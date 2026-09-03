-- ============================================================
-- Qi Teng — Visitor Atlas · D1 schema
-- ------------------------------------------------------------
-- Apply once:
--   npx wrangler d1 create qt-atlas          # prints the database_id
--   npx wrangler d1 execute qt-atlas --file=./schema.sql --remote
--
-- Shape: exactly one row per visitor (identified by an anonymous
-- token). Repeat visits bump `hits` instead of adding rows, so the
-- table stays small and a visitor can delete their own dot later.
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

-- dedupe: one dot per visitor, and the opt-out lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_visits_token
  ON visits (token);

-- the aggregation query groups by place, the cleanup prunes by age
CREATE INDEX IF NOT EXISTS idx_visits_place
  ON visits (city, country);

CREATE INDEX IF NOT EXISTS idx_visits_seen
  ON visits (last_seen);
