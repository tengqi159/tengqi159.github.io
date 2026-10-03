# Qi Teng Academic Homepage

A static academic homepage for https://tengqi159.github.io/ — research, publications, contact information and a visitor atlas. Built with HTML, CSS and vanilla JavaScript; no client framework or build dependency.

## Page and interaction

The warm paper / teal / gold design supports light and dark themes. A flowing signal illustration introduces the research, four selectable studies explain its directions, and publication cards include citation links and BibTeX copying. All studies are illustrations, not experimental results. Ambient motion can be paused and respects reduced-motion preferences.

The publication archive supports title, author and venue search, year filters, citation sorting and an explicit reset. `/` focuses search; Escape clears it. Clipboard failures open a selectable text dialog.

## Publication data

`assets/site-data.js` holds the curated archive, contacts, news and saved Google Scholar metrics. The browser may enrich publication details from OpenAlex, but it never removes saved papers or replaces Scholar citation counts with OpenAlex counts. The visible date is the saved citation snapshot date, not the time the page opened.

The scheduled workflow attempts a daily Scholar refresh and optional OpenAlex metadata enrichment. If Scholar is unavailable, the previous snapshot remains. If OpenAlex is unavailable, it does not prevent a successful Scholar refresh. A zero Scholar citation count remains zero. User-confirmed entries marked `verified: true` survive sync.

Owner-provided Scholar snapshots are recorded in `profile.citationSnapshot` with their date and capture source. Per-paper `citationsUpdatedAt` distinguishes historical counts from the current profile snapshot; an absent or blank count is unavailable, rather than a confirmed zero. A successful automatic refresh updates both the provenance and dates.

Verified arXiv/journal pairs appear once under the journal record. Its `preprints` array retains the arXiv title, link, DOI, historical citation snapshot and `scholarTitleAliases` for earlier titles. The card offers both DOI and arXiv links; archive search also matches preprint titles and IDs. The displayed count belongs to the journal record, and version counts are never added. Refresh routes known preprint rows into that nested metadata without creating another archive entry or replacing journal citations. Unrelated preprints remain independent.

Run manually with `node scripts/refresh-data.mjs`. Update news in `siteData.news`; the sync preserves it. An optional CV link is shown when `profile.cv` contains a local PDF path.

`siteData.excludedPublications` records owner-requested exclusions by full title and DOI. These cover namesake authorship errors and the CSFO correction notice, which the owner chose to omit. They override Scholar indexing, old verified records and browser metadata enrichment. The original CSFO article remains listed. Remove corresponding news and visual stories when excluding a record.

## Accepted papers and visual introductions

News leads with accepted, forthcoming papers. Accepted entries offer original figures and concise method walkthroughs; paper, conference-page, Scholar-search and story-source links are withheld. `status: "accepted"` is a curated status, preserved by Scholar sync and browser metadata enrichment. To mark a paper published, first verify the proceedings record, then update its status, venue, bibliographic details and public link, including the story publicationStatus. Citation snapshot dates remain separate from content update dates.

Every current archive record maps through `storyId` to `assets/paper-stories.js`. News, selected papers and archive rows show original framework figures extracted from the corresponding paper PDFs, preserving their labels and connections. The figure caption identifies its original figure number and author version where applicable. Clicking a figure opens a zoomable view; the image is never cropped to fit a card. Downloads contain only the figure image. Accepted manuscripts have no source or full-text link.

Each method walkthrough explains paper-specific mechanisms in two to six modules. `contentReview` must record a full-manuscript review before any explanation is shown; extracting a figure alone never enables it. The review covers the research question, complete method, evaluation and scope. Highlights map the reviewed explanations to exact regions of the original image, with multiple regions for parallel branches. Three papers additionally use original detail figures through `walkthroughFigure`, while their archive thumbnails keep the framework overview. Module buttons, zoom, pause and keyboard dismissal remain available. Playback starts only on request and respects reduced-motion preferences. Training and inference are distinguished where applicable. Preprint/article versions share a single archive record and story. Tall archive sections reveal as soon as they enter the viewport.

For future entries, verify a source figure before adding `figure` metadata and the WebP asset to `assets/paper-figures/`. Record dimensions, the original figure number, an accurate alt description and the public source for published work. Add normalized highlight regions only after checking the original figure against a full-paper reading. Keep page/section evidence in the private work audit, and set `contentReview` only after the public descriptions are checked. Add a genuine source detail figure when the overview omits operations essential to the explanation. Refreshing metadata never invents a visual explanation. Keep private source PDFs outside the deployable website.

## Visitor atlas

The configured Cloudflare Worker and D1 database aggregate approximate city/region locations. No browser GPS request is made. A random browser token deduplicates visits for 30 minutes per place. Maps use rounded coordinates; VPNs and carrier routing affect the estimate. The app does not write raw IP addresses to D1. Counts estimate browser visits rather than exact people.

The map supports location details, same-place aggregation, retry, explicit timeout/failure states and a labeled local cache of previously retrieved points. See `workers/README.md` for the API, schema and deployment notes.

The base map is derived from [Natural Earth 1:50m land](https://www.naturalearthdata.com/downloads/50m-physical-vectors/), a public-domain geographic dataset, projected consistently with the location markers.

## Local preview and verification

```sh
python3 -m http.server 8765 --bind 127.0.0.1
node --test scripts/*.test.mjs
```

The Worker tests use Node 24's built-in SQLite and do not contact production. For a clearly labeled, sample-data atlas demo, run `node scripts/preview-atlas.mjs` and open port 8766. Demo data is never injected into the normal site.

## Deployment

GitHub Actions deploys `index.html` and `assets/` on pushes to `main`. Worker code, tests and development artifacts are excluded from the Pages artifact. Deploy the Worker separately from `workers/`; a schema migration must precede frontend changes that depend on it. Preserve the newest published data snapshot when copying UI changes into the release checkout.
