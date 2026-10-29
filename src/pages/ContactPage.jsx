import PageHeader from '../components/PageHeader'
import BookingForm from '../components/BookingForm'
import { CLINIC_INFO } from '../data/clinic'
import { useContent } from '../lib/content'

export default function ContactPage() {
  const { siteDetails } = useContent()
  const info = {
    ...CLINIC_INFO,
    ...siteDetails,
    address:
      siteDetails.address ||
      [siteDetails.address1, siteDetails.address2, siteDetails.city, siteDetails.state, siteDetails.zip]
        .filter(Boolean)
        .join(', '),
  }

  const details = [
    { label: 'Clinic Address', value: info.address, href: info.mapsUrl || info.googleMapsUrl, external: true },
    { label: 'Phone', value: info.phoneDisplay || info.phone, href: `tel:${info.phone}` },
    { label: 'Email', value: info.email, href: `mailto:${info.email}` },
    {
      label: 'Instagram',
      value: info.instagramDisplay || info.instagram,
      href: info.social?.instagram || info.instagram,
      external: true
    }
  ]

  const hours = (siteDetails.hours || []).length
    ? siteDetails.hours.map((row) => ({ day: `${row.title} · ${row.days}`, time: row.timing }))
    : [
        { day: 'Monday – Saturday', time: '9:00 am – 8:00 pm' },
        { day: 'Sunday', time: 'By appointment' },
        { day: 'Home visits', time: 'Across Noida, 7 days' }
      ]

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
                <a href={`tel:${info.phone}`} className='booking-submit'>{'Call Now'}</a>
                <a
                  href={info.mapsUrl || info.googleMapsUrl}
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

          <div className='contact-map-embed'>
            <div className='contact-map-embed-head'>
              <div>
                <span className='contact-map-embed-tag'>{'Find Us'}</span>
                <h2 className='contact-map-embed-title'>{info.name}</h2>
                <p className='contact-map-embed-address'>{info.address}</p>
              </div>
              <a
                href={info.mapsUrl || info.googleMapsUrl}
                target='_blank'
                rel='noreferrer'
                className='contact-map-embed-link'
              >
                {'Get Directions'}
                <span aria-hidden='true'>{'\u2192'}</span>
              </a>
            </div>
            <div className='contact-map-frame'>
              <iframe
                title='Wellness Physiotherapy Centre location on Google Maps'
                src='https://www.google.com/maps?q=28.6101164,77.4368737&z=16&hl=en&output=embed'
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
