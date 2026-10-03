import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const c={URL,window:{},document:{addEventListener(){}}};vm.createContext(c);
for(const file of ['site-data.js','site.js'])vm.runInContext(readFileSync(new URL('../assets/'+file,import.meta.url),'utf8'),c);
const data=c.window.siteData;

test('verified journal and arXiv pairs occupy one archive entry each',()=>{
  assert.equal(data.publications.length,15);
  assert.equal(new Set(data.publications.map(p=>p.storyId)).size,15);
  assert.equal(data.publications.filter(p=>p.type==='Preprint').length,0);
  for(const [id,arxiv,count] of [['danhar','2006.14435',254],['lego-cnn','2005.03948',166]]){
    const [pub]=data.publications.filter(p=>p.storyId===id);
    assert.equal(pub.type,'Journal article');
    assert.equal(pub.citations,count);
    assert.equal(pub.preprints.length,1);
    assert.equal(pub.preprints[0].link,'https://arxiv.org/abs/'+arxiv);
    const links=c.createPaperLinks(pub,'');
    assert.match(links,/doi\.org/);
    assert.match(links,new RegExp('arxiv\\.org/abs/'+arxiv.replace('.','\\.')));
    assert.match(links,/arXiv preprint for/);
    assert.match(c.bibtexFor(pub),/^@article/);
    assert.doesNotMatch(c.bibtexFor(pub),/10\.48550/);
  }
});

test('preprint title aliases and IDs find the canonical journal record',()=>{
  const lego=data.publications.find(p=>p.storyId==='lego-cnn');
  for(const query of ['efficient convolutional neural networks','2005.03948','arxiv'])assert.ok(c.publicationSearchText(lego).includes(query));
  const danhar=data.publications.find(p=>p.storyId==='danhar');
  assert.ok(c.publicationSearchText(danhar).includes('2006.14435'));
});

test('metadata enrichment preserves preprint links and version-specific counts',()=>{
  const pub=data.publications.find(p=>p.storyId==='danhar');
  const [merged]=c.mergePublicationMetadata([pub],[{title:pub.title,doi:pub.link,venue:'Applied Soft Computing',details:'Vol. 111',citations:999}]);
  assert.equal(merged.citations,254);
  assert.deepEqual(merged.preprints,pub.preprints);
  assert.equal(merged.preprints[0].citations,11);
});

test('accepted unpublished entries suppress even accidental nested preprint links',()=>{
  const links=c.createPaperLinks({title:'Accepted work',status:'accepted',preprints:[{link:'https://arxiv.org/abs/2005.03948'}]},'');
  assert.doesNotMatch(links,/<a\b|arxiv\.org/);
});
