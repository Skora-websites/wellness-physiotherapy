import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from './client'
import { Empty, Field, ImageField, LoadError, Modal, SeoFields, Tabs, when } from './parts'

const blank = () => ({
  title: '', slug: '', groupCategory: 'Physiotherapy', summary: '', description: '',
  covers: [''], tags: [], accent: '#155a91', orderIndex: 0, image: '',
  metaTitle: '', metaKeywords: '', metaDescription: '', canonicalUrl: '',
})

const slugify = (value) =>
  String(value || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

export default function ServicesAdmin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)
  const [snapshot, setSnapshot] = useState('')
  const [tab, setTab] = useState('details')
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
    api('/api/services')
      .then((rows) => setItems([...rows].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return items
    return items.filter((item) =>
      [item.title, item.slug, item.groupCategory, item.summary, (item.tags || []).join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  }, [items, search])

  const openEditor = (record) => {
    const next = record ? { ...blank(), ...record, covers: record.covers?.length ? record.covers : [''] } : blank()
    setForm(next)
    setSnapshot(JSON.stringify(next))
    setTab('details')
    setError('')
  }

  const closeEditor = () => {
    if (form && JSON.stringify(form) !== snapshot && !window.confirm('Discard unsaved changes to this service?')) return
    setForm(null)
  }

  const patch = (changes) => setForm((current) => ({ ...current, ...changes }))

  const save = async () => {
    if (!form.title.trim()) {
      setError('')
      setTitleError(true)
      setTab('details')
      return
    }
    setBusy(true)
    setError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title), covers: form.covers.filter(Boolean) }
      const saved = form.id
        ? await api(`/api/services/${form.id}`, { method: 'PUT', body: payload })
        : await api('/api/services', { method: 'POST', body: payload })
      setItems((current) => (current.some((item) => item.id === saved.id)
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [...current, saved]))
      setForm(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (record) => {
    if (!window.confirm(`Delete “${record.title}”? This removes it from the website.`)) return
    try {
      await api(`/api/services/${record.id}`, { method: 'DELETE' })
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
            <h2>Services</h2>
            <p>Every entry becomes a page at /services/&lt;slug&gt; and a card in the services listing.</p>
          </div>
          <button type='button' className='adm-btn is-primary' onClick={() => openEditor(null)}>+ New service</button>
        </header>

        <div className='adm-toolbar'>
          <input className='adm-input' aria-label='Search services' placeholder='Search services…' value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        {loading ? (
          <p className='adm-muted' role='status'>Loading services…</p>
        ) : loadError ? (
          <LoadError message={loadError} onRetry={load} />
        ) : filtered.length === 0 ? (
          <Empty title='No services yet' text='Add a service to publish it on the website.' />
        ) : (
          <div
            className='adm-table-wrap'
            role='region'
            tabIndex={0}
            aria-label='Services table. Scroll horizontally to see more columns.'
          >
            <table className='adm-table'>
              <caption className='adm-sr-only'>Services</caption>
              <thead>
                <tr><th scope='col'>Service</th><th scope='col'>Category</th><th scope='col'>Summary</th><th scope='col'>Order</th><th scope='col'>Updated</th><th scope='col'><span className='adm-sr-only'>Actions</span></th></tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                      <span className='adm-sub'>/services/{item.slug}</span>
                    </td>
                    <td>{item.groupCategory || '—'}</td>
                    <td className='adm-clamp'>{item.summary}</td>
                    <td>{item.orderIndex || 0}</td>
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
        title={form?.id ? 'Edit Service' : 'New Service'}
        subtitle='Service catalogue & treatment content'
        footer={
          <>
            <button type='button' className='adm-btn' onClick={closeEditor} disabled={busy}>Cancel</button>
            <button type='button' className='adm-btn is-primary' onClick={save} disabled={busy} aria-busy={busy}>
              {busy ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Saving…</> : 'Save service'}
            </button>
          </>
        }
      >
        {form && (
          <div className='adm-stack'>
            <Tabs
              active={tab}
              onChange={setTab}
              tabs={[
                { id: 'details', label: 'Details' },
                { id: 'covers', label: 'Covers & Tags' },
                { id: 'media', label: 'Media' },
                { id: 'seo', label: 'SEO Settings', warn: seoWarn },
              ]}
            />

            {error && <div className='adm-alert' id='service-editor-error' role='alert'>{error}</div>}

            {tab === 'details' && (
              <div className='adm-stack' role='tabpanel' id='adm-editor-panel-details' aria-labelledby='adm-editor-tab-details'>
                <Field label='Service Title' required error={titleError ? 'Enter a service title before saving.' : ''}>
                  <input
                    ref={titleRef}
                    className='adm-input is-title'
                    value={form.title}
                    onChange={(event) => {
                      setTitleError(false)
                      patch({ title: event.target.value, slug: slugify(event.target.value) })
                    }}
                    aria-required='true'
                  />
                </Field>

                <div className='adm-grid-2'>
                  <Field label='URL Slug'>
                    <div className='adm-slug-row'>
                      <span className='adm-slug-prefix'>/services/</span>
                      <input className='adm-input is-mono' aria-label='URL slug' value={form.slug} onChange={(event) => patch({ slug: slugify(event.target.value) })} />
                    </div>
                  </Field>
                  <Field label='Category / Speciality'>
                    <input className='adm-input' value={form.groupCategory} onChange={(event) => patch({ groupCategory: event.target.value })} />
                  </Field>
                </div>

                <Field label='Short Summary' hint='Shown on service cards and used as the SEO description fallback.'>
                  <textarea className='adm-input' rows={2} value={form.summary} onChange={(event) => patch({ summary: event.target.value })} />
                </Field>

                <Field label='Detailed Description' hint='Rich text — paragraphs, headings and lists.'>
                  <textarea className='adm-input is-html' rows={10} value={form.description} onChange={(event) => patch({ description: event.target.value })} placeholder='<p>Describe the treatment…</p>' />
                </Field>

                <div className='adm-grid-2'>
                  <Field label='Display Order'>
                    <input className='adm-input' type='number' value={form.orderIndex} onChange={(event) => patch({ orderIndex: Number(event.target.value) })} />
                  </Field>
                  <Field label='Accent Colour'>
                    <input className='adm-color' type='color' value={form.accent} onChange={(event) => patch({ accent: event.target.value })} />
                  </Field>
                </div>
              </div>
            )}

            {tab === 'covers' && (
              <div className='adm-stack' role='tabpanel' id='adm-editor-panel-covers' aria-labelledby='adm-editor-tab-covers'>
                <Field label='Treatment Highlights' hint='Each line becomes a checklist item on the service page.'>
                  <div className='adm-repeat'>
                    {form.covers.map((cover, index) => (
                      <div key={index} className='adm-repeat-row'>
                        <input
                          className='adm-input'
                          aria-label={`Treatment highlight ${index + 1}`}
                          value={cover}
                          placeholder='e.g. Frozen shoulder and shoulder impingement'
                          onChange={(event) => {
                            const covers = [...form.covers]
                            covers[index] = event.target.value
                            patch({ covers })
                          }}
                        />
                        <button
                          type='button'
                          className='adm-btn is-sm is-danger'
                          aria-label={`Remove treatment highlight ${index + 1}`}
                          onClick={() => patch({ covers: form.covers.filter((_, i) => i !== index) })}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button type='button' className='adm-btn is-sm' onClick={() => patch({ covers: [...form.covers, ''] })}>+ Add highlight</button>
                  </div>
                </Field>

                <Field label='Tags' hint='Comma-separated.'>
                  <input
                    className='adm-input'
                    value={form.tags.join(', ')}
                    onChange={(event) => patch({ tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })}
                    placeholder='spine, posture, sports'
                  />
                </Field>
              </div>
            )}

            {tab === 'media' && (
              <div role='tabpanel' id='adm-editor-panel-media' aria-labelledby='adm-editor-tab-media'>
                <ImageField value={form.image} onChange={(image) => patch({ image })} />
              </div>
            )}

            {tab === 'seo' && (
              <div role='tabpanel' id='adm-editor-panel-seo' aria-labelledby='adm-editor-tab-seo'>
                <SeoFields
                  value={form}
                  onChange={(next) => setForm((current) => ({ ...current, ...next }))}
                  path={`/services/${form.slug || 'service-url'}`}
                  fallbackTitle={form.title}
                  fallbackDescription={form.summary}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
