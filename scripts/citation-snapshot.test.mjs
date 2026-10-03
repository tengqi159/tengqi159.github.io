import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context={window:{},document:{addEventListener(){}}};vm.createContext(context);
for(const file of ['site-data.js','site.js'])vm.runInContext(readFileSync(new URL('../assets/'+file,import.meta.url),'utf8'),context);
const data=context.window.siteData;

test('headline metrics retain the owner-provided Scholar total and source date',()=>{
  const metrics=Object.fromEntries(data.profile.metrics.map(m=>[m.label,m.value]));
  assert.equal(metrics.Citations,'1025');assert.equal(metrics['h-index'],'11');assert.equal(metrics['i10-index'],'11');
  assert.equal(data.profile.updatedAt,'2026-10-03');assert.equal(data.profile.citationSnapshot.capture,'owner-provided');
  assert.equal(data.profile.citationSnapshot.since2021.citations,1009);
  assert.ok(data.profile.metrics.slice(0,3).every(m=>!m.note.includes('auto-synced')));
});

test('publication versions receive only the citation count provided for their DOI or arXiv record',()=>{
  const expected={
    '10.1016/j.asoc.2021.107728':254,'10.1109/JSEN.2020.2978772':225,'10.1109/JSEN.2020.3015521':166,
    '10.1109/TETCI.2021.3136642':149,'10.1109/JBHI.2021.3092396':59,'10.1109/TIM.2023.3240198':40,
    '10.1063/1.5100558':38,'10.1109/JBHI.2024.3488528':30,'10.1109/JSEN.2021.3085360':23,
    '10.1109/JSEN.2024.3364187':20,'https://arxiv.org/abs/2005.03948':16,'10.1109/JSEN.2025.3534413':3,'10.1063/5.0015600':2
  };
  for(const [key,count] of Object.entries(expected)){
    const matches=data.publications.filter(p=>(p.link||'').replace('https://doi.org/','')===key);
    assert.equal(matches.length,1,key);assert.equal(matches[0].citations,count,key);assert.equal(matches[0].citationsUpdatedAt,'2026-10-03');
  }
  assert.equal(data.publications.find(p=>p.storyId==='dual-decoupling-attention').year,2025);
});

test('unlisted or blank counts cannot masquerade as current confirmed zeros',()=>{
  for(const id of ['csfo-correction','dswd']){
    const p=data.publications.find(p=>p.storyId===id);assert.equal(p.citations,null);assert.equal(context.citationLabel(p),'Citations unavailable');
  }
  const old=data.publications.find(p=>p.link==='https://doi.org/10.48550/arxiv.2006.14435');
  assert.equal(context.citationLabel(old),'Cited by 11 · 2026-08-09');
  assert.equal(context.citationLabel({citations:0}),'Cited by 0');
  assert.equal(context.citationLabel({status:'accepted',citations:0}),'Accepted · Forthcoming');
});
