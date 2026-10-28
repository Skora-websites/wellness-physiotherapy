export default function BeaconPagination({ page, pageCount, onChange, label = 'Pagination' }) {
  if (pageCount < 2) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className='beacon-tabs' aria-label={label}>
      {pages.map((number) => {
        const active = number === page
        return (
          <div key={number} className={`beacon-tab-slot${active ? ' is-active' : ''}`}>
            <button
              type='button'
              aria-current={active ? 'page' : undefined}
              aria-label={`Page ${number}`}
              onClick={() => onChange(number)}
              className={`beacon-tab${active ? ' is-active' : ''}`}
            >
              <span className='beacon-tab-fill' aria-hidden='true'></span>
              <span className='beacon-tab-label'>{number}</span>
            </button>
            <span className='beacon-tab-beacon' aria-hidden='true'></span>
          </div>
        )
      })}
    </nav>
  )
}

export function scrollToBlock(id) {
  const target = document.getElementById(id)
  if (!target) return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}
