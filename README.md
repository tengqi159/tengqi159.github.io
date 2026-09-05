# Qi Teng Academic Homepage

A static academic homepage for https://tengqi159.github.io/ — research, publications, contact information and a visitor atlas. Built with HTML, CSS and vanilla JavaScript; no client framework or build dependency.

## Page and interaction

The warm paper / teal / gold design supports light and dark themes. A flowing signal illustration introduces the research, four selectable studies explain its directions, and publication cards include citation links and BibTeX copying. All studies are illustrations, not experimental results. Ambient motion can be paused and respects reduced-motion preferences.

The publication archive supports title, author and venue search, year filters, citation sorting and an explicit reset. `/` focuses search; Escape clears it. Clipboard failures open a selectable text dialog.

## Publication data

`assets/site-data.js` holds the curated archive, contacts, news and saved Google Scholar metrics. The browser may enrich publication details from OpenAlex, but it never removes saved papers or replaces Scholar citation counts with OpenAlex counts. The visible date is the saved citation snapshot date, not the time the page opened.

The scheduled workflow attempts a daily Scholar refresh and optional OpenAlex metadata enrichment. If Scholar is unavailable, the previous snapshot remains. If OpenAlex is unavailable, it does not prevent a successful Scholar refresh. A zero Scholar citation count remains zero. User-confirmed entries marked `verified: true` survive sync.

Run manually with `node scripts/refresh-data.mjs`. Update news in `siteData.news`; the sync preserves it. An optional CV link is shown when `profile.cv` contains a local PDF path.

## Visitor atlas

The configured Cloudflare Worker and D1 database aggregate approximate city/region locations. No browser GPS request is made. A random browser token deduplicates visits for 30 minutes per place. Maps use rounded coordinates; VPNs and carrier routing affect the estimate. The app does not write raw IP addresses to D1. Counts estimate browser visits rather than exact people.

The map supports location details, same-place aggregation, retry, explicit timeout/failure states and a labeled local cache of previously retrieved points. See `workers/README.md` for the API, schema and deployment notes.

The base map is derived from [Natural Earth 1:50m land](https://www.naturalearthdata.com/downloads/50m-physical-vectors/), a public-domain geographic dataset, projected consistently with the location markers.

## Local preview and verification

```sh
python3 -m http.server 8765 --bind 127.0.0.1
node --test scripts/site-content.test.mjs workers/atlas-worker.test.mjs
```

The Worker tests use Node 24's built-in SQLite and do not contact production. For a clearly labeled, sample-data atlas demo, run `node scripts/preview-atlas.mjs` and open port 8766. Demo data is never injected into the normal site.

## Deployment

GitHub Actions deploys `index.html` and `assets/` on pushes to `main`. Worker code, tests and development artifacts are excluded from the Pages artifact. Deploy the Worker separately from `workers/`; a schema migration must precede frontend changes that depend on it. Preserve the newest published data snapshot when copying UI changes into the release checkout.
