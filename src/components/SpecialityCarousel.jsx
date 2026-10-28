import { useEffect, useState } from 'react'
import { specialties } from '../data/services'

const ITEM_STEP = 65
const AUTOPLAY_MS = 1600

function wrap(min, max, value) {
  const size = max - min
  return ((((value - min) % size) + size) % size) + min
}

export default function SpecialityCarousel() {
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % specialties.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [reduced])

  function offsetFor(itemIndex) {
    return wrap(-specialties.length / 2, specialties.length / 2, itemIndex - index)
  }

  return (
    <div
      className='spec-carousel'
      role='group'
      aria-roledescription='carousel'
      aria-label='Conditions we treat'
    >
      <div className='spec-rail'>
        <div className='spec-rail-fade spec-rail-fade-top' aria-hidden='true'></div>
        <div className='spec-rail-fade spec-rail-fade-bottom' aria-hidden='true'></div>

        {specialties.map((item, itemIndex) => {
          const offset = offsetFor(itemIndex)
          const active = offset === 0
          const far = Math.abs(offset) > 2

          return (
            <button
              key={item.label}
              type='button'
              aria-pressed={active}
              aria-hidden={far ? 'true' : undefined}
              tabIndex={far ? -1 : 0}
              className={`spec-chip${active ? ' is-active' : ''}`}
              style={{
                transform: `translateY(${offset * ITEM_STEP}px)`,
                opacity: far ? 0 : 1 - Math.abs(offset) * 0.25
              }}
              onClick={() => setIndex(itemIndex)}
            >
              <span className='spec-chip-dot' aria-hidden='true'></span>
              <span className='spec-chip-label'>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className='spec-stage'>
        <div className='spec-cards'>
          {specialties.map((item, itemIndex) => {
            const offset = offsetFor(itemIndex)
            const state =
              offset === 0 ? 'is-active' : offset === -1 ? 'is-prev' : offset === 1 ? 'is-next' : 'is-hidden'

            return (
              <figure
                key={item.label}
                className={`spec-card ${state}`}
                aria-hidden={state === 'is-hidden' ? 'true' : undefined}
              >
                <img src={item.image} alt={item.label} loading='lazy' className='spec-card-image' />
                <figcaption className='spec-card-caption'>
                  <span className='spec-card-tag'>{`${String(itemIndex + 1).padStart(2, '0')} · Our speciality`}</span>
                  <span className='spec-card-title'>{item.label}</span>
                  <span className='spec-card-text'>{item.description}</span>
                </figcaption>
              </figure>
            )
          })}
        </div>

        <p className='spec-count' aria-live='polite'>{`${index + 1} / ${specialties.length}`}</p>
      </div>
    </div>
  )
}
