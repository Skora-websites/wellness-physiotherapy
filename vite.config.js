import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serves the admin REST API from the dev server so `npm run dev` needs one
// process. Production mounts the same router in backend/src/app.js.
// Only used by `npm run dev` when the local backend/ directory is present.
// Vercel builds the frontend without backend/, so this plugin must not exist on
// a fresh clone; returning a plugin that imports ./backend/src/* still makes
// esbuild resolve those paths at config time and fails the build.
const adminApi = (() => {
  try {
    require.resolve('./backend/src/api.js')
    return {
      name: 'admin-api',
      apply: 'serve',
      async configureServer(server) {
        const [{ default: express }, { default: api }, { initDb }] = await Promise.all([
          import('express'),
          import('./backend/src/api.js'),
          import('./backend/src/db.js'),
        ])
        try {
          await initDb()
        } catch (error) {
          // The public site falls back to bundled content; only /admin is affected.
          console.error('\n[admin-api] MySQL is unavailable:', error.message, '\n')
        }
        // A bare Router lacks Express's res helpers; the app wrapper supplies them.
        const app = express()
        app.use(api)
        server.middlewares.use(app)
      },
    }
  } catch {
    return {}
  }
})()

export default defineConfig({
  plugins: [react(), adminApi],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsDir: 'static',
  },
  ssr: {
    noExternal: [],
  },
})
