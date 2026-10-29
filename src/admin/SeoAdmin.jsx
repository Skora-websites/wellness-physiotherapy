import { useContext, useEffect, useState } from 'react'
import { api } from './client'
import { LoadError, Modal, SeoFields, ToastCtx, when } from './parts'

export default function SeoAdmin() {
  const notify = useContext(ToastCtx)
  const [rows, setRows] = useState([])
  const [active, setActive] = useState(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setLoadError('')
    api('/api/page-seo')
      .then(setRows)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    setBusy(true)
    setError('')
    try {
      const saved = await api(`/api/page-seo/${active.id}`, { method: 'PUT', body: active })
      setRows((current) => current.map((row) => (row.id === saved.id ? saved : row)))
      setActive(null)
      notify('Page SEO saved')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='adm-stack'>
      {loadError && !active && <LoadError message={loadError} onRetry={load} />}

      <section className='adm-card'>
        <header className='adm-card-head'>
          <div>
            <h2>Page-by-page SEO</h2>
            <p>Titles, descriptions and canonicals for the fixed routes of the website.</p>
          </div>
        </header>

        {loading && rows.length === 0 && <p className='adm-muted' role='status'>Loading page settings…</p>}
        {loadError && rows.length === 0 ? null : (
        <div
          className='adm-table-wrap'
          role='region'
          tabIndex={0}
          aria-label='Page SEO table. Scroll horizontally to see more columns.'
        >
          <table className='adm-table'>
            <caption className='adm-sr-only'>Page-by-page SEO</caption>
            <thead>
              <tr><th scope='col'>Page</th><th scope='col'>Path</th><th scope='col'>Meta title</th><th scope='col'>Description</th><th scope='col'>Updated</th><th scope='col'><span className='adm-sr-only'>Actions</span></th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.label}</strong></td>
                  <td><code>{row.path}</code></td>
                  <td className='adm-clamp'>{row.metaTitle || <span className='adm-muted'>Default</span>}</td>
                  <td className='adm-clamp'>{row.metaDescription || <span className='adm-muted'>Default</span>}</td>
                  <td>{when(row.updatedAt)}</td>
                  <td className='adm-actions'>
                    <button type='button' className='adm-btn is-sm' onClick={() => setActive({ ...row })}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </section>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.label} — ${active.path}` : ''}
        subtitle='Search preview & indexing settings'
        footer={
          <>
            <button type='button' className='adm-btn' onClick={() => setActive(null)}>Cancel</button>
            <button type='button' className='adm-btn is-primary' onClick={save} disabled={busy} aria-busy={busy}>
              {busy ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Saving…</> : 'Save SEO'}
            </button>
          </>
        }
      >
        {active && (
          <div className='adm-stack'>
            {error && <div className='adm-alert' role='alert'>{error}</div>}
            <SeoFields
              value={active}
              onChange={(next) => setActive((current) => ({ ...current, ...next }))}
              path={active.path}
              fallbackTitle={active.label}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}
