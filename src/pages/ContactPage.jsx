import PageHeader from '../components/PageHeader'
import BookingForm from '../components/BookingForm'
import { CLINIC_INFO } from '../data/clinic'

const details = [
  {
    label: 'Clinic Address',
    value: CLINIC_INFO.address,
    href: CLINIC_INFO.googleMapsUrl,
    external: true
  },
  {
    label: 'Phone',
    value: CLINIC_INFO.phoneDisplay,
    href: `tel:${CLINIC_INFO.phone}`
  },
  {
    label: 'Email',
    value: CLINIC_INFO.email,
    href: `mailto:${CLINIC_INFO.email}`
  },
  {
    label: 'Instagram',
    value: CLINIC_INFO.instagramDisplay,
    href: CLINIC_INFO.instagram,
    external: true
  }
]

const hours = [
  { day: 'Monday – Saturday', time: '9:00 am – 8:00 pm' },
  { day: 'Sunday', time: 'By appointment' },
  { day: 'Home visits', time: 'Across Noida, 7 days' }
]

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        label='Get In Touch'
        title='Visit Us in Noida Sector 04'
        description='Walk in, call ahead or book a home visit. We will confirm your slot and start with a proper assessment.'
        image='/assets/img/clinic/reception.jpg'
        imageSmall='/assets/img/3fe0b5-6a8fd60b525735221fc5d64e_Frame-156-p-500.webp'
      />

      <section className='section contact-page'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='contact-page-grid'>
            <div className='contact-page-info'>
              <div className='sub-title-wrap left'>
                <h2 className='sub-title'>{'Clinic Details'}</h2>
              </div>
              <div className='cta-contact-list contact-page-list'>
                {details.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className='cta-contact-item'
                    {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    <div className='cta-contact-label'>{item.label}</div>
                    <div className='cta-contact-value'>{item.value}</div>
                  </a>
                ))}
              </div>

              <div className='contact-hours'>
                <div className='contact-hours-title'>{'Clinic Hours'}</div>
                {hours.map((row) => (
                  <div key={row.day} className='contact-hours-row'>
                    <span>{row.day}</span>
                    <span>{row.time}</span>
                  </div>
                ))}
              </div>

              <div className='contact-actions'>
                <a href={`tel:${CLINIC_INFO.phone}`} className='booking-submit'>{'Call Now'}</a>
                <a
                  href={CLINIC_INFO.googleMapsUrl}
                  target='_blank'
                  rel='noreferrer'
                  className='contact-map-link'
                >
                  {'Open in Google Maps'}
                </a>
              </div>
            </div>

            <div className='contact-page-form'>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
