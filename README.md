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

## Live publications

On every page load the site queries [OpenAlex](https://openalex.org) by ORCID
(`0000-0003-3573-4146`) and re-renders the publication archive and citation
metrics from the response. New papers appear automatically once OpenAlex
indexes them — no rebuild, no redeploy. The `selected` flags in
`assets/site-data.js` (matched by DOI) decide which papers stay featured; if
fewer than five match, the most-cited works fill the grid. If the API is
unreachable (offline, blocked), the curated local list in `site-data.js`
remains on screen unchanged.

A `Live · OpenAlex` badge next to "Full archive" indicates the live feed is
active.

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
