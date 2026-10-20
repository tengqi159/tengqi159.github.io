import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

// Run the actual atlas script through its DOM controls, without a browser or API.
// This process is isolated by node:test; fixing TZ makes date-label checks portable.
process.env.TZ = 'UTC';
const source = readFileSync(new URL('../assets/atlas-crowd.js', import.meta.url), 'utf8');

function element(tagName = 'div', id = '') {
  const attributes = new Map(), listeners = new Map(), classes = new Set();
  let ownText = '';
  return {
    tagName: tagName.toUpperCase(), id, children: [], hidden: false,
    value: '', dataset: {}, style: {}, disabled: false, offsetWidth: 260, offsetHeight: 110,
    get textContent() { return ownText + this.children.map(child => child.textContent ?? '').join(''); },
    set textContent(value) { ownText = String(value); this.children = []; },
    get options() { return this.children; },
    classList: {
      add(...values) { values.forEach(value => classes.add(value)); },
      remove(...values) { values.forEach(value => classes.delete(value)); },
      contains(value) { return classes.has(value); }
    },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    getAttribute(name) { return attributes.get(name) ?? null; },
    removeAttribute(name) { attributes.delete(name); },
    append(...children) { this.children.push(...children); },
    replaceChildren(...children) {
      ownText = ''; this.children = children;
      if (this.tagName === 'SELECT' && !children.some(child => child.value === this.value)) {
        this.value = children[0]?.value ?? '';
      }
    },
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(callback);
    },
    dispatch(name, event = {}) { return Promise.all((listeners.get(name) ?? []).map(callback => callback(event))); },
    getBoundingClientRect() { return { left: 0, top: 0, width: 1000, height: 500 }; },
    scrollIntoView() {}, getContext() { return null; }
  };
}

function point(city, visits, last_seen) {
  return { city, country: 'Test country', lat: 30, lon: 100, visits, visitors: 1, last_seen };
}

function payload(points) {
  return { ok: true, points, totals: { visitors: points.length, visits: 200, places: points.length, countries: 1 }, updatedAt: '2099-01-01T00:00:00.000Z' };
}

const places = [
  point('Older high-count city', 101, '2026-01-01T12:00:00.000Z'),
  point('Newest low-count city', 2, '2026-10-20T18:00:00.000Z'),
  point('Alpha city', 6, '2026-10-19T05:00:00.000Z'),
  point('Beta city', 6, '2026-10-19T05:00:00.000Z'),
  point('Missing timestamp', 30, undefined),
  point('Invalid timestamp', 40, 'not-a-date'),
  point('Epoch visit', 1, '1970-01-01T00:00:00.000Z')
];

async function fixture(initial = places, { cached = false, offline = false, protocol='https:', bundled } = {}) {
  const nodes = new Map();
  const get = id => {
    if (!nodes.has(id)) nodes.set(id, element(id.endsWith('-select') ? 'select' : 'div', id));
    return nodes.get(id);
  };
  get('atlas-place-select').value = '-1';
  get('atlas-order-select').value = 'recent';
  get('visitor-map-canvas').querySelector = selector => selector === '.atlas-plot' ? get('plot') : null;
  const flatten = node => [node, ...node.children.flatMap(flatten)];
  const document = {
    readyState: 'complete', documentElement: element(),
    getElementById: get, createElement: tag => element(tag),
    querySelectorAll: selector => selector === '.atlas-place-button'
      ? flatten(get('crowd-top')).filter(node => node.className === 'atlas-place-button') : [],
    addEventListener() {}, dispatchEvent() {}
  };
  const storage = new Map();
  if (cached) storage.set('qt-atlas-map-v2:https://atlas.test', JSON.stringify({ at: Date.now(), data: payload(initial) }));
  let current = payload(initial);
  const calls=[];
  const window = { QT_ATLAS_ENDPOINT: 'https://atlas.test', location:{protocol}, QT_ATLAS_SNAPSHOT:bundled, addEventListener() {} };
  const context = {
    window, document, AbortController, setTimeout, clearTimeout,
    matchMedia: () => ({ matches: true }),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    fetch: async url => {
      calls.push(url);
      if (offline) throw new Error('Test network offline');
      return { ok: true, json: async () => url.endsWith('/visits') ? structuredClone(current) : { ok: true, location: null } };
    }
  };
  vm.createContext(context); vm.runInContext(source, context);
  for (let attempt = 0; attempt < 10; attempt++) {
    await new Promise(setImmediate);
    if (!get('atlas-refresh').disabled && get('atlas-shell').dataset.state !== 'loading') break;
  }
  assert.notEqual(get('atlas-shell').dataset.state, 'loading', 'Actual atlas initialization completed');
  return {
    get, context, calls, storage,
    options: () => get('atlas-place-select').children.filter(option => option.value !== '-1'),
    async order(value) { get('atlas-order-select').value = value; await get('atlas-order-select').dispatch('change'); },
    async select(index) { get('atlas-place-select').value = String(index); await get('atlas-place-select').dispatch('change'); },
    async refresh(next) { current = payload(next); await window.QtAtlasCrowd.refresh(); },
    popularButtons: () => document.querySelectorAll('.atlas-place-button')
  };
}

