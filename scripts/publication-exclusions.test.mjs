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

test('the removed CSFO correction stays excluded while the original article remains',()=>{
  const c={window:{}};vm.createContext(c);
  for(const file of ['site-data.js','paper-stories.js']) vm.runInContext(readFileSync(new URL('../assets/'+file,import.meta.url),'utf8'),c);
  const {siteData,paperStories}=c.window;
  assert.ok(!siteData.publications.some(p=>p.storyId==='csfo-correction'));
  assert.ok(!paperStories.some(p=>p.id==='csfo-correction'));
  assert.ok(siteData.publications.some(p=>p.storyId==='csfo'));
  const excluded=loadScript().isExcludedPublication;
  assert.equal(excluded({doi:'10.1109/JSEN.2025.3610164'},siteData.excludedPublications),true);
  assert.equal(excluded({doi:'10.1109/JSEN.2025.3534413'},siteData.excludedPublications),false);
});

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

const scholarRow = (title, citations, venue = 'Sensors', year = '2026') => `<tr class="gsc_a_tr"><td><a class="gsc_a_at">${title}</a><div class="gs_gray">Q Teng</div><div class="gs_gray">${venue}</div></td><td><a class="gsc_a_ac gs_ibl">${citations}</a></td><td><span class="gsc_a_h gsc_a_hc gs_ibl">${year}</span></td></tr>`;

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
  assert.equal(refreshed.profile.citationSnapshot.capture, 'automatic');
  assert.equal(good.citationsUpdatedAt, refreshed.profile.updatedAt);
  assert.equal(refreshed.profile.citationSnapshot.since2021.citations, 80);
  assert.match(refreshed.profile.metrics[0].note, /Google Scholar · snapshot/);
  assert.equal(requests.filter(url => url.startsWith('https://scholar.google.com/')).length, 2);
});

test('a missing Scholar count is unavailable, while an explicit zero remains zero', () => {
  const { scholarCitationFields: fields } = loadScript();
  assert.equal(fields('', '2026-10-03').citations, null);
  assert.equal(fields('', '2026-10-03').citationsUpdatedAt, undefined);
  assert.equal(fields('0', '2026-10-03').citations, 0);
  assert.equal(fields('0', '2026-10-03').citationsUpdatedAt, '2026-10-03');
  assert.equal(fields('1,025', '2026-10-03').citations, 1025);
});

test('unreachable Scholar leaves an owner-provided snapshot and provenance untouched', async () => {
  const data={profile:{updatedAt:'2026-10-03',citationSnapshot:{capture:'owner-provided'},metrics:[{label:'Citations',value:'1025'}]},publications:[]};
  let wrote=false;
  const context=loadScript({
    readFileSync(){return `window.siteData = ${JSON.stringify(data)};`;},
    writeFileSync(){wrote=true;},
    async fetch(){throw new Error('Scholar is unavailable');}
  });
  await context.main();
  assert.equal(wrote,false);
});

const danharTitle = 'DanHAR: Dual attention network for multimodal human activity recognition using wearable sensors';
const legoTitle = 'Layer-wise training convolutional neural networks with smaller filters for human activity recognition using wearable sensors';
const legoAlias = 'Efficient convolutional neural networks with smaller filters for human activity recognition using wearable sensors';

function mergedVersions() {
  return [
    {
      title: danharTitle, link: 'https://doi.org/10.1016/j.asoc.2021.107728',
      venue: 'Applied Soft Computing', details: 'Vol. 111 · 2021', year: 2021,
      type: 'Journal article', citations: 254, citationsUpdatedAt: '2026-10-03',
      verified: true, metadataVerified: true, selected: true, storyId: 'danhar',
      preprints: [{
        title: danharTitle.toUpperCase(), link: 'https://arxiv.org/abs/2006.14435',
        doi: '10.48550/arxiv.2006.14435', citations: 11, citationsUpdatedAt: '2026-08-09'
      }]
    },
    {
      title: legoTitle, link: 'https://doi.org/10.1109/JSEN.2020.3015521',
      venue: 'IEEE Sensors Journal', details: '2020', year: 2020,
      type: 'Journal article', citations: 166, citationsUpdatedAt: '2026-10-03',
      verified: true, metadataVerified: true, selected: true, storyId: 'lego-cnn',
      preprints: [{
        title: legoTitle, scholarTitleAliases: [legoAlias],
        link: 'https://arxiv.org/abs/2005.03948', doi: '10.48550/arxiv.2005.03948',
        citations: 16, citationsUpdatedAt: '2026-10-03'
      }]
    }
  ];
}

