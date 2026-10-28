import { useState, useEffect } from 'react'
import { GOOGLE_BUSINESS_URL } from '../data/clinic'

const REVIEWS = [
  {
    name: 'Makers Of More',
    role: 'Verified Google Review',
    avatar: '/assets/img/reviews/makers-of-more.jpg',
    quote: 'I found the service excellent and would have no hesitation in recommending it to my family and friends. I was in a lot of pain in my back and neck area, but the way it was treated is amazing.'
  },
  {
    name: 'Rahul S.',
    role: 'Sports injury recovery',
    avatar: '/assets/img/reviews/rahul-s.jpg',
    quote: 'Excellent treatment and professional care. The team helped me recover from my sports injury in record time — their personalised approach is truly top-notch and highly recommended.'
  },
  {
    name: 'Priya P.',
    role: 'Chronic back pain',
    avatar: '/assets/img/reviews/priya-p.jpg',
    quote: 'Very knowledgeable physiotherapist and recovery was much faster than expected. After months of chronic back pain, a few sessions made me feel like a new person.'
  },
  {
    name: 'Amit K.',
    role: 'Home physiotherapy',
    avatar: '/assets/img/reviews/amit-k.jpg',
    quote: 'The home physiotherapy service was extremely convenient and effective. We booked a session for my mother and the therapist was patient, professional and genuinely helpful.'
  },
  {
    name: 'Sneha Verma',
    role: 'Post-surgery rehabilitation',
    avatar: '/assets/img/reviews/sneha-verma.jpg',
    quote: 'After my knee surgery, I was anxious about walking again. Dr. Arun’s structured rehabilitation gave me my full mobility and confidence back within weeks.'
  },
  {
    name: 'Vikram Malhotra',
    role: 'Cervical & posture correction',
    avatar: '/assets/img/reviews/vikram-malhotra.jpg',
    quote: 'Desk job strain had caused severe neck spasms. With manual therapy sessions and guided ergonomic exercises, the relief was immediate and long-lasting.'
  }
]

function QuoteIcon() {
  return (
    <svg
      className='reviews-quote-icon'
      width='38'
      height='38'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2 0 4-1 6-1 8z' />
      <path d='M15 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2 0 4-1 6-1 8z' />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M19 12H5M12 19l-7-7 7-7' />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
      <path d='M5 12h14M12 5l7 7-7 7' />
    </svg>
  )
}

function getSlot(i, activeIndex, total) {
  let diff = i - activeIndex
  while (diff > total / 2) diff -= total
  while (diff < -total / 2) diff += total

  if (diff === 0) return 'is-center'
  if (diff === -1) return 'is-left'
  if (diff === 1) return 'is-right'
  if (diff < -1) return 'is-hidden-left'
  return 'is-hidden-right'
}

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const total = REVIEWS.length

  const go = (next) => setIndex(((next % total) + total) % total)

  // Auto-play moving carousel
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total)
    }, 2800)
    return () => clearInterval(timer)
  }, [isPaused, total])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    }
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const distance = touchStart - touchEnd
    if (distance > 45) {
      go(index + 1)
    } else if (distance < -45) {
      go(index - 1)
    }
    setTouchStart(null)
  }

  return (
    <div
      className='reviews-carousel'
      role='group'
      aria-roledescription='carousel'
      aria-label='Patient reviews carousel'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className='reviews-stage'>
        {REVIEWS.map((review, reviewIndex) => {
          const slot = getSlot(reviewIndex, index, total)
          const isCenter = slot === 'is-center'
          const isLeft = slot === 'is-left'
          const isRight = slot === 'is-right'

          return (
            <figure
              key={review.name}
              className={`reviews-card ${slot}`}
              aria-hidden={isCenter ? undefined : 'true'}
              onClick={() => {
                if (isLeft) go(index - 1)
                if (isRight) go(index + 1)
              }}
            >
              <QuoteIcon />

              <blockquote className='reviews-quote'>
                {`"${review.quote}"`}
              </blockquote>

              <div className='reviews-stars' aria-label='5 out of 5 stars'>
                {'★★★★★'}
              </div>

              <figcaption className='reviews-person'>
                <img
                  src={review.avatar}
                  alt={review.name}
                  loading='lazy'
                  className='reviews-avatar'
                />
                <span className='reviews-person-text'>
                  <span className='reviews-name'>{review.name}</span>
                  <span className='reviews-role'>{review.role}</span>
                </span>

                <a
                  href={GOOGLE_BUSINESS_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='reviews-card-google-link'
                  title='View on Google Business Profile'
                  aria-label={`View ${review.name}'s review on Google Business Profile (opens in new tab)`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className='reviews-google-icon' viewBox='0 0 24 24' width='13' height='13' aria-hidden='true'>
                    <path fill='#4285F4' d='M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z' />
                    <path fill='#34A853' d='M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z' />
                    <path fill='#FBBC05' d='M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z' />
                    <path fill='#EA4335' d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z' />
                  </svg>
                  <span>{'Review'}</span>
                  <svg className='reviews-external-icon' viewBox='0 0 20 20' width='11' height='11' fill='currentColor' aria-hidden='true'>
                    <path fillRule='evenodd' d='M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z' clipRule='evenodd' />
                  </svg>
                </a>
              </figcaption>
            </figure>
          )
        })}
      </div>

      {/* Side Navigation Arrows */}
      <button
        type='button'
        className='reviews-nav-side-btn is-prev'
        aria-label='Previous review'
        onClick={() => go(index - 1)}
      >
        <ArrowLeft />
      </button>

      <button
        type='button'
        className='reviews-nav-side-btn is-next'
        aria-label='Next review'
        onClick={() => go(index + 1)}
      >
        <ArrowRight />
      </button>
    </div>
  )
}
