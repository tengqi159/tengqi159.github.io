# Qi Teng Academic Homepage

A static academic homepage for GitHub Pages, designed around an editorial
"Signal in the Noise" concept: Fraunces display type, hairline structure,
a warm paper palette with a dark counterpart, and a living multi-channel
sensor-signal canvas drawn behind the page — a nod to the research itself.

## Files

- `index.html` — page structure (Hero, Profile, News, Research, Publications, Visitor Atlas, Links).
- `assets/styles.css` — the full design system (light/dark themes, responsive, reduced-motion aware).
- `assets/site-data.js` — profile, metrics, the news timeline, and the curated
  offline publication list (fallback).
- `assets/site.js` — rendering, theme toggle, scroll progress, metric count-up,
  news timeline, BibTeX cite buttons, publication search/filter/sort,
  live OpenAlex sync, visitor map with signal arc, signal field.
- `assets/profile.jpg` — portrait.
- `assets/world-map-equirectangular.svg` — base map for the visitor atlas.
- `scripts/refresh-data.mjs` — scheduled sync that keeps the fallback dataset fresh.
- `.github/workflows/refresh-data.yml` — daily auto-refresh workflow.

## News timeline

The News section is fully data-driven. To post an update, add **one entry** at
the top of the `news` array in `assets/site-data.js` — no HTML or CSS needed:

```js
{
  "date": "2026-08",        // "2026", "2026-08", or "2026-08-15"
  "type": "paper",          // paper | award | grant | talk | code | service | misc
  "text": "Sentence without a trailing period. Venue appended automatically:",
  "venue": "Nature Machine Intelligence",   // optional, rendered in italics
  "link": "https://doi.org/…",              // optional
  "linkLabel": "DOI"                        // optional, defaults to "Details"
}
```

- Entries render newest first automatically; each type gets its own icon.
- Items dated within the last ~4 months get a pulsing **Fresh** badge — no
  manual cleanup, it expires by itself.
- If the array is emptied, the section and its nav link hide themselves.
- The daily refresh script preserves the `news` array; it only rewrites
  publications and metrics.

## Live publications

[Google Scholar](https://scholar.google.com/citations?user=D5kHbeAAAAAJ) is the
authoritative source: the archive only ever shows Scholar-indexed works plus
explicitly verified entries, and every paper's "Cited by" count comes from
the Scholar profile so the numbers match what Scholar shows (including the
headline Citations / h-index / i10-index metrics). [OpenAlex](https://openalex.org)
supplements DOIs, venues, and live metadata for the same Scholar-verified
list. Because Scholar has no public API, the profile page is parsed by the
daily sync below; if Scholar is unreachable the last snapshot stays on screen
unchanged.

## Automatic data refresh

Nothing needs to be maintained by hand. A scheduled GitHub Action
(`refresh-data.yml`, daily at 01:17 UTC / 09:17 Beijing) reads the Google
Scholar profile (paper list, per-paper citations, and the 998 / 11 / 11
metrics), merges it with verified entries in `assets/site-data.js`, and
commits the change back to `main` when anything moved. The Pages deployment
follows automatically. OpenAlex is queried in the same run to enrich DOIs and
venues. New Scholar-indexed papers appear automatically; mis-associated
OpenAlex records can never appear because the Scholar list is the whitelist.

Run the sync locally with:

```sh
node scripts/refresh-data.mjs
```

## Visitor atlas

- **Current visitor**: on load, the page quietly resolves an approximate
  city-level location via `ipapi.co`, places a dot, and draws a signal arc
  from the visitor back to the home-lab diamond in Zhengzhou, with the
  great-circle distance shown in the floating HUD chip. No permission prompt,
  nothing stored. The button upgrades the dot to a precise browser-approved
  location.
- **All visitors over time**: a purely static site cannot store other
  visitors' locations. To collect and display an aggregate map, embed a free
  third-party widget:
  1. Register the site at [ClustrMaps](https://clustrmaps.com/) (or PulseMaps
     / Flag Counter) and copy the provided snippet.
  2. Paste the snippet into `index.html` inside `.visitor-copy`, right after
     the `.privacy-note` paragraph.
  3. The widget renders its own map/thumbnail and starts counting from that
     moment.

## Features

- Light/dark theme with system preference detection and a manual toggle.
- Data-driven news timeline with per-type icons and self-expiring Fresh badges.
- One-click BibTeX citation copy on every publication.
- Publication archive with year filters, citation/recency sorting, and
  instant search (press `/` to focus, `Esc` to clear).
- Structured data (JSON-LD Person) and Open Graph tags for richer sharing.
- Optional CV button: set `profile.cv` in `site-data.js` (e.g.
  `"assets/cv.pdf"`) and a CV button appears in the hero.
- Respects `prefers-reduced-motion`; print-friendly.

## Preview locally

```sh
cd qi-teng-academic-homepage
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Publish these files to a GitHub repository and enable GitHub Pages from the
main branch root.
