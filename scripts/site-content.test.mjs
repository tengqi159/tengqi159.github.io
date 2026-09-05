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
