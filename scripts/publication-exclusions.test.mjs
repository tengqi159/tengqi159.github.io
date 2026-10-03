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

test('a known preprint title alias updates that record rather than its journal twin', async () => {
  const title='Layer-wise CNN with smaller filters', alias='Efficient CNN with smaller filters';
  const data={profile:{metrics:[]},publications:[
    {title,link:'https://doi.org/10.1234/journal',type:'Journal article',citations:166,verified:true,metadataVerified:true},
    {title,scholarTitleAliases:[alias],link:'https://arxiv.org/abs/2005.03948',type:'Preprint',citations:16,verified:true,metadataVerified:true}
  ]};
  const html=['1025','1009','11','11','11','11'].map(value=>`<td class="gsc_rsb_std">${value}</td>`).join('')+scholarRow(alias,'17');
  let saved;
  const context=loadScript({
    readFileSync(){return `window.siteData = ${JSON.stringify(data)};`;},
    writeFileSync(file,code){saved=code;},
    async fetch(url){
      if(String(url).startsWith('https://scholar.google.com/'))return {ok:true,text:async()=>html};
      throw new Error('Optional OpenAlex enrichment is unavailable');
    }
  });
  await context.main();
  const refreshed=context.parseSiteData(saved);
  assert.equal(refreshed.publications.length,2);
  assert.equal(refreshed.publications.find(p=>p.type==='Preprint').citations,17);
  assert.equal(refreshed.publications.find(p=>p.type==='Preprint').title,title);
  assert.equal(refreshed.publications.find(p=>p.type==='Journal article').citations,166);
});
