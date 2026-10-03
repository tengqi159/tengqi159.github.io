import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context={URL,window:{siteData:{publications:[]}},document:{addEventListener(){}}};
vm.createContext(context);
vm.runInContext(readFileSync(new URL('../assets/site.js',import.meta.url),'utf8'),context);
const merge=context.mergePublicationMetadata;
test('partial metadata preserves every paper, zero citations and curated selections',()=>{
  const source=[{title:'A',link:'https://doi.org/10.1/A',citations:0,selected:true},{title:'B',link:'https://doi.org/10.1/B',citations:27,selected:false,verified:true}];
  const result=merge(source,[{title:'A',doi:'https://doi.org/10.1/a',venue:'Journal',citations:900,details:'Vol. 2'}]);
  assert.equal(result.length,2);assert.equal(result[0].citations,0);assert.equal(result[0].selected,true);
  assert.equal(result[1].verified,true);assert.equal(result[0].venue,'Journal');assert.equal(source[0].venue,undefined);
});
test('preprint and journal twins only receive metadata from their own DOI',()=>{
  const source=[{title:'Same title',link:'https://doi.org/10.1/journal'},{title:'Same title',link:'https://doi.org/10.1/preprint'}];
  const result=merge(source,[{title:'Same title',doi:'https://doi.org/10.1/journal',venue:'Journal'}]);
  assert.equal(result[0].venue,'Journal');assert.equal(result[1].venue,undefined);
});
test('ambiguous title-only matching cannot replace saved metadata',()=>{
  const result=merge([{title:'Same title',venue:'Saved'}],[{title:'Same title',venue:'A'},{title:'Same title',venue:'B'}]);
  assert.equal(result[0].venue,'Saved');
});
test('bibliographic lines do not repeat Scholar volume/pages/year',()=>{
  const pub={venue:'Applied Soft Computing 111, 107728, 2021',details:'Applied Soft Computing 111, 107728, 2021 · Vol. 111, 107728-107728 · 2021',year:2021};
  assert.equal(context.venueLine(pub),pub.venue);
  assert.equal(context.venueLine({venue:'Journal',details:'Vol. 4, 1–9'}),'Journal · Vol. 4, 1–9');
});

test('BibTeX prefers verified Triple and JBHI issue metadata over abbreviated online-year strings',()=>{
  const records = [
    {
      title: 'Triple cross-domain attention on human activity recognition using wearable sensors',
      authors: 'Y Tang, L Zhang, Q Teng, F Min, A Song', type: 'Journal article',
      venue: 'IEEE Transactions on Emerging Topics in Computational Intelligence 6 (5 …, 2022', year: 2021,
      bibliography: {journal:'IEEE Transactions on Emerging Topics in Computational Intelligence',volume:'6',number:'5',pages:'1167–1176',year:2022,doi:'10.1109/TETCI.2021.3136642'}
    },
    {
      title: 'Innovative dual-decoupling CNN with layer-wise temporal-spatial attention for sensor-based human activity recognition',
      authors: 'Q Teng, W Li, G Hu, Y Shu, Y Liu', type: 'Journal article',
      venue: 'IEEE Journal of Biomedical and Health Informatics 29 (2), 1035–1048, 2025', year: 2024,
      bibliography: {journal:'IEEE Journal of Biomedical and Health Informatics',volume:'29',number:'2',pages:'1035-1048',year:2025,doi:'10.1109/JBHI.2024.3488528'}
    }
  ];
  for (const pub of records) {
    const bib = context.bibtexFor(pub), b = pub.bibliography;
    assert.ok(bib.includes(`journal={${b.journal}}`));
    assert.ok(bib.includes(`volume={${b.volume}}`));
    assert.ok(bib.includes(`number={${b.number}}`));
    assert.ok(bib.includes(`year={${b.year}}`));
    assert.ok(bib.includes(`doi={${b.doi}}`));
    assert.ok(bib.includes(`pages={${b.pages.replace(/[–-]/g,'--')}}`));
    assert.ok(bib.startsWith(`@article{${pub.authors.split(',')[0].split(' ').pop().toLowerCase()}${b.year}`));
    assert.doesNotMatch(bib,/journal=\{[^}]*\d/);
  }
});

test('AIP article numbers retain leading zeros as eid rather than invented page ranges',()=>{
  for (const [volume,number,eid,year,doi] of [['9','8','085311',2019,'10.1063/1.5100558'],['10','6','065227',2020,'10.1063/5.0015600']]) {
    const bib = context.bibtexFor({title:'Data driven governing equations',authors:'Q Teng, J Wang',type:'Journal article',year,venue:`AIP Advances ${volume} (${number}), ${year}`,
      bibliography:{journal:'AIP Advances',volume,number,articleNumber:eid,year,doi}});
    assert.ok(bib.includes('journal={AIP Advances}'));
    assert.ok(bib.includes(`eid={${eid}}`));
    assert.ok(bib.includes(`doi={${doi}}`));
    assert.doesNotMatch(bib,/pages=/);
  }
});

