import { useEffect, useRef, useState } from 'react'

const milestones = [
  {
    phase: '01 · Foundation',
    title: 'BPT — Bachelor of Physiotherapy',
    badge: 'Undergraduate',
    desc: 'Foundational clinical training in musculoskeletal biomechanics, anatomy, and therapeutic exercise protocols.'
  },
  {
    phase: '02 · Specialization',
    title: 'MPT (Neuro) — Rehabilitation',
    badge: 'Post-Graduate',
    desc: 'Specialized clinical mastery in stroke recovery, spinal cord injury rehab, and neuromuscular motor retraining.'
  },
  {
    phase: '03 · Certification',
    title: 'COMT & CDCT Certified Therapist',
    badge: 'Dual Certified',
    desc: 'Certified Orthopaedic Manual Therapy for joint mobilization, combined with Certified Dry Needling for trigger points.'
  },
  {
    phase: '04 · Sports Honors',
    title: 'Asian Para Games Gold Mentor',
    badge: 'Asian Games Gold',
    desc: 'Supervised full-cycle sports rehab and power conditioning for Neeraj Yadav during his Asian Para Games Gold triumph.'
  },
  {
    phase: '05 · Clinical Practice',
    title: 'Founder & Chief Specialist',
    badge: 'Wellness Noida',
    desc: 'Over 5 years and 1,000+ patient recoveries. Personally conducts every primary assessment with measurable milestones.'
  }
]

export default function DoctorTimeline() {
  const [scrollProgress, setScrollProgress] = useState(0.25)
  const timelineRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const el = timelineRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight || 800

      // Progress starts when top of timeline reaches 85% of viewport
      // and completes when top reaches 20% of viewport
      const start = windowHeight * 0.85
      const end = windowHeight * 0.20
      const totalRange = start - end

      const current = start - rect.top
      const progress = Math.min(1, Math.max(0, current / totalRange))
      setScrollProgress(progress)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Highlight threshold for each of the 5 cards
  const activeCount = Math.min(
    milestones.length,
    Math.max(1, Math.ceil(scrollProgress * milestones.length))
  )

  // Progress line width percentage
  const lineWidthPercent = Math.min(100, Math.max(0, scrollProgress * 100))

  return (
    <div className='doctor-timeline horizontal-timeline' ref={timelineRef}>
      <div className='doctor-timeline-header'>
        <div className='doctor-timeline-tag'>
          <span className='doctor-timeline-dot'></span>
          <span>{'Clinical Milestones & Achievements'}</span>
        </div>
        <h3 className='doctor-timeline-title'>
          {'Career & Credentials Timeline'}
        </h3>
      </div>

      <div className='horizontal-timeline-track-wrap'>
        {/* Continuous Horizontal Timeline Line */}
        <div className='horizontal-timeline-line-bg' aria-hidden='true'>
          <div
            className='horizontal-timeline-line-fill'
            style={{ width: `${lineWidthPercent}%` }}
          ></div>
        </div>

        {/* 5 Horizontal Milestone Cards */}
        <div className='horizontal-timeline-cards' role='list' aria-label='Career milestones'>
          {milestones.map((item, idx) => {
            const isHighlighted = idx < activeCount
            return (
              <div
                key={item.title}
                role='listitem'
                className={`horizontal-timeline-card-item ${isHighlighted ? 'is-highlighted' : ''}`}
              >
                {/* Milestone Node on the Line */}
                <div className='horizontal-timeline-node-wrap'>
                  <div className='horizontal-timeline-node'>
                    <span className='horizontal-timeline-node-num'>{idx + 1}</span>
                  </div>
                </div>

                {/* Milestone Card Content */}
                <div className='horizontal-timeline-card'>
                  <div className='horizontal-timeline-card-top'>
                    <span className='doctor-timeline-phase'>{item.phase}</span>
                    <span className='doctor-timeline-badge'>{item.badge}</span>
                  </div>
                  <h4 className='doctor-timeline-card-title'>{item.title}</h4>
                  <p className='doctor-timeline-card-desc'>{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
