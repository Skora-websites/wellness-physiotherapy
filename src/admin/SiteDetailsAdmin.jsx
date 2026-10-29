import { useContext, useEffect, useRef, useState } from 'react'
import { api } from './client'
import { Field, LoadError, ToastCtx } from './parts'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isWebLink = (value) => /^https?:\/\/[^\s]+$/i.test(String(value || '').trim())

const SOCIALS = [
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['linkedin', 'LinkedIn'],
  ['youtube', 'YouTube'],
  ['twitter', 'X / Twitter'],
]

export default function SiteDetailsAdmin() {
  const notify = useContext(ToastCtx)
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const errorRef = useRef(null)
  const emailRef = useRef(null)
  const mapsRef = useRef(null)
  const socialRefs = useRef({})

  const load = () => {
    setLoading(true)
    setLoadError('')
    api('/api/site-details')
      .then(setForm)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  // Focus the failure message so keyboard users land on the reason for it.
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  const clearFieldError = (key) =>
    setFieldErrors((current) => (current[key] ? { ...current, [key]: '' } : current))

  const set = (key) => (event) => {
    const value = event.target.value
    setForm((current) => ({ ...current, [key]: value }))
    clearFieldError(key)
  }

  const setSocial = (key) => (event) => {
    const value = event.target.value
    setForm((current) => ({ ...current, social: { ...current.social, [key]: value } }))
    clearFieldError(`social.${key}`)
  }

  const setHour = (index, key, value) => {
    const hours = form.hours.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    setForm((current) => ({ ...current, hours }))
  }

  const save = async () => {
    const found = {}
    if (form.email && !EMAIL_RE.test(form.email.trim())) {
      found.email = 'Enter a valid email address, such as name@example.com.'
    }
    if (form.mapsUrl && !isWebLink(form.mapsUrl)) {
      found.mapsUrl = 'Enter the full link, starting with https://'
    }
    for (const [key] of SOCIALS) {
      const value = form.social?.[key]
      if (value && !isWebLink(value)) found[`social.${key}`] = 'Enter the full link, starting with https://'
    }

    setFieldErrors(found)
    if (Object.keys(found).length) {
      setError('')
      const firstKey = Object.keys(found)[0]
      if (firstKey === 'email') emailRef.current?.focus()
      else if (firstKey === 'mapsUrl') mapsRef.current?.focus()
      else socialRefs.current[firstKey.replace('social.', '')]?.focus()
      return
    }

    setBusy(true)
    setError('')
    try {
      const saved = await api('/api/site-details', { method: 'PUT', body: form })
      setForm(saved)
      window.dispatchEvent(new CustomEvent('clinic-details-updated', { detail: saved }))
      notify('Site details saved')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!form) {
    return loading
      ? <p className='adm-muted' role='status'>Loading site details…</p>
      : <LoadError message={loadError} onRetry={load} />
  }

  return (
    <div className='adm-stack'>
      {error && <div className='adm-alert' role='alert' ref={errorRef} tabIndex={-1}>{error}</div>}

      <section className='adm-card'>
        <header className='adm-card-head'>
          <div><h2>General information</h2><p>Used in the footer, contact page and structured data.</p></div>
        </header>
        <div className='adm-grid-2'>
          <Field label='Clinic / organisation name'><input className='adm-input' value={form.name} onChange={set('name')} /></Field>
          <Field label='Tagline'><input className='adm-input' value={form.tagline} onChange={set('tagline')} /></Field>
        </div>
      </section>

      <section className='adm-card'>
        <header className='adm-card-head'><div><h2>Contact channels</h2><p>Phone numbers and the address patients will see.</p></div></header>
        <div className='adm-grid-2'>
          <Field label='Primary phone'><input className='adm-input' value={form.phone} onChange={set('phone')} /></Field>
          <Field label='Secondary phone'><input className='adm-input' value={form.phoneAlt} onChange={set('phoneAlt')} /></Field>
          <Field label='WhatsApp number' hint='Digits only, with country code.'><input className='adm-input' value={form.whatsapp} onChange={set('whatsapp')} /></Field>
          <Field label='Email' error={fieldErrors.email}>
            <input ref={emailRef} className='adm-input' type='email' autoComplete='email' value={form.email || ''} onChange={set('email')} />
          </Field>
        </div>
      </section>

      <section className='adm-card'>
        <header className='adm-card-head'><div><h2>Address & maps</h2><p>Shown on the contact page with the embedded map.</p></div></header>
        <div className='adm-grid-2'>
          <Field label='Address line 1'><input className='adm-input' value={form.address1} onChange={set('address1')} /></Field>
          <Field label='Address line 2'><input className='adm-input' value={form.address2} onChange={set('address2')} /></Field>
          <Field label='City'><input className='adm-input' value={form.city} onChange={set('city')} /></Field>
          <Field label='State'><input className='adm-input' value={form.state} onChange={set('state')} /></Field>
          <Field label='Postal code'><input className='adm-input' value={form.zip} onChange={set('zip')} /></Field>
          <Field label='Google Maps link' error={fieldErrors.mapsUrl}>
            <input ref={mapsRef} className='adm-input' value={form.mapsUrl || ''} onChange={set('mapsUrl')} placeholder='https://maps.google.com/…' />
          </Field>
        </div>
      </section>

      <section className='adm-card'>
        <header className='adm-card-head'>
          <div><h2>Working hours</h2><p>Add or remove the schedule rows shown to patients.</p></div>
          <button
            type='button'
            className='adm-btn is-sm'
            onClick={() => setForm((current) => ({ ...current, hours: [...current.hours, { title: '', days: '', timing: '' }] }))}
          >
            + Add schedule
          </button>
        </header>
        <div className='adm-repeat'>
          {form.hours.map((row, index) => (
            <div key={index} className='adm-repeat-row is-hours'>
              <input className='adm-input' aria-label={`Schedule ${index + 1} title`} value={row.title} onChange={(event) => setHour(index, 'title', event.target.value)} placeholder='Morning session' />
              <input className='adm-input' aria-label={`Schedule ${index + 1} days`} value={row.days} onChange={(event) => setHour(index, 'days', event.target.value)} placeholder='Mon – Sat' />
              <input className='adm-input' aria-label={`Schedule ${index + 1} timing`} value={row.timing} onChange={(event) => setHour(index, 'timing', event.target.value)} placeholder='09:00 – 13:00' />
              <button
                type='button'
                className='adm-btn is-sm is-danger'
                aria-label={`Remove schedule ${index + 1}`}
                onClick={() => setForm((current) => ({ ...current, hours: current.hours.filter((_, i) => i !== index) }))}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className='adm-card'>
        <header className='adm-card-head'><div><h2>Social profiles</h2><p>Leave a field empty to hide that icon.</p></div></header>
        <div className='adm-grid-2'>
          {SOCIALS.map(([key, label]) => (
            <Field key={key} label={label} error={fieldErrors[`social.${key}`]}>
              <input
                ref={(node) => { socialRefs.current[key] = node }}
                className='adm-input'
                value={form.social?.[key] || ''}
                onChange={setSocial(key)}
                placeholder={`https://${key}.com/…`}
              />
            </Field>
          ))}
        </div>
      </section>

      <div className='adm-sticky-actions'>
        <button type='button' className='adm-btn is-primary' onClick={save} disabled={busy} aria-busy={busy}>
          {busy ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Saving…</> : 'Save site details'}
        </button>
      </div>
    </div>
  )
}
