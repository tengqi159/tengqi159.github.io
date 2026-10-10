/* ============================================================
   Qi Teng — Academic Homepage
   Rendering, motion, and the living signal field.
   ============================================================ */

const ARROW_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>';
const COPY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" /></svg>';
const CHECK_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>';
const CITE_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 5h11A1.5 1.5 0 0 1 19 6.5v7a1.5 1.5 0 0 1-1.5 1.5H13l-3.6 3.3c-.3.3-.9.1-.9-.4v-2.9H6.5A1.5 1.5 0 0 1 5 13.5v-7A1.5 1.5 0 0 1 6.5 5Z" /><path d="M9 9.4h2.2M12.8 9.4H15" /></svg>';
const DOC_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7L19 8.5V20.5H7V3.5Z" /><path d="M13.5 3.5V9H19" /></svg>';

const METRIC_ICONS = {
  Citations:
    '<svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 5h11A1.5 1.5 0 0 1 19 6.5v7a1.5 1.5 0 0 1-1.5 1.5H13l-3.6 3.3c-.3.3-.9.1-.9-.4v-2.9H6.5A1.5 1.5 0 0 1 5 13.5v-7A1.5 1.5 0 0 1 6.5 5Z" /></svg>',
  "h-index":
    '<svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16" /><path d="M7.5 20v-5.5M12 20V9.5M16.5 20v-7.5" /></svg>',
  "i10-index":
    '<svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 4 7.5 20M16.5 4l-2 16M4 9h16.5M3.5 15h16.5" /></svg>',
  "Current Position":
    '<svg class="metric-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 8 4.5H4l8-4.5Z" /><path d="M5.6 11v6M9.9 11v6M14.1 11v6M18.4 11v6M4 20.5h16" /></svg>'
};

const NEWS_ICONS = {
  paper:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7L19 8.5V20.5H7V3.5Z" /><path d="M13.5 3.5V9H19" /><path d="M9.8 13h4.4M9.8 16.2h4.4" /></svg>',
  award:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9.5" r="4.5" /><path d="m9.7 13.3-1.8 7.2 4.1-2.4 4.1 2.4-1.8-7.2" /></svg>',
  grant:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 8 4.5H4l8-4.5Z" /><path d="M5.6 11v6M9.9 11v6M14.1 11v6M18.4 11v6M4 20.5h16" /></svg>',
  talk:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9.5" y="3.5" width="5" height="9" rx="2.5" /><path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V20M9 20h6" /></svg>',
  code:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4" /></svg>',
  service:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 5 6v5.5c0 4.3 2.8 7.4 7 9 4.2-1.6 7-4.7 7-9V6l-7-2.5Z" /><path d="m9 11.8 2.2 2.2 4-4.2" /></svg>',
  misc:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 2.1 4.9 5.4.4-4.1 3.5 1.2 5.2-4.6-2.7-4.6 2.7 1.2-5.2-4.1-3.5 5.4-.4L12 4Z" /></svg>'
};

