import { useState } from 'react'

const IMAGES = [
  {
    src: '/assets/img/clinic/reception.jpg',
    tag: 'Reception',
    title: 'Reception & Waiting Area'
  },
  {
    src: '/assets/img/clinic/consultation-room.jpg',
    tag: 'Consultation',
    title: 'Consultation Room'
  },
  {
    src: '/assets/img/clinic/treatment-room.jpg',
    tag: 'Treatment',
    title: 'Private Treatment Room'
  },
  {
    src: '/assets/img/clinic/credentials-wall.jpg',
    tag: 'Recognition',
    title: 'Certificates & Awards'
  },
  {
    src: '/assets/img/clinic/equipment.jpg',
    tag: 'Equipment',
    title: 'Electrotherapy & Rehab Equipment'
  },
  {
    src: '/assets/img/clinic/doctor-desk.jpg',
    tag: 'Our Doctor',
    title: 'Dr. Arun Yadav at the Clinic'
  }
]

function Chevron({ direction }) {
  return (
    <svg viewBox='0 0 24 24' fill='none' aria-hidden='true' className='gallery-arrow-icon'>
      <path
        d={direction === 'prev' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'}
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default function GalleryCarousel() {
  const [index, setIndex] = useState(0)
  const total = IMAGES.length
  const current = IMAGES[index]

  function go(next) {
    setIndex(((next % total) + total) % total)
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    }
  }

  return (
    <div
      className='gallery-carousel'
      role='group'
      aria-roledescription='carousel'
      aria-label='Clinic photo gallery'
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className='gallery-stage'>
        {IMAGES.map((item, itemIndex) => (
          <figure
            key={item.src}
            className={`gallery-slide ${itemIndex === index ? 'is-active' : ''}`}
            aria-hidden={itemIndex === index ? undefined : 'true'}
          >
            <img
              src={item.src}
              alt={item.title}
              loading={itemIndex === 0 ? 'eager' : 'lazy'}
            />
          </figure>
        ))}

        {/* Floating previous / next circular navigation controls on stage */}
        <button
          type='button'
          className='gallery-stage-arrow gallery-stage-prev'
          aria-label='Previous photo'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIndex((prev) => (prev - 1 + total) % total)
          }}
        >
          <Chevron direction='prev' />
        </button>
        <button
          type='button'
          className='gallery-stage-arrow gallery-stage-next'
          aria-label='Next photo'
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIndex((prev) => (prev + 1) % total)
          }}
        >
          <Chevron direction='next' />
        </button>

        {/* Floating slide counter in the bottom center */}
        <div className='gallery-stage-counter' aria-live='polite' aria-atomic='true'>
          {`${index + 1} / ${total}`}
        </div>
      </div>

      <div className='gallery-meta'>
        <div className='gallery-meta-text'>
          <span className='gallery-tag'>{current.tag}</span>
          <span className='gallery-title'>{current.title}</span>
        </div>
      </div>

      {/* Signature 21st.dev thumbnail row: expanding active landscape card + narrow portrait slices */}
      <div className='gallery-thumbs' role='tablist' aria-label='Clinic photos'>
        {IMAGES.map((item, itemIndex) => {
          const isActive = itemIndex === index
          return (
            <button
              key={item.src}
              type='button'
              role='tab'
              aria-selected={isActive}
              aria-label={item.title}
              className={`gallery-thumb ${isActive ? 'is-active' : ''}`}
              onClick={() => setIndex(itemIndex)}
            >
              <img src={item.src} alt={item.title} loading='lazy' />
            </button>
          )
        })}
      </div>
    </div>
  )
}
