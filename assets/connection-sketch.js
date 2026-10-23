/* Original Canvas2D sketch; the email choices keep their native behaviour. */
(() => {
  'use strict';
  function init() {
    const host = document.getElementById('connection-sketch');
    const canvas = document.getElementById('connection-sketch-field');
    const section = document.getElementById('collaboration');
    if (!host || !section || !canvas?.getContext) return;
    const context = canvas.getContext('2d', {alpha: true});
    if (!context) return;
    const root = document.documentElement;
    const reduced = typeof matchMedia === 'function'
      ? matchMedia('(prefers-reduced-motion: reduce)') : {matches: false};
    const topics = ['wearable', 'efficient', 'graphs'];
    let selected = new Set();
    let width = 360, height = 160, colors = {};
    let frame = 0, lastPaint = 0, lastInput = performance.now(), phase = 0;
    let onScreen = false, dirty = true, needsLayout = true, needsColors = true, failed = false;
    const paused = () => reduced.matches || root.dataset.motionPaused === 'true';
    const moving = time => onScreen && !document.hidden && !paused() && time - lastInput < 20000;

    function readColors() {
      const style = getComputedStyle(root);
      const token = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
      colors = {
        teal: token('--teal', '#0e5f63'),
        gold: token('--gold', '#96690f'),
        ink: token('--ink-3', '#878e96'),
        paper: token('--paper', '#f4f1e9')
      };
      needsColors = false;
    }
    function measure() {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      needsLayout = false;
    }
    const point = (curve, t) => {
      const s = 1 - t;
      return {
        x: s * s * s * curve[0] + 3 * s * s * t * curve[2] + 3 * s * t * t * curve[4] + t * t * t * curve[6],
        y: s * s * s * curve[1] + 3 * s * s * t * curve[3] + 3 * s * t * t * curve[5] + t * t * t * curve[7]
      };
    };
    function circle(x, y, radius, color, alpha = 1) {
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    function draw(time, animate) {
      if (animate && lastPaint) phase += Math.min((time - lastPaint) / 1000, .09);
      context.clearRect(0, 0, width, height);
      const sourceX = width * .30 + 12.5;
      const targetX = width * .78;
      const targetY = height * .48;
      topics.forEach((topic, index) => {
        const active = !selected.size || selected.has(topic);
        const sourceY = height * [.17, .48, .79][index];
        const curve = [sourceX, sourceY,
          sourceX + (targetX - sourceX) * .43, sourceY,
          targetX - (targetX - sourceX) * .38, targetY,
          targetX, targetY];
        context.globalAlpha = active ? .45 : .14;
        context.strokeStyle = active ? colors.teal : colors.ink;
        context.lineWidth = active && selected.size ? 1.35 : 1;
        context.beginPath();
        context.moveTo(curve[0], curve[1]);
        context.bezierCurveTo(...curve.slice(2));
        context.stroke();
        circle(sourceX, sourceY, active ? 2.6 : 2, active ? colors.teal : colors.ink, active ? .78 : .35);
        if (active && !paused()) {
          // Slow, staggered arrivals feel like ideas finding a common thread.
          const progress = ((phase / 5.5) + index * .31) % 1;
          const fade = Math.sin(progress * Math.PI);
          const current = point(curve, progress);
          const trail = point(curve, Math.max(0, progress - .045));
          circle(trail.x, trail.y, 1.4, colors.teal, fade * .3);
          circle(current.x, current.y, 2.3, index === 1 ? colors.gold : colors.teal, fade * .88);
        }
      });
      // Quiet concentric marks identify the meeting point without a UI badge.
      context.globalAlpha = .20;
      context.strokeStyle = colors.teal;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(targetX, targetY, 12, 0, Math.PI * 2);
      context.stroke();
      circle(targetX, targetY, 6, colors.paper);
      context.globalAlpha = .8;
      context.strokeStyle = colors.teal;
      context.beginPath();
      context.arc(targetX, targetY, 6, 0, Math.PI * 2);
      context.stroke();
      circle(targetX, targetY, 2, colors.gold, .9);
      context.globalAlpha = 1;
      host.classList.add('has-connection-sketch');
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
    function tick(time) {
      frame = 0;
      if (!onScreen || document.hidden) return;
      const animate = moving(time);
      if ((dirty || animate) && (!lastPaint || time - lastPaint >= 1000 / 24)) {
        try {
          if (needsLayout) measure();
          if (needsColors) readColors();
          draw(time, animate);
        } catch {
          failed = true;
          host.classList.remove('has-connection-sketch');
          return;
        }
        lastPaint = time;
        dirty = false;
      }
      if (dirty || moving(time)) requestFrame();
    }
    function syncSelection() {
      selected = new Set([...section.querySelectorAll('input[name="collaboration-topic"]:checked')]
        .map(input => input.value).filter(topic => topics.includes(topic)));
      host.querySelectorAll('[data-connection-topic]').forEach(label => {
        label.classList.toggle('is-selected', selected.has(label.dataset.connectionTopic));
        label.classList.toggle('is-muted', selected.size > 0 && !selected.has(label.dataset.connectionTopic));
      });
      wake();
    }
    function syncMotion() {
      cancelFrame();
      if (!document.hidden) wake(false);
    }
    const layout = () => { needsLayout = true; wake(false); };
    section.addEventListener('change', event => {
      if (event.target.matches('input[name="collaboration-topic"]')) syncSelection();
    });
    section.addEventListener('focusin', () => wake());
    host.addEventListener('pointerenter', () => wake(), {passive: true});
    document.addEventListener('qt-motionchange', syncMotion);
    document.addEventListener('qt-themechange', () => { needsColors = true; wake(false); });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) lastInput = performance.now();
      syncMotion();
    });
    if (reduced.addEventListener) reduced.addEventListener('change', syncMotion);
    else reduced.addListener?.(syncMotion);
    window.addEventListener('resize', layout, {passive: true});
    window.addEventListener('scroll', () => {
      if (!('IntersectionObserver' in window)) {
        const rect = host.getBoundingClientRect();
        onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!onScreen) cancelFrame();
      }
      if (onScreen) wake();
    }, {passive: true});
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(host);
    document.fonts?.ready?.then(layout).catch(() => {});
    syncSelection();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) wake();
        else cancelFrame();
      }, {threshold: .01}).observe(host);
    } else {
      const rect = host.getBoundingClientRect();
      onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      wake();
    }
  }
  const start = () => { try { init(); } catch { /* The four labels remain readable. */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
