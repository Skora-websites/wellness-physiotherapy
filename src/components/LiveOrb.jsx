import { useEffect, useRef } from 'react'

/**
 * Animated sphere whose eyes follow pointers and blink when displayed on mobile.
 */
export default function LiveOrb({ compact = false, className = '' }) {
  const orbRef = useRef(null)
  const eyesRef = useRef(null)

  useEffect(() => {
    const orb = orbRef.current
    const eyes = eyesRef.current
    if (!orb || !eyes) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 640px)')
    if (reduceMotion.matches) return undefined

    if (mobile.matches) {
      eyes.classList.add('live-orb-eyes-blink')
      return () => eyes.classList.remove('live-orb-eyes-blink')
    }

    let frame = 0

    const track = (event) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const box = orb.getBoundingClientRect()
        const dx = event.clientX - (box.left + box.width / 2)
        const dy = event.clientY - (box.top + box.height / 2)
        const distance = Math.hypot(dx, dy) || 1
        const maxReach = compact ? 10 : 24
        const reach = Math.min(1, distance / (compact ? 100 : 220)) * maxReach
        const x = (dx / distance) * reach
        const y = (dy / distance) * reach
        eyes.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      })
    }

    window.addEventListener('pointermove', track, { passive: true })
    return () => {
      window.removeEventListener('pointermove', track)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [compact])

  return (
    <div
      className={`live-orb ${compact ? 'live-orb-compact' : ''} ${className}`.trim()}
      ref={orbRef}
      aria-hidden='true'
    >
      <div className='live-orb-eyes' ref={eyesRef}>
        <span className='live-orb-slit' />
        <span className='live-orb-slit' />
      </div>
    </div>
  )
}

