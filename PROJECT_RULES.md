# Physiotherapy Clinic — Project Rules

Working rules for the clinic website. Keep this file in sync with the codebase.

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 18, JSX, Vite 5 |
| Styling | Base stylesheet `public/assets/css/wellness.css` + brand overrides in `public/assets/css/brand.css` |
| Rendering | Pure SSR — Express renders HTML per request, client hydrates |
| Server | Node.js + Express in `backend/` |
| Database | MongoDB (planned, phase 2) |
| Animations | Interaction runtime + jQuery + GSAP (scroll reveal, pinning, sliders, hover) |

## Directory rules

```
index.html            → Vite entry; the only HTML shell at root
src/                  → all React source
src/sections/         → one component per page section
src/lib/              → runtime helpers (script loader, formatters, API client)
public/assets/        → css, img, video, fonts, js (self-hosted, versioned filenames)
backend/src/          → Express app, routes, controllers, models, middleware
dist/                 → build output only, never edited by hand
```

- Frontend stays at the root; the server is a single `backend/` folder inside it.
- Nothing in `src/` imports from `backend/`; the two sides talk over HTTP only (decoupled).
- `dist/` is generated — never commit edits there.
- New assets go through `public/assets/<kind>/`, not the CDN.

## SSR rules

1. Every route is server-rendered: `backend/src/app.js` renders `src/entry-server.jsx` and injects
   the HTML into `<!--app-html-->`.
2. `src/main.jsx` hydrates the same markup — components must be deterministic so the server HTML and
   the client tree match.
3. Browser-only libraries load **after** hydration via `src/lib/loadSiteScripts.js`, in the order
   jQuery → GSAP → plugins → interaction runtime. Never put them in `index.html`.
4. Data for a page is resolved on the server and passed down as props; no data fetching inside
   `useEffect` for first paint.
5. Client-side navigation is not enabled yet — links are plain anchors and every path renders the
   home page until the router and the remaining pages exist.

## Design fidelity rules (home page)

- The home page must keep the approved design: markup, class names, spacing, fonts, videos,
  scroll/hover animations and responsive breakpoints.
- Keep `public/assets/css/wellness.css` unmodified. Brand and layout overrides belong in
  `public/assets/css/brand.css`.
- The visibility gate in `index.html` (elements hidden until `w-mod-ix3`) is required — do not remove
  it, the interactions add the class on init.
- `<html data-wf-page="...">` and `data-wf-site="..."` are required for the interaction runtime.
  Do not change or drop them.
- Verify layout with the section-height check (1440 px and 390 px widths) after any markup edit.

## Content and admin panel (phase 2)

- The admin panel writes to MongoDB through `/api/*` endpoints; the site never reads the database
  from the browser.
- Server render fetches page data through the backend (direct service call in SSR, not an HTTP
  round-trip), then hands it to sections as props.
- Every editable block gets a content key: hero, about, services, choose, works, approach, pricing,
  testimonials, journey, blog, cta, footer, nav.
- Sections accept data props with a default content shape (`src/content/`), so the demo still
  renders with no database.
- Admin endpoints are authenticated and rate-limited; public endpoints are read-only.

## API conventions

- Base path `/api`; JSON responses `{ success, data, error }`.
- Validation on every write (Zod/Joi); reject unknown fields.
- Central error middleware; never leak stack traces in production.
- CORS limited to the site origin; security headers via `helmet`.
- Status codes: 200 read, 201 create, 400 validation, 401 auth, 404 missing, 429 rate limit.

## Code conventions

- Functional components, hooks, no class components.
- `PascalCase.jsx` for components, `camelCase.js` for helpers.
- One section per file, under ~250 lines; extract children when longer.
- No inline business logic in JSX — derive values above the `return`.
- Environment config via `process.env` on the server and `import.meta.env` (`VITE_*`) in the client.
- Never commit secrets; `.env` stays git-ignored.

## Verification before handing work over

- `npm run build` succeeds and `npm start` serves the page with SSR markup in the HTML source.
- Section heights match the reference at 1440 px and 390 px.
- Interactions run: hero reveal, counters, marquees, scroll pinning, sliders, mobile menu.
- No failed asset requests and no hydration warnings in the console.
