import { renderToString } from 'react-dom/server'
import App from './App'
import { resolveRoute } from './lib/routes'
import { findService, services } from './data/services'
import { findPost, posts } from './data/posts'

export const staticRoutes = [
  '/', '/about', '/services', '/blog', '/gallery', '/contact',
  ...services.map(({ slug }) => `/services/${slug}`),
  ...posts.map(({ slug }) => `/blog/${slug}`),
]

export function renderPage(url = '/') {
  const { page, slug } = resolveRoute(url)
  const unknownService = page === 'serviceDetail' && !findService(slug)
  const unknownPost = page === 'blogDetail' && !findPost(slug)

  return {
    html: renderToString(<App path={url} />),
    status: page === 'notFound' || unknownService || unknownPost ? 404 : 200
  }
}
