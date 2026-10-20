# Qi Teng Academic Homepage

A static academic homepage for https://tengqi159.github.io/ — research, publications, contact information and a visitor atlas. Built with HTML, CSS and vanilla JavaScript; no client framework or build dependency.

## Page and interaction

The warm paper / teal / gold design supports light and dark themes. A flowing signal illustration introduces the research, four selectable studies explain its directions, and publication cards include citation links and BibTeX copying. All studies are illustrations, not experimental results. Ambient motion can be paused and respects reduced-motion preferences.

News, selected publications and the archive use compact rows: a complete original-figure thumbnail on the left, with metadata, title, authors, venue, reviewed method summary and actions grouped on the right. Narrow screens stack the two parts. The thumbnail opens the original figure viewer for reading labels, while the list remains easy to scan. The first selected paper follows the same scale as the rest. The publication archive supports title, author and venue search, year filters, citation sorting and an explicit reset. `/` focuses search; Escape clears it. Clipboard failures open a selectable text dialog.

Collaboration follows Publications, before the visitor atlas, with shortcuts in the hero, primary navigation and the end of Research. A single compact workbench welcomes students, researchers and curious visitors without implying admission, funding or supervision availability. Native interest checkboxes allow any mix (including no selection), and background radios tailor a short email outline. A native disclosure opens the full draft for preview and editing. Subject and body edits are preserved when changing interests or background; an explicit reset can be undone. Open email and Copy draft always use the visible current draft. Clipboard feedback and the manual-copy fallback reuse the shared site behavior. Drafts stay in page memory only: there is no submission backend, automatic sending or persisted visitor text. Without JavaScript, the invitation and direct email links remain usable. On small phones, all seven primary navigation destinations remain available through native horizontal scrolling.

## Publication data

`assets/site-data.js` holds the curated archive, contacts, news and saved Google Scholar metrics. The browser may enrich publication details from OpenAlex, but it never removes saved papers or replaces Scholar citation counts with OpenAlex counts. The visible date is the saved citation snapshot date, not the time the page opened.

The scheduled workflow attempts a daily Scholar refresh and optional OpenAlex metadata enrichment. If Scholar is unavailable, the previous snapshot remains. If OpenAlex is unavailable, it does not prevent a successful Scholar refresh. A zero Scholar citation count remains zero. User-confirmed entries marked `verified: true` survive sync.

Owner-provided Scholar snapshots are recorded in `profile.citationSnapshot` with their date and capture source. Per-paper `citationsUpdatedAt` distinguishes historical counts from the current profile snapshot; an absent or blank count is unavailable, rather than a confirmed zero. A successful automatic refresh updates both the provenance and dates.

Published records use primary-source `bibliography` fields for journal, volume, issue, pages or article number, DOI and formal issue year. BibTeX exports those separate fields, preserving leading zeros in article numbers. When first online publication precedes the issue year, `onlineYear` is shown separately; `scholarYear` retains the snapshot's indexing year. `metadataVerified` and `metadataSource` protect checked bibliography from truncated or conflicting refresh data. Scholar HTML entities are decoded before matching titles.

Verified arXiv/journal pairs appear once under the journal record. Its `preprints` array retains the arXiv title, link, DOI, historical citation snapshot and `scholarTitleAliases` for earlier titles. The card offers both DOI and arXiv links; archive search also matches preprint titles and IDs. The displayed count belongs to the journal record, and version counts are never added. Refresh routes known preprint rows into that nested metadata without creating another archive entry or replacing journal citations. Unrelated preprints remain independent.

Run manually with `node scripts/refresh-data.mjs`. Update news in `siteData.news`; the sync preserves it. An optional CV link is shown when `profile.cv` contains a local PDF path.

Published work may expose a `code` repository only after the repository and original paper are matched, with `codeVerified` and `codeSource` recording the check. A related repository is not assumed to implement a different paper. Accepted papers still withhold all outbound paper links.

`siteData.excludedPublications` records owner-requested exclusions by full title and DOI. These cover namesake authorship errors and the CSFO correction notice, which the owner chose to omit. They override Scholar indexing, old verified records and browser metadata enrichment. The original CSFO article remains listed. Remove corresponding news and visual stories when excluding a record.

## Accepted papers and visual introductions

News leads with accepted, forthcoming papers. Accepted entries offer original figures and concise method walkthroughs; paper, conference-page, Scholar-search and story-source links are withheld. `status: "accepted"` is a curated status, preserved by Scholar sync and browser metadata enrichment. To mark a paper published, first verify the proceedings record, then update its status, venue, bibliographic details and public link, including the story publicationStatus. Citation snapshot dates remain separate from content update dates.

Every current archive record maps through `storyId` to `assets/paper-stories.js`. News, selected papers and archive rows show original framework figures extracted from the corresponding paper PDFs, preserving their labels and connections. Thumbnail rows omit figure captions for a consistent edge; the enlarged viewer retains the original figure number and author version where applicable. Clicking a figure opens a zoomable view; the image is never cropped to fit a card. Downloads contain only the figure image. Accepted manuscripts have no source or full-text link.

Each method walkthrough explains paper-specific mechanisms in two to six modules. `contentReview` must record a full-manuscript review before any explanation is shown; extracting a figure alone never enables it. The review covers the research question, complete method, evaluation and scope. Highlights map the reviewed explanations to exact regions of the original image, with multiple regions for parallel branches. Three papers additionally use original detail figures through `walkthroughFigure`, while their archive thumbnails keep the framework overview. Module buttons, zoom, pause and keyboard dismissal remain available. Playback starts only on request and respects reduced-motion preferences. Training and inference are distinguished where applicable. Preprint/article versions share a single archive record and story. Tall archive sections reveal as soon as they enter the viewport.

