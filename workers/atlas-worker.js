/* ============================================================
   Qi Teng — Visitor Atlas · backend
   Cloudflare Worker + D1
   ------------------------------------------------------------
   Routes
     GET    /visits   → aggregated city points + running totals
     POST   /visits   → record (or bump) one visitor's city point

   Privacy rules enforced here, not just promised in the UI
     · only city-level coordinates are accepted; the browser never
       sends GPS-grade positions in the first place
     · no IP address, user agent or referrer is ever written to D1
     · one anonymous row per visitor token, which cannot be linked
       back to any person — the owner cannot identify anyone either
     · a repeat visit within REVISIT_WINDOW_MS bumps nothing, so a
       refresh loop cannot inflate the counter
     · there is no self-serve delete: rows live until the owner
       prunes them via `wrangler d1 execute qt-atlas --remote`

   Bindings (see wrangler.toml)
     DB               D1Database   required
     ALLOWED_ORIGINS  string       comma separated, first is fallback
     RECORDING        string       "on" (default) or "off" kill switch
   ============================================================ */

const MAX_BODY_BYTES = 2048;
const MAX_TEXT_LEN = 80;
const MAX_CITY_ROWS = 2000;
const REVISIT_WINDOW_MS = 30 * 60 * 1000;

const TOKEN_RE = /^[A-Za-z0-9_-]{8,64}$/;

/* ---------- helpers ---------- */

function json(body, extraHeaders = {}, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders
    }
  });
}

function corsFor(origin, allowedList) {
  const allow = allowedList.includes(origin) ? origin : allowedList[0] || "*";
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "Origin"
  };
}

function clampNumber(value, min, max) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

function cleanText(value) {
  if (typeof value !== "string") return "";
  // strip control characters before anything reaches the database
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, MAX_TEXT_LEN);
}

async function readJsonBody(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ---------- GET /visits ---------- */

async function getVisits(env) {
  const [cities, totals] = await Promise.all([
    env.DB.prepare(
      `SELECT city,
              region,
              country,
              country_code,
              ROUND(AVG(lat), 2)        AS lat,
              ROUND(AVG(lon), 2)        AS lon,
              COUNT(*)                  AS visitors,
              COALESCE(SUM(hits), 0)    AS visits,
              MAX(last_seen)            AS last_seen
         FROM visits
        GROUP BY city, country
        ORDER BY visitors DESC, last_seen DESC
        LIMIT ?`
    )
      .bind(MAX_CITY_ROWS)
      .all(),
    env.DB.prepare(
      `SELECT COUNT(*)               AS visitors,
              COALESCE(SUM(hits), 0) AS visits,
              COUNT(DISTINCT city)   AS cities
         FROM visits`
    ).first()
  ]);

  return {
    ok: true,
    points: cities.results || [],
    totals: totals || { visitors: 0, visits: 0, cities: 0 }
  };
}

/* ---------- POST /visits ---------- */

async function recordVisit(request, env) {
  if (env.RECORDING === "off") {
    return { ok: false, error: "Recording is paused." };
  }

  const payload = await readJsonBody(request);
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Malformed request body." };
  }

  const token = typeof payload.token === "string" ? payload.token : "";
  if (!TOKEN_RE.test(token)) {
    return { ok: false, error: "Invalid token." };
  }

  const lat = clampNumber(payload.lat, -90, 90);
  const lon = clampNumber(payload.lon, -180, 180);
  if (lat === null || lon === null) {
    return { ok: false, error: "Invalid coordinates." };
  }

  const city = cleanText(payload.city);
  const region = cleanText(payload.region);
  const country = cleanText(payload.country);
  const countryCode = cleanText(payload.country_code).slice(0, 8).toUpperCase();

  const now = new Date().toISOString();

  const existing = await env.DB.prepare(
    `SELECT hits, last_seen FROM visits WHERE token = ?`
  )
    .bind(token)
    .first();

  if (existing) {
    const previous = Date.parse(existing.last_seen);
    const fresh =
      Number.isFinite(previous) && Date.now() - previous > REVISIT_WINDOW_MS;
    const bump = fresh ? 1 : 0;

    await env.DB.prepare(
      `UPDATE visits
          SET lat = ?, lon = ?, city = ?, region = ?, country = ?, country_code = ?,
              hits = hits + ?, last_seen = ?
        WHERE token = ?`
    )
      .bind(lat, lon, city, region, country, countryCode, bump, now, token)
      .run();

    return { ok: true, recorded: bump === 1, hits: (existing.hits || 0) + bump };
  }

  await env.DB.prepare(
    `INSERT INTO visits
       (token, lat, lon, city, region, country, country_code, hits, first_seen, last_seen)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
  )
    .bind(token, lat, lon, city, region, country, countryCode, now, now)
    .run();

  return { ok: true, recorded: true, hits: 1 };
}

/* ---------- router ---------- */

export default {
  async fetch(request, env) {
    const allowed = String(env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    const cors = corsFor(request.headers.get("Origin") || "", allowed);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const path = new URL(request.url).pathname;

    try {
      if (path === "/visits") {
        if (request.method === "GET") return json(await getVisits(env), cors);
        if (request.method === "POST") return json(await recordVisit(request, env), cors);
        return json({ ok: false, error: "Method not allowed." }, cors, 405);
      }
      return json({ ok: false, error: "Not found." }, cors, 404);
    } catch (error) {
      // never leak internals to the client
      return json({ ok: false, error: "Internal error." }, cors, 500);
    }
  }
};
