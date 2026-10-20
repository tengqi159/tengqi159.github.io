/* Original signal-terrain atmosphere. One viewport canvas; no content or UI.
   Parametric contours morph between real page sections and sleep when idle. */
(() => {
  'use strict';
  function init() {
    const root = document.documentElement;
    const host = document.getElementById('page-atmosphere');
    const canvas = document.getElementById('atmosphere-canvas');
    if (!host || !canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d', {alpha:true});
    if (!ctx) return;

    const media = query => typeof matchMedia === 'function' ? matchMedia(query) : {matches:false};
    const reduced = media('(prefers-reduced-motion: reduce)');
    const fine = media('(hover: hover) and (pointer: fine)');
    const mobile = media('(max-width: 820px)');
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const mix = (a, b, t) => a + (b-a)*t;
    const smooth = value => value*value*(3-2*value);
    const now = () => performance.now();
    // cx/cy locate the terrain; span/spread open the contour fan. Quiet
    // reading sections keep the field near the outer edge of the page.
    const scenes = {
      hero:          {cx:.66,cy:.54,span:1.32,spread:.58,amp:.17,freq:1.12,twist:.85,strength:.98,density:1.00,flow:1.00},
      news:          {cx:.88,cy:.37,span:1.02,spread:.48,amp:.13,freq:1.00,twist:.65,strength:.76,density:.91,flow:.72},
      profile:       {cx:.92,cy:.60,span:.91,spread:.58,amp:.14,freq:.83,twist:1.12,strength:.68,density:.86,flow:.65},
      research:      {cx:.82,cy:.49,span:1.08,spread:.43,amp:.19,freq:1.40,twist:1.25,strength:.85,density:.96,flow:.90},
      publications:  {cx:1.03,cy:.52,span:.73,spread:.65,amp:.10,freq:.80,twist:.55,strength:.46,density:.72,flow:.42},
      collaboration: {cx:.69,cy:.58,span:1.15,spread:.38,amp:.17,freq:1.16,twist:1.48,strength:.87,density:.93,flow:.84},
      atlas:         {cx:1.06,cy:.47,span:.70,spread:.76,amp:.08,freq:.73,twist:.45,strength:.38,density:.70,flow:.38},
      links:         {cx:.92,cy:.59,span:.92,spread:.44,amp:.13,freq:1.02,twist:.88,strength:.65,density:.82,flow:.62}
    };
    const keys = Object.keys(scenes.hero);
    const field = {...scenes.hero};
    const pointer = {x:.55,y:.48};
    const target = {...pointer};
    let width=1, height=1, bounds=[], colors={teal:'#0e5f63',gold:'#96690f'};
    let frame=0, lastPaint=0, lastInput=now(), phase=1.8;
    let dirty=true, needsLayout=true, needsColors=true, failed=false;

    function paused() { return reduced.matches || root.dataset.motionPaused === 'true'; }
    function animating(time) { return !paused() && !document.hidden && time-lastInput < 20000; }
    function requestFrame() {
      if (!failed && !frame && !document.hidden) frame=requestAnimationFrame(tick);
    }
    function wake(input=true) {
      if (input) lastInput=now();
      dirty=true;
      requestFrame();
    }
    function queueLayout(input=false) {
      needsLayout=true;
      wake(input);
    }
    function measure() {
      width=Math.max(1,window.innerWidth || root.clientWidth || 1);
      height=Math.max(1,window.innerHeight || root.clientHeight || 1);
      // Bound the actual backing store, including wide/high-DPR displays.
      const ratio=Math.min(window.devicePixelRatio || 1,1.5,1600/width);
      canvas.width=Math.max(1,Math.round(width*ratio));
      canvas.height=Math.max(1,Math.round(height*ratio));
      ctx.setTransform(ratio,0,0,ratio,0,0);
      const scroll=window.scrollY || 0;
      bounds=Array.from(document.querySelectorAll('.hero, main > .section'))
        .map(element=>{
          const name=element.classList.contains('hero') ? 'hero' : element.id;
          if (!scenes[name] || element.hidden) return null;
          const rect=element.getBoundingClientRect();
          return rect.height>0 ? {name,top:rect.top+scroll,height:rect.height} : null;
        }).filter(Boolean).sort((a,b)=>a.top-b.top);
      if (!bounds.length) bounds=[{name:'hero',top:0,height}];
      needsLayout=false;
    }
    function readColors() {
      const style=getComputedStyle(root);
      colors.teal=style.getPropertyValue('--teal').trim() || '#0e5f63';
      colors.gold=style.getPropertyValue('--gold').trim() || '#96690f';
      needsColors=false;
    }
    function sceneTarget() {
      const anchor=(window.scrollY || 0)+height*.42;
      let index=0;
      while (index+1<bounds.length && anchor>=bounds[index+1].top) index++;
      const current=bounds[index], next=bounds[index+1];
      let progress=0;
      if (next) {
        const runway=Math.max(1,Math.min(height*.68,(next.top-current.top)*.7));
        progress=smooth(clamp((anchor-next.top+runway)/runway,0,1));
      }
      const name=next && progress>.5 ? next.name : current.name;
      if (root.dataset.pageScene!==name) root.dataset.pageScene=name;
      const a=scenes[current.name], b=next ? scenes[next.name] : a;
      return Object.fromEntries(keys.map(key=>[key,mix(a[key],b[key],progress)]));
    }
    function position(u, band, row) {
      const envelope=Math.pow(Math.max(0,Math.sin(Math.PI*u)),1.1);
      const drift=phase*field.flow;
      const fan=.65+.35*Math.cos(u*3.1+drift*.035+field.twist);
      const wave=Math.sin(u*6.5*field.freq-drift*.12+band*.35)*field.amp;
      const fold=Math.sin(u*11+drift*.075+row*.025)*field.amp*.21*field.twist;
      const pull=(pointer.y-.5)*.055*envelope+(pointer.x-.5)*.018*Math.sin(u*5.2);
      return [
        width*(field.cx+(u-.5)*field.span),
        height*(field.cy+band*field.spread*fan+(wave+fold)*envelope+pull)
      ];
    }
    function draw(time, moving) {
      const destination=sceneTarget();
      const easing=moving ? .16 : 1;
      keys.forEach(key=>field[key]=mix(field[key],destination[key],easing));
      pointer.x=mix(pointer.x,target.x,moving?.12:1);
      pointer.y=mix(pointer.y,target.y,moving?.12:1);
      if (moving && lastPaint) phase+=Math.min((time-lastPaint)/1000,.09);
      ctx.clearRect(0,0,width,height);

      // Sparse, quiet anchors sit only in the right-hand field.
      const spacing=mobile.matches ? 80:70;
      ctx.fillStyle=colors.teal;
      ctx.globalAlpha=.12*field.strength;
      for (let x=width*.64; x<width*.98; x+=spacing) {
        for (let y=height*.17; y<height*.9; y+=spacing) {
          ctx.beginPath();ctx.arc(x,y,.6,0,Math.PI*2);ctx.fill();
        }
      }

      const lines=clamp(Math.round((mobile.matches?33:44)*field.density),30,mobile.matches?34:44);
      const steps=mobile.matches ? 72:100;
      const left=width*(field.cx-field.span*.5), right=width*(field.cx+field.span*.5);
      const teal=ctx.createLinearGradient(left,0,right,0);
      teal.addColorStop(0,'transparent');teal.addColorStop(.08,'transparent');
      teal.addColorStop(.38,colors.teal);teal.addColorStop(.78,colors.teal);teal.addColorStop(1,'transparent');
      const gold=ctx.createLinearGradient(left,0,right,0);
      gold.addColorStop(0,'transparent');gold.addColorStop(.20,'transparent');
      gold.addColorStop(.48,colors.gold);gold.addColorStop(.82,colors.gold);gold.addColorStop(1,'transparent');
      for (let row=0;row<lines;row++) {
        const band=row/(lines-1)-.5;
        const accent=row%11===5;
        ctx.globalAlpha=(accent?.46:.31)*field.strength*(.8+.2*Math.cos(band*Math.PI));
        ctx.strokeStyle=accent ? gold:teal;
        ctx.lineWidth=accent ? 1.05:.78;
        ctx.beginPath();
        for (let step=0;step<=steps;step++) {
          const [x,y]=position(step/steps,band,row);
          if (step) ctx.lineTo(x,y); else ctx.moveTo(x,y);
        }
        ctx.stroke();
      }

      // A handful of travelling gold points connect the contour field.
      ctx.fillStyle=colors.gold;
      for (let dot=0;dot<(mobile.matches?3:6);dot++) {
        const u=(phase*.018*field.flow+dot*.167+.43)%1;
        const [x,y]=position(u,Math.sin(dot*2.4)*.43,dot*5);
        if (x<width*.58 || x>width+6 || y<0 || y>height) continue;
        const alpha=Math.sin(Math.PI*u)*field.strength;
        ctx.globalAlpha=alpha*.10;ctx.beginPath();ctx.arc(x,y,5.5,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=alpha*.68;ctx.beginPath();ctx.arc(x,y,1.65,0,Math.PI*2);ctx.fill();
      }
      ctx.globalAlpha=1;
      root.style.setProperty('--atmo-x',`${((field.cx+(pointer.x-.5)*.10)*100).toFixed(2)}%`);
      root.style.setProperty('--atmo-y',`${((field.cy+(pointer.y-.5)*.10)*100).toFixed(2)}%`);
      root.style.setProperty('--atmo-strength',field.strength.toFixed(3));
    }
    function tick(time) {
      frame=0;
      if (document.hidden) return;
      const moving=animating(time);
      const interval=1000/(mobile.matches?18:24);
      if ((moving || dirty) && (!lastPaint || time-lastPaint>=interval)) {
        try {
          if (needsLayout) measure();
          if (needsColors) readColors();
          draw(time,moving);
          root.classList.add('has-page-atmosphere');
        } catch {
          failed=true;
          root.classList.remove('has-page-atmosphere');
          return;
        }
        lastPaint=time;
        dirty=false;
      }
      if (animating(time) || dirty) requestFrame();
    }
    function syncMotion() {
      if (frame) cancelAnimationFrame(frame);
      frame=0;
      if (!document.hidden) wake(false);
    }
    const watch=(query,callback)=>{
      if (query.addEventListener) query.addEventListener('change',callback);
      else query.addListener?.(callback);
    };
    window.addEventListener('scroll',()=>wake(),{passive:true});
    window.addEventListener('resize',()=>queueLayout(true),{passive:true});
    window.addEventListener('pointermove',event=>{
      if (!fine.matches || paused()) return;
      target.x=clamp(event.clientX/width,0,1);
      target.y=clamp(event.clientY/height,0,1);
      wake();
    },{passive:true});
    document.addEventListener('visibilitychange',()=>{
      if (!document.hidden) lastInput=now();
      syncMotion();
    });
    document.addEventListener('qt-motionchange',syncMotion);
    document.addEventListener('qt-themechange',()=>{needsColors=true;wake(false);});
    watch(reduced,syncMotion);
    watch(fine,()=>wake(false));
    watch(mobile,()=>queueLayout(false));
    if ('ResizeObserver' in window && document.body) {
      const observer=new ResizeObserver(()=>queueLayout(false));
      observer.observe(document.body);
    }
    document.fonts?.ready?.then(()=>queueLayout(false)).catch(()=>{});
    requestFrame();
  }
  const start=()=>{try {init();} catch { /* Decoration never blocks page content. */ }};
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
