import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CtaBand from '../components/CtaBand'
import BeaconPagination from '../components/BeaconPagination'
import SpecialityCarousel from '../components/SpecialityCarousel'
import Cta from '../sections/Cta'
import { useContent } from '../lib/content'

const PAGE_SIZE = 6

export default function ServicesPage() {
  const [page, setPage] = useState(1)
  const { services } = useContent()
  const pageCount = Math.ceil(services.length / PAGE_SIZE)
  const visibleServices = services.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToPage(next) {
    setPage(next)
  }

  return (
    <main>
      <PageHeader
        label='Our Services'
        title='Ten Specialities, One Clinic'
        description='From neurological rehabilitation to cupping therapy — every service is delivered by a qualified physiotherapist with a plan built around your diagnosis.'
        image='/assets/img/3fe890-6a8c98b74a7a3a476138fa63_Frame-27.webp'
        imageSmall='/assets/img/3fe890-6a8c98b74a7a3a476138fa63_Frame-27.webp'
      />

      <section id='services-list' className='section svc-list'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='svc-list-head'>
            <div className='sub-title-wrapper'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>{'What We Treat'}</div>
                </div>
              </div>
              <div className='sub-title-wrap left'>
                <h2 className='sub-title'>{'Our Physiotherapy Services'}</h2>
              </div>
            </div>
          </div>

          <div className='svc-grid'>
            {visibleServices.map((service, idx) => (
              <a key={service.slug} href={`/services/${service.slug}`} className='svc-card svc-card-modular'>
                <div img-scroll='' className='svc-card-image-wrap'>
                  <img
                    src={service.image}
                    sizes='(max-width: 767px) 90vw, 360px'
                    srcSet={service.imageSmall ? `${service.imageSmall} 500w, ${service.image} 800w` : undefined}
                    alt={service.title}
                    loading='lazy'
                    className='svc-card-image'
                  />
                  <div className='svc-card-top-badges'>
                    <span className='svc-badge-index'>{`0${(page - 1) * PAGE_SIZE + idx + 1}`}</span>
                    <span className='svc-badge-evidence'>{'Evidence-Based'}</span>
                  </div>
                </div>
                <div className='svc-card-body'>
                  <h3 className='svc-card-title'>{service.title}</h3>
                  <p className='body-text gray svc-card-text'>{service.summary}</p>
                  
                  {Array.isArray(service.points) && service.points.length > 0 && (
                    <div className='svc-card-points'>
                      {service.points.slice(0, 2).map((pt) => (
                        <span key={pt} className='svc-point-chip'>
                          <span className='svc-point-dot' aria-hidden='true'></span>
                          <span className='svc-point-label'>{pt}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className='svc-card-footer'>
                    <span className='svc-card-link'>{'Explore Protocol'}</span>
                    <span className='svc-card-arrow-circle' aria-hidden='true'>{'→'}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <BeaconPagination page={page} pageCount={pageCount} onChange={goToPage} label='Services pages' />
        </div>
      </section>

      <CtaBand
        title='Not Sure Which Service You Need?'
        text='Call us on +91 63957 16031 or book an assessment — we will tell you exactly what your condition needs.'
      />

      <section id='specialty' className='section svc-specialty'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='svc-specialty-head'>
            <div className='sub-title-wrapper middle'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>{'Our Speciality'}</div>
                </div>
              </div>
              <div className='sub-title-wrap'>
                <h2 className='sub-title'>{'Conditions We Treat Every Day'}</h2>
              </div>
            </div>
          </div>

          <SpecialityCarousel />
        </div>
      </section>

      <Cta />
    </main>
  )
}
