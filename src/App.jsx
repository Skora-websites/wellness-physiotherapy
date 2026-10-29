import { useState, useEffect } from 'react'
import Navbar from './sections/Navbar'
import Footer from './sections/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import GalleryPage from './pages/GalleryPage'
import StandalonePage from './pages/StandalonePage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import { resolveRoute } from './lib/routes'
import { useContent, usePageSeo } from './lib/content'
import AdminApp from './admin/AdminApp'
import { loadSiteScripts } from './lib/loadSiteScripts'
import { initSectionTypographyAnimations } from './lib/typographyFlip'
import AppointmentModal from './components/AppointmentModal'

const pages = {
  home: HomePage,
  about: AboutPage,
  services: ServicesPage,
  serviceDetail: ServiceDetailPage,
  blog: BlogPage,
  blogDetail: BlogDetailPage,
  contact: ContactPage,
  gallery: GalleryPage,
  blogAlias: BlogDetailPage,
  standalone: StandalonePage,
  notFound: NotFoundPage
}

export default function App({ path = '/' }) {
  // Client-side persistent navigation state so Navbar stays mounted and animates smoothly
  const [currentPath, setCurrentPath] = useState(() => {
    return typeof window !== 'undefined' ? window.location.pathname : path
  })

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)

    // Intercept internal navigation to avoid hard page reloads
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      // Don't intercept external, anchor hashes, tel, mailto, or special keys
      if (
        anchor.target === '_blank' ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('#') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return
      }

      // Check if it is an internal route starting with '/'
      if (href.startsWith('/')) {
        e.preventDefault()
        if (window.location.pathname !== href) {
          window.history.pushState({}, '', href)
          setCurrentPath(href)
          window.scrollTo({ top: 0, behavior: 'instant' })
        }
      }
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [])

  const isAdmin = currentPath.startsWith('/admin')

  useEffect(() => {
    if (isAdmin) return undefined
    // Webflow interactions must run against the mounted DOM on route changes
    loadSiteScripts().catch((error) => console.error(error))
    // Trigger 3D letter flip typography animation on all section headers as they enter view
    const timer = setTimeout(() => {
      initSectionTypographyAnimations()
    }, 60)
    return () => clearTimeout(timer)
  }, [currentPath, isAdmin])

  const { page, slug } = resolveRoute(currentPath)
  const { pageSeo } = useContent()
  const seo = pageSeo.find((entry) => entry.path === (currentPath.split('?')[0] || '/'))
  const isDetail = page === 'serviceDetail' || page === 'blogDetail' || page === 'standalone' || page === 'blogAlias'

  usePageSeo(
    isAdmin || isDetail || !seo
      ? {}
      : {
          path: currentPath,
          title: seo.metaTitle || undefined,
          description: seo.metaDescription || undefined,
          keywords: seo.metaKeywords || undefined,
          canonical: seo.canonicalUrl || undefined,
        }
  )

  if (isAdmin) return <AdminApp />

  const Page = pages[page] || NotFoundPage

  return (
    <div className="page-wrapper">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Navbar remains mounted continuously across all pages */}
      <Navbar path={currentPath} />
      <div id="main-content" tabIndex={-1}>
        <Page slug={slug} />
      </div>
      <Footer />
      <AppointmentModal />
    </div>
  )
}
