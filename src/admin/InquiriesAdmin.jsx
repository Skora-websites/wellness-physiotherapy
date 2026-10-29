import { useContext, useEffect, useMemo, useState } from 'react'
import { api } from './client'
import { downloadInquiriesExcel } from './excel'
import { Empty, Field, LoadError, Modal, StatusPill, ToastCtx, when } from './parts'

const CONFIG = {
  consultations: {
    title: 'Consultation Requests',
    blurb: 'Appointment requests submitted through the website booking form.',
    statuses: [
      ['all', 'All'], ['new', 'New'], ['contacted', 'Contacted'], ['scheduled', 'Scheduled'], ['completed', 'Completed'],
    ],
    columns: ['Patient', 'Concern', 'Contact', 'Status', 'Received'],
  },
  contacts: {
    title: 'Contact Messages',
    blurb: 'General messages sent through the contact page.',
    statuses: [['all', 'All'], ['new', 'New'], ['replied', 'Replied'], ['archived', 'Archived']],
    columns: ['Sender', 'Subject', 'Contact', 'Status', 'Received'],
  },
}

export default function InquiriesAdmin({ kind, onChanged }) {
  const config = CONFIG[kind]
  const notify = useContext(ToastCtx)
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(null)
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  const load = () => {
    setLoading(true)
    setLoadError('')
    api(`/api/${kind}`)
      .then((data) => setRows(data))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    setRows([])
    setActive(null)
    load()
  }, [kind])

  const counts = useMemo(() => {
    const map = { all: rows.length }
    for (const [value] of config.statuses) {
      if (value !== 'all') map[value] = rows.filter((row) => row.status === value).length
    }
    return map
  }, [rows, config.statuses])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (!term) return true
      return [row.name, row.email, row.phone, row.subject, row.concern, row.message].join(' ').toLowerCase().includes(term)
    })
  }, [rows, status, search])

  const open = (row) => {
    setActionError('')
    setActive(row)
    setNotes(row.notes || '')
  }

  const patchRow = async (changes) => {
    if (!active) return
    setBusy(true)
    setActionError('')
    try {
      const saved = await api(`/api/${kind}/${active.id}`, { method: 'PATCH', body: changes })
      setRows((current) => current.map((row) => (row.id === saved.id ? saved : row)))
      setActive(saved)
      if (changes.notes !== undefined) setNotes(saved.notes)
      onChanged?.()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!window.confirm('Delete this inquiry permanently?')) return
    setActionError('')
    try {
      await api(`/api/${kind}/${active.id}`, { method: 'DELETE' })
      setRows((current) => current.filter((row) => row.id !== active.id))
      setActive(null)
      onChanged?.()
    } catch (err) {
      setActionError(err.message)
    }
  }

  const exportExcel = () => {
    try {
      downloadInquiriesExcel(kind, filtered)
    } catch {
      notify('We couldn’t create the Excel file. Please try again.')
    }
  }

  const waNumber = active?.phone?.replace(/[^0-9]/g, '')

  return (
    <div className='adm-stack'>
      {loadError && <LoadError message={loadError} onRetry={load} />}

      <section className='adm-card'>
        <header className='adm-card-head'>
          <div>
            <h2>{config.title}</h2>
            <p>{config.blurb}</p>
          </div>
          <div className='adm-head-actions'>
            <button
              type='button'
              className='adm-btn is-sm'
              onClick={exportExcel}
              disabled={filtered.length === 0}
              title='Download the current view as an Excel workbook'
            >
              Download Excel
            </button>
            <button type='button' className='adm-btn is-sm' onClick={load} disabled={loading} aria-busy={loading}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </header>

        <div className='adm-status-tabs' role='group' aria-label='Filter by status'>
          {config.statuses.map(([value, label]) => (
            <button
              key={value}
              type='button'
              className={`adm-status-tab${status === value ? ' is-active' : ''}`}
              aria-pressed={status === value}
              onClick={() => setStatus(value)}
            >
              {label}
              <span>{counts[value] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className='adm-toolbar'>
          <input
            className='adm-input'
            aria-label={`Search ${config.title.toLowerCase()} by name, phone, email or concern`}
            placeholder='Search by name, phone, email or concern…'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <p className='adm-sr-only' role='status'>
          {filtered.length === 0
            ? 'No inquiries in this view'
            : `${filtered.length} ${filtered.length === 1 ? 'inquiry' : 'inquiries'} in this view`}
        </p>

        {loading && rows.length === 0 ? (
          <p className='adm-muted' role='status'>Loading inquiries…</p>
        ) : loadError && rows.length === 0 ? null : filtered.length === 0 ? (
          <Empty title='No inquiries in this view' text='New submissions from the website will appear here.' />
        ) : (
          <div
            className='adm-table-wrap'
            role='region'
            tabIndex={0}
            aria-label={`${config.title} table. Scroll horizontally to see more columns.`}
          >
            <table className='adm-table'>
              <caption className='adm-sr-only'>{config.title}</caption>
              <thead>
                <tr>
                  {config.columns.map((column) => <th key={column} scope='col'>{column}</th>)}
                  <th scope='col'><span className='adm-sr-only'>Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} onClick={() => open(row)}>
                    <td><strong>{row.name}</strong></td>
                    <td className='adm-clamp'>{row.subject || row.concern || '—'}</td>
                    <td>
                      <span className='adm-sub'>{row.phone || '—'}</span>
                      <span className='adm-sub'>{row.email || ''}</span>
                    </td>
                    <td><StatusPill status={row.status} /></td>
                    <td>{when(row.createdAt)}</td>
                    <td className='adm-actions'>
                      <button
                        type='button'
                        className='adm-btn is-sm'
                        aria-label={`Open inquiry from ${row.name}`}
                        onClick={(event) => { event.stopPropagation(); open(row) }}
                      >
                        Open
                      </button>
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
        title={active?.name || ''}
        subtitle={active ? `${active.subject || active.concern || 'Inquiry'} · ${when(active.createdAt)}` : ''}
        footer={
          <>
            <button type='button' className='adm-btn is-danger' onClick={remove}>Delete</button>
            <div className='adm-foot-right'>
              <button type='button' className='adm-btn' onClick={() => setActive(null)}>Close</button>
              <button type='button' className='adm-btn is-primary' onClick={() => patchRow({ notes })} disabled={busy} aria-busy={busy}>
                {busy ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Saving…</> : 'Save notes'}
              </button>
            </div>
          </>
        }
      >
        {active && (
          <div className='adm-stack'>
            {actionError && <div className='adm-alert' role='alert'>{actionError}</div>}
            <div className='adm-detail-grid'>
              <div>
                <span className='adm-label'>Phone</span>
                <a href={`tel:${active.phone}`}>{active.phone || '—'}</a>
              </div>
              <div>
                <span className='adm-label'>Email</span>
                <a href={`mailto:${active.email}`}>{active.email || '—'}</a>
              </div>
              <div>
                <span className='adm-label'>Received</span>
                <span>{when(active.createdAt)}</span>
              </div>
              <div>
                <span className='adm-label'>Status</span>
                <select
                  className='adm-input'
                  aria-label='Inquiry status'
                  value={active.status}
                  onChange={(event) => patchRow({ status: event.target.value })}
                >
                  {config.statuses.filter(([value]) => value !== 'all').map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='adm-detail-actions'>
              {waNumber && (
                <a className='adm-btn is-sm' href={`https://wa.me/${waNumber}`} target='_blank' rel='noreferrer'>WhatsApp</a>
              )}
              {active.email && <a className='adm-btn is-sm' href={`mailto:${active.email}`}>Reply by email</a>}
            </div>

            <Field label={active.subject ? 'Message' : 'Health concern / message'}>
              <div className='adm-quote-box'>{active.message || '—'}</div>
            </Field>

            <Field label='Internal staff notes' hint='Visible to clinic staff only.'>
              <textarea className='adm-input' rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder='Called patient, scheduled for Friday 5 PM…' />
            </Field>
          </div>
        )}
      </Modal>
    </div>
  )
}
