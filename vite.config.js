import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Serves the admin REST API from the dev server so `npm run dev` needs one
// process. Production mounts the same router in backend/src/app.js.
function adminApi() {
  // Only used by `npm run dev`. Produced by Vercel builds when backend/src is
  // checked out locally; skip the plugin entirely on a fresh clone so the build
  // still succeeds without the uncommitted backend/ directory.
  try {
    require.resolve('./backend/src/api.js')
  } catch {
    return {}
  }

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
}

export default defineConfig({
  plugins: [react(), adminApi()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsDir: 'static',
  },
  ssr: {
    noExternal: [],
  },
})
