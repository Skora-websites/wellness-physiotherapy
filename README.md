# Wellness Physiotherapy — Website

Marketing site for Wellness Physiotherapy, built as a static React export and deployed on Vercel.

- **Frontend**: React 18 + Vite (JSX)
- **Rendering**: static prerender — every known route is rendered to HTML at build time, then hydrated on the client
- **Assets**: fully self-hosted in `public/assets` (CSS, images, video, fonts, animation runtime)

## Commands

```bash
npm install
npm run dev       # development server with HMR on http://localhost:5173
npm run build     # builds dist/client (static site) via a prerender pass
npm run preview   # serves the built static site locally
```

## Deployment (Vercel)

`vercel.json` runs `npm run build` and serves `dist/client`, which contains one prerendered
`index.html` per route. No server runtime is required.

## Structure

```
index.html                    Vite entry + hydration mount point (#root)
src/
  App.jsx                     composes the page sections
  main.jsx                    client entry (hydrates the prerendered markup)
  entry-server.jsx            static route list + render entry used at build time
  sections/                   one component per page section
  lib/loadSiteScripts.js      loads jQuery + GSAP + the interaction runtime after hydration
scripts/prerender-static.mjs  writes one HTML file per route into dist/client
public/assets/                self-hosted css, images, video, fonts and js
dist/                         build output (generated, not committed)
```

## Notes

- The scroll, hover and slider animations are driven by the interaction runtime, loaded after React
  hydrates so it binds to the mounted DOM. Keep section markup and class names unchanged when editing.
- Branding (name, nav lockup, footer wordmark) lives in `public/assets/css/brand.css` plus the
  matching markup in `src/sections/Navbar.jsx` and `src/sections/Footer.jsx`.
- `backend/` is local-only scaffolding and is excluded from this repository and its deployments.
