import { useCallback, useEffect, useMemo, useState } from 'react'

export const TABS = ['dashboard', 'consultations', 'contacts', 'services', 'blogs', 'site-details', 'seo', 'account']

const NAV = [
  {
    group: 'Main',
    items: [{ id: 'dashboard', label: 'Dashboard Overview', icon: '▦' }],
  },
  {
    group: 'Patient Inquiries',
    items: [
      { id: 'consultations', label: 'Consultation Requests', icon: '✚', badge: 'consultations' },
      { id: 'contacts', label: 'Contact Messages', icon: '✉', badge: 'contacts' },
    ],
  },
  {
    group: 'Website Content',
    items: [
      { id: 'services', label: 'Services Management', icon: '❖' },
      { id: 'blogs', label: 'Blogs & Pages', icon: '❐' },
    ],
  },
  {
    group: 'Settings & Config',
    items: [
      { id: 'site-details', label: 'Site Details', icon: '⌂' },
      { id: 'seo', label: 'Page SEO', icon: '◎' },
      { id: 'account', label: 'Account Settings', icon: '⚙' },
    ],
  },
]

export function tabFromPath(pathname = '/admin') {
  const match = String(pathname).match(/^\/admin\/?([a-z-]*)/)
  const tab = match?.[1] || ''
  return TABS.includes(tab) ? tab : 'dashboard'
}

export function useTabRoute() {
  const [tab, setTab] = useState(() =>
    typeof window === 'undefined' ? 'dashboard' : tabFromPath(window.location.pathname)
  )

  useEffect(() => {
    const onPop = () => setTab(tabFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const go = useCallback((next) => {
    if (!TABS.includes(next)) return
    if (window.location.pathname !== `/admin/${next}`) {
      window.history.pushState({}, '', `/admin/${next}`)
    }
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return [tab, go]
}

export { NAV }
