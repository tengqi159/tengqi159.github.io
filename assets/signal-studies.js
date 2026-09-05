/* Original procedural studies, inspired by React Bits Threads and Magic UI
   Animated Beam. These are generative illustrations, not measured results.
   One visibility-aware clock serves both canvases; no library or GPU required. */
(() => {
  "use strict";
  function init() {
    const hero = document.querySelector(".hero");
    const panel = document.getElementById("signal-study");
    const heroCanvas = document.getElementById("signal-canvas");
    const studyCanvas = document.getElementById("study-canvas");
    if (!hero || !panel || !heroCanvas || !studyCanvas) return;
    const heroCtx = heroCanvas.getContext("2d");
    const studyCtx = studyCanvas.getContext("2d");
    if (!heroCtx || !studyCtx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const mobile = matchMedia("(max-width: 820px)");
    const studies = [
      ["Sense / multichannel", "Movement becomes signal.", "Different channels, one shared rhythm. Patterns emerge across wearable sensor streams."],
      ["Learn / efficient networks", "A shorter path to intelligence.", "Local learning and compact architectures connect sensor inputs to useful representations."],
      ["Attend / time series", "Find what matters in time.", "Attention brings selected moments and channels into focus within a longer sequence."],
      ["Discover / dynamics", "Order inside the unexpected.", "A Lorenz trajectory illustrates the evolving structure of a nonlinear dynamical system."]
    ];
    let mode = 0, paused = false, frame = 0, last = 0, elapsed = 18, colors;
    const pointer = { x: .6, y: .5 };
    const surfaces = [
      { canvas: heroCanvas, ctx: heroCtx, host: hero, visible: false, width: 0, height: 0 },
      { canvas: studyCanvas, ctx: studyCtx, host: panel, visible: false, width: 0, height: 0 }
    ];
    panel.hidden = false;
    document.querySelector(".research-explorer").classList.add("is-interactive");
    const heroToggle = document.createElement("button");
    heroToggle.type = "button";
    heroToggle.className = "hero-motion";
    hero.append(heroToggle);
    const motionButtons = [heroToggle, document.getElementById("study-motion")];

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      colors = Object.fromEntries(["teal", "gold", "ink-2", "line-soft", "paper-elev"].map(key => [key, style.getPropertyValue(`--${key}`).trim()]));
    }
    function size(surface) {
      const rect = surface.canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      surface.width = rect.width;
      surface.height = rect.height;
      surface.canvas.width = Math.round(rect.width * dpr);
      surface.canvas.height = Math.round(rect.height * dpr);
      surface.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function line(ctx, points, color, alpha = 1, width = 1) {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    function dot(ctx, x, y, radius, color, alpha = 1) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    function text(ctx, label, x, y, color = colors["ink-2"]) {
      ctx.fillStyle = color;
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.fillText(label, x, y);
    }

    function drawHero(t) {
      const { ctx, width:w, height:h } = surfaces[0];
      ctx.clearRect(0,0,w,h);
      const count = mobile.matches ? 22 : 44;
      for (let j = 0; j < count; j++) {
        const points = [];
        for (let step = 0; step <= 110; step++) {
          const u = step / 110;
          const y = h * .52 + Math.sin(u * 5.6 - t * .13) * h * .12 +
            (j - count / 2) * (mobile.matches ? 5 : 5.8) * Math.cos(u * 3.6 + t * .055) +
            Math.sin(u * 9 + j * .05 + t * .2) * 13 + (pointer.y - .5) * 16 * Math.sin(u * Math.PI);
          points.push([u * w, y]);
        }
        const wash = ctx.createLinearGradient(0,0,w,0);
        wash.addColorStop(0, "transparent");
        wash.addColorStop(.24, "transparent");
        wash.addColorStop(.64, j % 6 === 0 ? colors.gold : colors.teal);
        wash.addColorStop(1, "transparent");
        line(ctx, points, wash, j % 6 === 0 ? .55 : .24, .8);
        if (j % 7 === 0) {
          const start = Math.floor(((t * .055 + j / count) % 1) * 98);
          line(ctx, points.slice(start, start + 9), colors.gold, .26, 1.2);
        }
      }
    }

    // Lorenz system, integrated once using a small fixed time step.
    const trajectory = [];
    let x = .1, y = 0, z = 0;
    for (let i = 0; i < 4200; i++) {
      const dt = .005;
      const dx = 10 * (y-x), dy = x * (28-z) - y, dz = x*y - (8/3)*z;
      x += dx*dt; y += dy*dt; z += dz*dt;
      if (i > 350) trajectory.push([x,y,z]);
    }

    function drawStudy(t) {
      const {ctx, width:w, height:h} = surfaces[1];
      ctx.clearRect(0,0,w,h);
      for (let x = 24; x < w-15; x += 24) for (let y = 25; y < h-12; y += 24) dot(ctx,x,y,.65,colors.teal,.16);
      if (mode === 0) {
        for (let channel = 0; channel < 5; channel++) {
          const baseline = 56 + channel * (h-104)/4;
          const points = [];
          for (let i = 0; i <= 150; i++) {
            const u = i/150;
            const envelope = .2 + .8*Math.pow(Math.sin(u*Math.PI),2);
            const value = Math.sin(u*22-t*1.1+channel*.85)*.7 + Math.sin(u*45+t*.8+channel)*.3;
            points.push([52+u*(w-78), baseline + value * 16 * envelope]);
          }
          text(ctx, `0${channel+1}`, 20, baseline+3);
          line(ctx,points,channel===2?colors.gold:colors.teal,channel===2?.95:.55,channel===2?1.6:1);
          const at = Math.floor(((t*.11+channel*.07)%1)*150);
          const [x,y] = points[at];
          dot(ctx,x,y,6,colors["paper-elev"],.7);
          dot(ctx,x,y,2.8,channel===2?colors.gold:colors.teal);
        }
        const sx = 52 + ((t*.07)%1)*(w-78);
        line(ctx,[[sx,32],[sx,h-27]],colors.gold,.35);
      } else if (mode === 1) {
        const sizes = [5,4,3,2];
        const layers = sizes.map((n,l) => Array.from({length:n},(_,i)=>[w*(.14+l*.24), h*.5+(i-(n-1)/2)*39]));
        layers.slice(0,-1).forEach((nodes,l) => nodes.forEach((from,i) => layers[l+1].forEach((to,j) => {
          line(ctx,[from,to],colors.teal,.14);
          if ((i+j)%2) return;
          const u = (t*.3+l*.24+i*.13+j*.19)%1;
          const v = Math.max(0,u-.13);
          line(ctx,[[from[0]+(to[0]-from[0])*v,from[1]+(to[1]-from[1])*v],[from[0]+(to[0]-from[0])*u,from[1]+(to[1]-from[1])*u]],colors.gold,.8,1.7);
        })));
        layers.forEach((nodes,l)=>nodes.forEach(([x,y],i)=>{
          dot(ctx,x,y,8,colors["paper-elev"]);
          dot(ctx,x,y,5,l===3?colors.gold:colors.teal,.6+.3*Math.sin(t*2-l+i));
          dot(ctx,x,y,2,colors["paper-elev"]);
        }));
        ["INPUT", "LOCAL", "COMPACT", "OUTPUT"].forEach((label,i)=>text(ctx,label,w*(.14+i*.24)-17,h-22));
      } else if (mode === 2) {
        const cols = 15, rows = 7, gap = 4;
        const cell = Math.min((w-80)/cols, (h-100)/rows);
        const left = (w-cols*cell)/2, top = (h-rows*cell)/2;
        const focus = (Math.sin(t*.6)+1)*6.5;
        for (let row=0;row<rows;row++) for(let col=0;col<cols;col++) {
          const weight = Math.exp(-Math.pow(col-focus,2)/6)*(.4+.6*Math.pow(Math.sin(row*.9+col*.4),2));
          ctx.globalAlpha = .08 + weight*.9;
          ctx.fillStyle = weight>.4?colors.gold:colors.teal;
          ctx.fillRect(left+col*cell,top+row*cell,cell-gap,cell-gap);
        }
        ctx.globalAlpha=1;
        text(ctx,"CHANNEL",left,top-16);
        text(ctx,"TIME →",left+cols*cell-45,top+rows*cell+22);
        line(ctx,[[left+focus*cell,top-5],[left+focus*cell,top+rows*cell]],colors.gold,.7,1);
      } else {
        const rotation = Math.sin(t*.12)*.42;
        const scale = Math.min(w/53,h/53);
        const projected = trajectory.map(([x,y,z])=>[w*.5+(x*Math.cos(rotation)+y*Math.sin(rotation))*scale,h*.87-z*scale*.81]);
        line(ctx,projected,colors.teal,.38,.7);
        const at = Math.floor((t*.1%1)*(projected.length-150));
        line(ctx,projected.slice(at,at+150),colors.gold,.95,1.4);
        const [px,py]=projected[at+149];
        dot(ctx,px,py,3,colors.gold);
        text(ctx,"LORENZ / σ 10 · ρ 28 · β 8/3",22,h-17);
      }
    }
    function render() {
      if (surfaces[0].visible) drawHero(elapsed);
      if (surfaces[1].visible) drawStudy(elapsed);
    }
    function shouldRun() { return !paused && !reduced.matches && !document.hidden && surfaces.some(s=>s.visible); }
    function loop(now) {
      frame = 0;
      if (!shouldRun()) { last = 0; return; }
      if (!last || now-last >= 1000/30) {
        elapsed += last ? Math.min((now-last)/1000,.07) : 0;
        last = now;
        render();
      }
      frame = requestAnimationFrame(loop);
    }
    function sync() {
      const stopped=String(paused || reduced.matches);
      if(document.documentElement.dataset.motionPaused!==stopped) {
        document.documentElement.dataset.motionPaused=stopped;
        document.dispatchEvent(new CustomEvent("qt-motionchange"));
      }
      motionButtons.forEach(button=>{
        button.textContent = reduced.matches ? "Motion reduced" : paused ? "Resume motion" : "Pause motion";
        button.setAttribute("aria-pressed",String(paused || reduced.matches));
        button.setAttribute("aria-label",reduced.matches ? "Ambient motion disabled by system preference" : paused ? "Resume ambient motion" : "Pause ambient motion");
        button.disabled = reduced.matches;
      });
      if (frame) cancelAnimationFrame(frame);
      frame = 0; last = 0;
      render();
      if (shouldRun()) frame = requestAnimationFrame(loop);
    }
    motionButtons.forEach(button=>button.addEventListener("click",()=>{paused=!paused;sync();}));

    const rows = Array.from(document.querySelectorAll(".direction-row"));
    rows.forEach((row,index)=>{
      const heading = row.querySelector("h3");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "direction-trigger";
      button.textContent = heading.textContent;
      button.setAttribute("aria-controls","signal-study");
      button.setAttribute("aria-pressed",String(index===0));
      heading.replaceChildren(button);
      row.classList.toggle("is-active",index===0);
      button.addEventListener("click",()=>{
        mode=index;
        rows.forEach((item,i)=>{
          item.classList.toggle("is-active",i===index);
          item.querySelector("button").setAttribute("aria-pressed",String(i===index));
        });
        document.getElementById("study-index").textContent=`0${index+1} / 04`;
        ["study-eyebrow","study-title","study-description"].forEach((id,i)=>document.getElementById(id).textContent=studies[index][i]);
        drawStudy(elapsed);
        panel.scrollIntoView({behavior: reduced.matches ? "instant" : "smooth",block:"start"});
      });
    });
    const hint = document.createElement("p");
    hint.className="research-hint";
    hint.textContent="Select a direction to explore its signal study.";
    document.querySelector(".direction-list").append(hint);

    if (fine.matches) {
      hero.addEventListener("pointermove",event=>{
        if (reduced.matches || paused) return;
        const rect=hero.getBoundingClientRect();
        pointer.x=(event.clientX-rect.left)/rect.width;
        pointer.y=(event.clientY-rect.top)/rect.height;
      },{passive:true});
      document.getElementById("selected-publications")?.addEventListener("pointermove",event=>{
        if (reduced.matches) return;
        const card=event.target.closest(".selected-card");
        if (!card) return;
        const rect=card.getBoundingClientRect();
        card.style.setProperty("--rim-angle",`${Math.atan2(event.clientY-rect.top-rect.height/2,event.clientX-rect.left-rect.width/2)*180/Math.PI+180}deg`);
      },{passive:true});
    }
    readColors(); surfaces.forEach(size);
    if ("ResizeObserver" in window) {
      const resize=new ResizeObserver(()=>{surfaces.forEach(size);render();});
      surfaces.forEach(s=>resize.observe(s.canvas));
    } else window.addEventListener("resize",()=>{surfaces.forEach(size);render();});
    if ("IntersectionObserver" in window) {
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{surfaces.find(s=>s.host===entry.target).visible=entry.isIntersecting;});
        sync();
      },{threshold:0});
      surfaces.forEach(s=>observer.observe(s.host));
    } else {surfaces.forEach(s=>s.visible=true);sync();}
    document.addEventListener("visibilitychange",sync);
    reduced.addEventListener("change",sync);
    document.addEventListener("qt-themechange",()=>{readColors();render();});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();
