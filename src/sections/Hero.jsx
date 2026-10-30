import { openAppointmentModal } from '../components/AppointmentModal'
import ShaderBackground from '../components/ui/ShaderBackground'

function renderLetters(text, startIndex = 0) {
  return text.split('').map((char, idx) => {
    const charIndex = startIndex + idx
    if (char === ' ') {
      return (
        <span key={idx} className='hero-char-space'>
          {'\u00A0'}
        </span>
      )
    }
    return (
      <span
        key={idx}
        className='hero-flip-char'
        style={{
          '--char-index': charIndex,
          animationDelay: `${charIndex * 65}ms`,
        }}
      >
        {char}
      </span>
    )
  })
}

export default function Hero() {
  return (
    <section id='home' className='section hero-editorial-section'>
      <ShaderBackground className='hero-shader-bg' />
      <div className='w-layout-blockcontainer container w-container'>
        <div className='hero-editorial-wrapper'>

          {/* Magazine Cover Headline Layout */}
          <div className='hero-editorial-stage'>
            <h1 className='hero-editorial-h1' aria-label='Movement for your recovery'>
              <span className='hero-editorial-line-left' aria-hidden='true'>
                {renderLetters('Movement', 0)}
              </span>
              <span className='hero-editorial-line-right' aria-hidden='true'>
                <span className='hero-text-foryour'>
                  {renderLetters('for your', 8)}
                </span>
                <span className='hero-text-recovery'>
                  {renderLetters('recovery', 16)}
                </span>
              </span>
            </h1>

            {/* Overlapping Running Girl Cutout (Centered between 'for your' and 'recovery', overlapping both top gradient & bottom photo section) */}
            <div className='hero-runner-overlap-wrap' aria-hidden='true'>
              <img
                src='/assets/img/hero-runner-cutout.png'
                alt='Active recovery in motion'
                className='hero-runner-cutout'
                loading='eager'
              />
            </div>
          </div>

          <div className='hero-mobile-copy'>
            <p>Personalised care to help you move better.</p>
            <a
              data-wf--button--variant='light'
              href='#book'
              onClick={(event) => {
                event.preventDefault()
                openAppointmentModal()
              }}
              className='primary-button w-inline-block cta-button-eyes'
            >
              <span className='hero-mobile-button-label'>Book Appointment</span>
              <span className='button-arrow-wrap'>
                <img src='/assets/img/arrow-navy.svg' alt='' className='arrow-icon' />
              </span>
            </a>
          </div>

        </div>
      </div>

      {/* Full-Bleed Viewport-Width Clinic Photo: Dr. Arun Yadav at clinic desk */}
      <div className='hero-editorial-fullbleed'>
        <img
          src='/assets/img/clinic/hero-editorial-clinic.jpg'
          alt='Dr. Arun Yadav, Senior Physiotherapist at Wellness Physiotherapy Noida'
          className='hero-editorial-fullbleed-img'
          loading='eager'
        />
        <div className='hero-editorial-fullbleed-overlay'></div>
      </div>
    </section>
  )
}
