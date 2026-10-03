import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync, readdirSync} from 'node:fs';

const context={window:{},document:{addEventListener(){}}};
vm.createContext(context);
for(const file of ['site-data.js','paper-stories.js','paper-explainer.js'])
  vm.runInContext(readFileSync(new URL('../assets/'+file,import.meta.url),'utf8'),context);
const {paperStories:stories,paperExplainer:viewer,siteData}=context.window;

test('verified framework assets exist with matching lossless WebP dimensions',()=>{
  const figures=stories.filter(s=>s.figure);
  assert.equal(figures.length,15);
  for(const {id,figure} of figures){
    assert.match(figure.src,new RegExp(`^assets/paper-figures/${id}\\.webp$`));
    const bytes=readFileSync(new URL('../'+figure.src,import.meta.url));
    assert.equal(bytes.toString('ascii',0,4),'RIFF');
    assert.equal(bytes.toString('ascii',8,12),'WEBP');
    const vp8l=bytes.indexOf(Buffer.from('VP8L'));
    assert.ok(vp8l>=12,'Figure must remain lossless');
    assert.equal(bytes[vp8l+8],0x2f);
    const bits=bytes.readUInt32LE(vp8l+9);
    assert.equal((bits&0x3fff)+1,figure.width,id);
    assert.equal(((bits>>>14)&0x3fff)+1,figure.height,id);
    assert.ok(figure.sourceFigureNumber);
    assert.ok(figure.alt.length>20);
  }
});

test('the viewer displays the source figure rather than generating a replacement diagram',()=>{
  for(const story of stories.filter(s=>s.figure)){
    const html=viewer.figureMarkup(story);
    assert.match(html,/<img class="pe-original-image"/);
    assert.ok(html.includes(`src="${story.figure.src}"`));
    assert.doesNotMatch(html,/<svg\b/);
    assert.match(html,/loading="eager"/);
    assert.match(viewer.figureMarkup(story,{thumbnail:true}),/loading="lazy"/);
  }
});

test('missing figures cannot produce a substitute graphic or animation entry',()=>{
  const notice=stories.find(s=>s.id==='csfo-correction');
  assert.equal(viewer.figureMarkup(notice),'');
  assert.equal(viewer.buttons(siteData.publications.find(p=>p.storyId===notice.id)),'');
  assert.equal(viewer.hasAnimation(notice),false);
});

test('animation requires three valid regions within the actual image',()=>{
  const story=JSON.parse(JSON.stringify(stories[0]));
  story.contentReview={status:'verified',basis:'full-manuscript'};
  assert.equal(viewer.hasAnimation(story),true);
  story.figure.regions[0].width=2;
  assert.equal(viewer.hasAnimation(story),false);
  story.figure.regions=story.figure.regions.slice(0,2);
  assert.equal(viewer.hasAnimation(story),false);
});

test('figure extraction alone cannot enable a manuscript explanation',()=>{
  const story=JSON.parse(JSON.stringify(stories[0]));
  delete story.contentReview;
  assert.equal(viewer.hasReviewedContent(story),false);
  assert.equal(viewer.hasAnimation(story),false);
  context.window.paperStories.unshift(story);
  const buttons=viewer.buttons({storyId:story.id});
  assert.match(buttons,/Paper framework/);
  assert.doesNotMatch(buttons,/Animated intro/);
  context.window.paperStories.shift();
  story.contentReview={status:'verified',basis:'figure-only'};
  assert.equal(viewer.hasAnimation(story),false);
});

test('accepted framework metadata and the deployable figure directory contain no manuscript PDF',()=>{
  for(const story of stories.filter(s=>s.publicationStatus==='accepted')){
    const serialized=JSON.stringify(story);
    assert.doesNotMatch(serialized,/https?:|\.pdf|\/Users\//);
    assert.equal(story.figure.sourceUrl,undefined);
  }
  assert.ok(readdirSync(new URL('../assets/paper-figures/',import.meta.url)).every(name=>name.endsWith('.webp')));
});
