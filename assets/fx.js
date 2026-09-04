/* ============================================================
   Qi Teng — Academic Homepage · motion layer (fx)
   ------------------------------------------------------------
   Vanilla re-authoring of the current component-library idioms
   (React Bits text animations, Aceternity spotlight / 3D tilt,
   Magic UI shimmer) so they fit this static, no-build page and
   its "Signal in the Noise" metaphor.

   Ground rules honoured here:
     · cursor-driven effects only on (hover: hover) + (pointer: fine)
     · nothing animates offscreen or on a hidden tab
     · prefers-reduced-motion removes the effect entirely rather
       than merely shortening it
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function remToPx(value) {
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return value * (Number.isFinite(root) && root > 0 ? root : 16);
  }

  /* run fn at most once per frame, keeping the latest arguments */
  function rafThrottle(fn) {
    let queued = false;
    let latest = null;
    return function throttled(...args) {
      latest = args;
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(() => {
        queued = false;
        fn.apply(this, latest);
      });
    };
  }

  /* fire onEnter once per element, the first time it shows up */
  function onceVisible(elements, options, onEnter) {
    const list = Array.from(elements);
    if (!("IntersectionObserver" in window)) {
      list.forEach((element) => onEnter(element));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        onEnter(entry.target);
      });
    }, options);
    list.forEach((element) => observer.observe(element));
  }

  /* ============================================================
     1. signal-lock text reveal
     Each unit rises out of a blur, as if the signal were
     acquiring lock. Characters for the name, words for prose.
     ============================================================ */

  function splitTextNode(textNode, units, byChar) {
    const text = textNode.nodeValue || "";
    if (!text) return;

    const fragment = document.createDocumentFragment();
    const pieces = byChar ? Array.from(text) : text.split(/(\s+)/);

    pieces.forEach((piece) => {
      if (!piece) return;
      if (!byChar && /^\s+$/.test(piece)) {
        fragment.appendChild(document.createTextNode(piece));
        return;
      }
      const unit = document.createElement("span");
      unit.className = "fx-unit";
      unit.textContent = piece;
      units.push(unit);
      fragment.appendChild(unit);
    });

    if (textNode.parentNode) {
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  function collectUnits(root, byChar) {
    const units = [];
    (function walk(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) splitTextNode(child, units, byChar);
        else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
      });
    })(root);
    return units;
  }

  function setupSignalLock() {
    const targets = [
      [".hero-name", true],
      [".hero-native", true],
      [".kicker", false],
      [".hero-statement", false]
    ]
      .map(([selector, byChar]) => ({
        element: document.querySelector(selector),
        byChar
      }))
      .filter((target) => target.element);

    if (!targets.length) return;

    targets.forEach(({ element, byChar }) => {
      const units = collectUnits(element, byChar);
      element.classList.add("fx-split", "fx-armed");
      units.forEach((unit, index) => unit.style.setProperty("--i", String(index)));
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        targets.forEach(({ element }) => element.classList.add("is-locked"));
      });
    });
  }

  /* ============================================================
     2. magnetic buttons — lean toward the cursor
     ============================================================ */

  function setupMagnetic(selector, strength) {
    document.querySelectorAll(selector).forEach((element) => {
      element.classList.add("fx-magnetic");
      const reset = () => {
        element.style.setProperty("--fx-x", "0px");
        element.style.setProperty("--fx-y", "0px");
      };
      const move = rafThrottle((event) => {
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        element.style.setProperty("--fx-x", `${clamp(dx * strength, -9, 9).toFixed(2)}px`);
        element.style.setProperty("--fx-y", `${clamp(dy * strength * 0.8, -7, 7).toFixed(2)}px`);
      });
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", reset);
      element.addEventListener("blur", reset);
    });
  }

  /* ============================================================
     3. spotlight — a cursor-tracked wash of light
     ============================================================ */

  function setupSpotlight(elements) {
    elements.forEach((element) => {
      if (!element) return;
      element.classList.add("fx-spotlight");
      const move = rafThrottle((event) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--mx", `${(event.clientX - rect.left).toFixed(1)}px`);
        element.style.setProperty("--my", `${(event.clientY - rect.top).toFixed(1)}px`);
      });
      element.addEventListener("pointermove", move);
    });
  }

  /* ============================================================
     4. tilt — 3D lean, with an optional specular glare
     ============================================================ */

  function setupTilt(element, maxDeg, glare) {
    if (!element) return;
    element.classList.add("fx-tilt");

    const reset = () => {
      element.style.setProperty("--rx", "0deg");
      element.style.setProperty("--ry", "0deg");
    };

    const move = rafThrottle((event) => {
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--ry", `${(px * maxDeg * 2).toFixed(2)}deg`);
      element.style.setProperty("--rx", `${(-py * maxDeg * 2).toFixed(2)}deg`);
      if (glare) {
        glare.style.setProperty("--gx", `${((px + 0.5) * 100).toFixed(1)}%`);
        glare.style.setProperty("--gy", `${((py + 0.5) * 100).toFixed(1)}%`);
      }
    });

    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
  }

  /* ============================================================
     5. news rail — the thread fills as you read down the timeline
     ============================================================ */

  function setupNewsRail() {
    const timeline = document.querySelector(".news-timeline");
    if (!timeline) return;

    const items = Array.from(timeline.querySelectorAll(".news-item"));
    if (!items.length) return;

    const rail = document.createElement("div");
    rail.className = "news-rail";
    rail.setAttribute("aria-hidden", "true");
    const fill = document.createElement("div");
    fill.className = "news-rail-fill";
    const head = document.createElement("div");
    head.className = "news-rail-head";
    rail.append(fill, head);
    timeline.appendChild(rail);

    let top = 0;
    let span = 0;

    // Vertical centre of an item's icon, in timeline-local coordinates.
    // Uses offsetTop/offsetHeight (layout boxes) rather than
    // getBoundingClientRect so the entrance translateY transition and
    // hover transforms can never skew the measurement.
    function nodeCenterY(item) {
      const node = item.querySelector(".news-node");
      if (!node) return item.offsetTop + remToPx(3.55);
      return item.offsetTop + node.offsetTop + node.offsetHeight / 2;
    }

    function measure() {
      // X: derive from the real icon disc so the rail always matches the
      // grid (padding, column widths and breakpoints included).
      const node = items[0].querySelector(".news-node");
      if (node) {
        const nr = node.getBoundingClientRect();
        const tr = timeline.getBoundingClientRect();
        rail.style.left = `${(nr.left + nr.width / 2 - tr.left).toFixed(1)}px`;
      }
      top = nodeCenterY(items[0]);
      span = Math.max(0, nodeCenterY(items[items.length - 1]) - top);
      rail.style.top = `${top.toFixed(1)}px`;
      fill.style.height = `${span.toFixed(1)}px`;
      update();
    }

    function update() {
      if (span <= 0) return;
      const rect = timeline.getBoundingClientRect();
      const anchor = window.innerHeight * 0.62;
      const progress = clamp((anchor - (rect.top + top)) / span, 0, 1);
      fill.style.transform = `scaleY(${progress.toFixed(4)})`;
      head.style.transform = `translateY(${(progress * span).toFixed(1)}px)`;
    }

    const onScroll = rafThrottle(update);
    const onResize = rafThrottle(measure);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    measure();
    // late font swaps change line wraps and item heights — re-measure
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    window.addEventListener("load", measure);

    onceVisible(items, { threshold: 0.25, rootMargin: "0px 0px -6% 0px" }, (item) => {
      item.classList.add("is-locked");
    });
  }

  /* ============================================================
     6. research icons — the strokes trace themselves
     ============================================================ */

  function strokeLength(shape) {
    if (typeof shape.getTotalLength !== "function") return 0;
    try {
      const length = shape.getTotalLength();
      return Number.isFinite(length) && length > 0 ? length : 0;
    } catch (error) {
      return 0;
    }
  }

  function setupIconDraw() {
    const icons = Array.from(document.querySelectorAll(".direction-icon svg"));
    if (!icons.length) return;

    icons.forEach((svg, rowIndex) => {
      const shapes = Array.from(
        svg.querySelectorAll("path, circle, ellipse, rect, polyline, line")
      ).filter((shape) => !shape.classList.contains("orbit-sat"));

      let order = 0;
      shapes.forEach((shape) => {
        const length = strokeLength(shape);
        if (!length) return;
        shape.setAttribute("data-draw", "");
        shape.style.setProperty("--len", length.toFixed(1));
        shape.style.setProperty("--i", (order + rowIndex * 0.5).toFixed(2));
        order += 1;
      });

      svg.classList.add("fx-draw");
    });

    const rows = Array.from(document.querySelectorAll(".direction-row"));
    onceVisible(rows, { threshold: 0.45 }, (row) => {
      const svg = row.querySelector(".direction-icon svg");
      if (svg) svg.classList.add("is-drawn");
    });
  }

  /* ============================================================
     7. citation meter — fills when the card is read
     ============================================================ */

  function setupCiteMeters() {
    const cards = Array.from(document.querySelectorAll(".selected-card"));
    if (!cards.length) return;
    onceVisible(cards, { threshold: 0.3 }, (card) => card.classList.add("is-locked"));
  }

  /* ============================================================
     8. atlas packets — the signal runs the arc back to Zhengzhou
     ============================================================ */

  const PACKET_COUNT = 3;
  const PACKET_TRAIL = 5;
  const PACKET_PERIOD = 2800;

  function setupPackets() {
    const map = document.getElementById("visitor-map-canvas");
    const homeMarker = document.querySelector(".home-marker");
    if (!map) return;

    const layer = document.createElement("div");
    layer.className = "packet-layer";
    layer.setAttribute("aria-hidden", "true");
    map.appendChild(layer);

    let path = null;
    let points = [];
    let offsetX = 0;
    let offsetY = 0;
    let scaleX = 1;
    let scaleY = 1;
    let trails = [];
    let frame = 0;
    let running = false;
    let onScreen = false;
    let lastArrival = 0;

    function buildTrails() {
      layer.replaceChildren();
      trails = [];
      for (let i = 0; i < PACKET_COUNT; i += 1) {
        const trail = [];
        for (let j = 0; j < PACKET_TRAIL; j += 1) {
          const dot = document.createElement("span");
          dot.className = "signal-packet";
          dot.style.opacity = "0";
          layer.appendChild(dot);
          trail.push(dot);
        }
        trails.push(trail);
      }
    }

    function measure() {
      if (!path || !path.ownerSVGElement) return;
      const svg = path.ownerSVGElement;
      const mapRect = map.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      offsetX = svgRect.left - mapRect.left;
      offsetY = svgRect.top - mapRect.top;
      scaleX = svgRect.width / 100;
      scaleY = svgRect.height / 100;

      const total = path.getTotalLength();
      if (!Number.isFinite(total) || total <= 0) {
        points = [];
        return;
      }
      const steps = 120;
      points = [];
      for (let i = 0; i <= steps; i += 1) {
        const point = path.getPointAtLength((i / steps) * total);
        points.push({ x: point.x, y: point.y });
      }
    }

    function sampleAt(t) {
      if (points.length < 2) return null;
      const position = clamp(t, 0, 1) * (points.length - 1);
      const index = Math.floor(position);
      const frac = position - index;
      const a = points[index];
      const b = points[Math.min(points.length - 1, index + 1)];
      return {
        x: offsetX + (a.x + (b.x - a.x) * frac) * scaleX,
        y: offsetY + (a.y + (b.y - a.y) * frac) * scaleY
      };
    }

    function ripple() {
      if (!homeMarker) return;
      const ring = document.createElement("span");
      ring.className = "fx-ripple";
      homeMarker.appendChild(ring);
      window.setTimeout(() => ring.remove(), 950);
    }

    function render(now) {
      frame = 0;
      if (!running || !onScreen || !points.length) return;

      const cycle = (now / PACKET_PERIOD) % 1;

      trails.forEach((trail, index) => {
        const head = (cycle + index / PACKET_COUNT) % 1;
        trail.forEach((dot, step) => {
          const t = head - step * 0.016;
          if (t < 0 || t > 1) {
            dot.style.opacity = "0";
            return;
          }
          const point = sampleAt(t);
          if (!point) {
            dot.style.opacity = "0";
            return;
          }
          const fade = clamp(Math.min(t * 7, (1 - t) * 7 + 0.2), 0, 1);
          dot.style.transform =
            `translate3d(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px, 0) ` +
            `scale(${(1 - step * 0.14).toFixed(2)})`;
          dot.style.opacity = (fade * (1 - step * 0.17)).toFixed(3);
        });
        if (head > 0.98 && now - lastArrival > 850) {
          lastArrival = now;
          ripple();
        }
      });

      frame = window.requestAnimationFrame(render);
    }

    function start() {
      if (running || !points.length) return;
      running = true;
      frame = window.requestAnimationFrame(render);
    }

    function stop() {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      trails.forEach((trail) =>
        trail.forEach((dot) => {
          dot.style.opacity = "0";
        })
      );
    }

    const onResize = rafThrottle(measure);
    window.addEventListener("resize", onResize);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          onScreen = entries[entries.length - 1].isIntersecting;
          if (onScreen) start();
          else stop();
        },
        { threshold: 0.05 }
      ).observe(map);
    } else {
      onScreen = true;
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    });

    document.addEventListener("qt-arcdrawn", (event) => {
      path = event.detail;
      if (!path) return;
      path.ownerSVGElement.classList.add("fx-packets");
      buildTrails();
      measure();
      start();
    });

    document.addEventListener("qt-arcclear", () => {
      if (path && path.ownerSVGElement) {
        path.ownerSVGElement.classList.remove("fx-packets");
      }
      path = null;
      points = [];
      stop();
    });
  }

  /* ============================================================
     wiring
     ============================================================ */

  function initCards() {
    if (!finePointer || reduceMotion) return;
    const cards = Array.from(document.querySelectorAll(".selected-card"));
    cards.forEach((card) => setupTilt(card, 4, null));
    setupSpotlight(cards);
  }

  function init() {
    if (!reduceMotion) {
      setupSignalLock();
      setupIconDraw();
      setupNewsRail();
      setupCiteMeters();
      setupPackets();
    }

    if (!finePointer || reduceMotion) return;

    setupMagnetic(".hero-cta .button", 0.22);
    setupSpotlight([
      ...document.querySelectorAll(".metric"),
      ...document.querySelectorAll(".direction-row"),
      ...document.querySelectorAll(".link-row")
    ]);
    initCards();

    const portrait = document.querySelector(".portrait");
    if (portrait) {
      const glare = document.createElement("span");
      glare.className = "portrait-glare";
      glare.setAttribute("aria-hidden", "true");
      portrait.appendChild(glare);
      setupTilt(portrait, 5, glare);
    }

    /* the metrics strip and the publication grid are re-rendered by the
       live data sync, which drops the elements these effects hold */
    if ("MutationObserver" in window) {
      let queued = false;
      const refresh = () => {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(() => {
          queued = false;
          initCards();
          setupSpotlight(Array.from(document.querySelectorAll(".metric")));
        });
      };
      ["metrics-grid", "selected-publications"].forEach((id) => {
        const host = document.getElementById(id);
        if (host) new MutationObserver(refresh).observe(host, { childList: true });
      });
    }
  }

  /* site.js renders the news, metrics and publication cards from a
     DOMContentLoaded handler. Because this file is deferred it runs
     during the "interactive" phase — before that handler — so we must
     queue on DOMContentLoaded too (registered afterwards, therefore
     fired afterwards) rather than initialising straight away. */
  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
