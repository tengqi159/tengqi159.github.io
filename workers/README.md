# Visitor Atlas — backend

The academic homepage is static (GitHub Pages), so it cannot store anything on
its own. This tiny Cloudflare Worker + D1 database gives it a place to keep one
dot per visitor, so the atlas on the homepage fills up over time.

Everything runs on the free tier:

| Resource | Free limit | This atlas uses |
| --- | --- | --- |
| Worker requests | 100,000 / day | 2 per visit (1 read, 1 write) |
| D1 rows read | 5,000,000 / day | tens per visit |
| D1 rows written | 100,000 / day | 1 per visit |
| D1 storage | 5 GB | ~120 bytes per visitor |
| Pausing | never | unlike Supabase free, this does not sleep |

## Deploy (once)

```bash
cd workers
npm i -g wrangler          # or: npx wrangler …
wrangler login

# 1. create the database, then copy the printed database_id into wrangler.toml
wrangler d1 create qt-atlas

# 2. create the table
wrangler d1 execute qt-atlas --file=./schema.sql --remote

# 3. ship the worker
wrangler deploy
```

Wrangler prints the worker URL, e.g.
`https://qt-atlas.<your-subdomain>.workers.dev`.

## Wire it into the homepage

Open `assets/atlas-crowd.js` and set:

```js
const ATLAS_ENDPOINT = "https://qt-atlas.<your-subdomain>.workers.dev";
```

Leave it as an empty string and the atlas silently falls back to the
local-only mode it already has — no errors, no broken map.

## API

| Method | Route | Body | Returns |
| --- | --- | --- | --- |
| `GET` | `/visits` | – | `{ ok, points: [{city, region, country, country_code, lat, lon, visitors, visits, last_seen}], totals: {visitors, visits, cities} }` |
| `POST` | `/visits` | `{ token, lat, lon, city, region, country, country_code }` | `{ ok, recorded, hits }` |

`token` is a random string generated in the browser and kept in
`localStorage`. It is the only handle on a visitor's row and cannot be linked
back to any person — not even by the site owner.

There is no self-serve delete: rows live until pruned by the owner (see
Housekeeping below).

## Privacy guarantees enforced by the worker

- **City-level coordinates only.** The browser never sends GPS positions; the
  "refine with precise location" result is shown locally and discarded.
- **No IP address, user agent or referrer is written to D1.** The Worker could
  read them, and deliberately does not.
- **One anonymous row per token.** Nothing in the database can be linked to a
  person — the owner cannot identify anyone either.
- **Repeat visits do not inflate counts.** A hit is only recorded once per
  30 minutes per token (`REVISIT_WINDOW_MS`), so a refresh loop is a no-op.
- **Input is validated and bounded.** Coordinate ranges, token shape, text
  length (80 chars) and total body size (2 KB) are all enforced server-side;
  every query uses bound parameters.

## Kill switch

Set the `RECORDING` variable to `off` to stop accepting new dots without
redeploying code:

```bash
wrangler deploy --var RECORDING:off
```

Reads keep working, so the existing map stays visible.

## Housekeeping

Prune visitors who have not come back in a year:

```bash
wrangler d1 execute qt-atlas --remote --command \
  "DELETE FROM visits WHERE last_seen < datetime('now','-365 day')"
```

Inspect current totals:

```bash
wrangler d1 execute qt-atlas --remote --command \
  "SELECT COUNT(*) visitors, SUM(hits) visits, COUNT(DISTINCT city) cities FROM visits"
```
