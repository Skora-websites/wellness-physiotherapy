import { useEffect, useRef } from 'react'

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Assess',
    description: 'A comprehensive 45-min biomechanical evaluation pinpoints the root cause of dysfunction and maps your milestones.',
    image: '/assets/img/works/works-01-assess.jpg',
    alt: 'Comprehensive biomechanical physiotherapy diagnostic assessment at Wellness Physiotherapy'
  },
  {
    step: '02',
    title: 'Treat',
    description: 'Hands-on manual therapy, spinal mobilization, dry needling, and advanced electrotherapy to alleviate acute pain.',
    image: '/assets/img/works/works-02-treat.jpg',
    alt: 'Targeted hands-on physical therapy and joint mobilization'
  },
  {
    step: '03',
    title: 'Rehab',
    description: 'Structured neuromuscular conditioning rebuilds mobility, muscular endurance, and full movement confidence.',
    image: '/assets/img/works/works-03-strengthen.jpg',
    alt: 'Functional rehabilitation and neuromuscular strengthening'
  },
  {
    step: '04',
    title: 'Thrive',
    description: 'Return to sports, active work, and pain-free daily living with custom home protocols that prevent recurrence.',
    image: '/assets/img/works/works-04-thrive.jpg',
    alt: 'Return to pain-free active living, sports, and long-term wellness'
  }
]

export default function Works() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    if (!section || !title) return

    const mainWrapper = section.querySelector('.works-main-wrapper')
    if (!mainWrapper) return

    let rafId = null

    const handleScroll = () => {
      // In mobile/tablet (<= 991px), title remains static
      if (window.innerWidth <= 991) {
        title.style.transform = 'none'
        title.style.opacity = '1'
        return
      }

      const rect = mainWrapper.getBoundingClientRect()
      const stickyTop = 110 // Below the floating liquid-glass navbar
      const totalScrollable = rect.height - window.innerHeight * 0.85

      if (rect.top > stickyTop) {
        // Above the sticky point
        title.style.transform = 'scale(1)'
        title.style.opacity = '1'
      } else if (rect.top <= stickyTop && totalScrollable > 0) {
        // Section pinned while left & right staggered cards scroll past
        const scrolled = stickyTop - rect.top
        const progress = Math.min(1, Math.max(0, scrolled / totalScrollable))

        // Helora scale from 1.0 down to 0.5, opacity 1.0 down to 0
        const scale = 1 - 0.5 * progress
        const opacity = Math.max(0, 1 - 1.25 * progress)

        title.style.transform = `scale(${scale})`
        title.style.opacity = `${opacity}`
      } else {
        // Passed section
        title.style.transform = 'scale(0.5)'
        title.style.opacity = '0'
      }
    }

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    handleScroll()

    // Helora [img-scroll] zoom-out interaction:
    // Images enter scaled at 1.28 and smoothly zoom out to 1.0 on viewport entry
    const imageWrappers = section.querySelectorAll('[img-scroll]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const img = entry.target.querySelector('.works-image')
          if (!img) return
          if (entry.isIntersecting) {
            img.style.transform = 'scale(1)'
            img.style.transition = 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)'
          } else if (entry.boundingClientRect.top > 0) {
            img.style.transform = 'scale(1.28)'
            img.style.transition = 'none'
          }
        })
      },
      { threshold: 0.15 }
    )

    imageWrappers.forEach((el) => {
      const img = el.querySelector('.works-image')
      if (img) {
        img.style.transform = 'scale(1.28)'
        img.style.transition = 'none'
      }
      observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  // Left column: Steps 01 & 03; Right column (offset by 307px): Steps 02 & 04
  const leftSteps = [PROCESS_STEPS[0], PROCESS_STEPS[2]]
  const rightSteps = [PROCESS_STEPS[1], PROCESS_STEPS[3]]

  return (
    <section id='process' ref={sectionRef} className='section works'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='works-main-wrapper'>

          {/* Sticky Centered Title Area (scales & fades as staggered cards scroll past) */}
          <div className='works-top'>
            <div
              ref={titleRef}
              className='works-title-wrapper'
              style={{ willChange: 'transform, opacity', transition: 'transform 0.1s ease-out, opacity 0.1s ease-out' }}
            >
              <div className='sub-title-wrapper middle'>
                <div slide-bottom-all='' className='sub-tag-wrap'>
                  <div className='sub-tag-dot'></div>
                  <div className='sub-tag-text-wrap'>
                    <div className='body-text gray'>Our Process</div>
                  </div>
                </div>
                <div className='sub-title-wrap'>
                  <h2 className='sub-title'>
                    Your Recovery,<br />Step by Step
                  </h2>
                </div>
                <div slide-bottom-all='' className='sub-text-wrap works'>
                  <p className='body-text gray'>
                    From your first assessment to full recovery, we guide you through every stage with a clear, personalised plan built around your body.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Staggered 2-Column Layout */}
          <div className='works-flex'>
            <div className='works-left-wrap'>
              <div className='works-wrapper'>
                {leftSteps.map((item) => (
                  <div key={item.step} className='works-wrap'>
                    <div img-scroll='' className='works-image-wrapper'>
                      <img
                        src={item.image}
                        loading='lazy'
                        zoom-out=''
                        alt={item.alt}
                        className='works-image'
                      />
                    </div>
                    <div className='works-content'>
                      <div className='h3'>{item.title}</div>
                      <p className='body-text middle'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='works-right-wrap'>
              <div className='works-wrapper right'>
                {rightSteps.map((item) => (
                  <div key={item.step} className='works-wrap'>
                    <div img-scroll='' className='works-image-wrapper'>
                      <img
                        src={item.image}
                        loading='lazy'
                        zoom-out=''
                        alt={item.alt}
                        className='works-image'
                      />
                    </div>
                    <div className='works-content'>
                      <div className='h3'>{item.title}</div>
                      <p className='body-text middle'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Touch-friendly process cards replace the auto-scrolling desktop layout. */}
          <div className='work-loop-wrapper'>
            <div className='work-loop-track'>
              <div className='work-loop'>
                {PROCESS_STEPS.map((item) => (
                  <article key={item.step} className='works-wrap'>
                    <div img-scroll='' className='works-image-wrapper'>
                      <img
                        src={item.image}
                        loading='lazy'
                        zoom-out=''
                        alt={item.alt}
                        className='works-image'
                      />
                    </div>
                    <div className='works-content'>
                      <h3 className='h3'>{item.title}</h3>
                      <p className='body-text middle'>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
