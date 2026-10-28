import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'

hydrateRoot(document.getElementById('root'), <App path={window.location.pathname} />)

// Visual feedback toolbar for development only. Loaded lazily so the package
// never reaches the production bundle or the server render.
if (import.meta.env.DEV) {
  const mount = document.createElement('div')
  mount.id = 'agentation-root'
  document.body.appendChild(mount)

  import('agentation').then(({ Agentation }) => {
    createRoot(mount).render(<Agentation />)
  })
}
