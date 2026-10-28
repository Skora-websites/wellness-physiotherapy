import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CtaBand from '../components/CtaBand'
import Cta from '../sections/Cta'
import NotFoundPage from './NotFoundPage'
import { services, findService } from '../data/services'
import { CLINIC_INFO } from '../data/clinic'
import { openAppointmentModal } from '../components/AppointmentModal'

export default function ServiceDetailPage({ slug }) {
  const service = findService(slug)
  const [openFaq, setOpenFaq] = useState(null)

  if (!service) return <NotFoundPage />

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3)

  const faqs = [
    {
      q: 'Do I need a doctor’s prescription or referral to start physiotherapy?',
      a: 'No referral is needed. You can book an assessment directly with Dr. Arun Yadav. If you already have MRI reports, X-rays, or surgical discharge summaries, please bring them along to your first appointment.'
    },
    {
      q: 'How many sessions will I need to see significant improvement?',
      a: 'Most patients experience meaningful pain reduction and mobility gains within 3 to 5 sessions. During your comprehensive 45-minute assessment, Dr. Arun will provide an honest, milestone-based recovery roadmap.'
    },
    {
      q: 'Are home visit physiotherapy sessions available for this condition?',
      a: 'Yes. We provide certified home physiotherapy visits across Noida and Greater Noida West for post-operative, neurological, and elderly patients who cannot travel to the clinic.'
    }
  ]

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
              <span className='detail-pill'>
                <span className='detail-pill-dot'></span>
                {'45–60 Mins Session'}
              </span>
              <span className='detail-pill'>
                <span className='detail-pill-dot'></span>
                {'1-on-1 Personalized'}
              </span>
              <span className='detail-pill'>
                <span className='detail-pill-dot'></span>
                {'Clinic & Home Visits'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Detail Section */}
      <section id='service-detail' className='section svc-detail-section'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='svc-detail-layout-grid'>

            {/* Left Column: Rich Clinical Content */}
            <div className='svc-detail-main-content'>

              {/* Featured Treatment Photo */}
              <div className='svc-hero-media-wrap'>
                <img
                  src={service.image}
                  alt={`${service.title} treatment session at Wellness Physiotherapy Noida`}
                  className='svc-hero-media-img'
                  loading='eager'
                />
                <div className='svc-media-badge'>
                  <span className='svc-media-badge-icon'>★</span>
                  {'Evidence-Based Rehabilitation'}
                </div>
              </div>

              {/* Clinical Description */}
              <div className='svc-editorial-block'>
                <h2 className='svc-section-h2'>
                  {`Comprehensive ${service.title} in Noida`}
                </h2>
                <div className='svc-paras-wrap'>
                  {service.description.map((paragraph, index) => (
                    <p key={index} className='svc-body-para'>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Structured 4-Stage Protocol */}
              <div className='svc-protocol-block'>
                <h3 className='svc-sub-h3'>{'Our 4-Stage Recovery Protocol'}</h3>
                <p className='svc-protocol-intro'>
                  {'We follow a scientific, milestone-based approach designed to relieve pain immediately and rebuild long-term joint and muscular resilience.'}
                </p>

                <div className='svc-protocol-grid'>
                  <div className='svc-protocol-card'>
                    <div className='svc-protocol-step-num'>{'01'}</div>
                    <div className='svc-protocol-title'>{'Biomechanical Assessment'}</div>
                    <p className='svc-protocol-desc'>
                      {'Detailed 45-minute physical exam assessing joint range, neural tension, muscular strength, and movement dysfunctions.'}
                    </p>
                  </div>

                  <div className='svc-protocol-card'>
                    <div className='svc-protocol-step-num'>{'02'}</div>
                    <div className='svc-protocol-title'>{'Targeted Pain Relief'}</div>
                    <p className='svc-protocol-desc'>
                      {'Hands-on manual therapy, joint mobilization, dry needling, and advanced electrotherapy to alleviate acute discomfort.'}
                    </p>
                  </div>

                  <div className='svc-protocol-card'>
                    <div className='svc-protocol-step-num'>{'03'}</div>
                    <div className='svc-protocol-title'>{'Neuromuscular Conditioning'}</div>
                    <p className='svc-protocol-desc'>
                      {'Progressive resistive loading, core stability, balance drills, and functional rehabilitation tailored to your daily life.'}
                    </p>
                  </div>

                  <div className='svc-protocol-card'>
                    <div className='svc-protocol-step-num'>{'04'}</div>
                    <div className='svc-protocol-title'>{'Long-Term Prevention'}</div>
                    <p className='svc-protocol-desc'>
                      {'Ergonomic setup advice and a customized home exercise routine that prevents re-injury and keeps you active.'}
                    </p>
                  </div>
                </div>
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
                  {faqs.map((faq, idx) => (
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

            {/* Right Column: Sticky Consultation Sidebar Card */}
            <aside className='svc-detail-sidebar'>
              <div className='svc-sidebar-sticky-card'>
                <div className='svc-card-header-badge'>{'Specialist Consultation'}</div>
                <h3 className='svc-sidebar-card-title'>{'Schedule Your Assessment'}</h3>
                <p className='svc-sidebar-card-desc'>
                  {'Get an accurate physical diagnosis and a personalized rehabilitation plan led by Dr. Arun Yadav.'}
                </p>

                <div className='svc-sidebar-trust-box'>
                  <div className='svc-doctor-mini-profile'>
                    <img
                      src='/assets/img/clinic/doctor-portrait.webp'
                      alt='Dr. Arun Yadav'
                      className='svc-doctor-avatar'
                    />
                    <div className='svc-doctor-meta'>
                      <div className='svc-doctor-name'>{'Dr. Arun Yadav'}</div>
                      <div className='svc-doctor-role'>{'Senior Physiotherapist · BPT, MPT'}</div>
                    </div>
                  </div>

                  <div className='svc-rating-strip'>
                    <span className='svc-stars'>{'★★★★★'}</span>
                    <span className='svc-rating-num'>{'5.0 Google Rating (50+ Reviews)'}</span>
                  </div>
                </div>

                <div className='svc-sidebar-actions'>
                  <a
                    href='#book'
                    onClick={(e) => {
                      e.preventDefault()
                      openAppointmentModal(service.title)
                    }}
                    className='svc-sidebar-book-btn'
                  >
                    {'Book an Appointment'}
                    <span className='svc-btn-arrow'>{'→'}</span>
                  </a>

                  <a href={`tel:${CLINIC_INFO.phone}`} className='svc-sidebar-phone-btn'>
                    <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                    </svg>
                    {`Call: ${CLINIC_INFO.phoneDisplay}`}
                  </a>

                  <a
                    href={`https://wa.me/${CLINIC_INFO.whatsappNumber}?text=Hi,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(service.title)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='svc-sidebar-whatsapp-btn'
                  >
                    {'Chat on WhatsApp'}
                  </a>
                </div>

                <div className='svc-sidebar-features'>
                  <div className='svc-feature-bullet'>{'✔ Direct 1-on-1 doctor attention'}</div>
                  <div className='svc-feature-bullet'>{'✔ No doctor referral needed'}</div>
                  <div className='svc-feature-bullet'>{'✔ Clean, sanitized modern clinic'}</div>
                  <div className='svc-feature-bullet'>{'✔ Home visit option available'}</div>
                </div>

                <div className='svc-sidebar-location-info'>
                  <div className='svc-loc-label'>{'Clinic Address:'}</div>
                  <div className='svc-loc-text'>{CLINIC_INFO.address}</div>
                </div>
              </div>
            </aside>

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
