import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../assets/site.js", import.meta.url), "utf8");

function element(id = "") {
  const classes = new Set();
  const attributes = new Map();
  return {
    id, hidden: false, children: [], style: { setProperty() {} },
    classList: {
      add(value) { classes.add(value); },
      remove(value) { classes.delete(value); },
      contains(value) { return classes.has(value); },
      toggle(value, active) { active ? classes.add(value) : classes.delete(value); }
    },
    setAttribute(name, value) { attributes.set(name, value); },
    getAttribute(name) { return attributes.get(name) ?? null; },
    removeAttribute(name) { attributes.delete(name); },
    replaceChildren(...children) { this.children = children; }
  };
}

function fixture({ publications = [], news = [], hash = "", observerFailure } = {}) {
  const sections = [element("news"), element("publications")];
  const links = sections.map(section => {
    const link = element(); link.setAttribute("href", `#${section.id}`); return link;
  });
  const targets = [element("hero"), element("profile")];
  const history = element("history"), timeline = element("news-timeline");
  timeline.closest = selector => selector === ".news-history" ? history : null;
  const byId = new Map([...sections, timeline].map(node => [node.id, node]));
  const observers = [], listeners = new Map(), frames = [];
  let nextFrame = 0;
  class Observer {
    constructor(callback, options) {
      if (observerFailure === "constructor") throw new Error("Observer unavailable");
      this.callback = callback; this.options = options; this.observed = [];
      observers.push(this);
    }
    observe(target) {
      if (observerFailure === "observe" && this.observed.length) throw new Error("Observation failed");
      this.observed.push(target);
    }
    unobserve(target) { this.observed = this.observed.filter(node => node !== target); }
    disconnect() { this.disconnected = true; this.observed = []; }
  }
  const window = {
    siteData: { publications, news }, innerHeight: 720, innerWidth: 1280,
    location: { hash },
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(callback);
    },
    requestAnimationFrame(callback) { frames.push(callback); return ++nextFrame; }
  };
  if (observerFailure !== "missing") window.IntersectionObserver = Observer;
  const document = {
    documentElement: { clientHeight: 720 }, addEventListener() {},
    getElementById(id) { return byId.get(id) ?? null; },
    querySelector(selector) { return selector === '[data-nav="news"]' ? links[0] : null; },
    querySelectorAll(selector) { return selector === "[data-nav]" ? links : selector === "[data-reveal]" ? targets : []; },
    createElement() { return element(); }
  };
  const context = { window, document, IntersectionObserver: Observer };
  vm.createContext(context); vm.runInContext(source, context);
  return {
    context, window, sections, links, targets, history, timeline, observers,
    dispatch(name) { for (const callback of listeners.get(name) || []) callback(); },
    flushFrames() { for (const callback of frames.splice(0)) callback(); }
  };
}

test("accepted papers remain visible when their earlier-news history is empty", () => {
  const f = fixture({ publications: [{ status: "accepted" }] });
  f.sections[0].hidden = true; f.links[0].hidden = true;
  f.timeline.children = [element("stale-news")];
  f.context.renderNews();
  assert.equal(f.sections[0].hidden, false);
  assert.equal(f.links[0].hidden, false);
  assert.equal(f.history.hidden, true);
  assert.equal(f.timeline.children.length, 0);
});

test("a genuinely empty News section hides and reappears when an update is added", () => {
  const f = fixture(); f.context.renderNews();
  assert.equal(f.sections[0].hidden, true);
  assert.equal(f.links[0].hidden, true);
  f.window.siteData.news.push({ date: "2026-10-03", type: "paper", text: "Published paper" });
  f.context.renderNews();
  assert.equal(f.sections[0].hidden, false);
  assert.equal(f.links[0].hidden, false);
  assert.equal(f.history.hidden, false);
  assert.equal(f.timeline.children.length, 1);
});

test("navigation honors the initial hash even without IntersectionObserver", () => {
  const f = fixture({ hash: "#publications", observerFailure: "missing" });
  f.context.setupActiveNav();
  assert.equal(f.links[1].getAttribute("aria-current"), "true");
  f.window.location.hash = "#news"; f.dispatch("hashchange");
  assert.equal(f.links[0].getAttribute("aria-current"), "true");
  assert.equal(f.links[1].getAttribute("aria-current"), null);
});

test("the navigation observation band stays nonempty and refreshes after resize", () => {
  const f = fixture({ hash: "#news" }); f.context.setupActiveNav();
  const first = f.observers[0];
  const usableHeight = observer => {
    const margins = observer.options.rootMargin.split(" ");
    assert.ok(margins.every(value => value.endsWith("px")), "No width-relative percentages");
    return f.window.innerHeight + parseFloat(margins[0]) + parseFloat(margins[2]);
  };
  assert.ok(usableHeight(first) > 0);
  f.window.innerHeight = 1000;
  f.dispatch("resize"); f.dispatch("resize"); f.flushFrames();
  assert.equal(f.observers.length, 2, "One observer rebuild per animation frame");
  assert.equal(first.disconnected, true);
  const second = f.observers[1];
  assert.notEqual(second.options.rootMargin, first.options.rootMargin);
  assert.ok(usableHeight(second) > 0);
  assert.equal(second.observed.length, f.sections.length);
  second.callback([{ isIntersecting: true, target: f.sections[1] }]);
  assert.equal(f.links[1].getAttribute("aria-current"), "true");
  assert.equal(f.links[0].getAttribute("aria-current"), null);
});

test("reveal enhancement is armed only after observation succeeds", () => {
  const f = fixture(); f.context.setupRevealObserver();
  assert.ok(f.targets.every(target => target.classList.contains("is-reveal-ready")));
  f.observers[0].callback([{ isIntersecting: true, target: f.targets[0] }]);
  assert.equal(f.targets[0].classList.contains("is-visible"), true);
  assert.equal(f.observers[0].observed.includes(f.targets[0]), false);
});

for (const failure of ["missing", "constructor", "observe"]) {
  test(`reveal content remains visible when the observer is ${failure}`, () => {
    const f = fixture({ observerFailure: failure });
    assert.doesNotThrow(() => f.context.setupRevealObserver());
    assert.ok(f.targets.every(target => target.classList.contains("is-visible")));
    assert.ok(f.targets.every(target => !target.classList.contains("is-reveal-ready")));
    if (failure === "observe") assert.equal(f.observers[0].disconnected, true);
  });
}
