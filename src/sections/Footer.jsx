
import { GradientBars } from '../components/ui/gradient-bars-background'
import { CLINIC_INFO } from '../data/clinic'

const services = [
  { href: '/services', label: 'Physiotherapy Assessment' },
  { href: '/services', label: 'Home Session' },
  { href: '/services', label: 'Physiotherapy Treatment' },
  { href: '/services', label: 'Sports Rehabilitation' },
  { href: '/services', label: 'Post-Surgery Care' }
]

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' }
]

const contactLinks = [
  {
    href: CLINIC_INFO.googleMapsUrl,
    label: CLINIC_INFO.address,
    external: true
  },
  { href: `tel:${CLINIC_INFO.phone}`, label: CLINIC_INFO.phoneDisplay },
  { href: `mailto:${CLINIC_INFO.email}`, label: CLINIC_INFO.email },
  { href: CLINIC_INFO.instagram, label: CLINIC_INFO.instagramDisplay, external: true }
]

export default function Footer() {
  return (
    <footer id='footer' className='section footer' role='contentinfo'>
      <GradientBars
        numBars={15}
        gradientFrom='rgba(21, 90, 145, 0.88)'
        gradientTo='transparent'
        animationDuration={2.2}
      />
      <div className='w-layout-blockcontainer container w-container'>
        <div className='footer-main-wrapper'>

          {/* 4-Column Footer Navigation Grid */}
          <div className='footer-info'>
            <div className='footer-info-col footer-info-brand'>
              <div className='footer-info-title'>
                {'Wellness Physiotherapy'}
              </div>
              <p className='footer-brand-desc'>
                {'Providing premium, evidence-based physiotherapy care in Noida to help you move better, recover faster, and live pain-free.'}
              </p>
            </div>

            {/* Services + Quick Links share one row: two columns on small screens */}
            <div className='footer-info-links'>
            <div className='footer-info-col'>
              <div className='footer-info-title'>
                {'Our Services'}
              </div>
              <ul className='footer-info-list' role='list'>
                {services.map((item) => (
                  <li key={item.label} className='footer-info-item'>
                    <a href={item.href} className='footer-info-link'>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className='footer-info-col'>
              <div className='footer-info-title'>
                {'Quick Links'}
              </div>
              <ul className='footer-info-list' role='list'>
                {quickLinks.map((link) => (
                  <li key={link.label} className='footer-info-item'>
                    <a href={link.href} className='footer-info-link'>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            </div>

            <div className='footer-info-col'>
              <div className='footer-info-title'>
                {'Contact Info'}
              </div>
              <ul className='footer-info-list' role='list'>
                {contactLinks.map((item) => (
                  <li key={item.label} className='footer-info-item'>
                    <a
                      href={item.href}
                      className='footer-info-link'
                      {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Giant Magazine Brand Wordmark */}
          <div className='footer-image-wrapper'>
            <a href='/' className='footer-wordmark-link' aria-label='Wellness Physiotherapy - Return to homepage'>
              <div className='footer-wordmark'>
                {'Wellness Physiotherapy'}
              </div>
            </a>
          </div>

          <div className='footer-divider'></div>

          {/* Bottom Bar: Copyright & Social Icons */}
          <div className='footer-bottom-wrap'>
            <div className='footer-text-wrap'>
              <div className='body-text white'>
                {'© 2026 Wellness Physiotherapy Centre. All Rights Reserved.'}
              </div>
              <div className='footer-credit'>
                {'Made by '}
                <a
                  href='https://skorainfotech.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='footer-credit-link'
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  {'SkoraInfotech'}
                </a>
              </div>
            </div>
            <div className='footer-icon-wrapper'>
              <a
                href='https://x.com/login'
                target='_blank'
                rel='noreferrer'
                aria-label='Follow Wellness Physiotherapy on X'
                className='footer-icon-wrap w-inline-block'
              >
                <img src='/assets/img/188cd4-6a8fe36ac5ebb416ebddfb63_Frame.svg' loading='lazy' alt='X (Twitter)' className='footer-icon' />
              </a>
              <a
                href='https://www.facebook.com/login/'
                target='_blank'
                rel='noreferrer'
                aria-label='Follow Wellness Physiotherapy on Facebook'
                className='footer-icon-wrap w-inline-block'
              >
                <img src='/assets/img/efc161-6a8fe36afb0202d3b4465ac0_Frame-1-.svg' loading='lazy' alt='Facebook' className='footer-icon' />
              </a>
              <a
                href={CLINIC_INFO.instagram}
                target='_blank'
                rel='noreferrer'
                aria-label='Follow Wellness Physiotherapy on Instagram'
                className='footer-icon-wrap w-inline-block'
              >
                <img src='/assets/img/87f0c0-6a8fe36afb0202d3b4465ac5_Frame-2-.svg' loading='lazy' alt='Instagram' className='footer-icon' />
              </a>
              <a
                href='https://www.linkedin.com/login'
                target='_blank'
                rel='noreferrer'
                aria-label='Connect with Wellness Physiotherapy on LinkedIn'
                className='footer-icon-wrap w-inline-block'
              >
                <img src='/assets/img/91430d-6a8fe36a5f737fe02f6c2fc5_Frame-3-.svg' loading='lazy' alt='LinkedIn' className='footer-icon' />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
