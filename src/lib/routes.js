const pages = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/blog': 'blog',
  '/gallery': 'gallery',
  '/contact': 'contact'
}

/**
 * Maps a request URL to a page key plus optional service slug. The same
 * function runs on the server and in the browser, so the hydrated tree always
 * matches the server-rendered one.
 */
export function resolveRoute(url = '/') {
  const path = String(url).split('?')[0].split('#')[0].replace(/\/+$/, '') || '/'

  if (pages[path]) return { page: pages[path], slug: null }

  const serviceMatch = path.match(/^\/services\/([a-z0-9-]+)$/)
  if (serviceMatch) return { page: 'serviceDetail', slug: serviceMatch[1] }

  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/)
  if (blogMatch) return { page: 'blogDetail', slug: blogMatch[1] }

  return { page: 'notFound', slug: null }
}
