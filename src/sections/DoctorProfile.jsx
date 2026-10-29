import CountUp from '../components/CountUp'
import DoctorTimeline from '../components/DoctorTimeline'
import { openAppointmentModal } from '../components/AppointmentModal'

const specialties = [
  'Sports injury rehabilitation',
  'Neurological physiotherapy',
  'Advanced manual therapy',
  'Cupping & dry needling'
]

const stats = [
  { label: 'Years in practice', value: 7, suffix: '+' },
  { label: 'Patients treated', value: 1000, suffix: '+' },
  { label: 'Satisfaction', value: 95, suffix: '%' }
]

export default function DoctorProfile() {
  return (
    <section id='doctor' className='section doctor'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='doctor-grid'>
          <div className='doctor-copy'>
            <div slide-bottom-all='' className='sub-tag-wrap'>
              <div className='sub-tag-text-wrap'>
                <div className='body-text gray'>{'Meet the Doctor'}</div>
              </div>
            </div>
            <div className='sub-title-wrap left'>
              <h2 className='sub-title'>{'Dr. Arun Yadav'}</h2>
            </div>
            <div className='doctor-quals'>
              {'BPT, MPT (Neuro), COMT, CDCT — Sports & Rehabilitation Specialist'}
            </div>
            <p className='body-text gray doctor-bio'>
              {'Dr. Arun Yadav founded Wellness Physiotherapy Centre after seven years of clinical practice across sports injury rehabilitation, neurological recovery and advanced manual therapy. He still assesses every new patient himself.'}
            </p>
            <p className='body-text gray doctor-bio'>
              {'His approach is deliberately hands-on: find the cause, treat it manually, then rebuild strength with a plan you can actually follow. Patients range from national-level para-athletes to desk workers with stubborn neck pain.'}
            </p>

            <div className='doctor-specialties'>
              {specialties.map((item) => (
                <div grow-in='' key={item} className='doctor-specialty'>
                  <div className='doctor-specialty-dot'></div>
                  <div className='body-text gray'>{item}</div>
                </div>
              ))}
            </div>

            <div className='button-wrap about'>
              <a
                data-wf--button--variant='black'
                href='#book'
                aria-label='Book a Consultation with Dr. Arun Yadav'
                onClick={(e) => {
                  e.preventDefault()
                  openAppointmentModal('Consultation with Dr. Arun Yadav')
                }}
                className='primary-button w-variant-0397469d-894a-0c47-2d88-4dc18f7e24aa w-inline-block'
              >
                <div className='primary-button-inner'>
                  <div className='button-text-wrap'>
                    <div className='button-text'>{'Book a Consultation'}</div>
                    <div className='button-text'>{'Book a Consultation'}</div>
                  </div>
                  <div className='button-arrow-wrap w-variant-0397469d-894a-0c47-2d88-4dc18f7e24aa'>
                    <img loading='lazy' src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg' alt='' className='arrow-icon w-variant-0397469d-894a-0c47-2d88-4dc18f7e24aa' />
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className='doctor-media'>
            <div grow-in='' className='doctor-portrait'>
              <img
                src='/assets/img/clinic/doctor-portrait.webp'
                alt='Dr. Arun Yadav, founder and chief physiotherapist'
                loading='lazy'
                className='doctor-portrait-image'
              />
            </div>

            <div className='doctor-stats'>
              {stats.map((stat) => (
                <div grow-in='' key={stat.label} className='doctor-stat'>
                  <div className='count-num'>
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className='body-text gray'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-Width Horizontal Milestone Timeline */}
        <DoctorTimeline />
      </div>
    </section>
  )
}
