/* Original conceptual diagrams: no measured data or experimental results. */
(() => {
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const all = () => window.paperStories || [];
  const normalized = title => String(title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const find = pub => all().find(s => s.id === pub.storyId || (pub.link && (s.link === pub.link || (s.aliases || []).includes(pub.link))) || normalized(s.title) === normalized(pub.title));
  const icon = name => `<svg class="paper-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{
    abstract: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m5 16 5-5 4 4 3-3 4 4"/><circle cx="16" cy="9" r="1"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
    new: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
    accepted: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    poster: '<path d="M6 3h9l3 3v15H6Z"/><path d="M14 3v5h4M9 12h6M9 16h6"/>'
  }[name]}</svg>`;
  const plot = (kind, seed) => {
    const path = (d, cls="pe-line") => `<path class="${cls}" d="${d}"/>`;
    const rect = (x,y,w,h,cls="pe-shape") => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/>`;
    const text = (x,y,label,cls="pe-small") => `<text class="${cls}" x="${x}" y="${y}">${esc(label)}</text>`;
    const wave = (y, phase=0) => path("M" + Array.from({length:53},(_,i)=>`${14+i*3},${y+Math.sin(i*.4+phase)*8+Math.sin(i*.15+phase)*4}`).join(" L"));
    if (kind === "views") return `<g transform="translate(2 7) scale(.48)">${plot("graph",seed)}</g><g transform="translate(92 18) scale(.48)">${plot("graph",seed+1)}</g>${text(15,95,"view A")}${text(105,95,"view B")}`;
    if (kind === "graph" || kind === "budgets") {
      const nodes=[[24,33],[67,18],[112,30],[147,61],[102,87],[54,77],[79,50]];
      const edges=[[0,1],[0,5],[0,6],[1,2],[1,6],[2,3],[2,6],[3,4],[4,5],[4,6],[5,6]];
      return edges.map(([a,b])=>path(`M${nodes[a]} L${nodes[b]}`,"pe-edge")).join("")+nodes.map(([x,y],i)=>
        `${kind==="budgets"?`<circle class="pe-budget" cx="${x}" cy="${y}" r="${10+i%3*4}"/>`:""}<circle class="pe-node pe-pulse" style="--node-delay:${i*.15}s" cx="${x}" cy="${y}" r="5"/>`).join("");
    }
    if (kind === "stability") return path("M15 86H160M15 17V86","pe-edge") + path("M16 50H159","pe-target") + path("M17 26L30 74L44 38L57 61L71 44L85 54L101 47L119 51L140 49L158 50") + path("M17 78L30 29L44 68L57 40L71 59L85 47L101 52L119 49L140 51L158 50","pe-secondary") + text(20,102,"bounded MI-surrogate targets");
    if (kind === "windows") return wave(35)+wave(75,1)+rect(65,15,48,77,"pe-window")+text(65,109,"partial action evidence");
    if (kind === "phases") return [0,1,2,3].map(i=>rect(13+i*40,28,30,28,i===seed%4?"pe-focus-shape":"pe-shape")).join("") + text(14,47,"p₁")+text(54,47,"p₂")+text(94,47,"p₃")+text(134,47,"p₄")+path("M13 76H165","pe-edge")+text(15,99,"current phase + recent history");
    if (kind === "route") return rect(14,39,43,26)+text(21,57,"window")+path("M57 52H79M79 52V24H113M79 52V84H113","pe-line")+rect(113,11,49,27,"pe-focus-shape")+rect(113,71,49,27)+text(117,29,"output")+text(117,89,"scripts")+text(59,15,"clear")+text(93,108,"uncertain");
    if (kind === "attention") return [0,1,2,3].map(r=>[0,1,2,3,4,5].map(c=>`<rect class="pe-heat" opacity="${.18+((r*5+c*3+seed)%9)/11}" x="${18+c*24}" y="${13+r*22}" width="20" height="17" rx="3"/>`).join("")).join("");
    if (kind === "layers" || kind === "local" || kind === "decouple") return [0,1,2].map(i=>rect(15+i*53,26,39,41)+text(21+i*53,50,["input","block","head"][i])+(i<2?path(`M${54+i*53} 46H${68+i*53}`):"")+(kind==="local"?path(`M${34+i*53} 68V87`,"pe-secondary")+text(19+i*53,102,"local loss"):"")).join("")+(kind==="decouple"?path("M15 80H164","pe-secondary")+text(25,103,"separate learning stages"):"");
    if (kind === "kernel") return [0,1,2].map(r=>[0,1,2,3,4].map(c=>rect(26+c*25,17+r*25,19,19)).join("")).join("")+rect(50,15,21,77,"pe-window")+rect(24,40,127,23,"pe-focus-shape");
    if (kind === "optimization") return [0,1,2].map(i=>path(`M${15+i*50} 28Q${35+i*50} ${94-i*8} ${56+i*50} 28`,i===1?"pe-secondary":"pe-line")+`<circle class="pe-node" cx="${35+i*50}" cy="${61-i*4}" r="4"/>`).join("")+text(20,103,"class-specific optimization");
    if (kind === "notice") return rect(46,10,81,92)+path("M58 27H111M58 42H111M58 57H100M58 72H111","pe-edge")+text(58,92,["article","notice","together"][seed]);
    if (kind === "video") return [0,1,2].map(i=>rect(11+i*53,22,46,60)+path(`M${19+i*53} 31H${47+i*53}M${19+i*53} 72H${47+i*53}`,"pe-edge")).join("")+text(26,103,"successive video frames");
    if (kind === "angles") return path("M34 35L87 60L134 25M87 60L122 90")+`<circle class="pe-node" cx="34" cy="35" r="4"/><circle class="pe-node" cx="87" cy="60" r="4"/><circle class="pe-node" cx="134" cy="25" r="4"/>`+path("M67 51Q77 38 98 52","pe-secondary")+text(38,109,"joint-angle features");
    if (kind === "correctness") return rect(17,23,145,28,"pe-focus-shape")+rect(17,68,145,28)+text(30,42,"correct movement")+text(30,87,"incorrect movement");
    if (kind === "tradeoff") return path("M22 12V91H164","pe-edge")+path("M32 75Q65 33 144 23")+text(27,109,"inference speed")+text(35,20,"recognition quality");
    if (kind === "tail" || kind === "balance") return [70,48,29,18,12,9].map((h,i)=>rect(15+i*25,88-(kind==="balance"?30+i%2*5:h),18,kind==="balance"?30+i%2*5:h,i>3?"pe-focus-shape":"pe-shape")).join("")+path("M10 91H170","pe-edge")+text(19,110,kind==="tail"?"uneven activity frequencies":"class-specific learning");
    if (kind === "dynamics") return path("M10 90H169M12 12V90","pe-edge") + wave(48,seed) + path("M14 48C50 5 75 92 105 48S143 9 164 48","pe-secondary") + text(28,110,"observations · learned dynamics");
    if (kind === "classify") return [0,1,2].map(i=>rect(24,18+i*29,125-i*30,17,i===0?"pe-focus-shape":"pe-shape")+text(30,31+i*29,["activity A","activity B","activity C"][i])).join("");
    return wave(26,seed)+wave(56,seed+1)+wave(86,seed+2);
  };
  function diagram(story, active=-1, thumbnail=false, responsive=true) {
    const steps=story.steps;
    const narrow=responsive && !thumbnail && window.innerWidth<640;
    const shown=narrow && active>=0 ? [active] : [0,1,2];
    const width=narrow?220:660, height=narrow?(active>=0?230:670):230;
    return `<svg class="pe-diagram${thumbnail?" pe-thumbnail":""}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(story.shortName)}: ${esc(steps.map(s=>s.label).join('; '))}">
      <title>${esc(story.shortName)} — conceptual graphical abstract</title>
      <desc>${esc(story.summary)} ${esc(steps.map(s=>`${s.label}: ${s.description}`).join(' '))}</desc>
      ${shown.map((i,position)=>{const step=steps[i]; return `<g class="pe-stage${i===active?" is-active":""}" data-stage="${i}" transform="translate(${narrow?8:i*220+8} ${narrow?position*220+10:10})">
        <rect class="pe-panel" x="0" y="0" width="204" height="204" rx="12"/>
        <text class="pe-number" x="16" y="27">0${i+1}</text><g transform="translate(13 43)">${plot(step.visual || "signals",i)}</g>
        <text class="pe-label" x="16" y="183">${esc(step.label)}</text>
      </g>${position<shown.length-1?`<path class="pe-connector" d="${narrow?`M110 ${214+position*220}V${230+position*220}`:`M${i*220+212} 112H${i*220+228}`}"/>`:""}`;}).join("")}
    </svg>`;
  }
  function buttons(pub, cls="") {
    const story=find(pub); if (!story) return "";
    return `<button class="paper-link pe-open ${cls}" type="button" data-story="${esc(story.id)}" data-mode="abstract" aria-label="View graphical abstract for ${esc(story.shortName)}">${icon("abstract")}Graphical abstract</button><button class="paper-link pe-open ${cls}" type="button" data-story="${esc(story.id)}" data-mode="animation" aria-label="Play animated introduction for ${esc(story.shortName)}">${icon("play")}Animated intro</button>`;
  }
  function renderNewsCards() {
    const root=document.getElementById("news-papers"); if (!root) return;
    root.innerHTML=(window.siteData.publications || []).filter(p=>p.status==="accepted").map(pub=>{
      const story=find(pub);
      return `<article class="news-paper">
        <div class="news-paper-top"><span class="news-new-badge">${icon("new")}New</span><span class="accepted-badge">${icon("accepted")}Accepted · NeurIPS ${pub.year}</span><span class="news-paper-format">${icon("poster")}Poster · Forthcoming</span></div>
        <h3>${esc(pub.title)}</h3><p class="paper-authors">${esc(pub.authors)}</p>
        ${story?`<div class="news-paper-figure">${diagram(story,-1,true)}</div><p class="news-paper-summary">${esc(story.summary)}</p>`:""}
        <div class="paper-links">${buttons(pub)}</div>
      </article>`;
    }).join("");
  }
  let dialog, current, frame, playing=false, phase=0, mode="abstract", previousFocus;
  const reduced=window.matchMedia?.("(prefers-reduced-motion: reduce)");
  function stop() {playing=false; clearInterval(frame); frame=undefined;}
  function update() {
    dialog.dataset.mode=mode; dialog.classList.toggle("is-playing",playing);
    dialog.querySelector("#pe-figure").innerHTML=diagram(current,mode==="animation"?phase:-1);
    dialog.querySelectorAll("[data-pe-step]").forEach((el,i)=>{el.classList.toggle("is-active",i===phase&&mode==="animation");el.setAttribute("aria-pressed",String(i===phase));});
    const caption=dialog.querySelector("#pe-caption");
    caption.textContent=mode==="abstract"?current.summary:`${current.steps[phase].label}. ${current.steps[phase].description}`;
    dialog.querySelector("#pe-play").textContent=playing?"Pause":"Play";
    dialog.querySelector("#pe-play").setAttribute("aria-pressed",String(playing));
    dialog.querySelectorAll("[data-pe-mode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.peMode===mode)));
    dialog.querySelector("#pe-progress").textContent=mode==="animation"?`Step ${phase+1} of 3`:"All three steps";
  }
  function play() {if (reduced?.matches) return; stop();playing=true;frame=setInterval(()=>{phase=(phase+1)%3;update();},4500);update();}
  function changeMode(next) {stop();mode=next;phase=0;update();}
  function open(story, requestedMode) {
    current=story; stop();phase=0;mode=requestedMode;previousFocus=document.activeElement;
    dialog.querySelector("#pe-title").textContent=story.title;
    dialog.querySelector("#pe-subtitle").textContent=story.shortName + (story.presentationLabel ? ` · ${story.presentationLabel}` : " · Method overview");
    dialog.querySelector("#pe-steps").innerHTML=story.steps.map((s,i)=>`<button type="button" data-pe-step="${i}" aria-pressed="false"><span>0${i+1}</span><strong>${esc(s.label)}</strong><span class="pe-step-description">${esc(s.description)}</span></button>`).join("");
    const source=dialog.querySelector("#pe-source");
    const accepted=story.publicationStatus==="accepted" || (window.siteData.publications || []).some(p=>p.storyId===story.id && p.status==="accepted");
    const sourceUrl=accepted ? "" : story.evidenceUrl || story.link;
    source.hidden=!sourceUrl;
    if(sourceUrl) source.href=sourceUrl; else source.removeAttribute("href");
    dialog.querySelector("#pe-note").textContent=story.evidenceLevel?.startsWith("title")?"Concept overview based on the paper title. Shapes and motion are illustrative; consult the paper for full methodological details.":"Conceptual illustration of the method. Shapes and motion do not represent measured results.";
    dialog.querySelector("#pe-play").disabled=!!reduced?.matches;
    dialog.querySelector("#pe-play").title=reduced?.matches?"Reduced motion is enabled; use the step buttons to explore.":"";
    update();dialog.showModal();document.body.classList.add("pe-modal-open");dialog.querySelector("#pe-close").focus();
    if (mode==="animation" && !reduced?.matches) play();
  }
  function exportSvg() {
    const css=`.pe-panel{fill:#f4f1e9;stroke:#cdd3d1}.pe-number,.pe-small,.pe-label{font-family:Arial,sans-serif;fill:#4d565f}.pe-number{font-size:13px}.pe-small{font-size:10px}.pe-label{font-size:13px;font-weight:bold}.pe-line,.pe-edge,.pe-target,.pe-secondary,.pe-connector{fill:none;stroke:#0e5f63;stroke-width:2}.pe-edge{stroke:#929c9b;stroke-width:1}.pe-secondary{stroke:#96690f}.pe-target{stroke-dasharray:4 4;stroke:#96690f}.pe-shape{fill:#e1eae7;stroke:#0e5f63}.pe-focus-shape{fill:#b8d4cc;stroke:#0e5f63}.pe-window{fill:#96690f;fill-opacity:.12;stroke:#96690f}.pe-heat,.pe-node{fill:#0e5f63}.pe-budget{fill:#96690f;fill-opacity:.1;stroke:#96690f;stroke-dasharray:3 3}`;
    let svg=diagram(current,-1,false,false).replace(/<svg /,'<svg width="1320" height="460" ').replace(/<title>/,`<style>${css}</style><title>`);
    const url=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;link.download=`${current.id}-graphical-abstract.svg`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  window.paperExplainer={find,buttons,diagram,renderNewsCards};
  document.addEventListener("DOMContentLoaded",()=>{
    dialog=document.getElementById("paper-dialog"); if (!dialog) return;
    renderNewsCards();
    document.addEventListener("click",e=>{const button=e.target.closest("[data-story]");if(!button)return;const story=all().find(s=>s.id===button.dataset.story);if(story)open(story,button.dataset.mode || "abstract");});
    dialog.addEventListener("click",e=>{
      const modeButton=e.target.closest("[data-pe-mode]");if(modeButton){changeMode(modeButton.dataset.peMode);return;}
      const step=e.target.closest("[data-pe-step]");if(step){stop();mode="animation";phase=Number(step.dataset.peStep);update();return;}
      if(e.target.id==="pe-play"){mode="animation";playing?(stop(),update()):play();}
      if(e.target.id==="pe-restart"){stop();mode="animation";phase=0;update();}
      if(e.target.id==="pe-download")exportSvg();
      if(e.target.id==="pe-close")dialog.close();
      if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}
    });
    dialog.addEventListener("close",()=>{stop();document.body.classList.remove("pe-modal-open");previousFocus?.focus({preventScroll:true});});
    document.addEventListener("visibilitychange",()=>{if(document.hidden&&playing){stop();update();}});
    reduced?.addEventListener("change",()=>{if(dialog.open){stop();dialog.querySelector("#pe-play").disabled=reduced.matches;update();}});
    window.addEventListener("resize",()=>{if(dialog.open)update();});
  });
})();
