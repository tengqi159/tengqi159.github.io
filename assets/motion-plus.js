/* ============================================================
   Motion layer, second pass (motion-plus)
   ------------------------------------------------------------
   1. Chapter headings rise word by word out of a clipped line.
   2. Section kickers decode like a signal acquiring lock.
   3. The outlined chapter numerals wipe in and drift (parallax).
   4. The venue band loops two counter-moving rails.
   5. A soft teal aura follows a fine pointer across the paper.

   Same ground rules as fx.js: content is visible without JS,
   nothing runs offscreen or on a hidden tab, and reduced motion
   or the page-wide Pause control settles every effect at rest.
   ============================================================ */
(() => {
  'use strict';

  function init() {
    const root = document.documentElement;
    const media = query => typeof matchMedia === 'function' ? matchMedia(query) : {matches: false};
    const reduced = media('(prefers-reduced-motion: reduce)');
    const fine = media('(hover: hover) and (pointer: fine)');
    const allowed = () => !reduced.matches && root.dataset.motionPaused !== 'true' && !document.hidden;
    const watch = (query, callback) => {
      if (query.addEventListener) query.addEventListener('change', callback);
      else query.addListener?.(callback);
    };
    const hasIO = 'IntersectionObserver' in window;
    const startedAllowed = allowed();
    root.classList.add('has-motion-plus');

    /* ---------- 1. word-rise headings ---------- */

    const headingTargets = [
      ...document.querySelectorAll('.section-head h2, .links-finale-copy h3')
    ];
    const heads = new Set();

    function splitWords(element) {
      let index = 0;
      (function walk(node) {
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName.toLowerCase() !== 'svg') walk(child);
            return;
          }
          if (child.nodeType !== Node.TEXT_NODE || !child.nodeValue.trim()) return;
          const fragment = document.createDocumentFragment();
          child.nodeValue.split(/(\s+)/).forEach(piece => {
            if (!piece) return;
            if (/^\s+$/.test(piece)) {
              fragment.appendChild(document.createTextNode(piece));
              return;
            }
            const outer = document.createElement('span');
            outer.className = 'mp-w';
            const inner = document.createElement('span');
            inner.className = 'mp-wi';
            inner.style.setProperty('--i', String(index++));
            inner.textContent = piece;
            outer.appendChild(inner);
            fragment.appendChild(outer);
          });
          child.parentNode.replaceChild(fragment, child);
        });
      })(element);
    }

    /* ---------- 2. kicker decode ---------- */

    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_';
    const scrambles = new Map();

    function prepareKicker(kicker) {
      const textNode = Array.from(kicker.childNodes)
        .find(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
      if (!textNode) return null;
      const text = textNode.nodeValue.trim();
      const visible = document.createElement('span');
      visible.className = 'mp-scramble';
      visible.setAttribute('aria-hidden', 'true');
      visible.textContent = text;
      const spoken = document.createElement('span');
      spoken.className = 'mp-sr';
      spoken.textContent = text;
      kicker.replaceChild(spoken, textNode);
      kicker.insertBefore(visible, spoken);
      return {visible, text};
    }

    function runScramble(entry) {
      if (!entry || entry.frame) return;
      const {visible, text} = entry;
      const started = performance.now();
      const duration = 260 + text.length * 55;
      const step = now => {
        const t = Math.min(1, (now - started) / duration);
        if (!allowed() || t >= 1) {
          visible.textContent = text;
          entry.frame = 0;
          return;
        }
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const lockAt = (i + 1) / text.length * .85;
          out += text[i] === ' ' || t >= lockAt
            ? text[i]
            : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        visible.textContent = out;
        entry.frame = requestAnimationFrame(step);
      };
      entry.frame = requestAnimationFrame(step);
    }

    function revealHead(head) {
      if (head.classList.contains('mp-in')) return;
      head.classList.add('mp-in');
      const kicker = head.querySelector('.section-kicker');
      if (kicker && allowed()) runScramble(scrambles.get(kicker));
      const section = head.closest('.section');
      if (section) section.classList.add('mp-section-in');
    }

    if (startedAllowed && hasIO) {
      root.classList.add('mp-echo-armed');
      headingTargets.forEach(heading => {
        splitWords(heading);
        const head = heading.closest('.section-head') || heading;
        head.classList.add('mp-armed');
        heads.add(head);
      });
      document.querySelectorAll('.section-head .section-kicker').forEach(kicker => {
        const entry = prepareKicker(kicker);
        if (entry) scrambles.set(kicker, entry);
      });
      const headObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          headObserver.unobserve(entry.target);
          revealHead(entry.target);
        });
      }, {threshold: .35, rootMargin: '0px 0px -8% 0px'});
      heads.forEach(head => headObserver.observe(head));
    }

    function settleHeads() {
      heads.forEach(head => {
        head.classList.add('mp-in', 'mp-settled');
        head.closest('.section')?.classList.add('mp-section-in');
      });
      scrambles.forEach(entry => {
        if (entry.frame) cancelAnimationFrame(entry.frame);
        entry.frame = 0;
        entry.visible.textContent = entry.text;
      });
    }

    /* ---------- 3. chapter numeral parallax ---------- */

    const echoes = [...document.querySelectorAll('.chapter-echo')]
      .map(echo => ({echo, section: echo.closest('.section'), visible: false}));
    let echoFrame = 0;

    function paintEchoes() {
      echoFrame = 0;
      if (!allowed()) return;
      const viewport = window.innerHeight || 1;
      echoes.forEach(item => {
        if (!item.visible || !item.section) return;
        const rect = item.section.getBoundingClientRect();
        const progress = (rect.top + Math.min(rect.height, viewport) / 2 - viewport / 2) / viewport;
        const shift = Math.max(-1.2, Math.min(1.2, progress)) * -70;
        item.echo.style.translate = `0 ${shift.toFixed(1)}px`;
      });
    }
    const queueEchoes = () => {
      if (!echoFrame) echoFrame = requestAnimationFrame(paintEchoes);
    };
    if (hasIO && echoes.length) {
      const echoObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const item = echoes.find(candidate => candidate.section === entry.target);
          if (item) item.visible = entry.isIntersecting;
        });
        queueEchoes();
      });
      echoes.forEach(item => item.section && echoObserver.observe(item.section));
      window.addEventListener('scroll', queueEchoes, {passive: true});
      window.addEventListener('resize', queueEchoes, {passive: true});
    }
    function resetEchoes() {
      echoes.forEach(item => { item.echo.style.translate = ''; });
    }

    /* ---------- 4. venue band ---------- */

    const band = document.querySelector('.venue-band');
    if (band) {
      band.querySelectorAll('.venue-rail').forEach(rail => {
        const list = rail.querySelector('.venue-list');
        if (!list || rail.children.length > 1) return;
        const clone = list.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('aria-label');
        rail.appendChild(clone);
      });
      band.classList.add('is-ready');
      if (hasIO) {
        new IntersectionObserver(entries => {
          band.classList.toggle('is-offscreen', !entries[entries.length - 1].isIntersecting);
        }).observe(band);
      }
    }

    // Small accents only run while their own content is in view.
    const ambientTargets = document.querySelectorAll('.hero, .hero-hello, .hero-latest, .news-paper');
    if (hasIO) {
      const ambientObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.target.classList.toggle('mp-ambient-visible', entry.isIntersecting));
      });
      ambientTargets.forEach(element => ambientObserver.observe(element));
    }

    /* ---------- 5. pointer aura ---------- */

    const aura = document.createElement('div');
    aura.className = 'mp-aura';
    aura.setAttribute('aria-hidden', 'true');
    document.body.appendChild(aura);
    const auraState = {x: innerWidth / 2, y: innerHeight / 3, tx: innerWidth / 2, ty: innerHeight / 3, frame: 0};

    function auraStep() {
      auraState.frame = 0;
      auraState.x += (auraState.tx - auraState.x) * .14;
      auraState.y += (auraState.ty - auraState.y) * .14;
      aura.style.transform = `translate3d(${auraState.x.toFixed(1)}px, ${auraState.y.toFixed(1)}px, 0)`;
      if (Math.abs(auraState.tx - auraState.x) + Math.abs(auraState.ty - auraState.y) > .5) {
        auraState.frame = requestAnimationFrame(auraStep);
      }
    }
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || !fine.matches || !allowed()) return;
      auraState.tx = event.clientX;
      auraState.ty = event.clientY;
      aura.classList.add('is-on');
      if (!auraState.frame) auraState.frame = requestAnimationFrame(auraStep);
    }, {passive: true});
    document.documentElement.addEventListener('pointerleave', () => aura.classList.remove('is-on'));

    /* ---------- live preferences ---------- */

    function sync() {
      const on = allowed();
      root.classList.toggle('mp-suspended', !on);
      if (!on) {
        settleHeads();
        resetEchoes();
        aura.classList.remove('is-on');
        if (auraState.frame) cancelAnimationFrame(auraState.frame);
        auraState.frame = 0;
      } else {
        queueEchoes();
      }
    }
    document.addEventListener('qt-motionchange', sync);
    document.addEventListener('visibilitychange', sync);
    watch(reduced, sync);
    watch(fine, sync);
    sync();
  }

  const start = () => { try { init(); } catch { /* Decoration only; the page stays complete. */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
