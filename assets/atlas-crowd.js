/* ============================================================
   Qi Teng — Visitor Atlas · crowd layer
   ------------------------------------------------------------
   Draws every visitor who has ever let the page record a
   city-level dot, so the map fills up as the page ages.

   Design rules
     · canvas, not DOM — a few thousand dots must stay cheap
     · the projection is identical to projectLocation() in site.js,
       so crowd dots, the home marker and the visitor dot line up
     · nothing here is required: if the endpoint is unset or the
       Worker is down the atlas silently keeps its old behaviour
     · GPS-grade positions are never uploaded (see report())
   ============================================================ */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     configuration — paste the deployed Worker URL here
     --------------------------------------------------------- */

  // ┌───────────────────────────────────────────────────────────────┐
  // │  PASTE YOUR WORKER URL BETWEEN THE QUOTES BELOW               │
  // │  e.g. "https://qt-atlas.your-subdomain.workers.dev"           │
  // │  Leave it as "" and the atlas just keeps its old behaviour.   │
  // └───────────────────────────────────────────────────────────────┘
  const DEPLOYED_ENDPOINT = "https://qt-atlas.teqi159.workers.dev";

  // The window override exists so a local mock endpoint can be injected in
  // tests without editing this file.
  const ATLAS_ENDPOINT = window.QT_ATLAS_ENDPOINT || DEPLOYED_ENDPOINT || "";

  const TOKEN_KEY = "qt-atlas-token";
  const REVEAL_MS = 900;

  /* ---------------------------------------------------------
     helpers
     --------------------------------------------------------- */

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* private mode — the atlas still works, it just forgets */
    }
  }

  function randomToken() {
    const bytes = new Uint8Array(18);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i += 1) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    let out = "";
    for (let i = 0; i < bytes.length; i += 1) {
      out += bytes[i].toString(36).padStart(2, "0");
    }
    return out.slice(0, 24);
  }

  function getToken() {
    let token = storageGet(TOKEN_KEY);
    if (!token) {
      token = randomToken();
      storageSet(TOKEN_KEY, token);
    }
    return token;
  }

  function round(value, digits) {
    const factor = 10 ** digits;
    return Math.round(Number(value) * factor) / factor;
  }

  function withAlpha(color, alpha) {
    const value = String(color).trim();
    if (value.startsWith("#")) {
      const hex = value.slice(1);
      const full =
        hex.length === 3
          ? hex
              .split("")
              .map((ch) => ch + ch)
              .join("")
          : hex;
      const n = Number.parseInt(full, 16);
      if (Number.isFinite(n)) {
        return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
      }
    }
    const parts = value.match(/rgba?\(([^)]+)\)/);
    if (parts) {
      const nums = parts[1]
        .split(/[,\s/]+/)
        .filter(Boolean)
        .map(Number);
      if (nums.length >= 3) {
        return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`;
      }
    }
    return value;
  }

  function themeColors() {
    const styles = window.getComputedStyle(document.documentElement);
    return {
      gold: styles.getPropertyValue("--gold").trim() || "#d9a94f",
      teal: styles.getPropertyValue("--teal").trim() || "#0e5f63"
    };
  }

  /* Keep in step with projectLocation() in site.js so every marker
     lands on the same spot. */
  function project(latitude, longitude, width, height) {
    const left = clamp(((longitude + 180) / 360) * 100, 3, 97);
    const top = clamp(((90 - latitude) / 180) * 100, 6, 94);
    return { x: (left / 100) * width, y: (top / 100) * height };
  }

  /* ---------------------------------------------------------
     state
     --------------------------------------------------------- */

  let layer = null;
  let points = [];
  let revealFrame = 0;
  let hasRevealed = false;

  const els = {};

  /* ---------------------------------------------------------
     network — every failure is silent by design
     --------------------------------------------------------- */

  async function api(path, options) {
    if (!ATLAS_ENDPOINT) throw new Error("atlas endpoint is not configured");
    const response = await window.fetch(ATLAS_ENDPOINT + path, options);
    if (!response.ok) throw new Error(`atlas responded ${response.status}`);
    return response.json();
  }

  async function refresh() {
    if (!ATLAS_ENDPOINT) return;
    let payload;
    try {
      payload = await api("/visits", { method: "GET", cache: "no-store" });
    } catch (error) {
      return;
    }
    if (!payload || !Array.isArray(payload.points)) return;
    points = payload.points;
    renderStats(payload.totals, points);
    reveal();
  }

  /* Upload one city-level point.
     The `coarse` guard is the privacy boundary: site.js marks only
     IP-derived locations coarse, so a browser GPS fix — which the
     visitor approved for their own screen — is never sent. */
  async function report(location) {
    if (!ATLAS_ENDPOINT) return;
    if (!location || location.coarse !== true) return;

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

    const token = getToken();

    try {
      await api("/visits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          lat: round(latitude, 2),
          lon: round(longitude, 2),
          city: location.city || "",
          region: location.region || "",
          country: location.country || "",
          country_code: location.countryCode || ""
        })
      });
      // let the visitor see their own dot join the field
      window.setTimeout(refresh, 1200);
    } catch (error) {
      /* offline, blocked, or the Worker is down — the map still works */
    }
  }

  /* ---------------------------------------------------------
     rendering
     --------------------------------------------------------- */

  function paint(progress) {
    if (!layer) return;
    const { canvas, ctx } = layer;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (!width || !height) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const targetW = Math.round(width * dpr);
    const targetH = Math.round(height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const { gold, teal } = themeColors();
    const now = Date.now();

    points.forEach((point, index) => {
      const latitude = Number(point.lat);
      const longitude = Number(point.lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;

      /* stagger the first reveal so the field assembles point by point */
      const stagger = points.length > 1 ? index / (points.length - 1) : 0;
      const appear = progress === 1 ? 1 : clamp((progress - stagger * 0.55) / 0.45, 0, 1);
      if (appear <= 0) return;

      const { x, y } = project(latitude, longitude, width, height);
      const visitors = Math.max(1, Number(point.visitors) || 1);
      const radius = Math.min(9, 2.2 + Math.log2(visitors) * 1.5);

      const age = Date.parse(point.last_seen || "");
      const days = Number.isFinite(age) ? clamp((now - age) / 86400000, 0, 365) : 180;
      const recency = clamp(1 - days / 365, 0.3, 1);
      const alpha = recency * appear;

      ctx.beginPath();
      ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = withAlpha(gold, alpha * 0.09);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = withAlpha(gold, alpha * 0.78);
      ctx.fill();

      if (visitors > 1) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = withAlpha(teal, alpha * 0.34);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }

  function reveal() {
    if (!layer) return;
    if (revealFrame) window.cancelAnimationFrame(revealFrame);

    /* only animate when the map is actually on screen */
    const rect = layer.canvas.getBoundingClientRect();
    const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;

    if (reduceMotion || !onScreen || hasRevealed) {
      hasRevealed = true;
      paint(1);
      return;
    }

    hasRevealed = true;
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / REVEAL_MS, 0, 1);
      paint(t);
      if (t < 1) revealFrame = window.requestAnimationFrame(step);
      else revealFrame = 0;
    };
    revealFrame = window.requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------
     stats panel
     --------------------------------------------------------- */

  function plural(count, one, many) {
    return `${count.toLocaleString("en-US")} ${count === 1 ? one : many}`;
  }

  function renderStats(totals, list) {
    if (!els.stats) return;

    const visitors = Number(totals && totals.visitors) || 0;
    const cities = Number(totals && totals.cities) || 0;

    if (!visitors) {
      els.stats.textContent = "The field is empty so far — this visit would be the first dot.";
    } else {
      els.stats.textContent = `${plural(visitors, "visitor", "visitors")} · ${plural(cities, "city", "cities")}`;
    }

    if (!els.top) return;
    els.top.replaceChildren();

    const named = (list || []).filter((point) => point.city || point.country).slice(0, 5);
    named.forEach((point) => {
      const item = document.createElement("li");

      const place = document.createElement("span");
      place.className = "crowd-city";
      place.textContent = point.city || point.country || "Unknown";

      const count = document.createElement("span");
      count.className = "crowd-count";
      count.textContent = String(Math.max(1, Number(point.visitors) || 1));

      item.append(place, count);
      els.top.appendChild(item);
    });
  }

  /* ---------------------------------------------------------
     init
     --------------------------------------------------------- */

  function init() {
    const canvas = document.getElementById("crowd-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    layer = { canvas, ctx };

    els.stats = document.getElementById("crowd-stats");
    els.top = document.getElementById("crowd-top");
    els.panel = document.getElementById("atlas-crowd");

    if (ATLAS_ENDPOINT) {
      if (els.panel) els.panel.hidden = false;
      // let the page settle, then fill the field
      window.setTimeout(refresh, 900);
    } else if (els.panel) {
      els.panel.hidden = true;
    }

    const repaint = () => {
      if (points.length) paint(1);
    };

    if ("ResizeObserver" in window) {
      new ResizeObserver(repaint).observe(canvas);
    } else {
      window.addEventListener("resize", repaint);
    }

    // the theme toggle swaps --gold / --teal, so redraw in the new palette
    document.addEventListener("qt-themechange", repaint);
  }

  window.QtAtlasCrowd = { report, refresh };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
