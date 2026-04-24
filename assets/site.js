function createMetricCard(metric) {
  const article = document.createElement("article");
  article.innerHTML = `
    <span class="metric-label">${metric.label}</span>
    <strong class="metric-value">${metric.value}</strong>
    <span class="metric-note">${metric.note}</span>
  `;
  return article;
}

function createHeroBadge(label) {
  const badge = document.createElement("span");
  badge.className = "hero-ribbon";
  badge.textContent = label;
  return badge;
}

function createContactCard(contact) {
  const article = document.createElement("article");
  article.className = "contact-card tilt-card";

  const linkLabel = contact.href?.startsWith("mailto:") ? "Compose" : "Open";
  const externalAttributes = contact.href?.startsWith("http")
    ? ' target="_blank" rel="noreferrer"'
    : "";

  article.innerHTML = `
    <span class="contact-label">${contact.label}</span>
    <strong class="contact-value">${contact.value}</strong>
    <span class="contact-hint">${contact.hint}</span>
    <div class="contact-actions">
      ${
        contact.href
          ? `<a class="inline-action" href="${contact.href}"${externalAttributes}>${linkLabel}</a>`
          : ""
      }
      ${
        contact.copyValue
          ? `<button class="inline-action copy-action" type="button" data-copy="${contact.copyValue}">Copy</button>`
          : ""
      }
    </div>
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
  wrapper.className = compact ? "selected-card tilt-card" : "publication-item";
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

function renderHeroBadges() {
  const heroRibbons = document.getElementById("hero-ribbons");
  if (!heroRibbons) {
    return;
  }

  heroRibbons.replaceChildren(
    ...window.siteData.profile.heroBadges.map((label) => createHeroBadge(label))
  );
}

function renderContacts() {
  const contactGrid = document.getElementById("contact-grid");
  if (!contactGrid) {
    return;
  }

  contactGrid.replaceChildren(
    ...window.siteData.profile.contacts.map((contact) => createContactCard(contact))
  );
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

function setupCopyButtons() {
  document.querySelectorAll(".copy-action:not([data-copy-ready])").forEach((button) => {
    button.dataset.copyReady = "true";
    button.addEventListener("click", async () => {
      const originalLabel = button.textContent;

      try {
        await navigator.clipboard.writeText(button.dataset.copy || "");
        button.textContent = "Copied";
      } catch (error) {
        button.textContent = "Retry";
      }

      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1400);
    });
  });
}

function setupRevealObserver() {
  const sections = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
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
    {
      threshold: 0.18
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (reduceMotion || coarsePointer) {
    glow.remove();
    return;
  }

  const point = {
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.2
  };
  let frame = null;

  function paintGlow() {
    glow.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
    frame = null;
  }

  window.addEventListener("pointermove", (event) => {
    point.x = event.clientX;
    point.y = event.clientY;
    glow.classList.add("is-active");
    if (!frame) {
      frame = window.requestAnimationFrame(paintGlow);
    }
  });
}

function setupTiltCards() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  document.querySelectorAll(".tilt-card:not([data-tilt-ready])").forEach((card) => {
    card.dataset.tiltReady = "true";

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--tilt-rotate-x", `${(offsetY * -7).toFixed(2)}deg`);
      card.style.setProperty("--tilt-rotate-y", `${(offsetX * 8).toFixed(2)}deg`);
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.removeProperty("--tilt-rotate-x");
      card.style.removeProperty("--tilt-rotate-y");
    });
  });
}

function bootstrap() {
  renderHeroBadges();
  renderContacts();
  renderMetrics();
  renderSelectedPublications();
  setupCopyButtons();
  setupRevealObserver();
  setupCursorGlow();
  setupTiltCards();

  const sortSelect = document.getElementById("sort-select");
  let activeYear = "All";
  let activeSort = sortSelect.value;

  function refresh() {
    renderYearFilters(activeYear, (year) => {
      activeYear = year;
      refresh();
    });
    renderPublicationList(activeYear, activeSort);
    setupTiltCards();
  }

  sortSelect.addEventListener("change", (event) => {
    activeSort = event.target.value;
    refresh();
  });

  refresh();
}

document.addEventListener("DOMContentLoaded", bootstrap);
