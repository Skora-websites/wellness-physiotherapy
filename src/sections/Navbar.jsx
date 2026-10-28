import { useState, useEffect } from 'react'
import { openAppointmentModal } from '../components/AppointmentModal'
import { LiquidNavbar, NimbusIcons } from '../components/ui/liquid-glass-navbar'

const navItems = [
  { label: 'Home', href: '/', icon: NimbusIcons.home, fx: 'glow' },
  { label: 'About', href: '/about', icon: NimbusIcons.user, fx: 'wave' },
  { label: 'Services', href: '/services', icon: NimbusIcons.activity, fx: 'wave' },
  { label: 'Blogs', href: '/blog', icon: NimbusIcons.globe, fx: 'spin' },
  { label: 'Gallery', href: '/gallery', icon: NimbusIcons.gallery, fx: 'pop' },
  { label: 'Contact', href: '/contact', icon: NimbusIcons.plane, fx: 'plane' }
]

function getActiveIndex(path) {
  if (path === '/') return 0
  const idx = navItems.findIndex((item) => item.href !== '/' && (path === item.href || path.startsWith(`${item.href}/`)))
  return idx >= 0 ? idx : 0
}

export default function Navbar({ path = '/' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const activeIndex = getActiveIndex(path)

  // Track scroll position past hero section
  useEffect(() => {
    const onScroll = () => {
      const hero =
        document.getElementById('home') ||
        document.querySelector('.hero-editorial-section') ||
        document.querySelector('.page-hero')
      const offset = hero ? Math.max(160, hero.offsetHeight - 120) : 220
      setScrolled(window.scrollY > offset)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [path])

  // Close mobile navigation on Escape key
  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <div
      role='banner'
      className={`navbar w-nav unified-nav-wrapper${scrolled ? ' is-scrolled' : ''}`}
    >
      <div className='container w-container'>
        <div className='navbar-main-wrapper unified-navbar-row'>

          {/* Unified Liquid Glass Pill: Logo + Navigation Items */}
          <div className='unified-pill-container'>
            <LiquidNavbar
              tone='light'
              active={activeIndex}
              className='unified-liquid-pill'
              items={navItems}
            >
              <a href='/' className='liquid-pill-brand' aria-label='Wellness Physiotherapy'>
                <img
                  src='/assets/img/brand/logo-mark.png'
                  alt=''
                  className='liquid-pill-logo'
                  loading='eager'
                />
                <span className='liquid-pill-name'>
                  {'Wellness Physiotherapy'}
                </span>
              </a>
              <span className='liquid-pill-divider' aria-hidden='true'></span>
            </LiquidNavbar>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type='button'
            aria-label='Toggle navigation menu'
            aria-expanded={menuOpen}
            aria-controls='primary-navigation'
            onClick={() => setMenuOpen((open) => !open)}
            className={`menu-button w-nav-button${menuOpen ? ' w--open' : ''}`}
          >
            <div className='menu-button-wrap'>
              <div className='menu-top'></div>
              <div className='menu-bottom'></div>
            </div>
          </button>

          {/* Mobile Menu Dropdown */}
          <div
            id='primary-navigation'
            className={`mobile-nav-drawer${menuOpen ? ' is-open' : ''}`}
            aria-hidden={!menuOpen}
          >
            <div className='mobile-nav-inner'>
              {navItems.map((item, idx) => {
                const isActive = idx === activeIndex
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`mobile-nav-link${isActive ? ' is-active' : ''}`}
                  >
                    <span className='mobile-nav-icon'>{item.icon}</span>
                    <span className='mobile-nav-label'>{item.label}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Separate Book Appointment CTA Button */}
          <div className='nav-button-wrap'>
            <a
              data-wf--button--variant='light'
              href='#book'
              aria-label='Book Appointment at Wellness Physiotherapy'
              onClick={(e) => {
                e.preventDefault()
                openAppointmentModal()
              }}
              className='primary-button w-inline-block'
            >
              <div className='primary-button-inner'>
                <div className='button-text-wrap'>
                  <div className='button-text'>
                    {'Book Appointment'}
                  </div>
                  <div className='button-text'>
                    {'Book Appointment'}
                  </div>
                </div>
                <div className='button-arrow-wrap'>
                  <img
                    loading='lazy'
                    src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg'
                    alt=''
                    className='arrow-icon'
                  />
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