const NEWS_TYPE_LABELS = {
  paper: "Paper",
  award: "Award",
  grant: "Grant",
  talk: "Talk",
  code: "Code",
  service: "Service",
  misc: "News"
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/* ---------- title matching (Scholar whitelist) ---------- */

const normalizeTitle = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

function isExcludedPublication(publication, exclusions = window.siteData.excludedPublications || []) {
  const fullTitle = value => String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
  const doiKey = value => {
    const key = String(value || "").trim().toLowerCase()
      .replace(/^doi:\s*/, "")
      .replace(/^https?:\/\/(?:dx\.)?doi\.org\//, "")
      .replace(/[?#].*$/, "")
      .replace(/\/+$/, "");
    return /^10\.\d{4,9}\/\S+$/.test(key) ? key : "";
  };
  const title = fullTitle(publication?.title);
  const dois = [publication?.doi, publication?.link].map(doiKey).filter(Boolean);
  return (Array.isArray(exclusions) ? exclusions : []).some(exclusion => {
    const excludedTitle = fullTitle(exclusion?.title);
    const excludedDoi = doiKey(exclusion?.doi || exclusion?.link);
    return (title && excludedTitle && title === excludedTitle) ||
      (excludedDoi && dois.includes(excludedDoi));
  });
}


/* ---------- shared state ---------- */

const state = {
  publications: window.siteData.publications.filter(publication => !isExcludedPublication(publication))
};

let archiveApi = null;

/* ---------- rendering ---------- */

function renderHeroBadges() {
  const container = document.getElementById("hero-ribbons");
  if (!container) return;
  container.replaceChildren(
    ...window.siteData.profile.heroBadges.map((label) => {
      const badge = document.createElement("span");
      badge.className = "hero-ribbon";
      badge.textContent = label;
      return badge;
    })
  );
}

function renderContacts() {
  const container = document.getElementById("contact-strip");
  if (!container) return;

  container.replaceChildren(
    ...window.siteData.profile.contacts.map((contact) => {
      const row = document.createElement("div");
      row.className = "contact-row";

      const label = document.createElement("span");
      label.className = "contact-row-label";
      label.textContent = contact.label;
      row.appendChild(label);

      if (contact.href) {
        const link = document.createElement("a");
        link.className = "contact-row-value";
        link.href = contact.href;
        if (contact.href.startsWith("http")) {
          link.target = "_blank";
          link.rel = "noreferrer";
        }
        link.textContent = contact.value;
        row.appendChild(link);
      } else {
        const value = document.createElement("span");
        value.className = "contact-row-value";
        value.textContent = contact.value;
        row.appendChild(value);
      }

      if (contact.copyValue) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "contact-copy";
        button.dataset.copy = contact.copyValue;
        button.setAttribute("aria-label", `Copy ${contact.label}`);
        button.innerHTML = COPY_ICON;
        row.appendChild(button);
      }

      return row;
    })
  );
}

function renderMetrics() {
  const container = document.getElementById("metrics-grid");
  if (!container) return;

  container.replaceChildren(
    ...window.siteData.profile.metrics.map((metric) => {
      const article = document.createElement("article");
      article.className = "metric";

      const label = document.createElement("span");
      label.className = "metric-label";
      label.innerHTML = `${METRIC_ICONS[metric.label] || ""}<span></span>`;
      label.lastElementChild.textContent = metric.label;

      const value = document.createElement("strong");
      value.className = "metric-value";
      const numeric = parseInt(metric.value.replace(/[^\d]/g, ""), 10);
      if (Number.isFinite(numeric) && /^\d/.test(metric.value.trim())) {
        value.dataset.count = String(numeric);
        value.textContent = "0";
      } else {
        value.textContent = metric.value;
        value.classList.add("is-text");
      }

      const note = document.createElement("span");
      note.className = "metric-note";
      note.textContent = metric.note;

      article.replaceChildren(label, value, note);
      return article;
    })
  );
}

/* ---------- BibTeX citation ---------- */

const BIBTEX_TYPES = {
  "Journal article": "article",
  Article: "article",
  Review: "article",
  Preprint: "misc",
  "Conference paper": "inproceedings",
  "Book chapter": "incollection",
  Correction: "misc",
  Letter: "misc",
  Editorial: "misc"
};

const BIBTEX_STOPWORDS = new Set([
  "with", "from", "using", "based", "that", "this", "for", "and", "the"
]);

function bibtexText(value) {
  const escapes = {"\\":"\\textbackslash{}", "{":"\\{", "}":"\\}", "&":"\\&", "%":"\\%", "#":"\\#", "_":"\\_", "$":"\\$", "~":"\\textasciitilde{}", "^":"\\textasciicircum{}"};
  return String(value ?? "").replace(/[\\{}&%#_$~^]/g, char => escapes[char]).replace(/\s+/g, " ").trim();
}

function legacyBibliography(publication) {
  let journal = String(publication.venue || "").trim();
  const year = journal.match(/(?:,\s*|\s*·\s*)(\d{4})$/);
  if (year) journal = journal.slice(0, year.index).trim();
  const suffix = journal.match(/^(.*?)\s+(?:Vol\.\s*)?(\d+)(?=\s*(?:\(|,|$))([\s\S]*)$/i);
  const result = { journal, year: publication.year };
  // Numeric/punctuation-only suffixes can be separated even when Scholar
  // truncates an issue. Never infer missing digits from an ellipsis.
  if (suffix && /^[\d\s,().:;\u2010-\u2015\-…]*$/.test(suffix[3])) {
    result.journal = suffix[1].trim();
    result.volume = suffix[2];
    const number = suffix[3].match(/^\s*\(\s*([\d\u2010-\u2015-]+)\s*\)/);
    if (number) result.number = number[1];
    const pages = suffix[3].match(/(?:^|[,;\s])(\d+\s*[\u2010-\u2015-]+\s*\d+)\s*$/);
    if (pages) result.pages = pages[1];
  }
  return result;
}

function bibliographyDoi(publication, bibliography) {
  const value = String(bibliography.doi || publication.doi || publication.link || "")
    .trim().replace(/^doi:\s*/i, "").replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .replace(/[?#].*$/, "");
  return /^10\.\d{4,9}\/[^\s{}]+$/.test(value) ? value : "";
}

function bibtexFor(publication) {
  if (publication.status === "accepted") {
    const slug = publication.storyId || "paper";
    return `@unpublished{teng${publication.year}${slug}, title={${bibtexText(publication.title)}}, author={${bibtexText(String(publication.authors || "").split(",").map(s=>s.trim()).join(" and "))}}, note={Accepted at NeurIPS ${publication.year} (Poster); proceedings forthcoming}}`;
  }
  const authors = String(publication.authors || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => {
      const parts = name.split(/\s+/);
      const last = parts.pop();
      return parts.length ? `${last}, ${parts.join(" ")}` : last;
    })
    .join(" and ");

  const firstAuthor = String(publication.authors || "work").split(",")[0];
  const lastName = (firstAuthor.trim().split(/\s+/).pop() || "work").toLowerCase().replace(/[^a-z0-9]/g, "") || "work";
  const titleWord =
    String(publication.title || "")
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .find((word) => word.length > 3 && !BIBTEX_STOPWORDS.has(word)) || "paper";
  const bibliography = { ...legacyBibliography(publication), ...publication.bibliography };
  const year = bibliography.year || publication.year;
  const key = `${lastName}${year || ""}${titleWord}`;
  const venue = bibliography.journal;
  const doi = bibliographyDoi(publication, bibliography);
  const entryType = BIBTEX_TYPES[publication.type] || "misc";
  const venueField =
    entryType === "article"
      ? `journal={${bibtexText(venue)}}`
      : entryType === "inproceedings"
        ? `booktitle={${bibtexText(venue)}}`
        : `howpublished={${bibtexText(venue)}}`;

  const fields = [
    `title={${bibtexText(publication.title)}}`,
    authors && `author={${bibtexText(authors)}}`,
    venue && venueField,
    year && `year={${year}}`,
    bibliography.volume && `volume={${bibtexText(bibliography.volume)}}`,
    bibliography.number && `number={${bibtexText(bibliography.number)}}`,
    bibliography.articleNumber
      ? `eid={${bibtexText(bibliography.articleNumber)}}`
      : bibliography.pages && `pages={${bibtexText(String(bibliography.pages).replace(/\s*[\u2010-\u2015-]+\s*/g, "--"))}}`,
    doi && `doi={${doi}}`
  ].filter(Boolean);

  return `@${entryType}{${key}, ${fields.join(", ")}}`;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function venueLine(publication) {
  const venue = publication.venue || "";
  const details = publication.details || "";
  // Scholar's venue often already includes the full bibliographic line.
  const line = publication.year && new RegExp(`(?:,|\\s)${publication.year}$`).test(venue.trim())
    ? venue : venue && details && details.includes(venue)
      ? details : [venue, details].filter(Boolean).join(" · ");
  const canonicalYear = publication.bibliography?.year || publication.year;
  const onlineYear = publication.onlineYear;
  return onlineYear && String(onlineYear) !== String(canonicalYear)
    ? [line, `First online ${onlineYear}`].filter(Boolean).join(" · ") : line;
}

function venueLineHtml(publication) {
  const journal = publication.bibliography?.journal || publication.venue || "";
  const line = venueLine(publication);
  if (journal && line.startsWith(journal)) return `<em>${escapeAttr(journal)}</em>${escapeAttr(line.slice(journal.length))}`;
  return escapeAttr(line);
}

function createPaperLinks(publication, extraClass) {
  const links = [];
  if (window.paperExplainer) links.push(window.paperExplainer.buttons(publication, extraClass));
  if (publication.status === "accepted") return links.join("");
  const scholarSearch = new URL("https://scholar.google.com/scholar");
  scholarSearch.searchParams.set("q", publication.title);
  if (publication.link) {
    links.push(
      `<a class="paper-link ${extraClass}" href="${publication.link}" target="_blank" rel="noreferrer">${publication.linkLabel}${ARROW_ICON}</a>`
    );
  }
  for (const version of publication.preprints || []) {
    if (!/^https:\/\/arxiv\.org\/abs\/\d{4}\.\d{4,5}(?:v\d+)?$/.test(version.link || "")) continue;
    links.push(
      `<a class="paper-link ${extraClass}" href="${escapeAttr(version.link)}" target="_blank" rel="noreferrer" aria-label="arXiv preprint for ${escapeAttr(publication.title)}">arXiv${ARROW_ICON}</a>`
    );
  }
  if (publication.codeVerified && /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(publication.code || "")) {
    links.push(
      `<a class="paper-link ${extraClass}" href="${escapeAttr(publication.code)}" target="_blank" rel="noreferrer" aria-label="Code repository for ${escapeAttr(publication.title)}">Code${ARROW_ICON}</a>`
    );
  }
  links.push(
    `<a class="paper-link ${extraClass}" href="${scholarSearch.toString()}" target="_blank" rel="noreferrer">Scholar${ARROW_ICON}</a>`
  );
  links.push(
    `<button type="button" class="paper-link cite-btn ${extraClass}" data-copy="${escapeAttr(bibtexFor(publication))}" aria-label="Copy BibTeX citation">Cite${CITE_ICON}</button>`
  );
  return links.join("");
}

function publicationPreview(publication) {
  const explainer = window.paperExplainer;
  const story = explainer?.find(publication);
  if (!explainer?.hasFigure(story)) return "";
  return `<figure class="publication-preview-wrap">
    <button class="publication-preview" type="button" data-story="${escapeAttr(story.id)}" data-mode="abstract" aria-label="View paper framework for ${escapeAttr(story.shortName)}">
      <span class="publication-preview-topline"><span>Original paper figure</span><span class="publication-preview-open">Enlarge${ARROW_ICON}</span></span>
      ${explainer.figureMarkup(story, {thumbnail:true})}
    </button>
  </figure>`;
}

function publicationSummary(publication) {
  const explainer = window.paperExplainer;
  const story = explainer?.find(publication);
  return explainer?.hasReviewedContent(story)
    ? `<p class="publication-summary">${escapeAttr(story.summary)}</p>`
    : "";
}

function citationLabel(publication) {
  if (publication.status === "accepted") return "Accepted · Forthcoming";
  if (!Number.isFinite(publication.citations)) return "Citations unavailable";
  const date = publication.citationsUpdatedAt;
  const older = date && date !== window.siteData.profile?.updatedAt;
  return `Cited by ${publication.citations}${older ? ` · ${date}` : ""}`;
}

function renderSelectedPublications() {
  const container = document.getElementById("selected-publications");
  if (!container) return;

  const selected = sortPublications(
    state.publications.filter((item) => item.selected),
    "citations"
  );

  /* Meters are scaled by the square root of the count: the 200+ work
     and the 3-citation work both stay readable on one bar. */
  const peak = selected.reduce(
    (max, item) => Math.max(max, Math.sqrt(Math.max(0, item.citations || 0))),
    0
  );

  container.replaceChildren(
    ...selected.map((publication) => {
      const card = document.createElement("article");
      card.className = "selected-card paper-row";
      card.innerHTML = `
        ${publicationPreview(publication)}
        <div class="publication-copy">
          <div class="paper-topline">
            <span class="paper-badge">${publication.year}</span>
            <span class="paper-badge ${publication.status === "accepted" ? "accepted-badge" : "citation"}">${citationLabel(publication)}</span>
            <span class="paper-badge">${publication.type}</span>
          </div>
          <h3>${publication.title}</h3>
          <p class="paper-authors">${publication.authors}</p>
          <p class="paper-venue">${venueLine(publication)}</p>
          ${publicationSummary(publication)}
          <div class="paper-links">${createPaperLinks(publication, "")}</div>
        </div>
      `;

      const share =
        peak > 0 ? Math.sqrt(Math.max(0, publication.citations || 0)) / peak : 0;
      const foot = document.createElement("div");
      foot.className = "cite-foot";
      const meter = document.createElement("span");
      meter.className = "cite-meter";
      meter.setAttribute("aria-hidden", "true");
      const bar = document.createElement("i");
      bar.style.setProperty("--w", `${share > 0 ? Math.max(6, Math.round(share * 100)) : 0}%`);
      meter.appendChild(bar);
      foot.appendChild(meter);
      if (publication.status !== "accepted") card.querySelector(".publication-copy").appendChild(foot);

      return card;
    })
  );
}

function sortPublications(publications, mode) {
  const count = paper => Number.isFinite(paper.citations) ? paper.citations : -1;
  return [...publications].sort((left, right) => {
    if (mode === "citations") {
      return count(right) - count(left) || right.year - left.year;
    }
    return right.year - left.year || count(right) - count(left);
  });
}

function createFilterChip(label, active, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `filter-chip${active ? " is-active" : ""}`;
  button.textContent = label;
  button.dataset.year = label;
  button.setAttribute("aria-pressed", String(active));
  button.addEventListener("click", onClick);
  return button;
}

function publicationSearchText(publication) {
  const versions = (publication.preprints || []).flatMap(version => [
    "arXiv", version.title, version.link, version.doi, ...(version.scholarTitleAliases || [])
  ]);
  return [publication.title, publication.authors, publication.venue, ...versions]
    .filter(Boolean).join(" ").toLowerCase();
}

function setupArchive() {
  const listContainer = document.getElementById("publication-list");
  const filtersContainer = document.getElementById("year-filters");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("publication-search");
  const emptyNote = document.getElementById("archive-empty");
  const resultCount = document.getElementById("archive-count");
  const reset = document.getElementById("archive-reset");
  if (!listContainer || !filtersContainer || !sortSelect || !searchInput) return;

  let activeYear = "All";
  let activeSort = sortSelect.value;
  let query = "";

  function renderFilters() {
    const focusedYear = filtersContainer.contains(document.activeElement) ? document.activeElement.dataset.year : null;
    const years = [
      "All",
      ...new Set(
        sortPublications(state.publications, "recent").map((item) =>
          String(item.year)
        )
      )
    ];
    filtersContainer.replaceChildren(
      ...years.map((year) =>
        createFilterChip(year, year === activeYear, () => {
          activeYear = year;
          renderFilters();
          renderList();
        })
      )
    );
    if (focusedYear) [...filtersContainer.children].find(button=>button.dataset.year===focusedYear)?.focus({preventScroll:true});
  }

  function renderList() {
    const filtered = state.publications.filter((publication) => {
      const matchesYear =
        activeYear === "All" || String(publication.year) === activeYear;
      if (!matchesYear) return false;
      if (!query) return true;
      return publicationSearchText(publication).includes(query);
    });

    const sorted = sortPublications(filtered, activeSort);

    listContainer.replaceChildren(
      ...sorted.map((publication) => {
        const item = document.createElement("article");
        item.className = "publication-item";
        item.innerHTML = `
          <div class="publication-main paper-row">
            ${publicationPreview(publication)}
            <div class="publication-copy">
              <div class="paper-topline publication-topline">
                <span class="publication-year">${publication.year}</span>
                <span class="cited-chip">${citationLabel(publication)}</span>
                <span class="paper-badge">${publication.type}</span>
              </div>
              <h3>${publication.title}</h3>
              <p class="publication-authors">${publication.authors}</p>
              <p class="publication-meta">${venueLineHtml(publication)}</p>
              ${publicationSummary(publication)}
              <div class="publication-links">${createPaperLinks(publication, "")}</div>
            </div>
          </div>
        `;
        return item;
      })
    );

    if (emptyNote) {
      emptyNote.hidden = sorted.length > 0;
    }
    if (resultCount) resultCount.textContent = query || activeYear !== "All"
      ? `${sorted.length} of ${state.publications.length} publications${activeYear !== "All" ? ` · ${activeYear}` : ""}`
      : `${sorted.length} publications`;
    if (reset) reset.hidden = !query && activeYear === "All";
  }

  reset?.addEventListener("click",()=>{
    activeYear="All";query="";searchInput.value="";renderFilters();renderList();searchInput.focus();
  });

  sortSelect.addEventListener("change", (event) => {
    activeSort = event.target.value;
    renderList();
  });

  searchInput.addEventListener("input", (event) => {
    query = event.target.value.trim().toLowerCase();
    renderList();
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      query = "";
      renderList();
      searchInput.blur();
    }
  });

  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName;
    if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag)) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  renderFilters();
  renderList();

  return {
    refresh() {
      const years = new Set(state.publications.map((item) => String(item.year)));
      if (activeYear !== "All" && !years.has(activeYear)) {
        activeYear = "All";
      }
      renderFilters();
      renderList();
    }
  };
}

/* ---------- news timeline ---------- */

function formatNewsDate(raw) {
  const parts = String(raw || "").split("-");
  const year = parts[0] || "";
  const month = parts[1] ? MONTH_NAMES[Number(parts[1]) - 1] || "" : "";
  const day = parts[2] ? String(Number(parts[2])) : "";
  if (month && day) return `${day} ${month} ${year}`;
  if (month) return `${month} ${year}`;
  return year;
}

function isFreshNews(raw) {
  const [year, month = 1] = String(raw || "").split("-").map(Number);
  if (!Number.isFinite(year) || !year) return false;
  const now = new Date();
  const itemIndex = year * 12 + (month || 1);
  const nowIndex = now.getFullYear() * 12 + (now.getMonth() + 1);
  return nowIndex >= itemIndex && nowIndex - itemIndex <= 4;
}

function renderNews() {
  const list = document.getElementById("news-timeline");
  if (!list) return;

  const items = [...(window.siteData.news || [])].filter(item=>item.status!=="accepted").sort((a, b) =>
    String(b.date).localeCompare(String(a.date))
  );

  const hasAcceptedPapers = (window.siteData.publications || []).some(publication => publication.status === "accepted");
  const section = document.getElementById("news");
  const navLink = document.querySelector('[data-nav="news"]');
  const history = list.closest(".news-history");
  if (section) section.hidden = !items.length && !hasAcceptedPapers;
  if (navLink) navLink.hidden = !items.length && !hasAcceptedPapers;
  if (history) history.hidden = !items.length;

  if (!items.length) {
    list.replaceChildren();
    return;
  }

  list.replaceChildren(
    ...items.map((item, index) => {
      const li = document.createElement("li");
      li.className = "news-item";
      li.style.setProperty("--d", `${Math.min(index, 8) * 70}ms`);

      const type = NEWS_ICONS[item.type] ? item.type : "misc";
      const dateLabel = formatNewsDate(item.date);
      const venue = item.venue
        ? ` <em class="news-venue">${item.venue}</em>.`
        : "";
      const link = item.link
        ? `<a class="news-link" href="${item.link}" target="_blank" rel="noreferrer">${item.linkLabel || "Details"}${ARROW_ICON}</a>`
        : "";

      li.innerHTML = `
        <span class="news-date">${dateLabel}</span>
        <span class="news-node" aria-hidden="true">${NEWS_ICONS[type]}</span>
        <div class="news-body">
          <p>${item.text}${venue}</p>
          <div class="news-meta">
            <span class="news-date-inline">${dateLabel}</span>
            <span class="news-type">${NEWS_TYPE_LABELS[type]}</span>
            ${isFreshNews(item.date) ? '<span class="news-fresh">Fresh</span>' : ""}
            ${link}
          </div>
        </div>
      `;
      return li;
    })
  );
}

/* ---------- optional CV button ---------- */

function renderCvButton() {
  const url = window.siteData.profile.cv;
  if (!url) return;
  const cta = document.querySelector(".hero-cta");
  if (!cta || cta.querySelector("[data-cv]")) return;
  const link = document.createElement("a");
  link.className = "button button-ghost";
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.dataset.cv = "true";
  link.innerHTML = `${DOC_ICON}CV`;
  cta.appendChild(link);
}

/* ---------- live publications (OpenAlex) ---------- */

function mapOpenAlexWork(work) {
  const source = work.primary_location && work.primary_location.source;
  const biblio = work.biblio || {};
  const detailsParts = [];
  if (biblio.volume) detailsParts.push(`Vol. ${biblio.volume}`);
  if (biblio.issue) detailsParts.push(`No. ${biblio.issue}`);
  if (biblio.first_page && biblio.last_page) {
    detailsParts.push(`${biblio.first_page}-${biblio.last_page}`);
  }

  const typeMap = {
    "journal-article": "Journal article",
    preprint: "Preprint",
    "proceedings-article": "Conference paper",
    "book-chapter": "Book chapter",
    review: "Review",
    letter: "Letter",
    editorial: "Editorial",
    correction: "Correction"
  };

  return {
    title: work.display_name,
    authors: (work.authorships || [])
      .map((authorship) => authorship.author && authorship.author.display_name)
      .filter(Boolean)
      .join(", "),
    venue: (source && source.display_name) || "Preprint",
    details:
      detailsParts.join(", ") || work.publication_date || String(work.publication_year),
    year: work.publication_year,
    citations: work.cited_by_count || 0,
    link:
      work.doi ||
      (work.primary_location && work.primary_location.landing_page_url) ||
      work.id,
    linkLabel: work.doi ? "DOI" : "Link",
    selected: false,
    type: typeMap[work.type] || "Article",
    doi: work.doi || ""
  };
}

// Owner exclusions override indexing; enrichment preserves other saved papers and citation counts.
function mergePublicationMetadata(snapshot, works) {
  const doiKey = value => String(value || "").replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").toLowerCase();
  const byDoi = new Map(works.filter(w=>w.doi).map(w=>[doiKey(w.doi),w]));
  const uniqueTitle = title => {
    const key=normalizeTitle(title);
    const matches=works.filter(w=>normalizeTitle(w.title)===key);
    return matches.length===1 && snapshot.filter(p=>normalizeTitle(p.title)===key).length===1 ? matches[0] : null;
  };
  return snapshot.filter(publication=>!isExcludedPublication(publication)).map(publication=>{
    if (publication.status === "accepted" || publication.metadataVerified) return {...publication};
    const hasDoi=/doi\.org\//i.test(publication.link || "");
    const match=hasDoi ? byDoi.get(doiKey(publication.link)) : uniqueTitle(publication.title);
    if (!match) return {...publication};
    return {...publication,
      venue: match.venue && match.venue!=="Preprint" ? match.venue : publication.venue,
      details: match.details || publication.details,
      link: publication.link || match.link,
      linkLabel: publication.linkLabel || match.linkLabel
    };
  });
}

/* ---------- publication metadata ---------- */

function updateDataStamp(info = {}) {
  const stamp = document.getElementById("data-stamp");
  if (!stamp) return;
  const snapshot = window.siteData.profile.updatedAt;
  const supplied = window.siteData.profile.citationSnapshot?.capture === "owner-provided";
  stamp.textContent = `Citations: Google Scholar${snapshot ? ` · snapshot ${snapshot}` : " · saved snapshot"}${supplied ? " · Provided by profile owner" : ""}${info.live ? " · Publication details updated from OpenAlex" : ""}`;
}

async function setupLivePublications() {
  const badge = document.getElementById("publications-live");
  updateDataStamp();
  // Keep the local archive immediately usable; metadata lookup is optional.
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(),8000);
  try {
    const orcid = window.siteData.profile.orcidId;
    const mailto = encodeURIComponent(window.siteData.profile.email);
    const authorResponse = await fetch(
      `https://api.openalex.org/authors/https://orcid.org/${orcid}?mailto=${mailto}`,
      {signal:controller.signal}
    );
    if (!authorResponse.ok) throw new Error("OpenAlex author lookup failed");
    const author = await authorResponse.json();
    const worksResponse = await fetch(
      `https://api.openalex.org/works?filter=author.id:${encodeURIComponent(author.id)}&per-page=200&sort=publication_date:desc&mailto=${mailto}`,
      {signal:controller.signal}
    );
    if (!worksResponse.ok) throw new Error("OpenAlex works lookup failed");
    const worksData = await worksResponse.json();
    const works=(worksData.results || []).map(mapOpenAlexWork).filter(w=>w.title && Number.isFinite(w.year));
    if (!works.length) throw new Error("No metadata returned");
    state.publications=mergePublicationMetadata(window.siteData.publications,works);
    renderSelectedPublications();
    if (archiveApi) archiveApi.refresh();
    if (badge) {badge.hidden=false;badge.textContent="Publication details updated";}
    updateDataStamp({live:true});
  } catch {
    updateDataStamp();
  } finally {clearTimeout(timeout);}
}

/* ---------- copy buttons ---------- */

function setupCopyButtons() {
  const feedback=document.getElementById("copy-feedback");
  let feedbackTimer;
  document.addEventListener("click", async (event) => {
    const button=event.target.closest("[data-copy]");
    if (!button || button.disabled) return;
    button.disabled=true;
    const original=button.innerHTML, label=button.getAttribute("aria-label");
    try {
      await navigator.clipboard.writeText(button.dataset.copy || "");
      button.classList.add("is-copied");
      const icon=button.querySelector("svg");
      if(icon)icon.outerHTML=CHECK_ICON;
      button.setAttribute("aria-label","Copied to clipboard");
      if(feedback) {
        clearTimeout(feedbackTimer);feedback.textContent="Copied to clipboard.";feedback.classList.add("is-visible");
        feedbackTimer=setTimeout(()=>feedback.classList.remove("is-visible"),2200);
      }
    } catch {
      const dialog=document.getElementById("copy-dialog"), field=document.getElementById("copy-text");
      if(dialog && field) {field.value=button.dataset.copy || "";dialog.showModal();field.focus();field.select();}
    } finally {
      setTimeout(()=>{
        button.disabled=false;button.classList.remove("is-copied");button.innerHTML=original;
        if(label)button.setAttribute("aria-label",label);
      },1400);
    }
  });
}

/* ---------- theme ---------- */

function syncThemeColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#101315" : "#f4f1e9";
}

function setupThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";

    const apply = (crossfade) => {
      if (crossfade) root.classList.add("is-theming");
      root.dataset.theme = next;
      try {
        localStorage.setItem("qt-theme", next);
      } catch (error) {}
      syncThemeColor(next);
      document.dispatchEvent(new CustomEvent("qt-themechange"));
      if (crossfade) {
        window.setTimeout(() => root.classList.remove("is-theming"), 480);
      }
    };

    const canSweep =
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canSweep) {
      apply(true);
      return;
    }

    /* Circular reveal that grows out of the toggle itself — the new
       theme sweeps across the page like a signal crossing the field. */
    const rect = button.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const radius = Math.ceil(
      Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY)
      )
    );
    root.style.setProperty("--sx", `${originX.toFixed(1)}px`);
    root.style.setProperty("--sy", `${originY.toFixed(1)}px`);
    root.style.setProperty("--sr", `${radius}px`);
    root.classList.add("fx-sweep");

    const transition = document.startViewTransition(() => apply(false));
    const settle = () => root.classList.remove("fx-sweep");
    transition.finished.then(settle, () => {
      /* the browser declined to animate (hidden tab, size change, …):
         fall back to the ordinary crossfade instead of a hard cut */
      root.classList.add("is-theming");
      window.setTimeout(() => root.classList.remove("is-theming"), 480);
      settle();
    });
  });
}

