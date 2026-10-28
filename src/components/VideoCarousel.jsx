import { useState, useRef, useEffect } from 'react'

const REEL_VIDEOS = [
  {
    id: 'reel-1',
    src: '/assets/video/video-1.mp4',
    title: 'Full Knee Mobility Restored',
    patient: 'Post-Operative ACL Rehab',
    tag: 'Sports Rehabilitation',
    desc: 'Targeted joint mobilization & functional strength training after surgical repair.'
  },
  {
    id: 'reel-2',
    src: '/assets/video/video-2.mp4',
    title: 'Pain-Free Spine & Posture Training',
    patient: 'Lumbar & Cervical Care',
    tag: 'Clinical Manual Therapy',
    desc: 'Decompression techniques and core motor control exercises for chronic back pain.'
  },
  {
    id: 'reel-3',
    src: '/assets/video/video-3.mp4',
    title: 'Active Shoulder Recovery Session',
    patient: 'Rotator Cuff & Impingement',
    tag: 'Physiotherapy & Dry Needling',
    desc: 'Scapular stabilization protocol restoring overhead reach without pain.'
  }
]

export default function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRefs = useRef({})

  const total = REEL_VIDEOS.length

  // Circular queue index helpers
  const getPrevIndex = (idx) => (idx - 1 + total) % total
  const getNextIndex = (idx) => (idx + 1) % total

  const prevIndex = getPrevIndex(currentIndex)
  const nextIndex = getNextIndex(currentIndex)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }

  // Play/pause management on active card change
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idxStr, vidEl]) => {
      if (!vidEl) return
      const idx = parseInt(idxStr, 10)
      if (idx === currentIndex) {
        vidEl.muted = isMuted
        vidEl.play().catch(() => {
          // Autoplay policy fallback: mute and retry
          vidEl.muted = true
          setIsMuted(true)
          vidEl.play().catch(() => {})
        })
        setIsPlaying(true)
      } else {
        vidEl.pause()
        vidEl.currentTime = 0
      }
    })
  }, [currentIndex, isMuted])

  const togglePlay = (idx) => {
    if (idx !== currentIndex) {
      setCurrentIndex(idx)
      return
    }
    const vid = videoRefs.current[idx]
    if (!vid) return
    if (vid.paused) {
      vid.play()
      setIsPlaying(true)
    } else {
      vid.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    setIsMuted((prev) => !prev)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section className='section video-carousel-section' aria-label='Patient Recovery Video Stories'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='video-carousel-header'>
          <div className='sub-tag-wrap'>
            <div className='sub-tag-text-wrap'>
              <div className='body-text gray'>{'Patient Stories'}</div>
            </div>
          </div>
          <h2 className='sub-title'>{'Real Patients. Real Recovery.'}</h2>
          <p className='video-carousel-subtitle'>
            {'Watch recovery sessions and mobility milestones documented right inside our clinic.'}
          </p>
        </div>

        {/* 3D Depth Reel Stage with Circular Queue */}
        <div className='reel-stage-container'>
          {/* Previous Arrow Button */}
          <button
            type='button'
            className='reel-nav-btn prev-btn'
            onClick={handlePrev}
            aria-label='Previous video story'
          >
            <svg viewBox='0 0 24 24' width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M15 18l-6-6 6-6' />
            </svg>
          </button>

          {/* Cards Track */}
          <div className='reel-cards-track'>
            {REEL_VIDEOS.map((item, idx) => {
              const isCenter = idx === currentIndex
              const isLeft = idx === prevIndex
              const isRight = idx === nextIndex

              let positionClass = 'reel-card-hidden'
              if (isCenter) positionClass = 'reel-card-center'
              else if (isLeft) positionClass = 'reel-card-left'
              else if (isRight) positionClass = 'reel-card-right'

              return (
                <div
                  key={item.id}
                  className={`reel-card ${positionClass}`}
                  onClick={() => togglePlay(idx)}
                  role='button'
                  tabIndex={0}
                  aria-label={`${item.title} - ${item.patient}`}
                >
                  <div className='reel-video-wrapper'>
                    <video
                      ref={(el) => { videoRefs.current[idx] = el }}
                      src={item.src}
                      playsInline
                      loop
                      muted={isMuted}
                      className='reel-video-element'
                      preload='metadata'
                    >
                      <source src={item.src} type='video/mp4' />
                    </video>

                    {/* Gradient Overlay & Badge */}
                    <div className='reel-overlay'>
                      <div className='reel-badge'>
                        <span className='reel-badge-dot'></span>
                        <span className='reel-badge-text'>{item.tag}</span>
                      </div>

                      {/* Sound Toggle (Only visible on active card) */}
                      {isCenter && (
                        <button
                          type='button'
                          className='reel-sound-btn'
                          onClick={toggleMute}
                          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                        >
                          {isMuted ? (
                            <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                              <path d='M11 5L6 9H2v6h4l5 4V5z' />
                              <line x1='23' y1='9' x2='17' y2='15' />
                              <line x1='17' y1='9' x2='23' y2='15' />
                            </svg>
                          ) : (
                            <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                              <polygon points='11 5 6 9 2 9 2 15 6 15 11 19 11 5' />
                              <path d='M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07' />
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Center Play/Pause Indicator (Shown when paused) */}
                      {isCenter && !isPlaying && (
                        <div className='reel-play-indicator' aria-hidden='true'>
                          <svg viewBox='0 0 24 24' width='36' height='36' fill='currentColor'>
                            <polygon points='5 3 19 12 5 21 5 3' />
                          </svg>
                        </div>
                      )}

                      {/* Video Caption Details */}
                      <div className='reel-info-box'>
                        <h3 className='reel-title'>{item.title}</h3>
                        <p className='reel-patient'>{item.patient}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Next Arrow Button */}
          <button
            type='button'
            className='reel-nav-btn next-btn'
            onClick={handleNext}
            aria-label='Next video story'
          >
            <svg viewBox='0 0 24 24' width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M9 18l6-6-6-6' />
            </svg>
          </button>
        </div>

        {/* Circular Queue Indicator Dots */}
        <div className='reel-dots-wrap' role='tablist' aria-label='Video reel navigation'>
          {REEL_VIDEOS.map((_, i) => (
            <button
              key={i}
              type='button'
              role='tab'
              aria-selected={i === currentIndex}
              className={`reel-dot${i === currentIndex ? ' is-active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Jump to video ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
