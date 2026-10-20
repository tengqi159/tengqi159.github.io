/* One-time, viewport-local entrances. Content is visible even if motion fails. */
(() => {
  'use strict';
  function init() {
    if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const selector = '.metric, .profile-columns > *, .news-paper, .selected-card, .collaboration-workbench, .link-row';
    const observed = new WeakSet();
    const entered = new WeakSet();
    const running = new Map();
    const disabled = () => reduced.matches || root.dataset.motionPaused === 'true' || document.hidden;

    function settle(element) {
      const animation = running.get(element);
      if (animation) {
        running.delete(element);
        animation.cancel();
      }
    }
    function settleAll() {
      for (const element of running.keys()) settle(element);
    }
    const observer = new IntersectionObserver(entries => {
      let order = 0;
      entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top ||
          a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach(({target}) => {
          observer.unobserve(target);
          if (entered.has(target)) return;
          entered.add(target);
          if (disabled() || target.contains(document.activeElement)) return;
          try {
            // Individual translate composes with the existing hover transforms.
            const animation = target.animate([
              {opacity: .32, translate: '0 14px'},
              {opacity: 1, translate: '0 0'}
            ], {
              duration: 560, delay: Math.min(order++ * 65, 195),
              easing: 'cubic-bezier(.22,.9,.28,1)', fill: 'backwards'
            });
            running.set(target, animation);
            const finish = () => {
              if (running.get(target) === animation) running.delete(target);
            };
            animation.finished.then(finish, finish);
          } catch { /* The visible resting state is always the fallback. */ }
        });
    }, {threshold: .05, rootMargin: '0px 0px -16px 0px'});

    function scan() {
      document.querySelectorAll(selector).forEach(element => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
      // Live citation refreshes can replace cards during their entrance.
      for (const element of running.keys()) {
        if (!element.isConnected) settle(element);
      }
    }
    scan();
    root.classList.add('has-page-rhythm');
    document.addEventListener('focusin', event => {
      const element = event.target.closest?.(selector);
      if (!element) return;
      entered.add(element);
      observer.unobserve(element);
      settle(element);
    });
    document.addEventListener('qt-motionchange', () => {
      if (disabled()) settleAll();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) settleAll();
    });
    if (reduced.addEventListener) reduced.addEventListener('change', () => {
      if (reduced.matches) settleAll();
    });
    if ('MutationObserver' in window) {
      const changes = new MutationObserver(scan);
      ['metrics-grid', 'news-papers', 'selected-publications'].forEach(id => {
        const host = document.getElementById(id);
        if (host) changes.observe(host, {childList: true});
      });
    }
  }
  const start = () => { try { init(); } catch { /* Optional decoration. */ } };
  if (document.readyState === 'complete') start();
  else document.addEventListener('DOMContentLoaded', start, {once: true});
})();
