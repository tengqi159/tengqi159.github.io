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
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 64);

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
  if (venue && details && details.includes(venue)) return details;
  return [venue, details].filter(Boolean).join(" · ");
}

function venueLineHtml(publication) {
  const venue = publication.venue || "";
  const details = publication.details || "";
  if (venue && details && details.includes(venue)) return details;
  return [venue ? `<em>${venue}</em>` : "", details]
    .filter(Boolean)
    .join(" · ");
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
  button.addEventListener("click", onClick);
  return button;
}

function setupArchive() {
  const listContainer = document.getElementById("publication-list");
  const filtersContainer = document.getElementById("year-filters");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("publication-search");
  const emptyNote = document.getElementById("archive-empty");
  if (!listContainer || !filtersContainer || !sortSelect || !searchInput) return;

  let activeYear = "All";
  let activeSort = sortSelect.value;
  let query = "";

  function renderFilters() {
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
  }

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

function applyCuration(works) {
  const curatedDois = new Set(
    window.siteData.publications
      .filter((item) => item.selected)
      .map((item) => item.link)
  );

  works.forEach((work) => {
    work.selected = curatedDois.has(work.doi);
  });

  let selectedCount = works.filter((work) => work.selected).length;
  if (selectedCount < 5) {
    for (const work of sortPublications(works, "citations")) {
      if (selectedCount >= 6) break;
      if (!work.selected) {
        work.selected = true;
        selectedCount += 1;
      }
    }
  }
  return works;
}

/* ---------- live data stamp ---------- */

function updateDataStamp(info) {
  const stamp = document.getElementById("data-stamp");
  if (!stamp) return;
  if (info.live) {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    stamp.textContent =
      `Live · ${info.count} Scholar-verified works · citations and metrics from Google Scholar (synced ${time}, daily auto-update)`;
  } else {
    const snapshot = window.siteData.profile.updatedAt || "unknown date";
    stamp.textContent =
      `Google Scholar · auto-synced snapshot (${snapshot}) · citations refresh daily, no manual maintenance needed.`;
  }
}


async function setupLivePublications() {
  const badge = document.getElementById("publications-live");

  try {
    const orcid = window.siteData.profile.orcidId;
    const mailto = encodeURIComponent(window.siteData.profile.email);

    const authorResponse = await fetch(
      `https://api.openalex.org/authors/https://orcid.org/${orcid}?mailto=${mailto}`
    );
    if (!authorResponse.ok) throw new Error("OpenAlex author lookup failed");
    const author = await authorResponse.json();

    const worksResponse = await fetch(
      `https://api.openalex.org/works?filter=author.id:${encodeURIComponent(author.id)}&per-page=200&sort=publication_date:desc&mailto=${mailto}`
    );
    if (!worksResponse.ok) throw new Error("OpenAlex works lookup failed");
    const worksData = await worksResponse.json();

    const snapshot = window.siteData.publications || [];
    const whitelist = new Set(
      snapshot.map((pub) => normalizeTitle(pub.title))
    );
    const scholarCites = new Map(
      snapshot.map((pub) => [
        normalizeTitle(pub.title) + "|" + normalizeTitle(pub.link),
        pub.citations
      ])
    );
    const works = (worksData.results || [])
      .map(mapOpenAlexWork)
      .filter((work) => work.title && Number.isFinite(work.year))
      .filter((work) => whitelist.has(normalizeTitle(work.title)));
    if (!works.length) throw new Error("OpenAlex returned no works");
    // Citation counts stay aligned with Google Scholar, the
    // authoritative source for the archive.
    for (const work of works) {
      const scholarValue = scholarCites.get(
        normalizeTitle(work.title) + "|" + normalizeTitle(work.doi || work.link)
      );
      if (Number.isFinite(scholarValue)) work.citations = scholarValue;
    }

    state.publications = applyCuration(works);
    renderSelectedPublications();
    if (archiveApi) archiveApi.refresh();

    if (badge) {
      badge.hidden = false;
      badge.textContent = `Live · OpenAlex · ${works.length} works`;
    }
    updateDataStamp({ live: true, count: works.length });
  } catch (error) {
    updateDataStamp({ live: false });
    // The curated local dataset stays on screen as the offline fallback.
  }
}

/* ---------- copy buttons ---------- */

function setupCopyButtons() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;

    const original = button.innerHTML;
    try {
      await navigator.clipboard.writeText(button.dataset.copy || "");
      button.classList.add("is-copied");
      button.innerHTML = CHECK_ICON;
    } catch (error) {
      button.innerHTML = COPY_ICON;
    }

    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.innerHTML = original;
    }, 1400);
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
    root.classList.add("is-theming");
    root.dataset.theme = next;
    try {
      localStorage.setItem("qt-theme", next);
    } catch (error) {}
    syncThemeColor(next);
    document.dispatchEvent(new CustomEvent("qt-themechange"));
    window.setTimeout(() => root.classList.remove("is-theming"), 480);
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

