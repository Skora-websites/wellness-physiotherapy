import { useEffect, useState } from 'react'

const STORIES = [
  {
    label: 'Para-Athletes',
    tag: 'Trusted By Athletes',
    title: 'Supporting Para-Athletes to Victory',
    description:
      "Proud to support Neeraj Yadav's gold medal journey at the Asian Para Games — Men's Javelin Throw F55.",
    image: '/assets/img/stories/neeraj-yadav-gold.jpg',
  },
  {
    label: 'International Patients',
    tag: 'International Patients',
    title: 'Trusted by International Clients',
    description:
      'Italian Political Strategist chose Wellness Physiotherapy Centre for specialized treatment during his visit to India.',
    image: '/assets/img/stories/international-patient.jpg',
  },
  {
    label: 'Media Professionals',
    tag: 'Recognized Professionals',
    title: 'Trusted by Media Professionals',
    description:
      'Leading media personalities and news anchors trust our expert physiotherapy care for their wellness needs.',
    image: '/assets/img/stories/media-celebrity.jpg',
  },
  {
    label: '5-Star Reviews',
    tag: 'Patient Satisfaction',
    title: 'Over 1,000+ Five-Star Verified Patient Recoveries',
    description:
      'Real patient treatment and 5-star Google reviews from people who recovered with our personalized physiotherapy care.',
    image: '/assets/img/stories/5-star-reviews.jpg',
  },
]

const ITEM_STEP = 65
const AUTOPLAY_MS = 3200

function wrap(min, max, value) {
  const size = max - min
  return ((((value - min) % size) + size) % size) + min
}

export default function Approach() {
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
      setIndex((current) => (current + 1) % STORIES.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [reduced])

  function offsetFor(itemIndex) {
    return wrap(-STORIES.length / 2, STORIES.length / 2, itemIndex - index)
  }

  return (
    <>
      <section id='stories' className='section approach'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='approach-main-wrapper'>
            <div className='approach-title-wrapper'>
              <div className='sub-title-wrapper middle'>
                <div slide-bottom-all='' className='sub-tag-wrap'>
                  <div className='sub-tag-text-wrap'>
                    <div className='body-text gray'>{'Success Stories'}</div>
                  </div>
                </div>
                <div className='sub-title-wrap'>
                  <h2 className='sub-title'>{'Real Recovery Stories'}</h2>
                </div>
                <div slide-bottom-all='' className='sub-text-wrap approach'>
                  <p className='body-text gray'>
                    {'Trusted by athletes, professionals and international patients for exceptional recovery outcomes.'}
                  </p>
                </div>
              </div>
            </div>

            <div
              className='spec-carousel'
              role='group'
              aria-roledescription='carousel'
              aria-label='Real recovery stories'
              style={{ marginTop: '40px' }}
            >
              <div className='spec-rail'>
                <div className='spec-rail-fade spec-rail-fade-top' aria-hidden='true'></div>
                <div className='spec-rail-fade spec-rail-fade-bottom' aria-hidden='true'></div>

                {STORIES.map((item, itemIndex) => {
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
                        opacity: far ? 0 : 1 - Math.abs(offset) * 0.25,
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
                  {STORIES.map((item, itemIndex) => {
                    const offset = offsetFor(itemIndex)
                    const state =
                      offset === 0 ? 'is-active' : offset === -1 ? 'is-prev' : offset === 1 ? 'is-next' : 'is-hidden'

                    return (
                      <figure
                        key={item.label}
                        className={`spec-card ${state}`}
                        aria-hidden={state === 'is-hidden' ? 'true' : undefined}
                      >
                        <img src={item.image} alt={item.title} loading='lazy' className='spec-card-image' />
                        <figcaption className='spec-card-caption'>
                          <span className='spec-card-tag'>{`${String(itemIndex + 1).padStart(2, '0')} · ${item.tag}`}</span>
                          <span className='spec-card-title'>{item.title}</span>
                          <span className='spec-card-text'>{item.description}</span>
                        </figcaption>
                      </figure>
                    )
                  })}
                </div>

                <p className='spec-count' aria-live='polite'>{`${index + 1} / ${STORIES.length}`}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
