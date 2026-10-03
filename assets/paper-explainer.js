/* Paper figures are extracted from source manuscripts; motion only highlights verified regions. */
(() => {
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const all = () => window.paperStories || [];
  const normalized = title => String(title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const find = pub => all().find(s => s.id === pub.storyId || (pub.link && (s.link === pub.link || (s.aliases || []).includes(pub.link))) || normalized(s.title) === normalized(pub.title));
  const hasFigure = story => !!story?.figure?.src;
  const hasAnimation = story => hasFigure(story) && story.steps?.length === 3 && story.figure.regions?.length === 3 && story.figure.regions.every(r =>
    [r.x, r.y, r.width, r.height].every(Number.isFinite) && r.x >= 0 && r.y >= 0 && r.width > 0 && r.height > 0 && r.x + r.width <= 1.001 && r.y + r.height <= 1.001);
  const icon = name => `<svg class="paper-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{
    abstract: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m5 16 5-5 4 4 3-3 4 4"/><circle cx="16" cy="9" r="1"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
    new: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
    accepted: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    poster: '<path d="M6 3h9l3 3v15H6Z"/><path d="M14 3v5h4M9 12h6M9 16h6"/>'
  }[name]}</svg>`;
  // Pure HTML for both archive previews and the zoomable dialog. No substitute diagram is generated.
  function figureMarkup(story, {thumbnail = false, active = -1, zoom = 1} = {}) {
    if (!hasFigure(story)) return "";
    const figure = story.figure;
    const dimensions = Number.isFinite(figure.width) && Number.isFinite(figure.height) ? ` width="${figure.width}" height="${figure.height}"` : "";
    const regions = !thumbnail && hasAnimation(story) ? figure.regions.map((r, i) => `<span class="pe-region" data-pe-region="${i}" aria-hidden="true"${i === active ? "" : " hidden"} style="left:${r.x * 100}%;top:${r.y * 100}%;width:${r.width * 100}%;height:${r.height * 100}%"></span>`).join("") : "";
    return `<span class="pe-image-stage${thumbnail ? " pe-image-thumbnail" : ""}" style="width:${thumbnail ? 100 : zoom * 100}%"><img class="pe-original-image" src="${esc(figure.src)}" alt="${esc(figure.alt || `${story.shortName}: original paper framework`)}"${dimensions} loading="${thumbnail ? "lazy" : "eager"}" decoding="async">${regions}</span>`;
  }
  function buttons(pub, cls = "") {
    const story = find(pub); if (!hasFigure(story)) return "";
    return `<button class="paper-link pe-open ${cls}" type="button" data-story="${esc(story.id)}" data-mode="abstract" aria-label="View paper framework for ${esc(story.shortName)}">${icon("abstract")}Paper framework</button>` + (hasAnimation(story) ? `<button class="paper-link pe-open ${cls}" type="button" data-story="${esc(story.id)}" data-mode="animation" aria-label="Play animated introduction for ${esc(story.shortName)}">${icon("play")}Animated intro</button>` : "");
  }
  function renderNewsCards() {
    const root = document.getElementById("news-papers"); if (!root) return;
    root.innerHTML = (window.siteData.publications || []).filter(p => p.status === "accepted").map(pub => {
      const story = find(pub);
      return `<article class="news-paper">
        <div class="news-paper-top"><span class="news-new-badge">${icon("new")}New</span><span class="accepted-badge">${icon("accepted")}Accepted · NeurIPS ${pub.year}</span><span class="news-paper-format">${icon("poster")}Poster · Forthcoming</span></div>
        <h3>${esc(pub.title)}</h3><p class="paper-authors">${esc(pub.authors)}</p>
        ${hasFigure(story) ? `<figure class="news-paper-figure"><button class="publication-preview" type="button" data-story="${esc(story.id)}" data-mode="abstract" aria-label="View paper framework for ${esc(story.shortName)}"><span class="publication-preview-topline"><span>Original paper figure</span><span class="publication-preview-open">Enlarge ↗</span></span>${figureMarkup(story, {thumbnail:true})}</button><figcaption class="publication-figure-caption">${esc(story.figure.label || "Paper framework")}</figcaption></figure>` : ""}
        ${story ? `<p class="news-paper-summary">${esc(story.summary)}</p>` : ""}
        <div class="paper-links">${buttons(pub)}</div>
      </article>`;
    }).join("");
  }
  let dialog, current, frame, playing = false, phase = 0, mode = "abstract", zoom = 1, previousFocus;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  function stop() { playing = false; clearInterval(frame); frame = undefined; }
  function update() {
    dialog.dataset.mode = mode; dialog.classList.toggle("is-playing", playing);
    dialog.querySelectorAll("[data-pe-region]").forEach(el => { el.hidden = mode !== "animation" || Number(el.dataset.peRegion) !== phase; });
    dialog.querySelectorAll("[data-pe-step]").forEach((el, i) => { const active = i === phase && mode === "animation"; el.classList.toggle("is-active", active); el.setAttribute("aria-pressed", String(active)); });
    const animationMode = mode === "animation" && hasAnimation(current);
    dialog.querySelector("#pe-steps").hidden = !animationMode;
    dialog.querySelector("#pe-play").hidden = !animationMode;
    dialog.querySelector("#pe-restart").hidden = !animationMode;
    dialog.querySelector("#pe-play").disabled = !!reduced?.matches;
    dialog.querySelector("#pe-play").title = reduced?.matches ? "Reduced motion is enabled; use the step buttons to explore." : "";
    const motionNote = dialog.querySelector("#pe-motion-note");
    motionNote.hidden = !animationMode || !reduced?.matches;
    const motionMessage = reduced?.matches ? "Reduced motion is enabled. Select a step to explore." : "";
    if (motionNote.textContent !== motionMessage) motionNote.textContent = motionMessage;
    dialog.querySelector("#pe-caption").textContent = mode === "abstract" ? `${current.figure.label || "Paper framework"}. ${current.summary}` : `${current.steps[phase].label}. ${current.steps[phase].description}`;
    dialog.querySelector("#pe-play").textContent = playing ? "Pause" : "Play";
    dialog.querySelector("#pe-play").setAttribute("aria-pressed", String(playing));
    dialog.querySelectorAll("[data-pe-mode]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.peMode === mode)));
    dialog.querySelector("#pe-progress").textContent = mode === "animation" ? `Step ${phase + 1} of 3` : "Original paper figure";
  }
  function setZoom(next) {
    zoom = Math.max(1, Math.min(4, next));
    const stage = dialog.querySelector(".pe-image-stage");
    if (stage) stage.style.width = `${zoom * 100}%`;
    dialog.querySelector("#pe-zoom-level").textContent = `${Math.round(zoom * 100)}%`;
    dialog.querySelector("#pe-zoom-out").disabled = zoom === 1;
    dialog.querySelector("#pe-zoom-in").disabled = zoom === 4;
    if (zoom === 1) { const viewport = dialog.querySelector("#pe-figure"); viewport.scrollLeft = 0; viewport.scrollTop = 0; }
  }
  function play() { if (reduced?.matches || !hasAnimation(current)) return; stop(); playing = true; frame = setInterval(() => { phase = (phase + 1) % 3; update(); }, 4500); update(); }
  function changeMode(next) { stop(); mode = next === "animation" && hasAnimation(current) ? "animation" : "abstract"; phase = 0; update(); }
  function open(story, requestedMode) {
    if (!hasFigure(story)) return;
    current = story; stop(); phase = 0; mode = requestedMode === "animation" && hasAnimation(story) ? "animation" : "abstract"; previousFocus = document.activeElement;
    dialog.querySelector("#pe-title").textContent = story.title;
    dialog.querySelector("#pe-subtitle").textContent = story.shortName + (story.presentationLabel ? ` · ${story.presentationLabel}` : " · Original paper framework");
    dialog.querySelector("#pe-figure").innerHTML = figureMarkup(story);
    dialog.querySelector("#pe-steps").innerHTML = hasAnimation(story) ? story.steps.map((s, i) => `<button type="button" data-pe-step="${i}" aria-pressed="false"><span>0${i + 1}</span><strong>${esc(s.label)}</strong><span class="pe-step-description">${esc(s.description)}</span></button>`).join("") : "";
    dialog.querySelector('[data-pe-mode="animation"]').hidden = !hasAnimation(story);
    const source = dialog.querySelector("#pe-source");
    const accepted = story.publicationStatus === "accepted" || (window.siteData.publications || []).some(p => p.storyId === story.id && p.status === "accepted");
    const sourceUrl = accepted ? "" : story.figure.sourceUrl || story.evidenceUrl || story.link;
    source.hidden = !sourceUrl;
    if (sourceUrl) source.href = sourceUrl; else source.removeAttribute("href");
    dialog.querySelector("#pe-note").textContent = hasAnimation(story) ? "Original paper figure. The walkthrough highlights the corresponding parts of the framework without changing its content." : "Original paper figure, preserving the paper's labels and connections.";
    setZoom(1); update(); dialog.showModal(); document.body.classList.add("pe-modal-open"); dialog.querySelector("#pe-close").focus();
    if (mode === "animation" && !reduced?.matches) play();
  }
  function downloadFigure() {
    if (!hasFigure(current)) return;
    const extension = current.figure.src.split("?")[0].split(".").pop();
    const link = document.createElement("a"); link.href = current.figure.src; link.download = `${current.id}-paper-framework.${extension}`; document.body.appendChild(link); link.click(); link.remove();
  }
  window.paperExplainer = {find, buttons, figureMarkup, hasFigure, hasAnimation, renderNewsCards};
  document.addEventListener("DOMContentLoaded", () => {
    dialog = document.getElementById("paper-dialog"); if (!dialog) return;
    renderNewsCards();
    document.addEventListener("click", e => { const button = e.target.closest("[data-story]"); if (!button) return; const story = all().find(s => s.id === button.dataset.story); if (story) open(story, button.dataset.mode || "abstract"); });
    dialog.addEventListener("click", e => {
      const modeButton = e.target.closest("[data-pe-mode]"); if (modeButton) { changeMode(modeButton.dataset.peMode); return; }
      const step = e.target.closest("[data-pe-step]"); if (step && hasAnimation(current)) { stop(); mode = "animation"; phase = Number(step.dataset.peStep); update(); return; }
      if (e.target.id === "pe-play" && hasAnimation(current)) { mode = "animation"; playing ? (stop(), update()) : play(); }
      if (e.target.id === "pe-restart" && hasAnimation(current)) { stop(); mode = "animation"; phase = 0; update(); }
      if (e.target.id === "pe-zoom-in") setZoom(zoom + .5);
      if (e.target.id === "pe-zoom-out") setZoom(zoom - .5);
      if (e.target.id === "pe-zoom-fit") setZoom(1);
      if (e.target.id === "pe-download") downloadFigure();
      if (e.target.id === "pe-close") dialog.close();
      if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); }
    });
    dialog.addEventListener("close", () => {
      stop(); document.body.classList.remove("pe-modal-open");
      const returnTarget = previousFocus?.isConnected ? previousFocus : [...document.querySelectorAll("[data-story]")].find(el => el.dataset.story === current.id && el.dataset.mode === previousFocus?.dataset.mode);
      returnTarget?.focus({preventScroll:true});
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden && playing) { stop(); update(); } });
    reduced?.addEventListener("change", () => { if (dialog.open) { stop(); update(); } });
  });
})();
