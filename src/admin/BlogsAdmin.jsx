import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from './client'
import {
  Counter, Empty, Field, ImageField, LoadError, Modal, RichText, SeoFields, StatusPill, Tabs, when,
} from './parts'

const blank = () => ({
  title: '', slug: '', contentType: 'blog', category: '', excerpt: '', content: '',
  image: '', imageAlt: '', status: 'draft', metaTitle: '', metaKeywords: '',
  metaDescription: '', canonicalUrl: '',
})

const slugify = (value) =>
  String(value || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

const pathFor = (form) => (form.contentType === 'standalone' ? `/${form.slug || 'page-url'}` : `/blog/${form.slug || 'article-url'}`)

export default function BlogsAdmin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [form, setForm] = useState(null)
  const [snapshot, setSnapshot] = useState('')
  const [tab, setTab] = useState('content')
  const [locked, setLocked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [titleError, setTitleError] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    if (titleError) titleRef.current?.focus()
  }, [titleError])

  const load = () => {
    setLoading(true)
    setLoadError('')
    api('/api/blogs')
      .then(setItems)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return items.filter((item) => {
      if (typeFilter !== 'all' && item.contentType !== typeFilter) return false
      if (!term) return true
      return [item.title, item.slug, item.category, item.excerpt].join(' ').toLowerCase().includes(term)
    })
  }, [items, search, typeFilter])

  const openEditor = (record) => {
    const next = record
      ? { ...blank(), ...record }
      : { ...blank(), title: '', slug: '', contentType: 'blog' }
    setForm(next)
    setSnapshot(JSON.stringify(next))
    setLocked(Boolean(record?.slug))
    setTab('content')
    setError('')
  }

  const closeEditor = () => {
    if (form && JSON.stringify(form) !== snapshot && !window.confirm('Discard unsaved changes to this item?')) return
    setForm(null)
  }

  const patch = (changes) => setForm((current) => ({ ...current, ...changes }))

  const onTitle = (value) => {
    setTitleError(false)
    setForm((current) => ({ ...current, title: value, ...(locked ? {} : { slug: slugify(value) }) }))
  }

  const save = async (status) => {
    if (!form.title.trim()) {
      setError('')
      setTitleError(true)
      setTab('content')
      return
    }
    setBusy(true)
    setError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title), status }
      const saved = form.id
        ? await api(`/api/blogs/${form.id}`, { method: 'PUT', body: payload })
        : await api('/api/blogs', { method: 'POST', body: payload })
      setItems((current) => {
        const exists = current.some((item) => item.id === saved.id)
        return exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]
      })
      setForm(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (record) => {
    if (!window.confirm(`Delete “${record.title}”? This cannot be undone.`)) return
    try {
      await api(`/api/blogs/${record.id}`, { method: 'DELETE' })
      setItems((current) => current.filter((item) => item.id !== record.id))
    } catch (err) {
      setError(err.message)
    }
  }

  const seoWarn = Boolean(form) && (form.metaTitle.length > 60 || form.metaDescription.length > 160)

  return (
    <div className='adm-stack'>
      {error && !form && <div className='adm-alert' role='alert'>{error}</div>}

      <section className='adm-card'>
        <header className='adm-card-head'>
          <div>
            <h2>Blogs & pages</h2>
            <p>Blog articles appear on the public blog. Standalone pages are published at their own URL.</p>
          </div>
          <button type='button' className='adm-btn is-primary' onClick={() => openEditor(null)}>+ New article</button>
        </header>

        <div className='adm-toolbar'>
          <input
            className='adm-input'
            aria-label='Search blogs and pages'
            placeholder='Search title, slug, category…'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select className='adm-input' aria-label='Filter by content type' value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value='all'>All content types</option>
            <option value='blog'>Blog articles</option>
            <option value='standalone'>Standalone pages</option>
          </select>
        </div>

        {loading ? (
          <p className='adm-muted' role='status'>Loading content…</p>
        ) : loadError ? (
          <LoadError message={loadError} onRetry={load} />
        ) : filtered.length === 0 ? (
          <Empty title='Nothing here yet' text='Create your first article or standalone page to fill this table.' />
        ) : (
          <div
            className='adm-table-wrap'
            role='region'
            tabIndex={0}
            aria-label='Blogs and pages table. Scroll horizontally to see more columns.'
          >
            <table className='adm-table'>
              <caption className='adm-sr-only'>Blogs and pages</caption>
              <thead>
                <tr><th scope='col'>Title &amp; URL</th><th scope='col'>Type</th><th scope='col'>Category</th><th scope='col'>Status</th><th scope='col'>Updated</th><th scope='col'><span className='adm-sr-only'>Actions</span></th></tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                      <span className='adm-sub'>
                        {item.contentType === 'standalone' ? `/${item.slug}` : `/blog/${item.slug}`}
                      </span>
                    </td>
                    <td>{item.contentType === 'standalone' ? 'Standalone' : 'Blog'}</td>
                    <td>{item.category || '—'}</td>
                    <td><StatusPill status={item.status} /></td>
                    <td>{when(item.updatedAt)}</td>
                    <td className='adm-actions'>
                      <button type='button' className='adm-btn is-sm' onClick={() => openEditor(item)}>Edit</button>
                      <button type='button' className='adm-btn is-sm is-danger' onClick={() => remove(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={Boolean(form)}
        onClose={closeEditor}
        size='lg'
        title={form?.id ? 'Edit Blog or Page' : 'Write New Blog or Page'}
        subtitle='Knowledge base & patient education system'
        footer={
          <>
            <button type='button' className='adm-btn' onClick={closeEditor} disabled={busy}>Cancel</button>
            <div className='adm-foot-right'>
              <button type='button' className='adm-btn' onClick={() => save('draft')} disabled={busy}>Save as draft</button>
              <button type='button' className='adm-btn is-primary' onClick={() => save('published')} disabled={busy} aria-busy={busy}>
                {busy ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Saving…</> : form?.status === 'published' ? 'Update article' : 'Publish article'}
              </button>
            </div>
          </>
        }
      >
        {form && (
          <div className='adm-stack'>
            <Tabs
              active={tab}
              onChange={setTab}
              tabs={[
                { id: 'content', label: 'Title & Article Content' },
                { id: 'media', label: 'Featured Media' },
                { id: 'seo', label: 'SEO Settings', warn: seoWarn },
              ]}
            />

            {error && <div className='adm-alert' id='blog-editor-error' role='alert'>{error}</div>}

            {tab === 'content' && (
              <div className='adm-stack' role='tabpanel' id='adm-editor-panel-content' aria-labelledby='adm-editor-tab-content'>
                <Field label='Content Type' required hint={form.contentType === 'blog'
                  ? 'Appears on the public blog page and uses the /blog/ URL structure.'
                  : 'Published at its own URL and excluded from the blog listing and discovery sections.'}>
                  <div className='adm-choice-row' role='group' aria-label='Content type'>
                    {[['blog', 'Blog'], ['standalone', 'Standalone Page']].map(([value, label]) => (
                      <button
                        key={value}
                        type='button'
                        className={`adm-choice${form.contentType === value ? ' is-active' : ''}`}
                        aria-pressed={form.contentType === value}
                        onClick={() => patch({ contentType: value })}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label='Article Title' required error={titleError ? 'Enter an article title before saving.' : ''}>
                  <input
                    ref={titleRef}
                    className='adm-input is-title'
                    value={form.title}
                    onChange={(event) => onTitle(event.target.value)}
                    aria-required='true'
                    placeholder='e.g. Recovering Faster After a Sports Injury'
                  />
                </Field>

                <Field label='URL Slug'>
                  <div className='adm-slug-row'>
                    <span className='adm-slug-prefix'>{form.contentType === 'standalone' ? '/' : '/blog/'}</span>
                    <input
                      className='adm-input is-mono'
                      aria-label='URL slug'
                      value={form.slug}
                      onChange={(event) => {
                        setLocked(true)
                        patch({ slug: slugify(event.target.value) })
                      }}
                      placeholder='auto-generated-from-title'
                    />
                    <button
                      type='button'
                      className='adm-btn is-sm'
                      aria-pressed={locked}
                      aria-label={locked ? 'Slug is locked. Click to unlock and auto-generate from the title.' : 'Slug is auto-generated. Click to lock manual editing.'}
                      onClick={() => {
                        if (locked) patch({ slug: slugify(form.title) })
                        setLocked(!locked)
                      }}
                    >
                      <span aria-hidden='true'>{locked ? '🔒' : '🔗'}</span> {locked ? 'Locked' : 'Auto'}
                    </button>
                  </div>
                  <span className='adm-hint'>
                    {locked
                      ? 'Manually edited. Click unlock to resume auto-generating from the title.'
                      : 'Auto-fills as you type the title.'}
                    {' '}Full URL: <code>{pathFor(form)}</code>
                  </span>
                </Field>

                <Field label='Excerpt / Summary' hint='Used for card previews and as the SEO description fallback.'>
                  <textarea className='adm-input' rows={2} value={form.excerpt} onChange={(event) => patch({ excerpt: event.target.value })} />
                </Field>

                <Field label='Category'>
                  <input className='adm-input' value={form.category} onChange={(event) => patch({ category: event.target.value })} placeholder='Back Care, Sports Rehab, Posture…' />
                </Field>

                <Field label='Content' required hint='Paste from Word or Google Docs — styling is cleaned automatically.'>
                  <RichText value={form.content} onChange={(content) => patch({ content })} ariaLabel='Article content' required />
                </Field>
              </div>
            )}

            {tab === 'media' && (
              <div role='tabpanel' id='adm-editor-panel-media' aria-labelledby='adm-editor-tab-media'>
                <ImageField
                  value={form.image}
                  onChange={(image) => patch({ image })}
                  alt={form.imageAlt}
                  onAlt={(imageAlt) => patch({ imageAlt })}
                />
              </div>
            )}

            {tab === 'seo' && (
              <div role='tabpanel' id='adm-editor-panel-seo' aria-labelledby='adm-editor-tab-seo'>
                <SeoFields
                  value={form}
                  onChange={(next) => setForm((current) => ({ ...current, ...next }))}
                  path={pathFor(form)}
                  fallbackTitle={form.title}
                  fallbackDescription={form.excerpt}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