test('the default dropdown follows latest recorded visits and leaves unknown times last', async () => {
  const f = await fixture();
  const indices = f.options().map(option => Number(option.value));
  assert.deepEqual(indices.slice(0, 5), [1, 2, 3, 0, 6]);
  assert.deepEqual(new Set(indices.slice(5)), new Set([4, 5]));
  assert.match(f.popularButtons()[0].getAttribute('aria-label'), /^Older high-count city,/,
    'Sorting the dropdown must not reorder the map data or Most connected buttons');
});

test('Most visits ranks counts first, recent visits second, and labels deterministically on ties', async () => {
  const tied = [
    point('Beta', 5, '2026-10-19T01:00:00Z'),
    point('Newest', 5, '2026-10-20T01:00:00Z'),
    point('Alpha', 5, '2026-10-19T01:00:00Z'),
    point('High count', 6, '2020-01-01T00:00:00Z'),
    point('No time', 5, null)
  ];
  const f = await fixture(tied); await f.order('visits');
  assert.deepEqual(f.options().map(option => Number(option.value)), [3, 1, 2, 0, 4]);
});

test('dropdown labels show visit dates and a time zone without inventing missing times', async () => {
  const f = await fixture([...places, point('Numeric timestamp', 3, 0)]);
  const options = new Map(f.options().map(option => [option.value, option.textContent]));
  assert.match(options.get('1'), /20 Oct 2026,? 18:00 \(UTC\+00:00\)/);
  assert.match(options.get('1'), /2 visits/);
  assert.match(options.get('6'), /01 Jan 1970,? 00:00 \(UTC\+00:00\)/, 'A genuine epoch timestamp is a valid visit');
  for (const index of ['4', '5', '7']) {
    assert.match(options.get(index), /Time unavailable/);
    assert.doesNotMatch(options.get(index), /2099|1970/, 'Neither map refresh time nor an epoch fallback is a visit time');
  }
});

test('switching order preserves the selected map point and its original option identity', async () => {
  const f = await fixture(); await f.select(1);
  const tooltip = f.get('atlas-tooltip');
  assert.match(tooltip.children[0].textContent, /^Newest low-count city,/);
  assert.equal(tooltip.hidden, false);
  await f.order('visits');
  assert.equal(f.options().findIndex(option => option.value === '1'), 5, 'The selected option actually moves in the sorted list');
  assert.equal(f.get('atlas-place-select').value, '1');
  assert.match(tooltip.children[0].textContent, /^Newest low-count city,/);
  assert.equal(tooltip.hidden, false);
  await f.popularButtons()[0].dispatch('click');
  assert.equal(f.get('atlas-place-select').value, '0');
  assert.match(tooltip.children[0].textContent, /^Older high-count city,/);
});

test('a data refresh retains the chosen order and sorts the replacement snapshot', async () => {
  const f = await fixture(); await f.order('visits');
  await f.refresh([
    point('Recent but fewer', 2, '2026-10-20T08:00:00Z'),
    point('Most visits', 15, '2026-10-18T08:00:00Z')
  ]);
  assert.equal(f.get('atlas-order-select').value, 'visits');
  assert.deepEqual(f.options().map(option => option.value), ['1', '0']);
  assert.equal(f.get('atlas-shell').dataset.state, 'ready');
});