async function refreshFixture(publications, rows, works = []) {
  const data = {
    profile: { metrics: [{ label: 'Citations', value: '1000' }, { label: 'h-index', value: '10' }] },
    publications
  };
  const html = ['1025', '1009', '11', '11', '11', '11']
    .map(value => `<td class="gsc_rsb_std">${value}</td>`).join('') + rows.join('');
  let saved;
  const context = loadScript({
    readFileSync() { return `window.siteData = ${JSON.stringify(data)};`; },
    writeFileSync(file, code) { saved = code; },
    async fetch(value) {
      const url = String(value);
      if (url.startsWith('https://scholar.google.com/')) return { ok: true, text: async () => html };
      if (url.startsWith('https://api.openalex.org/authors/')) return { ok: true, json: async () => ({ id: 'A_TEST' }) };
      if (url.startsWith('https://api.openalex.org/works?')) return { ok: true, json: async () => ({ results: works }) };
      throw new Error(`Unexpected mock request: ${url}`);
    }
  });
  await context.main();
  assert.ok(saved, 'Successful refresh must save a snapshot.');
  return JSON.parse(JSON.stringify(context.parseSiteData(saved)));
}

for (const preprintFirst of [true, false]) {
  test(`identical case-equivalent titles refresh both versions when ${preprintFirst ? 'arXiv' : 'journal'} is first`, async () => {
    const pair = [
      scholarRow(danharTitle.toUpperCase(), '12', 'arXiv (Cornell University)', '2020'),
      scholarRow(danharTitle, '255', 'Applied Soft Computing', '2021')
    ];
    if (!preprintFirst) pair.reverse();
    const publications = mergedVersions();
    if (!preprintFirst) delete publications[0].metadataVerified;
    const refreshed = await refreshFixture(publications, pair);
    const parent = refreshed.publications.find(p => p.storyId === 'danhar');
    assert.equal(refreshed.publications.length, 2);
    assert.equal(parent.citations, 255);
    assert.equal(parent.preprints[0].citations, 12);
    assert.equal(parent.preprints[0].citationsUpdatedAt, refreshed.profile.updatedAt);
    assert.equal(parent.title, danharTitle);
    assert.equal(parent.venue, 'Applied Soft Computing');
    assert.equal(parent.year, 2021);
    assert.equal(parent.link, 'https://doi.org/10.1016/j.asoc.2021.107728');
    assert.equal(parent.preprints[0].link, 'https://arxiv.org/abs/2006.14435');
    assert.equal(parent.preprints[0].doi, '10.48550/arxiv.2006.14435');
    assert.ok(!refreshed.publications.some(p => p.type === 'Preprint'));
    // The profile count is fetched once as a total, never recomputed by adding
    // the journal and preprint snapshots (which can overlap in Scholar).
    assert.equal(refreshed.profile.metrics[0].value, '1025');
    assert.equal(refreshed.profile.citationSnapshot.since2021.citations, 1009);
  });
}

test('a distinct known nested alias refreshes only preprint citations without requiring a venue marker', async () => {
  const before = mergedVersions();
  const refreshed = await refreshFixture(before, [scholarRow(legoAlias, '17', '')]);
  const parent = refreshed.publications.find(p => p.storyId === 'lego-cnn');
  const expected = JSON.parse(JSON.stringify(before[1]));
  expected.preprints[0].citations = 17;
  expected.preprints[0].citationsUpdatedAt = refreshed.profile.updatedAt;
  assert.deepEqual(parent, expected);
  assert.equal(refreshed.publications.length, 2);
});

test('a distinct explicitly known nested title also identifies the preprint without a venue marker', async () => {
  const before = mergedVersions();
  before[1].preprints[0].title = legoAlias;
  delete before[1].preprints[0].scholarTitleAliases;
  const refreshed = await refreshFixture(before, [scholarRow(legoAlias, '17', '')]);
  const parent = refreshed.publications.find(p => p.storyId === 'lego-cnn');
  assert.equal(parent.citations, 166);
  assert.equal(parent.preprints[0].citations, 17);
  assert.equal(parent.preprints[0].title, legoAlias);
  assert.equal(refreshed.publications.length, 2);
});

test('same-title preprint-only refresh preserves the entire journal snapshot and canonical nested metadata', async () => {
  const before = mergedVersions();
  const refreshed = await refreshFixture(before, [scholarRow(danharTitle, '13', 'arXiv preprint arXiv:2006.14435', '2020')]);
  const parent = refreshed.publications.find(p => p.storyId === 'danhar');
  const expected = JSON.parse(JSON.stringify(before[0]));
  expected.preprints[0].citations = 13;
  expected.preprints[0].citationsUpdatedAt = refreshed.profile.updatedAt;
  assert.deepEqual(parent, expected);
  assert.equal(refreshed.publications.length, 2);
});

