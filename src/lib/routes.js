const pages = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/blog': 'blog',
  '/gallery': 'gallery',
  '/contact': 'contact'
}

/**
 * Maps a request URL to a page key plus optional slug. The same
 * function runs on the server and in the browser, so the hydrated tree always
 * matches the server-rendered one.
 */
export function resolveRoute(url = '/') {
  const path = String(url).split('?')[0].split('#')[0].replace(/\/+$/, '') || '/'

  if (path === '/admin' || path.startsWith('/admin/')) return { page: 'admin', slug: null }
  if (pages[path]) return { page: pages[path], slug: null }

  const serviceMatch = path.match(/^\/services\/([a-z0-9-]+)$/)
  if (serviceMatch) return { page: 'serviceDetail', slug: serviceMatch[1] }

  const blogMatch = path.match(/^\/blogs?\/([a-z0-9-]+)$/)
  if (blogMatch) return { page: 'blogDetail', slug: blogMatch[1] }

  // Anything else may be a standalone page published from the admin panel.
  const rootMatch = path.match(/^\/([a-z0-9-]+)$/)
  if (rootMatch) return { page: 'standalone', slug: rootMatch[1] }

  return { page: 'notFound', slug: null }
}
