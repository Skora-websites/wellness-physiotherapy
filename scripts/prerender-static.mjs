import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const clientDir = path.resolve('dist/client')
const template = await fs.readFile(path.join(clientDir, 'index.html'), 'utf8')
const { renderPage, staticRoutes } = await import(pathToFileURL(path.resolve('dist/server/entry-server.js')).href)

for (const route of staticRoutes) {
  const { html, status } = renderPage(route)
  if (status !== 200) continue

  const page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  const target = route === '/' ? path.join(clientDir, 'index.html') : path.join(clientDir, route.slice(1), 'index.html')
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, page)
}

// Ship the admin-fallback page so /admin and /admin/* serve a friendly
// offline notice instead of the normal site shell (Vercel rewrites catch
// these paths before the client app can run).
await fs.mkdir(path.join(clientDir, 'backoffice'), { recursive: true })
await fs.copyFile(path.join('public', 'backoffice', 'index.html'), path.join(clientDir, 'backoffice', 'index.html'))

// Remove the duplicated public folder that is not referenced by the frontend.
await fs.rm(path.join(clientDir, 'testimonial_videos'), { recursive: true, force: true })

// Give the backoffice notice explicit cache-control headers in the static
// output so stale admin shells do not get served from a CDN edge.
await fs.writeFile(
  path.join(clientDir, 'backoffice', 'index.html'),
  (await fs.readFile(path.join(clientDir, 'backoffice', 'index.html'), 'utf8')).replace(
    '</head>',
    '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/><meta http-equiv="Pragma" content="no-cache"/><meta http-equiv="Expires" content="0"/></head>'
  ),
  'utf8'
)