/* ---------- signal field ---------- */

function setupSignalField() {
  const canvas = document.getElementById("signal-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  let width = 0;
  let height = 0;
  let colors = [];
  let colorFrame = 0;

  const pointer = { x: -9999, y: -9999, active: false };

  const channels = [
    { base: 0.16, freq: 0.0062, speed: 0.00021, amp: 0.045, drift: 0.9, wave: "--wave-1" },
    { base: 0.33, freq: 0.0089, speed: -0.00016, amp: 0.06, drift: 1.4, wave: "--wave-3" },
    { base: 0.52, freq: 0.0051, speed: 0.00012, amp: 0.075, drift: 0.6, wave: "--wave-2" },
    { base: 0.7, freq: 0.0077, speed: -0.00024, amp: 0.055, drift: 1.1, wave: "--wave-4" },
    { base: 0.86, freq: 0.0104, speed: 0.00018, amp: 0.04, drift: 1.7, wave: "--wave-5" }
  ];

  function readColors() {
    const styles = getComputedStyle(document.documentElement);
    colors = channels.map((channel) =>
      styles.getPropertyValue(channel.wave).trim()
    );
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function channelY(channel, x, time) {
    const slow = Math.sin(x * channel.freq + time * channel.speed + channel.drift * 7.3);
    const fast = Math.sin(x * channel.freq * 2.7 - time * channel.speed * 1.6 + channel.drift * 3.1);
    const jitter = Math.sin(x * 0.09 + channel.drift * 11) * Math.sin(x * 0.023 + time * 0.00035 + channel.drift);
    let gain = 1;
    if (pointer.active) {
      const distance = Math.abs(x - pointer.x);
      gain += 0.85 * Math.exp(-(distance * distance) / (2 * 190 * 190));
    }
    return (
      channel.base * height +
      (slow * 0.72 + fast * 0.34 + jitter * 0.22) * channel.amp * height * gain
    );
  }

  function draw(time) {
    colorFrame += 1;
    if (colorFrame % 45 === 1) readColors();

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    channels.forEach((channel, index) => {
      ctx.strokeStyle = colors[index] || "rgba(120,120,120,0.4)";
      ctx.beginPath();
      for (let x = -8; x <= width + 8; x += 5) {
        const y = channelY(channel, x, time);
        if (x === -8) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  function loop(time) {
    draw(time);
    window.requestAnimationFrame(loop);
  }

  readColors();
  resize();
  window.addEventListener("resize", resize);
  document.addEventListener("qt-themechange", readColors);

  if (!coarsePointer) {
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
      },
      { passive: true }
    );
    document.addEventListener("mouseleave", () => {
      pointer.active = false;
    });
    window.addEventListener("blur", () => {
      pointer.active = false;
    });
  }

  if (reduceMotion) {
    draw(4200);
    return;
  }

  window.requestAnimationFrame(loop);
}

/* ---------- visitor atlas ---------- */

const HOME_BASE = { latitude: 34.76, longitude: 113.65 };

function setupVisitorMap() {
  const button = document.getElementById("locate-visitor");
  const dot = document.getElementById("visitor-dot");
  const dotLabel = document.getElementById("visitor-dot-label");
  const map = document.getElementById("visitor-map-canvas");
  const status = document.getElementById("visitor-status");
  const hud = document.getElementById("map-hud");
  const hudPlace = document.getElementById("hud-place");
  const hudMeta = document.getElementById("hud-meta");
  const hudDistance = document.getElementById("hud-distance");
  const arcBase = document.getElementById("arc-base");
  const arcFlow = document.getElementById("arc-flow");
  if (!button || !dot || !map || !status || !hud) return;

  function setStatus(message) {
    status.textContent = message;
  }

  function projectLocation(latitude, longitude) {
    return {
      left: Math.min(97, Math.max(3, ((longitude + 180) / 360) * 100)),
      top: Math.min(94, Math.max(6, ((90 - latitude) / 180) * 100))
    };
  }

  function haversineKm(from, to) {
    const rad = Math.PI / 180;
    const dLat = (to.latitude - from.latitude) * rad;
    const dLon = (to.longitude - from.longitude) * rad;
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(from.latitude * rad) *
        Math.cos(to.latitude * rad) *
        Math.sin(dLon / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  }

  function drawArc(location) {
    if (!arcBase || !arcFlow) return false;
    const start = projectLocation(location.latitude, location.longitude);
    const end = projectLocation(HOME_BASE.latitude, HOME_BASE.longitude);
    const span = Math.hypot(end.left - start.left, end.top - start.top);
    if (span < 4) {
      // The visitor is (approximately) at the home lab — no thread needed.
      arcBase.hidden = true;
      arcFlow.hidden = true;
      return false;
    }
    const cx = (start.left + end.left) / 2;
    const lift = Math.min(span * 0.32, 24);
    const cy = Math.max(3, Math.min(start.top, end.top) - lift);
    const d = `M ${start.left} ${start.top} Q ${cx} ${cy} ${end.left} ${end.top}`;
    arcBase.setAttribute("d", d);
    arcFlow.setAttribute("d", d);
    arcBase.hidden = false;
    arcFlow.hidden = false;
    arcBase.classList.remove("is-drawn");
    arcFlow.classList.remove("is-drawn");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => arcBase.classList.add("is-drawn"));
    });
    window.setTimeout(() => arcFlow.classList.add("is-drawn"), 900);
    return true;
  }

  function renderHud(location, arcDrawn) {
    if (hudPlace) hudPlace.textContent = location.place;
    if (hudMeta) {
      hudMeta.textContent =
        `${location.latitude.toFixed(2)}°, ${location.longitude.toFixed(2)}° · ${location.method}`;
    }
    const km = haversineKm(location, HOME_BASE);
    if (hudDistance) {
      if (arcDrawn && km > 50) {
        hudDistance.textContent = `⇢ ~${Math.round(km).toLocaleString("en-US")} km to the home lab`;
        hudDistance.hidden = false;
      } else {
        hudDistance.hidden = true;
      }
    }
    hud.hidden = false;
  }

  function placeDot(location) {
    const point = projectLocation(location.latitude, location.longitude);
    dot.hidden = false;
    dot.classList.remove("is-placed");
    dot.style.left = `${point.left}%`;
    dot.style.top = `${point.top}%`;
    dotLabel.textContent = location.shortLabel || "You";
    window.requestAnimationFrame(() => dot.classList.add("is-placed"));
    const arcDrawn = drawArc(location);
    renderHud(location, arcDrawn);
    setStatus(
      `${location.place} — signal locked. The marker lives only in this browser session.`
    );
  }

  function getBrowserLocation() {
    if (!("geolocation" in navigator)) {
      return Promise.reject(new Error("Browser geolocation is unavailable."));
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          resolve({
            latitude,
            longitude,
            accuracy: accuracy ? `about ${Math.round(accuracy / 1000)} km` : "",
            place: "Browser-approved location",
            shortLabel: "Here",
            method: "Browser permission"
          });
        },
        reject,
        { enableHighAccuracy: false, maximumAge: 600000, timeout: 7000 }
      );
    });
  }

  async function getIpLocation() {
    const response = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("The IP location service did not respond.");
    }
    const data = await response.json();
    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("The IP location service returned an incomplete location.");
    }
    const place = [data.city, data.region, data.country_name].filter(Boolean).join(", ");
    return {
      latitude,
      longitude,
      place: place || "Approximate IP location",
      shortLabel: data.city || data.country_code || "IP",
      method: "Approximate IP lookup",
      accuracy: "city or region level"
    };
  }

  button.addEventListener("click", async () => {
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Locating…";
    hud.hidden = true;
    map.classList.add("is-scanning");

    try {
      setStatus("Asking the browser for a location signal…");
      const browserLocation = await getBrowserLocation();
      placeDot(browserLocation);
    } catch (browserError) {
      try {
        setStatus("Browser location unavailable. Trying an approximate IP lookup…");
        const ipLocation = await getIpLocation();
        placeDot(ipLocation);
      } catch (ipError) {
        setStatus(
          "No location signal could be resolved. The map stays anonymous until you allow a signal."
        );
      }
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
      map.classList.remove("is-scanning");
    }
  });

  window.setTimeout(async () => {
    if (!dot.hidden) return;
    map.classList.add("is-scanning");
    setStatus("Detecting an approximate location for this visit…");
    try {
      const ipLocation = await getIpLocation();
      placeDot(ipLocation);
    } catch (error) {
      setStatus(
        "Automatic detection was unavailable. You can still place a dot manually with the button above."
      );
    } finally {
      map.classList.remove("is-scanning");
    }
  }, 700);
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
  setupSignalField();
  setupVisitorMap();
  setupLivePublications();
}

document.addEventListener("DOMContentLoaded", bootstrap);