/* ---------- chrome: progress, header, nav, reveal ---------- */

function setupChrome() {
  const header = document.getElementById("site-header");
  const progress = document.getElementById("scroll-progress");
  let ticking = false;

  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) {
      progress.style.width = `${max > 0 ? (scrollTop / max) * 100 : 0}%`;
    }
    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 8);
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

function setupRevealObserver() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  let observer;
  try {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      // Reveal even when the archive is taller than the viewport.
      { threshold: 0 }
    );
    targets.forEach((target) => observer.observe(target));
    // Static content stays visible until observation is successfully set up.
    targets.forEach((target) => target.classList.add("is-reveal-ready"));
  } catch {
    observer?.disconnect();
    targets.forEach((target) => {
      target.classList.remove("is-reveal-ready");
      target.classList.add("is-visible");
    });
  }
}

function setupActiveNav() {
  const links = Array.from(document.querySelectorAll("[data-nav]"));
  if (!links.length) return;

  const byId = new Map(
    links.map((link) => [link.getAttribute("href").slice(1), link])
  );

  function setActive(id) {
    links.forEach((link) => {
      const active = byId.get(id) === link;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }
  function syncHash() {
    setActive(window.location.hash.slice(1));
  }
  syncHash();
  window.addEventListener("hashchange", syncHash);
  if (!("IntersectionObserver" in window)) return;

  const sections = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
  let observer;
  let resizeFrame = 0;
  function observeSections() {
    observer?.disconnect();
    // Percentage root margins are based on width, so use viewport height here.
    const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight);
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: `${-height * .38}px 0px ${-height * .55}px 0px` });
    sections.forEach(section => observer.observe(section));
  }
  observeSections();
  window.addEventListener("resize", () => {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      observeSections();
    });
  });
}

function setupMetricCountUp() {
  const values = document.querySelectorAll(".metric-value[data-count]");
  if (!values.length) return;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    values.forEach((value) => {
      value.textContent = value.dataset.count;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const target = Number(entry.target.dataset.count);
        if (!Number.isFinite(target)) return;
        const duration = 1100;
        const started = performance.now();

        function step(now) {
          const t = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          entry.target.textContent = String(Math.round(target * eased));
          if (t < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    },
    { threshold: 0.6 }
  );

  values.forEach((value) => observer.observe(value));
}

/* ---------- bootstrap ---------- */

function bootstrap() {
  syncThemeColor(document.documentElement.dataset.theme);
  renderHeroBadges();
  renderContacts();
  renderMetrics();
  renderNews();
  renderCvButton();
  renderSelectedPublications();
  archiveApi = setupArchive();
  setupCopyButtons();
  setupThemeToggle();
  setupChrome();
  setupRevealObserver();
  setupActiveNav();
  setupMetricCountUp();
  setupLivePublications();
}

document.addEventListener("DOMContentLoaded", bootstrap);
