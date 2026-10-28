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

// The site serves its videos from /assets/video; this duplicated public folder
// is not referenced by the frontend and needlessly doubles the static upload.
await fs.rm(path.join(clientDir, 'testimonial_videos'), { recursive: true, force: true })
