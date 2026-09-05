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

/* ---------- shared state ---------- */

const state = {
  publications: window.siteData.publications
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

function bibtexFor(publication) {
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
  const lastName = (firstAuthor.trim().split(/\s+/).pop() || "work").toLowerCase();
  const titleWord =
    String(publication.title || "")
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .find((word) => word.length > 3 && !BIBTEX_STOPWORDS.has(word)) || "paper";
  const key = `${lastName}${publication.year || ""}${titleWord}`;

  const venue = String(publication.venue || "")
    .replace(/\s+\d+[\d\s,().:-]*$/, "")
    .trim();
  const entryType = BIBTEX_TYPES[publication.type] || "misc";
  const venueField =
    entryType === "article"
      ? `journal={${venue}}`
      : entryType === "inproceedings"
        ? `booktitle={${venue}}`
        : `howpublished={${venue}}`;

  const fields = [
    `title={${publication.title}}`,
    authors && `author={${authors}}`,
    venue && venueField,
    publication.year && `year={${publication.year}}`,
    publication.link &&
      publication.link.includes("doi.org") &&
      `doi={${publication.link.replace("https://doi.org/", "")}}`
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
  if (publication.year && new RegExp(`(?:,|\\s)${publication.year}$`).test(venue.trim())) return venue;
  if (venue && details && details.includes(venue)) return details;
  return [venue, details].filter(Boolean).join(" · ");
}

function venueLineHtml(publication) {
  const venue = publication.venue || "";
  const line = venueLine(publication);
  if (venue && line.startsWith(venue)) return `<em>${escapeAttr(venue)}</em>${escapeAttr(line.slice(venue.length))}`;
  return escapeAttr(line);
}

function createPaperLinks(publication, extraClass) {
  const scholarSearch = new URL("https://scholar.google.com/scholar");
  scholarSearch.searchParams.set("q", publication.title);

  const links = [];
  if (publication.link) {
    links.push(
      `<a class="paper-link ${extraClass}" href="${publication.link}" target="_blank" rel="noreferrer">${publication.linkLabel}${ARROW_ICON}</a>`
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
      card.className = "selected-card";
      card.innerHTML = `
        <div class="paper-topline">
          <span class="paper-badge">${publication.year}</span>
          <span class="paper-badge citation">Cited by ${publication.citations}</span>
          <span class="paper-badge">${publication.type}</span>
        </div>
        <h3>${publication.title}</h3>
        <p class="paper-authors">${publication.authors}</p>
        <p class="paper-venue">${venueLine(publication)}</p>
        <div class="paper-links">${createPaperLinks(publication, "")}</div>
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
      card.appendChild(foot);

      return card;
    })
  );
}

function sortPublications(publications, mode) {
  return [...publications].sort((left, right) => {
    if (mode === "citations") {
      return right.citations - left.citations || right.year - left.year;
    }
    return right.year - left.year || right.citations - left.citations;
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
      const haystack =
        `${publication.title} ${publication.authors} ${publication.venue}`.toLowerCase();
      return haystack.includes(query);
    });

    const sorted = sortPublications(filtered, activeSort);

    listContainer.replaceChildren(
      ...sorted.map((publication) => {
        const item = document.createElement("article");
        item.className = "publication-item";
        item.innerHTML = `
          <span class="publication-year">${publication.year}</span>
          <div class="publication-main">
            <h3>${publication.title}</h3>
            <p class="publication-authors">${publication.authors}</p>
            <p class="publication-meta">${venueLineHtml(publication)}</p>
          </div>
          <div class="publication-side">
            <span class="cited-chip">Cited by ${publication.citations}</span>
            <div class="publication-links">${createPaperLinks(publication, "")}</div>
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

  const items = [...(window.siteData.news || [])].sort((a, b) =>
    String(b.date).localeCompare(String(a.date))
  );

  if (!items.length) {
    const section = document.getElementById("news");
    const navLink = document.querySelector('[data-nav="news"]');
    if (section) section.hidden = true;
    if (navLink) navLink.hidden = true;
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

// Enrichment never removes a curated paper or substitutes citation counts.
function mergePublicationMetadata(snapshot, works) {
  const doiKey = value => String(value || "").replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").toLowerCase();
  const byDoi = new Map(works.filter(w=>w.doi).map(w=>[doiKey(w.doi),w]));
  const uniqueTitle = title => {
    const key=normalizeTitle(title);
    const matches=works.filter(w=>normalizeTitle(w.title)===key);
    return matches.length===1 && snapshot.filter(p=>normalizeTitle(p.title)===key).length===1 ? matches[0] : null;
  };
  return snapshot.map(publication=>{
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
  stamp.textContent = `Citations: Google Scholar${snapshot ? ` · snapshot ${snapshot}` : " · saved snapshot"}${info.live ? " · Publication details updated from OpenAlex" : ""}`;
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((target) => observer.observe(target));
}

function setupActiveNav() {
  const links = Array.from(document.querySelectorAll("[data-nav]"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const byId = new Map(
    links.map((link) => [link.getAttribute("href").slice(1), link])
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        });
        const link = byId.get(entry.target.id);
        if (link) {
          link.classList.add("is-active");
          link.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-38% 0px -55% 0px" }
  );

  byId.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
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
