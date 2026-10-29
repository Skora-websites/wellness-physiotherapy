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

## Admin panel

Open `/admin` (or `/admin/dashboard`) on the running site.

| | |
|---|---|
| Sign in | `admin@wellnessphysio.in` / username `arun` / password `wellness2026` |
| Change it | Admin → Account Settings (sets `ADMIN_PASSWORD` at seed time only; afterwards change in the panel) |

What it manages: blog articles & standalone pages (rich editor, featured image, SEO per item),
services, consultation requests, contact messages, site details + working hours, and per-route SEO.

Where the data lives:

- API: `backend/src/api.js`. Storage: **MySQL / MariaDB** through `mysql2` (`backend/src/db.js`).
  Copy `.env.example` to `.env` and set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
  On boot the database, all tables and the first-run content (seeded from `src/data/*.js`) are
  created automatically — no manual SQL import needed.
- Uploaded images: `public/assets/img/uploads/`.
- In dev the API is mounted inside the Vite server (`vite.config.js`), so `npm run dev` is enough.
- In production run `npm run build && npm start`: `backend/src/app.js` serves the built site, the
  uploads folder and the same API.

The public pages fetch `/api/content` at runtime and fall back to the bundled seed data in
`src/data/*.js` when the API is unreachable, so a static-only deploy still renders.
