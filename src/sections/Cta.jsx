import LiveOrb from '../components/LiveOrb'
import ShaderBackground from '../components/ui/ShaderBackground'
import { openAppointmentModal } from '../components/AppointmentModal'

export default function Cta() {
  return (
    <section id='contact' className='section cta'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='cta-panel cta-panel-prominent'>
          <ShaderBackground className='cta-shader-bg' />

          <div className='cta-panel-copy cta-panel-centered'>
            <div className='cta-badge'>
              <span className='cta-badge-dot' aria-hidden='true'></span>
              <span>{'START YOUR RECOVERY JOURNEY TODAY'}</span>
            </div>

            <h2 className='sub-title cta-panel-title'>
              {'Pain Should Not Decide Your Day'}
            </h2>

            <p className='body-text cta-panel-text'>
              {'Experience evidence-based physiotherapy with personalized 1-on-1 care in Noida. Leave your first 30-minute diagnostic assessment with clarity, relief, and a customized recovery plan you can start immediately.'}
            </p>



            {/* Action buttons row */}
            <div className='cta-actions-row'>
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
                    <div className='button-text'>
                      {'Book Assessment'}
                    </div>
                    <div className='button-text'>
                      {'Book Assessment'}
                    </div>
                  </div>
                  <div className='button-arrow-wrap cta-eyes-wrap'>
                    <LiveOrb compact={true} className='cta-button-orb' />
                    <img loading='lazy' src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg' alt='' className='arrow-icon cta-hover-arrow' />
                  </div>
                </div>
              </a>

              <a
                href='tel:+916395716031'
                className='cta-phone-button'
                aria-label='Call clinic at +91 63957 16031'
              >
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'></path>
                </svg>
                <span>{'Call Clinic: +91 63957 16031'}</span>
              </a>
            </div>

            {/* Trust badge strip */}
            <div className='cta-trust-strip'>
              <span className='cta-trust-item'>
                <span className='cta-trust-star'>{'★'}</span> {'4.9/5 Google Rating'}
              </span>
              <span className='cta-trust-sep'>{'•'}</span>
              <span className='cta-trust-item'>{'1,000+ Recovered Patients'}</span>
              <span className='cta-trust-sep'>{'•'}</span>
              <span className='cta-trust-item'>{'Sector 104, Noida'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