test('a saved map keeps real last_seen ordering when the network is unavailable', async () => {
  const f = await fixture(places, { cached: true, offline: true });
  assert.equal(f.get('atlas-shell').dataset.state, 'cached');
  assert.deepEqual(f.options().slice(0, 4).map(option => Number(option.value)), [1, 2, 3, 0]);
  assert.match(f.options()[0].textContent, /20 Oct 2026/);
  assert.doesNotMatch(f.options()[0].textContent, /2099/);
});

test('an empty snapshot hides the place controls without creating a fake visitor', async () => {
  const f = await fixture([]);
  assert.equal(f.get('atlas-all-places').hidden, true);
  assert.equal(f.get('atlas-places-row').hidden, true);
  assert.equal(f.options().length, 0);
  assert.equal(f.get('atlas-tooltip').hidden, true);
  assert.equal(f.get('atlas-shell').dataset.state, 'ready');
});

test('a direct file preview shows dated public records without making blocked API requests', async () => {
  const bundled={capturedAt:'2026-10-20T03:00:00.000Z',data:payload(places)};
  const f=await fixture([], {protocol:'file:',bundled});
  assert.equal(f.calls.length,0,'File origins must not send location or visit requests');
  assert.equal(f.get('atlas-shell').dataset.state,'cached');
  assert.match(f.get('atlas-map-status').textContent,/Saved visitor map · 20 Oct 2026/);
  assert.equal(f.get('atlas-visitors').textContent,String(places.length));
  assert.equal(f.get('atlas-visits').textContent,'200');
  assert.deepEqual(f.options().slice(0,4).map(option=>Number(option.value)),[1,2,3,0]);
  assert.equal(f.get('visitor-place').textContent,'Local file preview');
  assert.equal(f.get('atlas-local-preview').hidden,false);
  assert.equal(f.get('atlas-refresh').hidden,true);
  assert.equal(f.get('atlas-retry').hidden,true);
  assert.equal(f.storage.size,0,'Bundled history is not a fresh localStorage response');
  await f.refresh([]);
  assert.equal(f.calls.length,0);
});

test('an offline first load retains the bundled history with a snapshot label', async () => {
  const bundled={capturedAt:'2026-10-20T03:00:00.000Z',data:payload(places)};
  const f=await fixture([], {offline:true,bundled});
  assert.equal(f.get('atlas-shell').dataset.state,'cached');
  assert.match(f.get('atlas-map-status').textContent,/Saved visitor map/);
  assert.doesNotMatch(f.get('atlas-map-status').textContent,/synced|live/i);
  assert.match(f.options()[0].textContent,/20 Oct 2026/);
  assert.equal(f.storage.size,0,'An unsuccessful live fetch must never refresh the fallback age');
});

test('a successful live response replaces the bundled history and is the only cached payload', async () => {
  const older=[point('Bundled old city',999,'2026-09-01T03:00:00Z')];
  const f=await fixture(places,{bundled:{capturedAt:'2026-09-01T04:00:00Z',data:payload(older)}});
  assert.equal(f.get('atlas-shell').dataset.state,'ready');
  assert.match(f.get('atlas-map-status').textContent,/synced/);
  assert.equal(f.options().length,places.length);
  assert.ok(f.options().every(option=>!option.textContent.includes('Bundled old city')));
  const cache=JSON.parse(f.storage.get('qt-atlas-map-v2:https://atlas.test'));
  assert.equal(cache.data.points.length,places.length);
  assert.equal(cache.data.points[0].city,places[0].city);
});

test('a file preview without a valid snapshot explains the connection requirement without inventing zeros', async () => {
  const f=await fixture([], {protocol:'file:',bundled:{capturedAt:'not-a-date',data:payload(places)}});
  assert.equal(f.calls.length,0);
  assert.equal(f.get('atlas-shell').dataset.state,'error');
  assert.equal(f.get('atlas-map-status').textContent,'Connected preview needed');
  assert.equal(f.get('atlas-visitors').textContent,'');
  assert.equal(f.options().length,0);
});
