/* Original pixel-signal field for the closing research links.
   Decorative Canvas2D only; native links remain the foreground interaction. */
(() => {
  'use strict';
  function init() {
    const host = document.getElementById('links-finale');
    const canvas = document.getElementById('closing-field');
    if (!host || !canvas?.getContext) return;
    const ctx = canvas.getContext('2d', {alpha: true});
    if (!ctx) return;
    const root = document.documentElement;
    const media = query => typeof matchMedia === 'function' ? matchMedia(query) : {matches: false};
    const reduced = media('(prefers-reduced-motion: reduce)');
    const fine = media('(hover: hover) and (pointer: fine)');
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const smooth = (a, b, value) => {
      const t = clamp((value - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const hash = (x, y, salt = 0) => {
      const value = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453;
      return value - Math.floor(value);
    };
    let colors = [];
    let width = 1, height = 1, artWidth = 1, artHeight = 1, compact = false;
    let particles = [], frame = 0, lastPaint = 0, phase = 4.2;
    let needsLayout = true, needsColors = true, dirty = true, failed = false, onScreen = false;
    let lastInput = performance.now();
    const pointer = {x: -1000, y: -1000, active: false};
    const paused = () => reduced.matches || root.dataset.motionPaused === 'true';
    const moving = time => onScreen && !document.hidden && !paused() && time - lastInput < 20000;

    function measure() {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      compact = (window.innerWidth || width) <= 760;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 1600 / width);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      // The lower-left invitation and the right-hand links have quiet space.
      artWidth = width * (compact ? 1.04 : .69);
      artHeight = Math.min(height * (compact ? .30 : .56), compact ? 190 : 320);
      const spacing = compact ? 6.7 : 7.2;
      const candidates = [];
      for (let col = 0; col * spacing < artWidth + spacing; col++) {
        const x = col * spacing;
        const u = x / artWidth;
        const ridges = [
          .29 + Math.sin(u * 6.8 + .2) * .14,
          .64 + Math.sin(u * 7.4 + 1.4) * .14,
          .44 + Math.sin(u * 4.6 + 2.8) * .22
        ];
        for (let row = 0; row * spacing < artHeight; row++) {
          const y = row * spacing;
          const v = y / artHeight;
          const spread = .065 + .085 * (1 - u);
          let density = 0;
          for (const ridge of ridges) {
            const distance = (v - ridge) / spread;
            density += Math.exp(-distance * distance * .5) * .55;
          }
          density *= 1 - smooth(.73, 1.02, u);
          density *= smooth(-.04, .055, v) * (1 - smooth(.82, 1, v));
          const seed = hash(col, row);
          if (seed > density * .82) continue;
          candidates.push({
            x: x + (hash(col, row, 1) - .5) * 1.5,
            y: y + artHeight * .08 + (hash(col, row, 2) - .5) * 1.5,
            u, seed, density: clamp(density, 0, 1),
            size: 1.4 + hash(col, row, 3) * 1.7,
            color: seed < .085 ? 2 : seed < .34 ? 0 : seed < .77 ? 1 : 3,
            dx: 0, dy: 0, vx: 0, vy: 0,
            rank: hash(col, row, 4)
          });
        }
      }
      // A stable selection bounds work on large/high-DPR screens.
      const limit = compact ? 650 : 2200;
      particles = candidates.length > limit
        ? candidates.sort((a, b) => a.rank - b.rank).slice(0, limit)
        : candidates;
      needsLayout = false;
    }

    function readColors() {
      const style = getComputedStyle(root);
      const token = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
      const ink = token('--ink-2', '#4d565f');
      // Use the surrounding page's palette in both light and dark themes.
      colors = [
        token('--teal', '#0e5f63'),
        ink,
        token('--gold', '#96690f'),
        token('--ink-3', ink)
      ];
      needsColors = false;
    }

    function requestFrame() {
      if (!failed && !frame && onScreen && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function cancelFrame() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
    function wake(input = true) {
      if (input) lastInput = performance.now();
      dirty = true;
      requestFrame();
    }
    function layout() {
      needsLayout = true;
      wake(false);
    }
    function resetPointer() {
      pointer.active = false;
      for (const p of particles) p.dx = p.dy = p.vx = p.vy = 0;
    }

    function draw(time, animate) {
      const delta = lastPaint ? Math.min((time - lastPaint) / 1000, .09) : 0;
      if (animate) phase += delta;
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(140, width * .17);
      const radiusSquared = radius * radius;
      for (const p of particles) {
        const drift = Math.sin(phase * .23 + p.u * 7.6 + p.seed * 2.4) * artHeight * .025;
        const fold = Math.sin(phase * .12 - p.u * 11.3) * artHeight * .012;
        const x = p.x + Math.sin(phase * .14 + p.seed * 6.3) * 1.8;
        const y = p.y + drift + fold;
        let tx = 0, ty = 0;
        if (animate && pointer.active && fine.matches) {
          const px = x + p.dx - pointer.x;
          const py = y + p.dy - pointer.y;
          const distanceSquared = px * px + py * py;
          if (distanceSquared < radiusSquared) {
            const distance = Math.max(1, Math.sqrt(distanceSquared));
            const pressure = Math.pow(1 - distance / radius, 2) * 35;
            tx = (px || Math.cos(p.seed * 6.3)) / distance * pressure;
            ty = (py || Math.sin(p.seed * 6.3)) / distance * pressure;
          }
        }
        if (animate) {
          p.vx = (p.vx + (tx - p.dx) * .09) * .76;
          p.vy = (p.vy + (ty - p.dy) * .09) * .76;
          p.dx += p.vx;
          p.dy += p.vy;
          if (!tx && !ty && Math.abs(p.dx) + Math.abs(p.dy) + Math.abs(p.vx) + Math.abs(p.vy) < .02) {
            p.dx = p.dy = p.vx = p.vy = 0;
          }
        }
        const twinkle = .90 + .10 * Math.sin(phase * .34 + p.seed * 24);
        const fade = 1 - smooth(.70, 1, p.u);
        ctx.globalAlpha = (.22 + p.seed * .42 + p.density * .16) * fade * twinkle;
        ctx.fillStyle = colors[p.color];
        ctx.fillRect(Math.round(x + p.dx), Math.round(y + p.dy), p.size, p.size);
      }
      ctx.globalAlpha = 1;
      host.classList.add('has-closing-field');
    }

    function tick(time) {
      frame = 0;
      if (!onScreen || document.hidden) return;
      const animate = moving(time);
      const interval = 1000 / (compact ? 18 : 24);
      if ((dirty || animate) && (!lastPaint || time - lastPaint >= interval)) {
        try {
          if (needsLayout) measure();
          if (needsColors) readColors();
          draw(time, animate);
        } catch {
          failed = true;
          host.classList.remove('has-closing-field');
          return;
        }
        lastPaint = time;
        dirty = false;
      }
      if (dirty || moving(time)) requestFrame();
    }

    function syncMotion() {
      cancelFrame();
      if (paused() || document.hidden || !fine.matches) resetPointer();
      if (!document.hidden) wake(false);
    }
    const watch = (query, callback) => {
      if (query.addEventListener) query.addEventListener('change', callback);
      else query.addListener?.(callback);
    };
    host.addEventListener('pointermove', event => {
      if (!onScreen || !fine.matches || paused() || event.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      wake();
    }, {passive: true});
    const leave = () => { pointer.active = false; wake(); };
    host.addEventListener('pointerleave', leave, {passive: true});
    host.addEventListener('pointercancel', leave, {passive: true});
    window.addEventListener('resize', layout, {passive: true});
    window.addEventListener('scroll', () => {
      if (!('IntersectionObserver' in window)) {
        const rect = host.getBoundingClientRect();
        onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!onScreen) cancelFrame();
      }
      if (onScreen) wake();
    }, {passive: true});
    document.addEventListener('qt-motionchange', syncMotion);
    document.addEventListener('qt-themechange', () => {
      needsColors = true;
      wake(false);
    });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) lastInput = performance.now();
      syncMotion();
    });
    watch(reduced, syncMotion);
    watch(fine, syncMotion);
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(host);
    document.fonts?.ready?.then(layout).catch(() => {});
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) wake();
        else { pointer.active = false; cancelFrame(); }
      }, {threshold: .01}).observe(host);
    } else {
      const rect = host.getBoundingClientRect();
      onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      wake();
    }
  }
  const start = () => { try { init(); } catch { /* Links remain useful without decoration. */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
