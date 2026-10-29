import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { uploadImage } from './client'

export const ToastCtx = createContext(() => {})

/* ------------------------------------------------------------------ fields */

const LABELABLE = new Set(['input', 'textarea', 'select'])

// A wrapping <label> would make the hint and character counter part of the
// control's accessible name. Render an explicit label instead, point it at the
// control with htmlFor, and expose the hint through aria-describedby.
export function Field({ label, hint, error, required, counter, children, className = '' }) {
  const uid = useId()
  const labelId = `${uid}-label`
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`
  const controlId = `${uid}-control`

  const only = Children.count(children) === 1 ? Children.only(children) : null
  const isElement = isValidElement(only)
  const labelable = isElement && typeof only.type === 'string' && LABELABLE.has(only.type)
  const describedBy = (existing) =>
    [existing, hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  let body = children
  if (labelable) {
    body = cloneElement(only, {
      id: only.props.id || controlId,
      'aria-describedby': describedBy(only.props['aria-describedby']),
      'aria-required': required ? true : only.props['aria-required'],
      'aria-invalid': error ? true : only.props['aria-invalid'],
    })
  } else if (isElement && typeof only.type === 'string') {
    // Groups (choice rows, repeat rows) cannot take a <label for>, so expose the
    // visible label as their accessible group name when they do not have one.
    const named = only.props['aria-label'] || only.props['aria-labelledby'] || only.props.role
    body = cloneElement(only, {
      'aria-describedby': describedBy(only.props['aria-describedby']),
      ...(named ? {} : { role: 'group', 'aria-labelledby': labelId }),
    })
  }

  const labelContent = label && (
    <>
      {label}
      {required && <span className='adm-required' aria-hidden='true'>*</span>}
      {counter}
    </>
  )

  return (
    <div className={`adm-field ${className}`.trim()}>
      {label &&
        (labelable ? (
          <label className='adm-label' htmlFor={only.props.id || controlId}>{labelContent}</label>
        ) : (
          <span className='adm-label' id={labelId}>{labelContent}</span>
        ))}
      {body}
      {hint && <span className='adm-hint' id={hintId}>{hint}</span>}
      {error && <span className='adm-hint is-error' id={errorId} role='alert'>{error}</span>}
    </div>
  )
}

export function LoadError({ message, onRetry, retryLabel = 'Try again' }) {
  return (
    <div className='adm-alert is-inline' role='alert'>
      <span>{message || 'We couldn’t load this information. Please try again.'}</span>
      {onRetry && (
        <button type='button' className='adm-btn is-sm' onClick={onRetry}>{retryLabel}</button>
      )}
    </div>
  )
}

export function Counter({ value = '', max }) {
  const over = value.length > max
  return (
    <>
      <span className={`adm-counter${over ? ' is-over' : ''}`}>{`${value.length} / ${max}`}</span>
      <span className='adm-bar' aria-hidden='true'>
        <span
          className={`adm-bar-fill${over ? ' is-over' : ''}`}
          style={{ width: `${Math.min(100, (value.length / max) * 100)}%` }}
        />
      </span>
    </>
  )
}

/* ------------------------------------------------------------------- modal */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"], [tabindex]:not([tabindex="-1"])'

const isVisible = (element) =>
  element.getClientRects().length > 0 && element.getAttribute('aria-hidden') !== 'true'

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const focusables = () =>
      dialog ? Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(isVisible) : []

    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new Event('scroll-lock'))
    dialog?.focus()

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current?.()
        return
      }
      if (event.key !== 'Tab' || !dialog) return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (!dialog.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.dispatchEvent(new Event('scroll-unlock'))
      window.removeEventListener('keydown', onKey)
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus()
      }
    }
  }, [open])

  if (!open) return null

  return (
    <div className='adm-overlay' onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className={`adm-modal is-${size}`}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={subtitle ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className='adm-modal-head'>
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p id={descriptionId}>{subtitle}</p>}
          </div>
          <button type='button' className='adm-icon-btn' onClick={onClose} aria-label='Close dialog'>
            ✕
          </button>
        </header>
        <div className='adm-modal-body'>{children}</div>
        <footer className='adm-modal-foot'>{footer}</footer>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- tabs */

export function Tabs({ tabs, active, onChange, idPrefix = 'adm-editor', label = 'Editor sections' }) {
  const listRef = useRef(null)

  const onKeyDown = (event) => {
    const index = tabs.findIndex((tab) => tab.id === active)
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    const next = tabs[nextIndex]
    onChange(next.id)
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-tab="${next.id}"]`)?.focus())
  }

  return (
    <div className='adm-tabs' role='tablist' aria-orientation='horizontal' aria-label={label} ref={listRef} onKeyDown={onKeyDown}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type='button'
          role='tab'
          id={`${idPrefix}-tab-${tab.id}`}
          aria-controls={`${idPrefix}-panel-${tab.id}`}
          aria-selected={active === tab.id}
          data-tab={tab.id}
          tabIndex={active === tab.id ? 0 : -1}
          className={`adm-tab${active === tab.id ? ' is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.warn && (
            <>
              <span className='adm-tab-warn' aria-hidden='true' />
              <span className='adm-sr-only'> SEO fields over the recommended length</span>
            </>
          )}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------- pill */

const STATUS_LABEL = {
  new: 'New',
  contacted: 'Contacted',
  scheduled: 'Scheduled',
  completed: 'Completed',
  replied: 'Replied',
  archived: 'Archived',
  published: 'Published',
  draft: 'Draft',
}

export function StatusPill({ status }) {
  return (
    <span className={`adm-pill is-${status}`}>
      <span className='adm-pill-dot' />
      {STATUS_LABEL[status] || status}
    </span>
  )
}

/* ------------------------------------------------------------- rich editor */

const PASTE_CLEAN = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|meta|link|iframe|xml)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|meta|link)[^>]*>/gi, '')
    .replace(/<(span|font|o:p)\b[^>]*>/gi, '')
    .replace(/<\/(span|font|o:p)>/gi, '')
    .replace(/<div\b[^>]*>/gi, '<p>')
    .replace(/<\/div>/gi, '</p>')
    .replace(/\s(style|class|lang|id|dir|data-[\w-]+|width|height|align)="[^"]*"/gi, '')

export function RichText({ value, onChange, ariaLabel = 'Rich text content', required = false }) {
  const ref = useRef(null)
  const [cleaned, setCleaned] = useState(false)

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) ref.current.innerHTML = value || ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sync = () => onChange(ref.current?.innerHTML || '')
  const exec = (command, arg) => {
    ref.current?.focus()
    document.execCommand(command, false, arg)
    sync()
  }

  const onPaste = (event) => {
    const html = event.clipboardData?.getData('text/html')
    if (!html) return
    event.preventDefault()
    document.execCommand('insertHTML', false, PASTE_CLEAN(html))
    sync()
    setCleaned(true)
    setTimeout(() => setCleaned(false), 2500)
  }

  const buttons = [
    ['bold', 'B', null, 'Bold'],
    ['italic', 'I', null, 'Italic'],
    ['underline', 'U', null, 'Underline'],
    ['formatBlock', 'H2', '<h2>', 'H2'],
    ['formatBlock', 'H3', '<h3>', 'H3'],
    ['formatBlock', 'P', '<p>', 'Paragraph'],
    ['insertUnorderedList', '• List', null, 'Bullet list'],
    ['insertOrderedList', '1. List', null, 'Numbered list'],
    ['formatBlock', 'BLOCKQUOTE', '<blockquote>', 'Quote'],
    ['removeFormat', 'Clear', null, 'Clear formatting'],
  ]

  return (
    <div className='adm-rich'>
      <div className='adm-rich-toolbar' role='toolbar' aria-label='Text formatting'>
        {buttons.map(([command, label, arg, title]) => (
          <button
            key={title}
            type='button'
            title={title}
            aria-label={title}
            onClick={() => exec(command, arg)}
            onMouseDown={(event) => event.preventDefault()}
          >
            {label}
          </button>
        ))}
        {cleaned && <span className='adm-rich-note' role='status'>Pasted formatting cleaned</span>}
      </div>
      <div
        ref={ref}
        className='adm-rich-area'
        contentEditable
        suppressContentEditableWarning
        role='textbox'
        aria-multiline='true'
        aria-label={ariaLabel}
        aria-required={required ? 'true' : undefined}
        onInput={sync}
        onBlur={sync}
        onPaste={onPaste}
      />
    </div>
  )
}

/* ------------------------------------------------------------------- image */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']

export function ImageField({ label = 'Featured Header Image', value, onChange, alt, onAlt }) {
  const notify = useContext(ToastCtx)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const pick = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    // Check locally first so an unsupported or oversized file never leaves the browser.
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError('That file type isn’t supported. Choose a PNG, JPG, WEBP, GIF or AVIF image.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('This image is larger than 8 MB. Choose a smaller file.')
      event.target.value = ''
      return
    }
    setBusy(true)
    try {
      onChange(await uploadImage(file))
      notify('Image uploaded')
    } catch (err) {
      setError(err.message || 'Upload failed. Check the file and try again.')
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  return (
    <div className='adm-image-field'>
      <span className='adm-label'>{label}</span>
      <div className='adm-image-row'>
        <div className='adm-image-frame'>
          {value ? <img src={value} alt='' /> : <span>No image</span>}
          {busy && <div className='adm-image-busy'>Uploading…</div>}
        </div>
        <div className='adm-image-controls'>
          <input
            className='adm-input'
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder='/assets/img/posts/example.jpg'
            aria-label={`${label} URL`}
          />
          <label className={`adm-file${busy ? ' is-busy' : ''}`} aria-busy={busy}>
            <input
              type='file'
              accept='image/png,image/jpeg,image/webp,image/gif,image/avif'
              onChange={pick}
              disabled={busy}
              aria-label={`Upload ${label.toLowerCase()}`}
              aria-describedby={error ? 'adm-image-error' : undefined}
            />
            {busy ? 'Uploading…' : 'Upload image'}
          </label>
          <span className='adm-sr-only' role='status'>{busy ? 'Uploading image…' : ''}</span>
        </div>
      </div>
      {error && <span className='adm-hint is-error' id='adm-image-error' role='alert'>{error}</span>}
      {onAlt && (
        <Field label='Image Alt Text (Accessibility & Image SEO)'>
          <input className='adm-input' value={alt || ''} onChange={(event) => onAlt(event.target.value)} />
        </Field>
      )}
    </div>
  )
}

/* ------------------------------------------------------- SEO engine (shared) */

export function SeoFields({ value, onChange, path, fallbackTitle = '', fallbackDescription = '' }) {
  const set = (key) => (event) => onChange({ ...value, [key]: event.target.value })
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wellnessphysiotherapy.in'
  const title = value.metaTitle || fallbackTitle
  const description = value.metaDescription || fallbackDescription
  const url = value.canonicalUrl || `${origin}${path}`

  return (
    <div className='adm-seo'>
      <div className='adm-snippet' aria-hidden='true'>
        <div className='adm-snippet-url'>{url.replace(/^https?:\/\//, '').replace(/\//g, ' › ')}</div>
        <div className='adm-snippet-title'>{title || 'Add a meta title to preview it here'}</div>
        <div className='adm-snippet-desc'>{description || 'Add a meta description to control how this page appears in search results.'}</div>
      </div>

      <Field label='Meta Title' counter={<Counter value={value.metaTitle || ''} max={60} />} hint='Optimal length for search engines is 50–60 characters.'>
        <input className='adm-input' value={value.metaTitle || ''} onChange={set('metaTitle')} placeholder={fallbackTitle} />
      </Field>

      <Field label='Meta Description' counter={<Counter value={value.metaDescription || ''} max={160} />} hint='Search engines may truncate longer descriptions.'>
        <textarea className='adm-input' rows={3} value={value.metaDescription || ''} onChange={set('metaDescription')} placeholder={fallbackDescription} />
      </Field>

      <Field label='Meta Keywords' hint='Comma-separated subject keywords.'>
        <input className='adm-input' value={value.metaKeywords || ''} onChange={set('metaKeywords')} placeholder='physiotherapy noida, back pain, sports rehab' />
      </Field>

      <Field
        label='Canonical URL'
        counter={<Counter value={value.canonicalUrl || ''} max={500} />}
        hint="Preferred URL to index. Leave empty to use this content's main public URL."
      >
        <input className='adm-input' value={value.canonicalUrl || ''} onChange={set('canonicalUrl')} placeholder='Enter a preferred canonical URL or leave empty for the default.' />
      </Field>
    </div>
  )
}

/* -------------------------------------------------------------- misc bits */

export function Empty({ title, text }) {
  return (
    <div className='adm-empty'>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  )
}

export const when = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'
