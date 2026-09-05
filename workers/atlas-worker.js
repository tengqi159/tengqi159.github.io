/* Visitor Atlas API v2. City/region estimates come from Cloudflare request.cf.
   Client coordinates are never trusted; no raw IP or user agent is stored. */
const WINDOW_MS = 30 * 60 * 1000;
const MAX_POINTS = 2000;
const TOKEN_RE = /^[A-Za-z0-9_-]{16,64}$/;
const clean = value => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f|]/g, ' ').trim().slice(0, 80) : '';
const round = n => Math.round(n * 10) / 10;

function coordinate(value, min, max) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? round(n) : null;
}

export function locationFromRequest(request) {
  const cf = request.cf || {};
  const latitude = coordinate(cf.latitude, -90, 90);
  const longitude = coordinate(cf.longitude, -180, 180);
  const city = clean(cf.city), region = clean(cf.region);
  const countryCode = /^[A-Z]{2}$/.test(cf.country || '') ? cf.country : '';
  if (latitude === null || longitude === null || (!city && !region)) return null;
  let country = countryCode;
  try { if (countryCode) country = new Intl.DisplayNames(['en'], {type:'region'}).of(countryCode); } catch {}
  const placeKey = [countryCode || country, region, city].map(s => s.toLowerCase()).join('|');
  return { latitude, longitude, city, region, country, countryCode, placeKey,
    level: city ? 'city' : 'region', source: 'network', coarse: true };
}

function response(data, headers, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: {
    'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers
  }});
}

async function readVisits(env) {
  const [places, totals] = await Promise.all([
    env.DB.prepare(`SELECT place_key, city, region, country, country_code,
      ROUND(AVG(lat),1) AS lat, ROUND(AVG(lon),1) AS lon,
      COUNT(*) AS visitors, SUM(hits) AS visits, MAX(last_seen) AS last_seen
      FROM atlas_visits GROUP BY place_key ORDER BY visits DESC, last_seen DESC LIMIT ?`).bind(MAX_POINTS).all(),
    env.DB.prepare(`SELECT COUNT(DISTINCT token) AS visitors, COALESCE(SUM(hits),0) AS visits,
      COUNT(DISTINCT place_key) AS places, COUNT(DISTINCT NULLIF(country_code,'')) AS countries
      FROM atlas_visits`).first()
  ]);
  return {ok:true, version:2, points:places.results || [], totals:{...totals, cities:totals.places},
    truncated: totals.places > MAX_POINTS, updatedAt:new Date().toISOString()};
}

async function recordVisit(request, env, headers) {
  if (env.RECORDING === 'off') return response({ok:false,code:'recording_paused'},headers,503);
  const agent = request.headers.get('user-agent') || '';
  if (request.cf?.botManagement?.verifiedBot || /bot\b|crawler|spider|headlesschrome/i.test(agent)) {
    return response({ok:true,recorded:false,code:'automated_request'},headers);
  }
  // Request bodies are tiny; stop reading at the limit rather than buffering an unbounded body.
  const reader = request.body?.getReader();
  if (!reader) return response({ok:false,code:'invalid_body'},headers,400);
  const chunks = []; let bytes = 0;
  while (true) {
    const {done,value} = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 2048) { await reader.cancel(); return response({ok:false,code:'body_too_large'},headers,413); }
    chunks.push(value);
  }
  let payload;
  try {
    const raw = new Uint8Array(bytes); let offset=0;
    for (const chunk of chunks) {raw.set(chunk,offset);offset+=chunk.byteLength;}
    payload = JSON.parse(new TextDecoder().decode(raw));
  } catch { return response({ok:false,code:'invalid_body'},headers,400); }
  if (!payload || typeof payload.token !== 'string' || !TOKEN_RE.test(payload.token)) return response({ok:false,code:'invalid_token'},headers,400);
  const location = locationFromRequest(request);
  if (!location) return response({ok:false,recorded:false,code:'location_unavailable'},headers,422);
  const {latitude,longitude,city,region,country,countryCode,placeKey} = location;
  const now = new Date().toISOString();
  // Atomic upsert: simultaneous loads share a row; refreshes don't slide the 30-minute window.
  const saved = await env.DB.prepare(`INSERT INTO atlas_visits
    (token,place_key,lat,lon,city,region,country,country_code,hits,first_seen,last_seen)
    VALUES (?,?,?,?,?,?,?,?,1,?,?)
    ON CONFLICT(token,place_key) DO UPDATE SET
      hits = atlas_visits.hits + CASE WHEN (julianday(excluded.last_seen)-julianday(atlas_visits.last_seen))*86400000 >= ? THEN 1 ELSE 0 END,
      last_seen = CASE WHEN (julianday(excluded.last_seen)-julianday(atlas_visits.last_seen))*86400000 >= ? THEN excluded.last_seen ELSE atlas_visits.last_seen END
    RETURNING hits`).bind(payload.token,placeKey,latitude,longitude,city,region,country,countryCode,now,now,WINDOW_MS,WINDOW_MS).first();
  return response({ok:true,recorded:true,location,hits:saved.hits},headers);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map(s=>s.trim()).filter(Boolean);
    const headers = {vary:'Origin','access-control-allow-methods':'GET, POST, OPTIONS',
      'access-control-allow-headers':'content-type','access-control-max-age':'86400'};
    if (origin && allowed.includes(origin)) headers['access-control-allow-origin']=origin;
    if (origin && !allowed.includes(origin)) return response({ok:false,code:'origin_not_allowed'},headers,403);
    if (request.method==='OPTIONS') return new Response(null,{status:204,headers});
    const path = new URL(request.url).pathname;
    try {
      if (path === '/location' && request.method === 'GET') {
        return response({ok:true,version:2,location:locationFromRequest(request),recording:env.RECORDING!=='off'},headers);
      }
      if (path === '/visits') {
        if (request.method === 'GET') return response(await readVisits(env),headers);
        if (request.method === 'POST') {
          if (!origin) return response({ok:false,code:'origin_required'},headers,403);
          return await recordVisit(request,env,headers);
        }
        return response({ok:false,code:'method_not_allowed'},headers,405);
      }
      return response({ok:false,code:'not_found'},headers,404);
    } catch {
      return response({ok:false,code:'service_unavailable'},headers,503);
    }
  }
};
