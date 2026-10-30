import CountUp from '../components/CountUp'
import { openAppointmentModal } from '../components/AppointmentModal'

const STATS = [
  { key: 'patients', value: 1000, suffix: '+', label: 'Patients treated with care' },
  { key: 'years', value: 5, suffix: '+', label: 'Years of clinical experience' },
  { key: 'satisfaction', value: 95, suffix: '%', label: 'Patient satisfaction rate' }
]

export default function About() {
  return (
    <section id='about' className='section about'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='about-main-wrapper'>
          <div className='about-main-wrap'>
            <div className='about-pill-wrapper'>
              <div className='about-pill-wrap _01'>
                <div className='about-pill-text'>
                  {'Sports'}
                </div>
              </div>
              <div className='about-pill-wrap _02'>
                <div className='about-pill-text'>
                  {'Rehab'}
                </div>
              </div>
            </div>
            <div className='about-title-wrapper'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>
                    {'About Us'}
                  </div>
                </div>
              </div>
              <div className='sub-title-wrap about'>
                <h2 className='sub-title'>
                  {'Physiotherapy Built Around You'}
                </h2>
              </div>
              <div className='about-credentials'>
                {'BPT, MPT (Neuro), COMT, CDCT — Sports & Rehabilitation Specialist'}
              </div>
              <p className='body-text gray about-bio'>
                {'At Wellness Physiotherapy Centre, treatment starts with a proper assessment and a plan built for your body. Specialising in sports injury rehabilitation, neurological physiotherapy and advanced manual therapy, our patient-centred approach keeps every session focused on measurable recovery.'}
              </p>
              <div className='button-wrap about'>
                <a
                  data-wf--button--variant='black'
                  href='#book'
                  aria-label='Book a Consultation with Wellness Physiotherapy'
                  onClick={(e) => {
                    e.preventDefault()
                    openAppointmentModal('General Physiotherapy Assessment')
                  }}
                  className='primary-button w-variant-0397469d-894a-0c47-2d88-4dc18f7e24aa w-inline-block'
                >
                  <div className='primary-button-inner'>
                    <div className='button-text-wrap'>
                      <div className='button-text'>
                      {'Book a Consultation'}
                      </div>
                      <div className='button-text'>
                      {'Book a Consultation'}
                      </div>
                    </div>
                    <div className='button-arrow-wrap w-variant-0397469d-894a-0c47-2d88-4dc18f7e24aa'>
                      <img loading='lazy' src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg' alt='' className='arrow-icon w-variant-0397469d-894a-0c47-2d88-4dc18f7e24aa' />
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className='about-pill-wrapper'>
              <div className='about-pill-wrap _03'>
                <div className='about-pill-text'>
                  {'Neuro'}
                </div>
              </div>
              <div className='about-pill-wrap _04'>
                <div className='about-pill-text'>
                  {'Manual'}
                </div>
              </div>
            </div>
          </div>
          <div className='about-grid'>
            {STATS.map((stat, index) => (
              <div key={stat.key} className={`about-content-wrapper _0${index + 1}`}>
                <div className='about-content-block'>
                  <div className='about-stat-mark' aria-hidden='true'></div>
                  <div className='count-num'>
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className='body-text gray'>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