For future entries, verify a source figure before adding `figure` metadata and the WebP asset to `assets/paper-figures/`. Record dimensions, the original figure number, an accurate alt description and the public source for published work. Add normalized highlight regions only after checking the original figure against a full-paper reading. Keep page/section evidence in the private work audit, and set `contentReview` only after the public descriptions are checked. Add a genuine source detail figure when the overview omits operations essential to the explanation. Refreshing metadata never invents a visual explanation. Keep private source PDFs outside the deployable website.

## Visitor atlas

The configured Cloudflare Worker and D1 database aggregate approximate city/region locations. No browser GPS request is made. A random browser token deduplicates visits for 30 minutes per place. Maps use rounded coordinates; VPNs and carrier routing affect the estimate. The app does not write raw IP addresses to D1. Counts estimate browser visits rather than exact people.

The map supports location details with each place’s latest recorded visit time, same-place aggregation, retry, explicit timeout/failure states and a labeled local cache of previously retrieved points. The place dropdown defaults to latest visit first, includes local dates and UTC offsets, and can switch to most visits without changing the selected map point. Missing times appear last and are labeled unavailable. These are each place’s latest records, not a history of individual visitors. See `workers/README.md` for the API, schema and deployment notes.

The Research section keeps its original four generative Canvas studies and direction selector. The temporary exploration slider, drag controls and Auto button have been removed.

The whole page uses a continuous, original signal-field background in `assets/page-atmosphere.js` and `.css`. Its composition changes with the chapter: expressive around the introduction and collaboration invitation, quieter around papers and the visitor map. Small pointer parallax, an ambient wash and chapter-opening rules share the existing teal/gold palette. Decorative layers do not intercept input or alter academic content. The field stops for reduced motion, Pause, hidden pages and inactivity. The implementation studies the background principles in [Motion Anything Waves](https://github.com/nexu-io/motion-anything/tree/main/recipes/web/waves), [React Bits Threads](https://reactbits.dev/backgrounds/threads), and [Codrops Morphing Background Shapes](https://github.com/codrops/MorphingBackgroundShapes); it does not load a video or a third-party animation runtime.

`assets/page-navigation.js` and `.css` add a shared sliding navigation marker, with keyboard-visible focus and minimal automatic scrolling when the reading chapter changes. Subtle edge fades identify hidden navigation items on narrow screens. `assets/page-rhythm.js` gives profile blocks, selected papers, collaboration and research links one-time viewport entrances, inspired by the sequencing principle in [Motion's stagger documentation](https://motion.dev/docs/stagger). These use native browser animation, cap simultaneous delays at 195 ms, and immediately settle on focus, Pause, reduced motion or a hidden tab. Search results remain immediate. A soft canvas mask protects the reading column. The existing pointer effects also follow live motion preferences and cancel pending mouse updates when the pointer leaves or motion is disabled.

The final Links chapter contains an opaque dark-teal closing panel. `assets/closing-field.js` draws original square-pixel signal ribbons inspired by the visual language in the supplied TRAE reference screenshot. Local mouse movement displaces nearby pixels, which return elastically on leave. The artwork stays above the closing invitation and fades toward the four stable research links. The panel stacks at 760px, retains its native anchors and a shortcut back to Collaboration, and remains readable without Canvas or JavaScript. Rendering is capped at 2200 desktop / 650 mobile pixels and 24 / 18 fps, with bounded pixel density; it stops offscreen, hidden, paused, reduced or idle. No video or external rendering service is used.

`assets/atlas-snapshot.js` contains an explicitly dated copy of real public aggregate data for offline resilience. Direct `file:` previews show this saved view and do not attempt cross-origin location/recording requests. HTTP previews and production still request live data; a failed connection retains a dated cache or saved view rather than clearing the map. Bundled fallback data is never saved as a fresh network response. Use the connected local preview below for current location and visit recording; the Worker retains its exact origin allowlist.

Visit times come from the API point’s `last_seen`, not `updatedAt` or the frontend refresh clock. The tooltip converts that UTC timestamp to the viewer’s local time, shows the UTC offset, and keeps the original ISO timestamp in a semantic `<time>` element. Old cached points without a valid timestamp show “Time unavailable”. This is a place-level latest visit, rather than a personal visit history.

The five most visited places remain quick buttons. A labeled native selector exposes every recorded place to keyboard and screen-reader users, including places outside that shortcut list.

The base map is derived from [Natural Earth 1:50m land](https://www.naturalearthdata.com/downloads/50m-physical-vectors/), a public-domain geographic dataset, projected consistently with the location markers.

## Local preview and verification

Static introductions remain visible when JavaScript is disabled or reveal initialization fails. News cards remain available when there are no earlier updates. Navigation uses a viewport-height observation band and updates after resize; publication search and viewer controls retain their keyboard behavior.

```sh
python3 -m http.server 8765 --bind 127.0.0.1
node --test scripts/*.test.mjs
```

The Worker tests use Node 24's built-in SQLite and do not contact production. For a clearly labeled, sample-data atlas demo, run `node scripts/preview-atlas.mjs` and open port 8766. Demo data is never injected into the normal site.

## Deployment

GitHub Actions deploys `index.html` and `assets/` on pushes to `main`. Worker code, tests and development artifacts are excluded from the Pages artifact. Deploy the Worker separately from `workers/`; a schema migration must precede frontend changes that depend on it. Preserve the newest published data snapshot when copying UI changes into the release checkout.
