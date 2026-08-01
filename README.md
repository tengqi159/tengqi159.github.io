# Qi Teng Academic Homepage

A static academic homepage for GitHub Pages, designed around an editorial
"Signal in the Noise" concept: Fraunces display type, hairline structure,
a warm paper palette with a dark counterpart, and a living multi-channel
sensor-signal canvas drawn behind the page — a nod to the research itself.

## Files

- `index.html` — page structure (Hero, Profile, Research, Publications, Visitor Atlas, Links).
- `assets/styles.css` — the full design system (light/dark themes, responsive, reduced-motion aware).
- `assets/site-data.js` — profile, metrics, and the curated offline publication list (fallback).
- `assets/site.js` — rendering, theme toggle, scroll progress, metric count-up,
  publication search/filter/sort, live OpenAlex sync, visitor map, signal field.
- `assets/profile.jpg` — portrait.
- `assets/world-map-equirectangular.svg` — base map for the visitor atlas.
- `scripts/refresh-data.mjs` — scheduled sync that keeps the fallback dataset fresh.
- `.github/workflows/refresh-data.yml` — daily auto-refresh workflow.

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
  city-level location via `ipapi.co` and places a dot — no permission prompt,
  nothing stored. The button upgrades the dot to a precise browser-approved
  location.
- **All visitors over time**: a purely static site cannot store other
  visitors' locations. To collect and display an aggregate map, embed a free
  third-party widget:
  1. Register the site at [ClustrMaps](https://clustrmaps.com/) (or PulseMaps
     / Flag Counter) and copy the provided snippet.
  2. Paste the snippet into `index.html` inside `.visitor-copy`, right after
     the `#visitor-details` div.
  3. The widget renders its own map/thumbnail and starts counting from that
     moment.

## Features

- Light/dark theme with system preference detection and a manual toggle.
- Publication archive with year filters, citation/recency sorting, and
  instant search (press `/` to focus, `Esc` to clear).
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
