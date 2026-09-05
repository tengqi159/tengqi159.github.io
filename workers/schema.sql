-- ============================================================
-- Qi Teng — Visitor Atlas · D1 schema
-- ------------------------------------------------------------
-- Apply once:
--   npx wrangler d1 create qt-atlas          # prints the database_id
--   npx wrangler d1 execute qt-atlas --file=./schema.sql --remote
--
-- Legacy visits is retained for migration and rollback.
-- v2 records one row per random browser token and estimated place.
-- ============================================================

CREATE TABLE IF NOT EXISTS visits (
  token        TEXT    NOT NULL,
  lat          REAL    NOT NULL,   -- city-level only, never GPS precision
  lon          REAL    NOT NULL,
  city         TEXT,
  region       TEXT,
  country      TEXT,
  country_code TEXT,
  hits         INTEGER NOT NULL DEFAULT 1,
  first_seen   TEXT    NOT NULL,   -- ISO 8601 UTC
  last_seen    TEXT    NOT NULL    -- ISO 8601 UTC
);

-- legacy uniqueness: one row per browser
CREATE UNIQUE INDEX IF NOT EXISTS idx_visits_token
  ON visits (token);

-- legacy indexes
CREATE INDEX IF NOT EXISTS idx_visits_place
  ON visits (city, country);

CREATE INDEX IF NOT EXISTS idx_visits_seen
  ON visits (last_seen);

-- v2: retain each browser's earlier places when its estimated location changes.
-- The legacy table is preserved. This migration can be run more than once.
CREATE TABLE IF NOT EXISTS atlas_visits (
  token TEXT NOT NULL,
  place_key TEXT NOT NULL,
  lat REAL NOT NULL CHECK(lat BETWEEN -90 AND 90),
  lon REAL NOT NULL CHECK(lon BETWEEN -180 AND 180),
  city TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  country_code TEXT NOT NULL DEFAULT '',
  hits INTEGER NOT NULL DEFAULT 1 CHECK(hits >= 1),
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  PRIMARY KEY(token, place_key)
);
CREATE INDEX IF NOT EXISTS idx_atlas_places ON atlas_visits(place_key);
CREATE INDEX IF NOT EXISTS idx_atlas_seen ON atlas_visits(last_seen);
INSERT OR IGNORE INTO atlas_visits
  (token,place_key,lat,lon,city,region,country,country_code,hits,first_seen,last_seen)
SELECT token,
  lower(COALESCE(NULLIF(country_code,''),country,'')) || '|' || lower(COALESCE(region,'')) || '|' ||
  CASE WHEN COALESCE(city,'') <> '' OR COALESCE(region,'') <> '' THEN lower(COALESCE(city,''))
       ELSE 'grid:' || ROUND(lat,1) || ',' || ROUND(lon,1) END,
  ROUND(lat,1),ROUND(lon,1),COALESCE(city,''),COALESCE(region,''),COALESCE(country,''),COALESCE(country_code,''),
  MAX(1,hits),first_seen,last_seen FROM visits WHERE lat BETWEEN -90 AND 90 AND lon BETWEEN -180 AND 180;
