import CountUp from '../components/CountUp'
import { openAppointmentModal } from '../components/AppointmentModal'

export default function Journey() {
  return (
    <>
    <section id='clinic' className='section journey'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='journey-main-wrapper'>
          <div className='journey-title-wrapper'>
            <div className='sub-title-wrapper middle'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>
                    {'Our Clinic'}
                  </div>
                </div>
              </div>
              <div className='sub-title-wrap journey'>
                <h2 className='sub-title'>
                  {'State-of-the-Art Clinic Facility'}
                </h2>
              </div>
              <div slide-bottom-all='' className='sub-text-wrap journey'>
                <p className='body-text gray'>
                  {'Our clinic is equipped with modern physiotherapy equipment and a comfortable environment designed to support your healing journey. Every detail is crafted for your comfort and recovery.'}
                </p>
              </div>
            </div>
          </div>
          <div className='clinic-bento'>
            <figure className='clinic-bento-item clinic-bento-large'>
              <img src='/assets/img/clinic/reception.jpg' alt='Reception and waiting area' loading='lazy' />
              <figcaption className='clinic-bento-label'>{'Reception & Waiting Area'}</figcaption>
            </figure>
            <figure className='clinic-bento-item'>
              <img src='/assets/img/clinic/treatment-room.jpg' alt='Private treatment room' loading='lazy' />
              <figcaption className='clinic-bento-label'>{'Treatment Room'}</figcaption>
            </figure>
            <figure className='clinic-bento-item'>
              <img src='/assets/img/clinic/credentials-wall.jpg' alt='Certificates and awards' loading='lazy' />
              <figcaption className='clinic-bento-label'>{'Certificates & Awards'}</figcaption>
            </figure>
            <figure className='clinic-bento-item'>
              <img src='/assets/img/clinic/equipment.jpg' alt='Electrotherapy equipment' loading='lazy' />
              <figcaption className='clinic-bento-label'>{'Electrotherapy'}</figcaption>
            </figure>
            <figure className='clinic-bento-item'>
              <img src='/assets/img/clinic/doctor-desk.jpg' alt='Dr. Arun Yadav at the clinic desk' loading='lazy' />
              <figcaption className='clinic-bento-label'>{'Consultation Desk'}</figcaption>
            </figure>
          </div>
          <div slide-bottom-all='' className='journey-facility journey-facility-centered'>
            <div className='cta-button-wrap'>
              <a
                data-wf--button--variant='black'
                href='#book'
                aria-label='Book a Clinic Visit and Consultation'
                onClick={(e) => {
                  e.preventDefault()
                  openAppointmentModal('Clinic Visit & Consultation')
                }}
                className='primary-button w-inline-block'
              >
                <div className='primary-button-inner'>
                  <div className='button-text-wrap'>
                    <div className='button-text'>{'Visit Us'}</div>
                    <div className='button-text'>{'Visit Us'}</div>
                  </div>
                  <div className='button-arrow-wrap'>
                    <img loading='lazy' src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg' alt='' className='arrow-icon' />
                  </div>
                </div>
              </a>
              <a
                href='tel:+916395716031'
                aria-label='Call Wellness Physiotherapy clinic at +91 63957 16031'
                className='hero-call-link cta-call-link'
              >
                {'Call Now'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