test('both DanHAR and LegoCNN nested versions retain separate counts when all Scholar rows are returned', async () => {
  const before = mergedVersions();
  // Exercise both a curated journal and the ordinary rebuilding path.
  delete before[1].metadataVerified;
  const refreshed = await refreshFixture(before, [
    scholarRow(legoAlias, '18', 'arXiv preprint arXiv:2005.03948', '2020'),
    scholarRow(danharTitle, '256', 'Applied Soft Computing', '2021'),
    scholarRow(legoTitle, '167', 'IEEE Sensors Journal', '2020'),
    scholarRow(danharTitle.toUpperCase(), '14', 'arXiv (Cornell University)', '2020')
  ]);
  const danhar = refreshed.publications.find(p => p.storyId === 'danhar');
  const lego = refreshed.publications.find(p => p.storyId === 'lego-cnn');
  assert.equal(refreshed.publications.length, 2);
  assert.equal(danhar.citations, 256);
  assert.equal(danhar.preprints[0].citations, 14);
  assert.equal(lego.citations, 167);
  assert.equal(lego.preprints[0].citations, 18);
  assert.equal(lego.preprints[0].doi, before[1].preprints[0].doi);
  assert.deepEqual(lego.preprints[0].scholarTitleAliases, [legoAlias]);
  assert.equal(lego.link, before[1].link);
  assert.equal(lego.selected, true);
  assert.equal(lego.verified, true);
  assert.equal(refreshed.profile.metrics[0].value, '1025');
});

test('the saved DanHAR and LegoCNN arXiv versions occur only inside their canonical journal records', () => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(readFileSync(new URL('../assets/site-data.js', import.meta.url), 'utf8'), context);
  const publications = context.window.siteData.publications;
  for (const [id, doi, arxivId] of [
    ['danhar', '10.1016/j.asoc.2021.107728', '2006.14435'],
    ['lego-cnn', '10.1109/JSEN.2020.3015521', '2005.03948']
  ]) {
    const parents = publications.filter(p => p.storyId === id);
    assert.equal(parents.length, 1);
    assert.equal(parents[0].type, 'Journal article');
    assert.equal(parents[0].link, `https://doi.org/${doi}`);
    assert.equal(parents[0].preprints.length, 1);
    assert.equal(parents[0].preprints[0].link, `https://arxiv.org/abs/${arxivId}`);
    assert.equal(parents[0].preprints[0].doi, `10.48550/arxiv.${arxivId}`);
    assert.ok(!publications.some(p => String(p.link).includes(arxivId)));
  }
});

test('a same-title row without preprint evidence updates only the journal record', async () => {
  const refreshed = await refreshFixture(mergedVersions(), [scholarRow(danharTitle, '257', '')]);
  const parent = refreshed.publications.find(p => p.storyId === 'danhar');
  assert.equal(parent.citations, 257);
  assert.equal(parent.preprints[0].citations, 11);
  assert.equal(parent.preprints[0].citationsUpdatedAt, '2026-08-09');
});

test('a stale standalone record for an explicitly nested version is not emitted again', async () => {
  const publications = mergedVersions();
  publications.push({
    ...publications[0].preprints[0], type: 'Preprint', venue: 'arXiv', verified: true
  });
  const refreshed = await refreshFixture(publications, [scholarRow(danharTitle, '15', 'arXiv')]);
  assert.equal(refreshed.publications.length, 2);
  assert.equal(refreshed.publications.find(p => p.storyId === 'danhar').preprints[0].citations, 15);
  assert.ok(!refreshed.publications.some(p => p.type === 'Preprint'));
});

test('unknown preprints and similar titles remain independent publications', async () => {
  const publications = mergedVersions();
  const title = `${legoTitle}: A different approach`;
  publications.push({
    title, link: 'https://arxiv.org/abs/2601.01234', type: 'Preprint',
    citations: 2, verified: true, metadataVerified: true
  });
  const refreshed = await refreshFixture(publications, [
    scholarRow(title, '3', 'arXiv preprint arXiv:2601.01234'),
    scholarRow('An unrelated uncurated preprint', '4', 'arXiv')
  ]);
  assert.equal(refreshed.publications.length, 4);
  assert.equal(refreshed.publications.find(p => p.title === title).citations, 3);
  assert.equal(refreshed.publications.find(p => p.title === title).link, 'https://arxiv.org/abs/2601.01234');
  assert.equal(refreshed.publications.find(p => p.title === 'An unrelated uncurated preprint').type, 'Preprint');
  assert.equal(refreshed.publications.find(p => p.storyId === 'lego-cnn').preprints[0].citations, 16);
});

for (const preprintFirst of [true, false]) {
  test(`unknown same-title journal and preprint stay independent in ${preprintFirst ? 'preprint-first' : 'journal-first'} order`, async () => {
    const title = 'An unrelated same-title study';
    const publications = [
      { title, link: 'https://doi.org/10.1234/unrelated', type: 'Journal article', citations: 8, verified: true, metadataVerified: true },
      { title, link: 'https://arxiv.org/abs/2601.99999', type: 'Preprint', citations: 2, verified: true, metadataVerified: true }
    ];
    const rows = [scholarRow(title, '3', 'arXiv'), scholarRow(title, '9', 'Sensors')];
    if (!preprintFirst) rows.reverse();
    const refreshed = await refreshFixture(publications, rows);
    assert.equal(refreshed.publications.length, 2);
    assert.equal(refreshed.publications.find(p => p.type === 'Preprint').citations, 3);
    assert.equal(refreshed.publications.find(p => p.type === 'Journal article').citations, 9);
  });
}