test('saved Triple, JBHI and AIP records export their verified final issue fields',()=>{
  const dataContext={window:{}};vm.createContext(dataContext);
  vm.runInContext(readFileSync(new URL('../assets/site-data.js',import.meta.url),'utf8'),dataContext);
  const expected = [
    ['triple-attention','IEEE Transactions on Emerging Topics in Computational Intelligence','6','5','pages','1167--1176',2022],
    ['dual-decoupling-attention','IEEE Journal of Biomedical and Health Informatics','29','2','pages','1035--1048',2025],
    ['channel-selectivity','IEEE Journal of Biomedical and Health Informatics','25','10','pages','3834--3843',2021],
    ['multistep-cldnn','AIP Advances','9','8','eid','085311',2019],
    ['attention-multistep-dynamics','AIP Advances','10','6','eid','065227',2020]
  ];
  for (const [id,journal,volume,number,identifier,value,year] of expected) {
    const pub=dataContext.window.siteData.publications.find(p=>p.storyId===id);
    assert.equal(pub.metadataVerified,true,id);
    const bib=context.bibtexFor(pub);
    for (const field of [`journal={${journal}}`,`volume={${volume}}`,`number={${number}}`,`${identifier}={${value}}`,`year={${year}}`]) assert.ok(bib.includes(field),`${id}: ${field}`);
    assert.ok(bib.includes(`doi={${pub.bibliography.doi}}`),id);
  }
});

test('actual online-year differences appear after clean final issue information with only the journal italicized',()=>{
  const dataContext={window:{}};vm.createContext(dataContext);
  vm.runInContext(readFileSync(new URL('../assets/site-data.js',import.meta.url),'utf8'),dataContext);
  for (const [id,canonicalYear,onlineYear] of [['lego-cnn',2021,2020],['dual-decoupling-attention',2025,2024]]) {
    const pub=dataContext.window.siteData.publications.find(p=>p.storyId===id);
    assert.equal(context.venueLine(pub),`${pub.venue} · First online ${onlineYear}`);
    assert.ok(context.venueLine(pub).includes(String(canonicalYear)));
    assert.equal(context.venueLineHtml(pub),`<em>${pub.bibliography.journal}</em>${pub.venue.slice(pub.bibliography.journal.length)} · First online ${onlineYear}`);
  }
  const sameYear={venue:'AIP Advances 10 (6), 065227, 2020',year:2020,onlineYear:2020};
  assert.equal(context.venueLine(sameYear),sameYear.venue);
});

test('legacy unicode page dashes and truncated issues cannot leak volume/page text into journal names',()=>{
  const complete = context.bibtexFor({title:'Attention',authors:'Q Teng',type:'Journal article',year:2025,venue:'IEEE Journal of Biomedical and Health Informatics 29 (2), 1035–1048, 2025'});
  assert.ok(complete.includes('journal={IEEE Journal of Biomedical and Health Informatics}'));
  assert.ok(complete.includes('volume={29}'));
  assert.ok(complete.includes('number={2}'));
  assert.ok(complete.includes('pages={1035--1048}'));
  const truncated = context.bibtexFor({title:'Triple attention',authors:'Y Tang',type:'Journal article',year:2022,venue:'IEEE Transactions on Emerging Topics in Computational Intelligence 6 (5\u00a0…, 2022'});
  assert.ok(truncated.includes('journal={IEEE Transactions on Emerging Topics in Computational Intelligence}'));
  assert.ok(truncated.includes('volume={6}'));
  assert.doesNotMatch(truncated,/number=/,'An incomplete issue suffix must not be guessed.');
});

