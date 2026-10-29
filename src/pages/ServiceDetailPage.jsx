import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CtaBand from '../components/CtaBand'
import Cta from '../sections/Cta'
import NotFoundPage from './NotFoundPage'
import { SERVICE_DETAIL } from '../data/detailContent'
import { useContent, usePageSeo } from '../lib/content'

export default function ServiceDetailPage({ slug }) {
  const { services } = useContent()
  const service = services.find((item) => item.slug === slug)
  const [openFaq, setOpenFaq] = useState(null)

  usePageSeo({
    path: `/services/${slug}`,
    title: service ? `${service.metaTitle || service.title} · Wellness Physiotherapy` : undefined,
    description: service?.metaDescription || service?.summary,
    keywords: service?.metaKeywords,
    canonical: service?.canonicalUrl,
  })

  if (!service) return <NotFoundPage />

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3)

  // Copy comes from src/data/detailContent.js + optional per-service overrides.
  const detail = { ...SERVICE_DETAIL, ...service.detail }

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx)
  }

  return (
    <main className='service-detail-page'>
      {/* Dynamic Animated Page Hero */}
      <PageHeader
        label='Specialised Clinical Care'
        title={service.title}
        description={service.summary}
        image={service.image}
        imageSmall={service.imageSmall}
      />

      {/* Breadcrumbs & Quick Bar */}
      <div className='detail-breadcrumb-bar'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='detail-breadcrumb-flex'>
            <nav aria-label='Breadcrumb' className='detail-breadcrumbs'>
              <a href='/' className='breadcrumb-link'>Home</a>
              <span className='breadcrumb-sep'>/</span>
              <a href='/services' className='breadcrumb-link'>Services</a>
              <span className='breadcrumb-sep'>/</span>
              <span className='breadcrumb-current'>{service.title}</span>
            </nav>

            <div className='detail-pills-row'>
              {detail.pills.map((pill) => (
                <span key={pill} className='detail-pill'>
                  <span className='detail-pill-dot'></span>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Detail Section */}
      <section id='service-detail' className='section svc-detail-section'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='svc-detail-main-content'>

            {/* Featured Treatment Photo */}
            <div className='svc-hero-media-wrap'>
              <img
                src={service.image}
                alt={`${service.title} treatment session at Wellness Physiotherapy Noida`}
                className='svc-hero-media-img'
                loading='eager'
              />
              <div className='svc-media-badge'>{detail.mediaBadge}</div>
            </div>

            {/* Clinical Description */}
            <div className='svc-editorial-block'>
              <h2 className='svc-section-h2'>{`Comprehensive ${service.title} in Noida`}</h2>
              {service.contentHtml ? (
                <div className='svc-paras-wrap blog-rich-content' dangerouslySetInnerHTML={{ __html: service.contentHtml }} />
              ) : (
                <div className='svc-paras-wrap'>
                  {service.description.map((paragraph, index) => (
                    <p key={index} className='svc-body-para'>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Conditions & Symptoms Treated Checklist */}
            <div className='svc-conditions-container'>
              <h3 className='svc-sub-h3'>{'Conditions & Symptoms We Address'}</h3>
              <div className='svc-points-grid'>
                {service.points.map((point) => (
                  <div key={point} className='svc-point-item'>
                    <div className='svc-point-icon-box'>
                      <svg viewBox='0 0 20 20' width='14' height='14' fill='currentColor'>
                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                      </svg>
                    </div>
                    <span className='svc-point-text'>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className='svc-faq-block'>
              <h3 className='svc-sub-h3'>{'Frequently Asked Questions'}</h3>
              <div className='svc-faq-list'>
                {detail.faqs.map((faq, idx) => (
                  <div key={idx} className={`svc-faq-item${openFaq === idx ? ' is-expanded' : ''}`}>
                    <button
                      type='button'
                      className='svc-faq-question-btn'
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={openFaq === idx}
                    >
                      <span className='svc-faq-question-text'>{faq.q}</span>
                      <span className='svc-faq-chevron-box'>
                        <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M6 9l6 6 6-6' />
                        </svg>
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className='svc-faq-answer'>
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Related Other Services Section */}
          <div className='svc-related-wrapper'>
            <div className='svc-related-header'>
              <div>
                <span className='svc-related-tag'>{'Comprehensive Care'}</span>
                <h3 className='svc-related-main-title'>{'Explore Other Physiotherapy Specialties'}</h3>
              </div>
              <a href='/services' className='svc-view-all-link'>
                {'View All Services'}
                <span>{'→'}</span>
              </a>
            </div>

            <div className='svc-related-cards-grid'>
              {related.map((item) => (
                <a key={item.slug} href={`/services/${item.slug}`} className='svc-related-item-card'>
                  <div className='svc-related-img-box'>
                    <img src={item.image} alt={item.title} className='svc-related-img' loading='lazy' />
                  </div>
                  <div className='svc-related-content-box'>
                    <h4 className='svc-related-card-title'>{item.title}</h4>
                    <p className='svc-related-card-summary'>{item.summary}</p>
                    <span className='svc-related-read-more'>
                      {'Read Full Service'}
                      <span className='svc-read-arrow'>{'→'}</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Inline CTA Band & Bottom CTA */}
      <CtaBand
        title='Ready to Move Pain-Free?'
        text='Every recovery begins with a clear diagnosis. Schedule an evaluation with Dr. Arun Yadav today.'
      />

      <Cta />
    </main>
  )
}
