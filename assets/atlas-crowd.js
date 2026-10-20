/* Visitor Atlas v2: explicit asynchronous states; no GPS or third-party IP API.
   A server acknowledgement, not finding a coordinate, confirms a saved visit. */
(() => {
  'use strict';
  const ENDPOINT = (window.QT_ATLAS_ENDPOINT ?? 'https://qt-atlas.teqi159.workers.dev').replace(/\/$/,'');
  const FILE_MODE = window.location?.protocol==='file:';
  const TIMEOUT_MS = 7500;
  const CACHE_KEY = `qt-atlas-map-v2:${ENDPOINT}`;
  const TOKEN_KEY = 'qt-atlas-token';
  const HOME = {latitude:34.76,longitude:113.65};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
  const label = p => [...new Set([p.city,p.region,p.country || p.countryCode || p.country_code].filter(Boolean))].join(', ');
  const count = n => Number.isFinite(Number(n)) && Number(n)>=0 ? Math.floor(Number(n)) : 0;
  const fmt = n => count(n).toLocaleString('en-US');
  function visitTime(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) return null;
    const offset = -date.getTimezoneOffset();
    const absolute = Math.abs(offset);
    const zone = `UTC${offset >= 0 ? '+' : '-'}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
    const text = date.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
    });
    return {date, text: `${text} (${zone})`};
  }
  function validLocation(p) {
    return p && typeof p.latitude==='number' && typeof p.longitude==='number' &&
      Number.isFinite(p.latitude) && Number.isFinite(p.longitude) &&
      Math.abs(p.latitude)<=90 && Math.abs(p.longitude)<=180;
  }
  function project(lat,lon,w=100,h=100) {return {x:(lon+180)/360*w,y:(90-lat)/180*h};}
  function stored(key) {try{return localStorage.getItem(key);}catch{return null;}}
  function save(key,value) {try{localStorage.setItem(key,value);}catch{}}
  let pageToken;
  function token() {
    if (pageToken) return pageToken;
    const existing = stored(TOKEN_KEY);
    if (/^[A-Za-z0-9_-]{16,64}$/.test(existing || '')) return pageToken=existing;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    pageToken=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
    save(TOKEN_KEY,pageToken); return pageToken;
  }
  async function api(path,options={}) {
    if (!ENDPOINT) throw new Error('not_configured');
    const controller = new AbortController();
    const timeout=setTimeout(()=>controller.abort(),TIMEOUT_MS);
    try {
      const response=await fetch(ENDPOINT+path,{...options,signal:controller.signal,cache:'no-store',credentials:'omit'});
      const data=await response.json();
      if (!response.ok || data.ok!==true) throw new Error(data.code || `http_${response.status}`);
      return data;
    } finally {clearTimeout(timeout);}
  }
  function init() {
    const get=id=>document.getElementById(id);
    const map=get('visitor-map-canvas'), canvas=get('crowd-canvas'), shell=get('atlas-shell');
    if (!map || !canvas || !shell) return;
    const ctx=canvas.getContext('2d');
    const plot=map.querySelector('.atlas-plot');
    const status=get('atlas-map-status'), visitStatus=get('visitor-status'), place=get('visitor-place');
    const refresh=get('atlas-refresh'), retry=get('atlas-retry'), note=get('atlas-map-note'), tooltip=get('atlas-tooltip');
    const placeSelect=get('atlas-place-select'), allPlaces=get('atlas-all-places'), orderSelect=get('atlas-order-select');
    const localPreview=get('atlas-local-preview');
    let points=[], snapshot=null, active=-1, pinned=false, busy=false, readVersion=0, arcTimer=0;
    let snapshotAt=null;
    let visitSaved=false;

    function paint() {
      if (!ctx) return;
      const rect=canvas.getBoundingClientRect(), w=rect.width,h=rect.height;
      if (!w || !h) return;
      const dpr=Math.min(devicePixelRatio || 1,2);
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      const css=getComputedStyle(document.documentElement), gold=css.getPropertyValue('--gold').trim(),teal=css.getPropertyValue('--teal').trim();
      points.forEach((p,i)=>{
        const {x,y}=project(p.lat,p.lon,w,h),r=Math.min(10,2.2+Math.log2(Math.max(1,p.visits))*1.1);
        ctx.globalAlpha=.12;ctx.fillStyle=gold;ctx.beginPath();ctx.arc(x,y,r*2.3,0,Math.PI*2);ctx.fill();
        ctx.globalAlpha=.86;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
        if (i===active) {ctx.globalAlpha=1;ctx.strokeStyle=teal;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,r+4,0,Math.PI*2);ctx.stroke();}
      });
      ctx.globalAlpha=1;
    }
    function showPoint(index,pin=false) {
      active=index;pinned=pin && index>=0;
      document.querySelectorAll('.atlas-place-button').forEach((b,i)=>b.setAttribute('aria-pressed',String(pin && i===index)));
      if(placeSelect)placeSelect.value=String(pinned ? index : -1);
      if (!points[index]) {tooltip.hidden=true;paint();return;}
      const p=points[index];
      const strong=document.createElement('strong');strong.textContent=label(p) || 'Approximate region';
      const span=document.createElement('span');span.textContent=`${fmt(p.visits)} ${p.visits===1?'visit':'visits'} · ${fmt(p.visitors)} ${p.visitors===1?'visitor':'visitors'}`;
      const visited=document.createElement('div');visited.className='atlas-visit-time';
      const heading=document.createElement('span');heading.textContent='Last visit';
      const last=visitTime(p.last_seen);
      const time=document.createElement(last ? 'time' : 'span');
      time.textContent=last ? last.text : 'Time unavailable';
      if (last) time.dateTime=last.date.toISOString();
      visited.append(heading,time);
      tooltip.replaceChildren(strong,span,visited);tooltip.hidden=false;
      const pr=plot.getBoundingClientRect(),mr=map.getBoundingClientRect(),xy=project(p.lat,p.lon,pr.width,pr.height);
      tooltip.style.left=`${clamp(pr.left-mr.left+xy.x+10,8,mr.width-tooltip.offsetWidth-8)}px`;
      tooltip.style.top=`${clamp(pr.top-mr.top+xy.y-tooltip.offsetHeight-10,8,mr.height-tooltip.offsetHeight-8)}px`;
      paint();
    }
    function decode(payload) {
      if (!payload || !Array.isArray(payload.points) || !payload.totals || payload.ok!==true) throw new Error('invalid_map');
      const pts=payload.points.filter(p=>typeof p.lat==='number' && typeof p.lon==='number' && Number.isFinite(p.lat) && Number.isFinite(p.lon) && Math.abs(p.lat)<=90 && Math.abs(p.lon)<=180)
        .map(p=>({...p,visitors:count(p.visitors),visits:count(p.visits ?? p.visitors)}));
      return {...payload,points:pts};
    }
    function renderPlaceOptions() {
      if (!placeSelect || !allPlaces) return;
      const prompt=document.createElement('option');prompt.value='-1';prompt.textContent='Choose a place…';
      const order=orderSelect?.value || 'recent';
      const entries=points.map((point,index)=>({point,index,time:visitTime(point.last_seen)}));
      entries.sort((a,b)=>{
        if (order==='visits' && a.point.visits!==b.point.visits) return b.point.visits-a.point.visits;
        const at=a.time?.date.getTime() ?? -Infinity, bt=b.time?.date.getTime() ?? -Infinity;
        if (at!==bt) return at>bt ? -1:1;
        return label(a.point).localeCompare(label(b.point),'en') || a.index-b.index;
      });
      placeSelect.replaceChildren(prompt);
      entries.forEach(({point:p,index,time})=>{
        const option=document.createElement('option');option.value=String(index);
        option.textContent=`${time ? time.text : 'Time unavailable'} · ${label(p) || 'Approximate region'} · ${fmt(p.visits)} ${p.visits===1?'visit':'visits'}`;
        placeSelect.append(option);
      });
      placeSelect.value=String(pinned && active>=0 ? active:-1);
      allPlaces.hidden=!points.length;
    }
    function savedState() {
      shell.dataset.state='cached';
      const saved=visitTime(snapshotAt);
      status.textContent=`Saved visitor map${saved ? ' · '+saved.date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):''}`;
      status.title=saved ? `Public map snapshot captured ${saved.text}. Live updates are unavailable.` : 'Saved visitor records. Live updates are unavailable.';
    }
    function render(payload,at=null) {
      snapshot=payload;points=payload.points;active=-1;pinned=false;tooltip.hidden=true;
      snapshotAt=at;
      const t=payload.totals;
      get('atlas-visitors').textContent=fmt(t.visitors);
      get('atlas-visits').textContent=fmt(t.visits);
      get('atlas-places').textContent=fmt(t.places ?? t.cities);
      get('atlas-countries').textContent=t.countries==null ? '—' : fmt(t.countries);
      note.textContent=points.length ? (payload.truncated ? `Showing ${fmt(points.length)} places. Select a point for details.` : 'Hover or tap a point for visits and the latest visit time.') : 'No recorded visits yet.';
      const list=get('crowd-top');list.replaceChildren();
      points.slice(0,5).forEach((p,i)=>{
        const li=document.createElement('li'),b=document.createElement('button'),n=document.createElement('span');
        b.type='button';b.className='atlas-place-button';b.setAttribute('aria-pressed','false');
        b.textContent=p.city || p.region || p.country || 'Region';n.textContent=fmt(p.visits);b.append(n);
        b.setAttribute('aria-label',`${label(p)}, ${fmt(p.visits)} visits`);
        b.addEventListener('click',()=>{
          const next=active===i && pinned ? -1:i;
          showPoint(next,true);
          if(next>=0)map.scrollIntoView({block:'center',behavior:reduced.matches?'auto':'smooth'});
        });
        li.append(b);list.append(li);
      });
      get('atlas-places-row').hidden=!points.length;paint();
      renderPlaceOptions();
    }
    async function loadMap() {
      const requestId=++readVersion;
      shell.dataset.state='loading';status.textContent=snapshot?'Updating visitor map…':'Loading visitor map…';
      try {
        const data=decode(await api('/visits'));
        if (requestId!==readVersion) return;
        const synced=new Date();
        render(data,synced.toISOString());shell.dataset.state='ready';
        status.textContent=`Visitor map · synced ${synced.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}`;
        status.title=`Last successful refresh: ${synced.toLocaleString()}`;
        save(CACHE_KEY,JSON.stringify({at:Date.now(),data}));
      } catch {
        if (requestId!==readVersion) return;
        if (snapshot) savedState();
        else {shell.dataset.state='error';status.textContent='Visitor map temporarily unavailable';}
        if (!snapshot) note.textContent='No visitor records could be loaded. Try refreshing the map.';
      }
    }
    function showLocation(location) {
      const dot=get('visitor-dot'),xy=project(location.latitude,location.longitude);
      dot.style.left=`${xy.x}%`;dot.style.top=`${xy.y}%`;dot.hidden=false;dot.classList.add('is-placed');
      place.textContent=label(location) || 'Approximate region';
      const home=project(HOME.latitude,HOME.longitude),span=Math.hypot(home.x-xy.x,home.y-xy.y);
      const base=get('arc-base'),flow=get('arc-flow');
      clearTimeout(arcTimer);
      if (span<3) {
        base.setAttribute('hidden','');flow.setAttribute('hidden','');document.dispatchEvent(new CustomEvent('qt-arcclear'));return;
      }
      const cy=Math.max(2,Math.min(home.y,xy.y)-Math.min(span*.3,22));
      const path=`M ${xy.x} ${xy.y} Q ${(home.x+xy.x)/2} ${cy} ${home.x} ${home.y}`;
      [base,flow].forEach(p=>{p.removeAttribute('hidden');p.setAttribute('d',path);p.classList.remove('is-drawn');});
      requestAnimationFrame(()=>base.classList.add('is-drawn'));
      arcTimer=setTimeout(()=>flow.classList.add('is-drawn'),reduced.matches?0:750);
      document.dispatchEvent(new CustomEvent('qt-arcdrawn',{detail:flow}));
    }
    async function recordConnection() {
      if (visitSaved) return;
      retry.hidden=true;place.textContent='Finding your region…';visitStatus.textContent='Looking up an approximate location.';
      try {
        const result=await api('/location');
        if (!validLocation(result.location)) {
          place.textContent='Location unavailable';visitStatus.textContent='This network could not be placed on the map.';retry.hidden=false;return;
        }
        showLocation(result.location);
        if (!result.recording) {visitStatus.textContent='Location found. New visit recording is paused.';retry.hidden=false;return;}
        visitStatus.textContent='Adding this visit to the map…';
        try {
          const saved=await api('/visits',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token:token()})});
          if (!saved.recorded) {
            visitStatus.textContent=saved.code==='automated_request'?'Automated visits are not counted.':'Location found. This visit was not saved.';
            retry.hidden=false;return;
          }
          if (validLocation(saved.location)) showLocation(saved.location);
          visitSaved=true;visitStatus.textContent='Your visit is on the map. Thanks for stopping by.';
          await loadMap();
        } catch {
          visitStatus.textContent='Location found, but this visit could not be saved.';retry.hidden=false;
        }
      } catch {
        place.textContent='Connection unavailable';visitStatus.textContent='Location service is temporarily unreachable.';retry.hidden=false;
      }
    }
    async function run() {
      if (FILE_MODE) {
        refresh.hidden=true;retry.hidden=true;
        if (localPreview) localPreview.hidden=false;
        place.textContent='Local file preview';
        visitStatus.textContent='Saved visitor records are shown here. Open the connected preview for live updates and visit recording.';
        if (snapshot) savedState();
        else {
          shell.dataset.state='error';status.textContent='Connected preview needed';
          note.textContent='Open the connected preview to load visitor records.';
        }
        return;
      }
      if (busy) return;
      busy=true;refresh.disabled=true;retry.disabled=true;
      try {await Promise.allSettled([loadMap(),recordConnection()]);}
      finally {busy=false;refresh.disabled=false;retry.disabled=false;}
    }
    function hit(event) {
      const r=canvas.getBoundingClientRect();let nearest=-1,distance=Infinity;
      points.forEach((p,i)=>{const xy=project(p.lat,p.lon,r.width,r.height),d=Math.hypot(event.clientX-r.left-xy.x,event.clientY-r.top-xy.y);
        if(d<Math.max(12,2.2+Math.log2(Math.max(1,p.visits))*1.1+5)&&d<distance){nearest=i;distance=d;}});
      return nearest;
    }
    map.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||pinned)return;const i=hit(event);if(i!==active)showPoint(i);});
    map.addEventListener('pointerleave',()=>{if(!pinned)showPoint(-1);});
    map.addEventListener('click',event=>{const i=hit(event);showPoint(pinned && i===active ? -1:i,true);});
    document.addEventListener('keydown',event=>{if(event.key==='Escape' && active>=0)showPoint(-1);});
    refresh.addEventListener('click',run);retry.addEventListener('click',run);
    placeSelect?.addEventListener('change',()=>showPoint(Number(placeSelect.value),true));
    orderSelect?.addEventListener('change',renderPlaceOptions);
    const repaint=()=>{paint();if(active>=0)showPoint(active,pinned);};
    if('ResizeObserver' in window)new ResizeObserver(repaint).observe(canvas);
    else window.addEventListener('resize',repaint);
    document.addEventListener('qt-themechange',repaint);
    window.addEventListener('online',run);
    const saved=[];
    try {
      const bundled=window.QT_ATLAS_SNAPSHOT;
      const at=typeof bundled?.capturedAt==='string' ? Date.parse(bundled.capturedAt) : NaN;
      if (Number.isFinite(at)) saved.push({at,data:decode(bundled.data)});
    } catch {}
    try {
      const cached=JSON.parse(stored(CACHE_KEY));
      if(cached && typeof cached.at==='number' && cached.at<=Date.now() && Date.now()-cached.at<7*86400000) saved.push({at:cached.at,data:decode(cached.data)});
    }catch{}
    saved.sort((a,b)=>b.at-a.at);
    if (saved[0]) {render(saved[0].data,new Date(saved[0].at).toISOString());savedState();}
    window.QtAtlasCrowd={refresh:run};
    run();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
