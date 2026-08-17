# vozpópuli clone — Frontend

Next.js (Pages Router) + JavaScript + Tailwind CSS v4 clone of the vozpópuli
header and footer, built from the provided reference screenshots.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm run start
```

## What's included so far

- **Header** (`components/Header.jsx`)
  - Top "Latest" bar — a dummy single-headline strip standing in for the
    site's "Outstanding" ticker, using the same fonts/weights so it can be
    wired to a live feed later without restyling. See `components/LatestNewsBar.jsx`.
  - Desktop: hamburger button, centered logo, Subscribe button, and the
    full category nav row underneath.
  - Mobile: hamburger, centered logo, account icon, and a horizontally
    scrollable nav strip underneath (`components/MobileNavStrip.jsx`).
  - Hamburger opens a slide-out drawer (`components/MobileNavDrawer.jsx`)
    with nav links, a Subscribe button, and social icons.
- **Footer** (`components/Footer.jsx`) — logo, "We highlight" tag row,
  legal link row, copyright line, and social icons, responsive across
  breakpoints.
- **Logo** (`components/Logo.jsx`) — text-based mimic of the wordmark
  (green tagline + triangle flag + serif "vozpópuli"). To swap in a real
  logo image: drop your file in `public/images/`, then uncomment the
  `<img>` block in `Logo.jsx` and remove the text wordmark block below it.
- **Fonts** — self-hosted via `@fontsource/inter` (sans, nav/UI) and
  `@fontsource/bitter` (serif, logo/headlines/italic tags). Bundled as
  local static assets, no runtime calls to Google Fonts.
- **Data** — `data/siteConfig.json` holds nav labels, tagline, footer
  tags/links, and social links, so header/footer content isn't hardcoded
  in components.

## Project conventions

- All components/pages are `.jsx` (JavaScript, not TypeScript).
- Pages Router (`pages/`), not the App Router.
- Tailwind CSS v4, configured via `@theme inline` in `styles/globals.css`
  (brand colors: `brand-green`, `ink`, `ink-soft`, `link`, `hairline`).
- Shared `Layout.jsx` wraps every page with `Header` + `Footer` — use it
  for all upcoming pages (home, author, category, detail) so the header
  and footer stay consistent site-wide.

## Next steps (planned)

- Homepage component setup, pulling from a single JSON data file
  (title, description, date, category, author) for both listing and
  detail views.
- Static author, category, and detail pages, reusing the same
  `Layout`/`Header`/`Footer`.
