import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api, getToken, setToken } from './client'
import { ToastCtx } from './parts'
import { NAV, useTabRoute } from './nav'
import Login from './Login'
import Dashboard from './Dashboard'
import BlogsAdmin from './BlogsAdmin'
import ServicesAdmin from './ServicesAdmin'
import InquiriesAdmin from './InquiriesAdmin'
import SiteDetailsAdmin from './SiteDetailsAdmin'
import SeoAdmin from './SeoAdmin'
import AccountAdmin from './AccountAdmin'
import logo from '/assets/img/brand/logo-lockup.png'
import './admin.css'

const TITLES = {
  dashboard: 'Dashboard Overview',
  consultations: 'Consultation Requests',
  contacts: 'Contact Messages',
  services: 'Services Management',
  blogs: 'Blogs & Pages',
  'site-details': 'Site Details',
  seo: 'Page-by-Page SEO',
  account: 'Account Settings',
}

export default function AdminApp() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(Boolean(getToken()))
  const [tab, go] = useTabRoute()
  const [navOpen, setNavOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [sessionNotice, setSessionNotice] = useState('')
  const [counts, setCounts] = useState({ consultations: 0, contacts: 0 })
  const sidebarRef = useRef(null)
  const burgerRef = useRef(null)
  const headingRef = useRef(null)
  const mainRef = useRef(null)
  const skipNavRestore = useRef(false)
  const firstTabEffect = useRef(true)

  const notify = useCallback((message) => {
    setToast({ message, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  const refreshCounts = useCallback(async () => {
    try {
      const [consultations, contacts] = await Promise.all([api('/api/consultations'), api('/api/contacts')])
      setCounts({
        consultations: consultations.filter((item) => item.status === 'new').length,
        contacts: contacts.filter((item) => item.status === 'new').length,
      })
    } catch {
      /* counts stay at zero when the API is unavailable */
    }
  }, [])

  useEffect(() => {
    // Legacy hash links still land on the dashboard.
    if (window.location.hash.startsWith('#/admin')) {
      window.history.replaceState({}, '', '/admin/dashboard')
    }
    if (!getToken()) {
      setChecking(false)
      return
    }
    api('/api/admin/profile')
      .then((profile) => {
        setUser(profile)
        refreshCounts()
      })
      .catch(() => {
        // A 401 has already cleared the token. If it is still here the server was
        // unreachable, so keep it and explain rather than silently signing out.
        if (getToken()) {
          setSessionNotice('We couldn’t reach the server to confirm your session. Check your connection and try again.')
        } else {
          setSessionNotice('Your session expired. Sign in again to continue where you left off.')
        }
      })
      .finally(() => setChecking(false))
  }, [refreshCounts])

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null)
      setSessionNotice('Your session expired. Sign in again to continue where you left off.')
    }
    window.addEventListener('admin-unauthorized', onUnauthorized)
    return () => window.removeEventListener('admin-unauthorized', onUnauthorized)
  }, [])

  useEffect(() => {
    if (!user) return
    document.title = `${TITLES[tab] || 'Admin'} · Wellness Physiotherapy`
  }, [tab, user])

  // Move focus to the page heading after an in-app navigation so keyboard and
  // screen-reader users hear the new section instead of staying on the old tab.
  useEffect(() => {
    if (firstTabEffect.current) {
      firstTabEffect.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [tab])

  // The sidebar is an off-canvas drawer below 1080px. Lock the page, trap focus
  // inside the drawer, close on Escape, and return focus to the opener.
  useEffect(() => {
    if (!navOpen) return undefined
    const sidebar = sidebarRef.current
    const previousOverflow = document.body.style.overflow
    const focusables = () =>
      sidebar
        ? Array.from(sidebar.querySelectorAll('button, a[href]')).filter(
            (element) => element.getClientRects().length > 0
          )
        : []

    document.body.style.overflow = 'hidden'
    if (mainRef.current) mainRef.current.inert = true
    ;(sidebar?.querySelector('.adm-nav-close') || focusables()[0])?.focus()

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setNavOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
      if (mainRef.current) mainRef.current.inert = false
      if (skipNavRestore.current) {
        skipNavRestore.current = false
        return
      }
      burgerRef.current?.focus()
    }
  }, [navOpen])

  // Do not leave the drawer open (or the body locked) when resizing to desktop.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1081px)')
    const onChange = () => {
      if (media.matches) setNavOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const login = async (email, password) => {
    setSessionNotice('')
    const result = await api('/api/admin/login', { method: 'POST', body: { email, password } })
    setToken(result.token)
    setUser(result.user)
    if (window.location.pathname.replace(/\/$/, '') === '/admin') go('dashboard')
    refreshCounts()
  }

  const logout = async () => {
    try {
      await api('/api/admin/logout', { method: 'POST' })
    } catch {
      /* token is dropped locally regardless */
    }
    setToken(null)
    setSessionNotice('')
    setUser(null)
    go('dashboard')
  }

  // The password endpoint revokes every session, so drop this one cleanly
  // instead of leaving a dead token behind for the next request to trip over.
  const endSession = useCallback(() => {
    setToken(null)
    setUser(null)
    setSessionNotice('Password changed. Sign in again with your new password.')
    go('dashboard')
  }, [go])

  const select = (next) => {
    const changing = next !== tab
    if (navOpen && changing) skipNavRestore.current = true
    go(next)
    setNavOpen(false)
  }

  const body = useMemo(() => {
    switch (tab) {
      case 'blogs':
        return <BlogsAdmin />
      case 'services':
        return <ServicesAdmin />
      case 'consultations':
        return <InquiriesAdmin kind='consultations' onChanged={refreshCounts} />
      case 'contacts':
        return <InquiriesAdmin kind='contacts' onChanged={refreshCounts} />
      case 'site-details':
        return <SiteDetailsAdmin />
      case 'seo':
        return <SeoAdmin />
      case 'account':
        return <AccountAdmin user={user} onUser={setUser} onSessionEnded={endSession} />
      default:
        return <Dashboard counts={counts} onNavigate={go} />
    }
  }, [tab, counts, go, refreshCounts, user, endSession])

  if (checking) {
    return (
      <div className='adm-splash'>
        <span className='adm-spinner' />
        Checking session…
      </div>
    )
  }

  if (!user) return <Login onSubmit={login} notice={sessionNotice} />

  return (
    <ToastCtx.Provider value={notify}>
      <div className={`adm-shell${navOpen ? ' is-nav-open' : ''}`}>
        <a className='adm-skip-link' href='#admin-main'>Skip to admin content</a>
        <aside ref={sidebarRef} id='admin-sidebar' className='adm-sidebar' aria-label='Admin navigation'>
          <button
            type='button'
            className='adm-nav-close'
            onClick={() => setNavOpen(false)}
            aria-label='Close navigation'
          >
            ✕
          </button>
          <div className='adm-brand'>
            <img className='adm-brand-logo' src={logo} alt='Wellness Physiotherapy' />
            <div>
              <strong>Wellness Physio</strong>
              <small>Admin Panel</small>
            </div>
          </div>

          <nav className='adm-nav' aria-label='Admin sections'>
            {NAV.map((group) => (
              <div key={group.group} className='adm-nav-group'>
                <span className='adm-nav-group-label'>{group.group}</span>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    className={`adm-nav-item${tab === item.id ? ' is-active' : ''}`}
                    aria-current={tab === item.id ? 'page' : undefined}
                    onClick={() => select(item.id)}
                  >
                    <span className='adm-nav-icon' aria-hidden='true'>{item.icon}</span>
                    <span className='adm-nav-label'>{item.label}</span>
                    {item.badge && counts[item.badge] > 0 && (
                      <span className='adm-nav-badge'>{counts[item.badge]}</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className='adm-sidebar-foot'>
            <a href='/' className='adm-side-link' target='_blank' rel='noreferrer'>↗ View Live Site</a>
            <div className='adm-user-card'>
              {user.avatar ? <img src={user.avatar} alt='' /> : <span className='adm-user-initial'>{user.name?.[0] || 'A'}</span>}
              <div className='adm-user-meta'>
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </div>
              <button type='button' className='adm-icon-btn' onClick={logout} title='Sign out' aria-label='Sign out'>⏻</button>
            </div>
          </div>
        </aside>

        <main ref={mainRef} className='adm-main' id='admin-main' tabIndex={-1}>
          <header className='adm-topbar'>
            <button
              ref={burgerRef}
              type='button'
              className='adm-burger'
              onClick={() => setNavOpen((open) => !open)}
              aria-label='Toggle navigation'
              aria-expanded={navOpen}
              aria-controls='admin-sidebar'
            >
              <span /><span /><span />
            </button>
            <div>
              <span className='adm-topbar-eyebrow'>Wellness Physiotherapy Centre</span>
              <h1 ref={headingRef} tabIndex={-1}>{TITLES[tab]}</h1>
            </div>
            <a href='/' className='adm-topbar-live' target='_blank' rel='noreferrer'>View site ↗</a>
          </header>

          <div className='adm-content'>{body}</div>
        </main>

        {navOpen && <div className='adm-scrim' onClick={() => setNavOpen(false)} aria-hidden='true' />}
        {toast && <div className='adm-toast' role='status'>{toast.message}</div>}
      </div>
    </ToastCtx.Provider>
  )
}
