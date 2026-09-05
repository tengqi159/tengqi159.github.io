# Visitor Atlas API v2

The static homepage uses this Cloudflare Worker and D1 database to aggregate approximate visitor places. The v2 Worker and schema were deployed on September 5, 2026. The migration preserved all 6 historical visits. Worker version: `d7634ad1-3751-4d65-b24c-d3a76cc058dd`.

## Behaviour

- `GET /location` resolves the current request's Cloudflare city/region estimate. It does not ask for browser GPS. Missing coordinates or missing city/region return a null location.
- `POST /visits` accepts only a random browser `token` (16–64 characters). Coordinates come from `request.cf`, even if a client submits its own coordinates. Positions are rounded to one decimal degree before storage or display.
- One row per `(token, place_key)` preserves earlier places. City, region and country together distinguish places with identical city names. An atomic upsert counts at most one visit per browser/place per 30-minute window; refreshes do not extend that window.
- `GET /visits` returns aggregate points and totals: distinct browser tokens, visits, places and countries. At most 2,000 places are drawn, with an explicit truncation flag. Total counts include all places.
- Recognized bots are skipped. Browser tokens and network locations are approximate measures, not exact people or physical positions. Clearing browser storage, using another browser, a VPN or a mobile carrier can affect counts/location.
- D1 stores tokens, coarse place metadata, counts and timestamps. The Worker does not write raw IP addresses, user agents or referrers to D1. This does not make claims about infrastructure access logs.

Cloudflare geolocation fields: https://developers.cloudflare.com/workers/runtime-apis/request/

## Local verification

Requires Node 24 with built-in `node:sqlite` (an experimental warning is expected).

```bash
node --test workers/atlas-worker.test.mjs
node scripts/preview-atlas.mjs
```

Open `http://127.0.0.1:8766/?atlas=demo#atlas`. A visible bilingual banner labels sample records and the simulated Berlin visitor. The preview uses the actual Worker module and an in-memory SQLite adapter. It makes no requests or writes to the production atlas.

Other `atlas` modes: `empty`, `no-location`, `offline`, `save-fails`, `timeout`, `cached`. In `cached`, the first two map reads succeed; subsequent reads fail so the retained snapshot can be checked. Restart the server to reset its fixtures.

`http://127.0.0.1:8765/` remains the normal static preview and contacts the configured production Worker. The v2 backend supports this local origin as well as the production origin. Network reachability still depends on the visitor's connection.

## Future deployment

Use the existing `qt-atlas` D1 database and Worker; do not create another database. `schema.sql` retains the legacy `visits` table and imports records into `atlas_visits` without duplicating them when rerun. To avoid writes landing in the legacy table during migration, briefly pause the existing Worker's recording before migration. Then deploy v2 with `RECORDING=on`, and update the frontend. Deploying the frontend by itself leaves the new location flow disconnected.

From `workers/`, after pausing legacy writes:

```bash
npx wrangler d1 execute qt-atlas --file=./schema.sql --remote
npx wrangler deploy
```

Confirm `/location` returns `version: 2`, both intended origins receive the matching CORS header, `/visits` retains the legacy totals, and a real browser can record and refresh without increasing its count twice. D1's real binding and edge geolocation still require this post-deployment check; local SQLite tests do not prove cloud deployment.

The frontend endpoint defaults to `https://qt-atlas.teqi159.workers.dev`. For local verification only, the preview injects `window.QT_ATLAS_ENDPOINT` before `assets/atlas-crowd.js` loads. Every fetch has a 7.5-second timeout and explicit failure UI. Last successful aggregate maps are cached in browser storage for up to 7 days and labeled as saved when a refresh fails.