test('plain-text BibTeX fields escape TeX punctuation without corrupting canonical DOI identifiers',()=>{
  const bib = context.bibtexFor({title:'Temperature & humidity at 50%: Sensor_{A}',authors:'Q Teng',type:'Journal article',year:2024,
    bibliography:{journal:'Sensors & Systems',volume:'2',year:2024,doi:'10.1234/sensor_a'}});
  assert.ok(bib.includes(String.raw`title={Temperature \& humidity at 50\%: Sensor\_\{A\}}`));
  assert.ok(bib.includes(String.raw`journal={Sensors \& Systems}`));
  assert.ok(bib.includes('doi={10.1234/sensor_a}'));
});
test('metadata indexing does not imply publication of an accepted paper',()=>{
  const pub={title:'Accepted conference work',status:'accepted',venue:'NeurIPS 2026',details:'Proceedings forthcoming',citations:0};
  const result=merge([pub],[{title:pub.title,venue:'Unconfirmed source',details:'2026-12-01'}]);
  assert.equal(result[0].status,'accepted');assert.equal(result[0].details,'Proceedings forthcoming');assert.equal(result[0].venue,'NeurIPS 2026');
  const bib=context.bibtexFor({...pub,storyId:'example',year:2026,authors:'Q. Teng, X. Wang',link:'https://example.com/paper'});
  assert.match(bib,/^@unpublished/);assert.match(bib,/proceedings forthcoming/);
  assert.doesNotMatch(bib,/url=|https:\/\//);
});
test('accepted papers cannot expose outbound paper links even if metadata supplies a URL',()=>{
  context.window.paperExplainer={buttons:()=>'<button>Graphical abstract</button><button>Animated intro</button>'};
  const links=context.createPaperLinks({title:'Accepted paper',status:'accepted',link:'https://example.com/fulltext',linkLabel:'PDF',code:'https://github.com/example/accepted-paper',codeVerified:true},'');
  assert.match(links,/Graphical abstract/);assert.match(links,/Animated intro/);
  assert.doesNotMatch(links,/<a\b|href=|Scholar|Cite|PDF|Code/);
  delete context.window.paperExplainer;
});
test('only verified published-paper repositories create code links',()=>{
  const publication={title:'Paper & method',type:'Journal article',year:2024,code:'https://github.com/author/paper-method',codeVerified:true};
  const html=context.createPaperLinks(publication,'');
  assert.match(html,/href="https:\/\/github\.com\/author\/paper-method"/);
  assert.match(html,/aria-label="Code repository for Paper &amp; method"/);
  assert.doesNotMatch(context.createPaperLinks({...publication,codeVerified:false},''),/>Code</);
  assert.doesNotMatch(context.createPaperLinks({...publication,code:'javascript:alert(1)'},''),/>Code</);
});
test('withheld paper links still match each accepted work to its own visual story',()=>{
  const dataContext={window:{},document:{addEventListener(){}}};vm.createContext(dataContext);
  for(const file of ['site-data.js','paper-stories.js','paper-explainer.js'])
    vm.runInContext(readFileSync(new URL('../assets/'+file,import.meta.url),'utf8'),dataContext);
  for(const pub of dataContext.window.siteData.publications.filter(p=>p.status==='accepted')){
    assert.equal(pub.link,undefined);assert.equal(dataContext.window.paperExplainer.find(pub).id,pub.storyId);
    const story=dataContext.window.paperExplainer.find(pub);
    assert.equal(story.publicationStatus,'accepted');assert.equal(story.link,undefined);assert.equal(story.evidenceUrl,undefined);
  }
});
test('every archive record maps to a story with matching figure regions',()=>{
  const dataContext={window:{}};vm.createContext(dataContext);
  vm.runInContext(readFileSync(new URL('../assets/site-data.js',import.meta.url),'utf8'),dataContext);
  vm.runInContext(readFileSync(new URL('../assets/paper-stories.js',import.meta.url),'utf8'),dataContext);
  const stories=new Map(dataContext.window.paperStories.map(s=>[s.id,s]));
  for(const pub of dataContext.window.siteData.publications){
    assert.ok(stories.has(pub.storyId),pub.title);
    const story=stories.get(pub.storyId);
    if(story.figure) { assert.ok(story.steps.length>=2 && story.steps.length<=6); assert.equal(story.steps.length,(story.walkthroughFigure||story.figure).regions.length); }
    else assert.equal(story.steps.length,0);
  }
});
test('owner authorship exclusions override restored snapshots and external indexing',()=>{
  const title='Frailty-Focused Movement Monitoring: A Single-Camera System Using Joint Angles for Assessing Chair-Based Exercise Quality';
  context.window.siteData.excludedPublications=[{title,doi:'10.3390/s25133907'}];
  const wrong={title,link:'https://doi.org/10.3390/s25133907',verified:true};
  const renamed={title:'Renamed by an external index',link:'https://doi.org/10.3390/S25133907?source=index',verified:true};
  const kept={title:'DanHAR',link:'https://doi.org/10.1016/j.asoc.2021.107728',citations:244};
  const result=merge([wrong,renamed,kept],[{title,doi:wrong.link,venue:'Sensors'}]);
  assert.equal(result.length,1);assert.equal(result[0].title,kept.title);assert.equal(result[0].citations,244);
  delete context.window.siteData.excludedPublications;
});
test('incorrectly attributed work is absent from the archive, news and graphical stories',()=>{
  const dataContext={window:{}};vm.createContext(dataContext);
  for(const file of ['site-data.js','paper-stories.js'])
    vm.runInContext(readFileSync(new URL('../assets/'+file,import.meta.url),'utf8'),dataContext);
  const {siteData,paperStories}=dataContext.window;
  assert.ok(siteData.excludedPublications.some(p=>p.doi==='10.3390/s25133907'));
  assert.ok(siteData.excludedPublications.some(p=>p.doi==='10.3390/healthcare12191926'));
  assert.ok(!siteData.publications.some(p=>p.storyId==='frailty-movement-monitoring'));
  assert.ok(!siteData.publications.some(p=>p.storyId==='chair-system-design'));
  assert.ok(!siteData.news.some(p=>p.link==='https://doi.org/10.3390/s25133907'));
  assert.ok(!paperStories.some(p=>p.id==='frailty-movement-monitoring'));
  assert.ok(!paperStories.some(p=>p.id==='chair-system-design'));
});
