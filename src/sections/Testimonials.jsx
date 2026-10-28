import TestimonialCarousel from '../components/TestimonialCarousel'
import { GOOGLE_BUSINESS_URL } from '../data/clinic'

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' className='reviews-google-icon' aria-hidden='true'>
      <path fill='#4285F4' d='M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z' />
      <path fill='#34A853' d='M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z' />
      <path fill='#FBBC05' d='M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z' />
      <path fill='#EA4335' d='M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z' />
    </svg>
  )
}

function ExternalIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox='0 0 20 20' fill='currentColor' className='reviews-external-icon' aria-hidden='true'>
      <path fillRule='evenodd' d='M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z' clipRule='evenodd' />
    </svg>
  )
}

export default function Testimonials() {
  return (
    <>
    <section id='reviews' className='section client-stories'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='client-main-wrapper'>
          <div className='client-title-wrapper'>
            <div className='sub-title-wrapper middle'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>
                    {'Patient Stories'}
                  </div>
                </div>
              </div>
              <div className='sub-title-wrap'>
                <h2 className='sub-title'>
                  {'What Our Patients Say'}
                </h2>
              </div>
              <div slide-bottom-all='' className='sub-text-wrap client'>
                <p className='body-text gray'>
                  {'Real experiences from people who found relief, recovery and confidence at Wellness Physiotherapy Centre in Noida.'}
                </p>
              </div>

              {/* Google Business Profile badge */}
              <div className='reviews-google-badge-wrap'>
                <a
                  href={GOOGLE_BUSINESS_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='reviews-google-badge'
                  aria-label='Wellness Physiotherapy Centre on Google Maps (opens in a new tab)'
                >
                  <GoogleIcon size={18} />
                  <span className='reviews-google-badge-text'>
                    <span className='reviews-google-score'>{'5.0'}</span>
                    <span className='reviews-google-stars' aria-hidden='true'>{'★★★★★'}</span>
                    <span className='reviews-google-label'>{'on Google Business Profile'}</span>
                  </span>
                  <ExternalIcon size={13} />
                </a>
              </div>
            </div>
          </div>

          <TestimonialCarousel />
        </div>
      </div>
    </section>
    </>
  )
}
