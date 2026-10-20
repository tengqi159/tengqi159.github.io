/* Progressive navigation decoration. No new destinations or animation loop. */
(() => {
  'use strict';
  function init() {
    const nav = document.querySelector('.site-nav');
    const links = Array.from(nav?.querySelectorAll('[data-nav]') || []);
    if (!nav || !links.length || !('MutationObserver' in window)) return;
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const marker = document.createElement('span');
    marker.className = 'nav-reading-marker';
    marker.setAttribute('aria-hidden', 'true');
    nav.appendChild(marker);
    let hovered = null;
    let previousCurrent = null;
    let frame = 0;
    let initialized = false;
    const motionAllowed = () => !reduced.matches && root.dataset.motionPaused !== 'true';
    const visible = link => link && !link.hidden && link.getBoundingClientRect().width > 0;
    const current = () => links.find(link => link.getAttribute('aria-current') === 'true') || null;
    // A pointer click also leaves DOM focus on an anchor. Only keyboard-visible
    // focus should override the reading chapter after the visitor scrolls on.
    const focused = () => links.find(link => link.matches(':focus-visible')) || null;

    function revealCurrent(link) {
      if (!visible(link) || nav.scrollWidth <= nav.clientWidth + 1) return;
      const area = nav.getBoundingClientRect();
      const item = link.getBoundingClientRect();
      const inset = 5;
      let delta = 0;
      if (item.left < area.left + inset) delta = item.left - area.left - inset;
      else if (item.right > area.right - inset) delta = item.right - area.right + inset;
      if (Math.abs(delta) > 1) {
        nav.scrollTo({
          left: Math.max(0, Math.min(nav.scrollWidth - nav.clientWidth, nav.scrollLeft + delta)),
          behavior: initialized && motionAllowed() ? 'smooth' : 'auto'
        });
      }
    }
    function update() {
      frame = 0;
      const active = current();
      // Only reveal when the reading chapter changes; free swiping stays free.
      if (active !== previousCurrent) {
        revealCurrent(active);
        previousCurrent = active;
      }
      const remaining = nav.scrollWidth - nav.clientWidth - nav.scrollLeft;
      nav.style.setProperty('--nav-edge-left', nav.scrollLeft > 1 ? '12px' : '0px');
      nav.style.setProperty('--nav-edge-right', remaining > 1 ? '12px' : '0px');
      const target = (fine.matches && visible(hovered) ? hovered : null) || focused() || active;
      if (!visible(target)) {
        marker.style.opacity = '0';
        return;
      }
      const area = nav.getBoundingClientRect();
      const item = target.getBoundingClientRect();
      marker.style.width = `${item.width}px`;
      marker.style.height = `${item.height}px`;
      marker.style.transform = `translate3d(${item.left-area.left+nav.scrollLeft}px, ${item.top-area.top+nav.scrollTop}px, 0)`;
      marker.style.opacity = '1';
      nav.classList.add('has-nav-marker');
      initialized = true;
    }
    function queue() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    links.forEach(link => {
      link.addEventListener('pointerenter', () => { hovered = link; queue(); });
      link.addEventListener('pointerleave', () => { if (hovered === link) hovered = null; queue(); });
    });
    nav.addEventListener('pointerleave', () => { hovered = null; queue(); });
    nav.addEventListener('focusin', () => { hovered = null; queue(); });
    nav.addEventListener('focusout', queue);
    nav.addEventListener('scroll', queue, {passive: true});
    window.addEventListener('scroll', () => { hovered = null; queue(); }, {passive: true});
    window.addEventListener('resize', queue, {passive: true});
    window.addEventListener('pageshow', queue);
    window.addEventListener('hashchange', queue);
    document.addEventListener('qt-motionchange', queue);
    const watch = media => {
      if (media.addEventListener) media.addEventListener('change', queue);
      else media.addListener?.(queue);
    };
    watch(reduced);
    watch(fine);
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(queue);
      links.forEach(link => observer.observe(link, {attributes: true, attributeFilter: ['aria-current', 'hidden']}));
    }
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(queue);
      observer.observe(nav);
      links.forEach(link => observer.observe(link));
    }
    document.fonts?.ready?.then(queue).catch(() => {});
    queue();
  }
  const start = () => {
    try { init(); } catch { /* Native anchors and active backgrounds remain usable. */ }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
