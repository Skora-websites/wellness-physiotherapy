/**
 * Button mascot: two eyes that face forward and blink on an interval.
 * (Pointer tracking was removed: it pushed the eyes sideways inside the button.)
 */
export default function LiveOrb({ compact = false, className = '' }) {
  return (
    <div
      className={`live-orb ${compact ? 'live-orb-compact' : ''} ${className}`.trim()}
      aria-hidden='true'
    >
      <div className='live-orb-eyes live-orb-eyes-blink'>
        <span className='live-orb-slit' />
        <span className='live-orb-slit' />
      </div>
    </div>
  )
}
