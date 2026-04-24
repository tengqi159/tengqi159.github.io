function createMetricCard(metric) {
  const article = document.createElement("article");
  article.innerHTML = `
    <span class="metric-label">${metric.label}</span>
    <strong class="metric-value">${metric.value}</strong>
    <span class="metric-note">${metric.note}</span>
  `;
  return article;
}

function createPublicationLink(publication) {
  const scholarSearch = new URL("https://scholar.google.com/scholar");
  scholarSearch.searchParams.set("q", publication.title);

  const links = [];
  if (publication.link) {
    links.push(
      `<a class="publication-link" href="${publication.link}" target="_blank" rel="noreferrer">${publication.linkLabel}</a>`
    );
  }
  links.push(
    `<a class="publication-link" href="${scholarSearch.toString()}" target="_blank" rel="noreferrer">Scholar search</a>`
  );
  return links.join("");
}

function createPublicationCard(publication, compact) {
  const wrapper = document.createElement("article");
  wrapper.className = compact ? "selected-card" : "publication-item";
  wrapper.innerHTML = `
    <div class="${compact ? "paper-topline" : "publication-topline"}">
      <span class="paper-badge">${publication.year}</span>
      <span class="paper-badge citation">Cited by ${publication.citations}</span>
      <span class="paper-badge">${publication.type}</span>
    </div>
    <h3>${publication.title}</h3>
    <p class="publication-authors">${publication.authors}</p>
    <p class="publication-meta">${publication.venue} | ${publication.details}</p>
    <div class="publication-links">
      ${createPublicationLink(publication)}
    </div>
  `;
  return wrapper;
}

function sortPublications(publications, mode) {
  const list = [...publications];
  list.sort((left, right) => {
    if (mode === "citations") {
      return right.citations - left.citations || right.year - left.year;
    }
    return right.year - left.year || right.citations - left.citations;
  });
  return list;
}

function renderMetrics() {
  const metricsGrid = document.getElementById("metrics-grid");
  metricsGrid.replaceChildren(
    ...window.siteData.profile.metrics.map((metric) => createMetricCard(metric))
  );
}

function renderSelectedPublications() {
  const selectedContainer = document.getElementById("selected-publications");
  const selected = sortPublications(
    window.siteData.publications.filter((publication) => publication.selected),
    "citations"
  );
  selectedContainer.replaceChildren(
    ...selected.map((publication) => createPublicationCard(publication, true))
  );
}

function createFilterChip(label, active, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `filter-chip${active ? " is-active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderYearFilters(currentYear, onChange) {
  const container = document.getElementById("year-filters");
  const years = [
    "All",
    ...new Set(
      sortPublications(window.siteData.publications, "recent").map((item) => String(item.year))
    )
  ];
  container.replaceChildren(
    ...years.map((year) =>
      createFilterChip(year, year === currentYear, () => onChange(year))
    )
  );
}

function renderPublicationList(currentYear, currentSort) {
  const listContainer = document.getElementById("publication-list");
  const filtered =
    currentYear === "All"
      ? window.siteData.publications
      : window.siteData.publications.filter(
          (publication) => String(publication.year) === currentYear
        );
  const sorted = sortPublications(filtered, currentSort);
  listContainer.replaceChildren(
    ...sorted.map((publication) => createPublicationCard(publication, false))
  );
}

function bootstrap() {
  renderMetrics();
  renderSelectedPublications();

  const sortSelect = document.getElementById("sort-select");
  let activeYear = "All";
  let activeSort = sortSelect.value;

  function refresh() {
    renderYearFilters(activeYear, (year) => {
      activeYear = year;
      refresh();
    });
    renderPublicationList(activeYear, activeSort);
  }

  sortSelect.addEventListener("change", (event) => {
    activeSort = event.target.value;
    refresh();
  });

  refresh();
}

document.addEventListener("DOMContentLoaded", bootstrap);
