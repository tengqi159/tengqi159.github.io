import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const scriptUrl = new URL('./refresh-data.mjs', import.meta.url);
const scriptSource = readFileSync(scriptUrl, 'utf8')
  .replace(/^#![^\n]*\n/, '')
  .replace(/^import .*;\n/gm, '')
  .replaceAll('import.meta.url', JSON.stringify('file:///fixture/scripts/refresh-data.mjs'))
  .replace(/\nmain\(\)\.catch\(\(error\) => \{[\s\S]*?\n\}\);\s*$/, '\n');
assert.doesNotMatch(scriptSource, /main\(\)\.catch/, 'Tests must not auto-run main or issue network requests.');

function loadScript(overrides = {}) {
  const context = {
    URL, AbortSignal, vm,
    console: { log() {}, error() {} },
    process: { exit() { throw new Error('Unexpected process.exit'); } },
    fetch() { throw new Error('Network is unavailable in this test'); },
    readFileSync() { throw new Error('Unexpected filesystem read'); },
    writeFileSync() { throw new Error('Unexpected filesystem write'); },
    ...overrides
  };
  vm.createContext(context);
  vm.runInContext(scriptSource, context, { timeout: 5000 });
  return context;
}

const excludedTitle = 'Frailty-Focused Movement Monitoring: A Single-Camera System Using Joint Angles for Assessing Chair-Based Exercise Quality';
const excludedDoi = '10.3390/s25133907';
const secondTitle = 'Innovative Chair and System Designs to Enhance Resistance Training Outcomes for the Elderly';
const secondDoi = '10.3390/healthcare12191926';
const exclusions = [{ title: excludedTitle, doi: excludedDoi }, { title: secondTitle, doi: secondDoi }];

test('exclusion matches the complete normalized title without truncating it', () => {
  const { isExcludedPublication: excluded } = loadScript();
  assert.equal(excluded({ title: excludedTitle.toUpperCase().replaceAll('-', ' ') }, exclusions), true);
  const sharedPrefix = 'A'.repeat(90);
  assert.equal(excluded({ title: `${sharedPrefix} different paper` }, [{ title: `${sharedPrefix} rejected paper` }]), false);
  assert.equal(excluded({ title: 'A completely different article' }, exclusions), false);
});

test('DOI exclusion accepts bare DOI and resolver links independently of title', () => {
  const { isExcludedPublication: excluded } = loadScript();
  for (const doi of [excludedDoi, `DOI: ${excludedDoi.toUpperCase()}`, `https://doi.org/${excludedDoi}`, `http://dx.doi.org/${excludedDoi.toUpperCase()}?source=example`]) {
    assert.equal(excluded({ title: 'An alternate article title', doi }, exclusions), true);
    assert.equal(excluded({ link: doi }, exclusions), true);
  }
  assert.equal(excluded({ doi: '10.3390/s251339070' }, exclusions), false);
  assert.equal(excluded({ link: 'https://example.org/article' }, [{ link: 'https://example.org/article' }]), false);
});

test('missing titles, links, exclusions and publications never match empty keys', () => {
  const { isExcludedPublication: excluded } = loadScript();
  assert.equal(excluded(undefined, exclusions), false);
  assert.equal(excluded({}, [{}]), false);
  assert.equal(excluded({ title: excludedTitle }), false);
  assert.equal(excluded({ title: excludedTitle }, null), false);
});

const scholarRow = (title, citations) => `<tr class="gsc_a_tr"><td><a class="gsc_a_at">${title}</a><div class="gs_gray">Q Teng</div><div class="gs_gray">Sensors</div></td><td><a class="gsc_a_ac gs_ibl">${citations}</a></td><td><span class="gsc_a_h gsc_a_hc gs_ibl">2026</span></td></tr>`;

test('mock refresh cannot resurrect excluded Scholar papers or verified records', async () => {
  const goodTitle = 'A useful sensor study';
  const normalTitle = 'Another useful paper';
  const acceptedTitle = 'An accepted unpublished paper';
  const data = {
    profile: { updatedAt: '2026-08-09', metrics: [{ label: 'Citations', value: '90' }, { label: 'h-index', value: '9' }, { label: 'i10-index', value: '10' }] },
    excludedPublications: exclusions,
    publications: [
      { title: excludedTitle, link: `https://doi.org/${excludedDoi}`, citations: 999, verified: true, storyId: 'wrong-author' },
      { title: 'A renamed wrong-author paper', link: `https://doi.org/${excludedDoi}`, verified: true },
      { title: secondTitle, link: `https://doi.org/${secondDoi}`, verified: true },
      { title: goodTitle, link: 'https://doi.org/10.1234/good', verified: true, metadataVerified: true, storyId: 'good-story', selected: true, citations: 4 },
      { title: normalTitle, link: 'https://doi.org/10.1234/normal', verified: true, storyId: 'normal-story', citations: 1 },
      { title: acceptedTitle, status: 'accepted', storyId: 'mirage', verified: true, citations: 0, year: 2026 },
      { title: 'Another accepted unpublished paper', status: 'accepted', storyId: 'psdnet', verified: true, citations: 0, year: 2026 }
    ]
  };
  const html = ['100', '80', '10', '9', '11', '10'].map(value => `<td class="gsc_rsb_std">${value}</td>`).join('') +
    scholarRow(excludedTitle, '999') + scholarRow('A renamed wrong-author paper', '7') + scholarRow(secondTitle, '9') +
    scholarRow(goodTitle, '12') + scholarRow(normalTitle, '3') + scholarRow(acceptedTitle, '2');
  const requests = [];
  let savedCode;
  const context = loadScript({
    readFileSync(file) { assert.equal(file.pathname, '/fixture/assets/site-data.js'); return `window.siteData = ${JSON.stringify(data)};\n`; },
    writeFileSync(file, code) { assert.equal(file.pathname, '/fixture/assets/site-data.js'); savedCode = code; },
    async fetch(value) {
      const url = String(value); requests.push(url);
      if (url.startsWith('https://scholar.google.com/citations?')) return { ok: true, text: async () => html };
      if (url.startsWith('https://api.openalex.org/authors/')) return { ok: true, json: async () => ({ id: 'https://openalex.org/A_TEST' }) };
      if (url.startsWith('https://api.openalex.org/works?')) return { ok: true, json: async () => ({ results: [] }) };
      throw new Error(`Unexpected mock request: ${url}`);
    }
  });
  await context.main();
  assert.ok(savedCode, 'The mocked successful refresh should write a snapshot.');
  const refreshed = context.parseSiteData(savedCode);
  assert.equal(refreshed.publications.length, 4);
  assert.equal(refreshed.publications.some(pub => context.isExcludedPublication(pub, exclusions)), false);
  const good = refreshed.publications.find(pub => pub.title === goodTitle);
  assert.equal(good.citations, 12);
  assert.equal(good.verified, true);
  assert.equal(good.metadataVerified, true);
  assert.equal(good.storyId, 'good-story');
  assert.equal(good.selected, true);
  const normal = refreshed.publications.find(pub => pub.title === normalTitle);
  assert.equal(normal.citations, 3);
  assert.equal(normal.verified, true);
  assert.equal(normal.storyId, 'normal-story');
  for (const id of ['mirage', 'psdnet']) {
    const accepted = refreshed.publications.find(pub => pub.storyId === id);
    assert.equal(accepted.status, 'accepted');
    assert.equal(accepted.verified, true);
    assert.equal(accepted.citations, 0);
    assert.equal(Object.hasOwn(accepted, 'link'), false);
  }
  assert.equal(refreshed.excludedPublications[0].doi, excludedDoi);
  assert.equal(refreshed.profile.metrics[0].value, '100');
  assert.equal(requests.filter(url => url.startsWith('https://scholar.google.com/')).length, 2);
});
