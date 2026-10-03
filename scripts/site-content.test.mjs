import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context={window:{siteData:{publications:[]}},document:{addEventListener(){}}};
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
  const links=context.createPaperLinks({title:'Accepted paper',status:'accepted',link:'https://example.com/fulltext',linkLabel:'PDF'},'');
  assert.match(links,/Graphical abstract/);assert.match(links,/Animated intro/);
  assert.doesNotMatch(links,/<a\b|href=|Scholar|Cite|PDF/);
  delete context.window.paperExplainer;
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
test('every archive record maps to a story and verified figures have three matching steps',()=>{
  const dataContext={window:{}};vm.createContext(dataContext);
  vm.runInContext(readFileSync(new URL('../assets/site-data.js',import.meta.url),'utf8'),dataContext);
  vm.runInContext(readFileSync(new URL('../assets/paper-stories.js',import.meta.url),'utf8'),dataContext);
  const stories=new Map(dataContext.window.paperStories.map(s=>[s.id,s]));
  for(const pub of dataContext.window.siteData.publications){
    assert.ok(stories.has(pub.storyId),pub.title);
    const story=stories.get(pub.storyId);
    if(story.figure) assert.equal(story.steps.length,3);
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
