import { useEffect, useState } from 'react'
import { api } from './client'
import { LoadError, StatusPill, when } from './parts'

export default function Dashboard({ counts, onNavigate }) {
  const [stats, setStats] = useState({ blogs: [], services: [], consultations: [], contacts: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    Promise.all([
      api('/api/blogs'),
      api('/api/services'),
      api('/api/consultations'),
      api('/api/contacts'),
    ])
      .then(([blogs, services, consultations, contacts]) => {
        setStats({ blogs, services, consultations, contacts })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const recent = [...stats.consultations, ...stats.contacts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)

  const cards = [
    { label: 'New consultations', value: counts.consultations, tab: 'consultations' },
    { label: 'New messages', value: counts.contacts, tab: 'contacts' },
    { label: 'Published articles', value: stats.blogs.filter((item) => item.status === 'published').length, tab: 'blogs' },
    { label: 'Services listed', value: stats.services.length, tab: 'services' },
  ]

  return (
    <div className='adm-stack'>
      {error && <LoadError message={`We couldn’t load the latest dashboard figures. ${error}`} onRetry={load} />}

      <div className='adm-stat-grid'>
        {cards.map((card) => (
          <button key={card.label} type='button' className='adm-stat' onClick={() => onNavigate(card.tab)}>
            <span className='adm-stat-value'>{card.value}</span>
            <span className='adm-stat-label'>{card.label}</span>
            <span className='adm-stat-arrow' aria-hidden='true'>→</span>
          </button>
        ))}
      </div>

      <section className='adm-card'>
        <header className='adm-card-head'>
          <div>
            <h2>Latest inquiries</h2>
            <p>Consultation requests and contact messages, newest first.</p>
          </div>
          <button type='button' className='adm-btn' onClick={() => onNavigate('consultations')}>Open inbox</button>
        </header>

        {loading && recent.length === 0 ? (
          <p className='adm-muted' role='status'>Loading inquiries…</p>
        ) : recent.length === 0 ? (
          error ? null : <p className='adm-muted'>No inquiries yet. New bookings from the website appear here.</p>
        ) : (
          <div
            className='adm-table-wrap'
            role='region'
            tabIndex={0}
            aria-label='Latest inquiries table. Scroll horizontally to see more columns.'
          >
            <table className='adm-table'>
              <caption className='adm-sr-only'>Latest inquiries</caption>
              <thead>
                <tr><th scope='col'>Name</th><th scope='col'>Type</th><th scope='col'>Detail</th><th scope='col'>Status</th><th scope='col'>Received</th></tr>
              </thead>
              <tbody>
                {recent.map((row) => (
                  <tr key={row.id} className='is-static'>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.subject ? 'Contact' : 'Consultation'}</td>
                    <td className='adm-clamp'>{row.subject || row.concern || row.phone}</td>
                    <td><StatusPill status={row.status} /></td>
                    <td>{when(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
