import LiveOrb from './LiveOrb'
import ShaderBackground from './ui/ShaderBackground'
import { openAppointmentModal } from './AppointmentModal'

export default function CtaBand({
  id,
  className = '',
  title = 'Ready to Move Without Pain?',
  text = 'Book a consultation at our Noida centre or request a home visit — we will assess your movement and build a plan for you.'
}) {
  return (
    <section id={id} className={`section cta-band ${className}`.trim()}>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='cta-band-inner'>
          <ShaderBackground className='cta-shader-bg' />

          <div className='cta-band-copy'>
            <h2 className='cta-band-title'>{title}</h2>
            <p className='cta-band-text'>{text}</p>
          </div>
          <div className='cta-band-actions'>
            <a
              data-wf--button--variant='light'
              href='#book'
              aria-label='Book Appointment at Wellness Physiotherapy'
              onClick={(e) => {
                e.preventDefault()
                openAppointmentModal()
              }}
              className='primary-button w-inline-block cta-button-eyes'
            >
              <div className='primary-button-inner'>
                <div className='button-text-wrap'>
                  <div className='button-text'>{'Book Appointment'}</div>
                  <div className='button-text'>{'Book Appointment'}</div>
                </div>
                <div className='button-arrow-wrap cta-eyes-wrap'>
                  <LiveOrb compact={true} className='cta-button-orb' />
                  <img
                    loading='lazy'
                    src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg'
                    alt=''
                    className='arrow-icon cta-hover-arrow'
                  />
                </div>
              </div>
            </a>
            <a
              href='tel:+916395716031'
              aria-label='Call clinic at +91 63957 16031'
              className='cta-band-call'
            >
              {'Call +91 63957 16031'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
