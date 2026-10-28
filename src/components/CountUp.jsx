import { useEffect, useRef, useState } from 'react'

/**
 * Counts from 0 to `value` the first time it scrolls into view.
 * Uses the template's `.count-number` typography.
 */
export default function CountUp({ value, suffix = '', duration = 1600 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return undefined
    }

    let frame = 0
    let started = false

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return
        started = true
        observer.disconnect()

        const startTime = performance.now()
        const step = (now) => {
          const progress = Math.min(1, (now - startTime) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(value * eased))
          if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <div className="count-number" ref={ref}>
      {display}
      {suffix}
    </div>
  )
}
