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

function setupRetroSprites() {
  const field = document.getElementById("retro-field");
  if (!field) {
    return;
  }

  const sprites = [
    ["pixel-star", 9, 18, 26],
    ["pixel-coin", 18, 72, 32],
    ["pixel-block", 27, 28, 30],
    ["pixel-runner", 41, 82, 34],
    ["pixel-star", 57, 14, 24],
    ["pixel-coin", 72, 36, 28],
    ["pixel-block", 86, 68, 34],
    ["pixel-runner", 93, 22, 30],
    ["pixel-star", 12, 88, 22],
    ["pixel-coin", 49, 54, 26],
    ["pixel-block", 66, 91, 32],
    ["pixel-star", 83, 9, 20],
    ["pixel-coin", 33, 8, 22],
    ["pixel-runner", 6, 44, 28]
  ];

  field.replaceChildren(
    ...sprites.map(([shape, left, top, size], index) => {
      const item = document.createElement("span");
      item.className = `retro-sprite ${shape}`;
      item.style.left = `${left}%`;
      item.style.top = `${top}%`;
      item.style.setProperty("--sprite-size", `${size}px`);
      item.style.setProperty("--sprite-speed", `${12 + (index % 5) * 2}s`);
      item.style.setProperty("--sprite-delay", `${index * -0.9}s`);
      return item;
    })
  );
}

function setupVisitorMap() {
  const button = document.getElementById("locate-visitor");
  const dot = document.getElementById("visitor-dot");
  const status = document.getElementById("visitor-status");
  if (!button || !dot || !status) {
    return;
  }

  function setStatus(message) {
    status.textContent = message;
  }

  button.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      setStatus("This browser does not expose a location signal.");
      return;
    }

    button.disabled = true;
    setStatus("Waiting for browser permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const left = Math.min(97, Math.max(3, ((longitude + 180) / 360) * 100));
        const top = Math.min(95, Math.max(5, ((90 - latitude) / 180) * 100));

        dot.hidden = false;
        dot.style.left = `${left}%`;
        dot.style.top = `${top}%`;
        setStatus(
          `Approximate marker placed at ${latitude.toFixed(2)}, ${longitude.toFixed(2)}. It stays in this browser session.`
        );
        button.disabled = false;
      },
      () => {
        setStatus("Location permission was not shared, so the map stays anonymous.");
        button.disabled = false;
      },
      {
        enableHighAccuracy: false,
        maximumAge: 600000,
        timeout: 9000
      }
    );
  });
}

function setupPlaygroundEffects() {
  const canvas = document.getElementById("play-canvas");
  if (!canvas) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (reduceMotion || coarsePointer) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  const colors = ["#d94d4d", "#13727a", "#b9892c", "#4869b1", "#6a994e", "#e07a5f"];
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 3, ready: false };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let snake = null;
  let idleTimer = null;
  let running = false;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function startLoop() {
    if (!running) {
      running = true;
      window.requestAnimationFrame(tick);
    }
  }

  function clearSnake() {
    snake = null;
    if (idleTimer) {
      window.clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function burst(x, y) {
    for (let index = 0; index < 54; index += 1) {
      const angle = (Math.PI * 2 * index) / 54 + Math.random() * 0.22;
      const speed = 2.2 + Math.random() * 8.2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 8,
        spin: Math.random() * Math.PI,
        spinSpeed: -0.18 + Math.random() * 0.36,
        life: 46 + Math.random() * 34,
        maxLife: 80,
        color: colors[index % colors.length],
        square: index % 3 === 0
      });
    }
    startLoop();
  }

  function updateParticles() {
    particles = particles.filter((particle) => particle.life > 0);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.982;
      particle.vy = particle.vy * 0.982 - 0.045;
      particle.spin += particle.spinSpeed;
      particle.life -= 1;
    });
  }

  function drawParticles() {
    particles.forEach((particle) => {
      const alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.spin);
      ctx.fillStyle = particle.color;
      if (particle.square) {
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  function getObstacleRects() {
    const selectors = [
      ".site-header",
      ".hero-copy",
      ".profile-card",
      ".stats-grid article",
      ".profile-note-card",
      ".focus-card",
      ".selected-card",
      ".publication-item",
      ".visitor-panel",
      ".link-card"
    ];

    return selectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < height)
      .map((rect) => ({
        left: rect.left - 14,
        right: rect.right + 14,
        top: rect.top - 14,
        bottom: rect.bottom + 14
      }));
  }

  function createSnakePath(targetX, targetY) {
    const cell = width < 720 ? 20 : 24;
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    const end = {
      x: Math.min(cols - 1, Math.max(0, Math.floor(targetX / cell))),
      y: Math.min(rows - 1, Math.max(0, Math.floor(targetY / cell)))
    };
    const corners = [
      { x: 0, y: 0 },
      { x: cols - 1, y: 0 },
      { x: 0, y: rows - 1 },
      { x: cols - 1, y: rows - 1 }
    ];
    const start = corners.sort(
      (left, right) =>
        Math.hypot(right.x - end.x, right.y - end.y) -
        Math.hypot(left.x - end.x, left.y - end.y)
    )[0];
    const blocked = new Set();

    getObstacleRects().forEach((rect) => {
      const minX = Math.max(0, Math.floor(rect.left / cell));
      const maxX = Math.min(cols - 1, Math.ceil(rect.right / cell));
      const minY = Math.max(0, Math.floor(rect.top / cell));
      const maxY = Math.min(rows - 1, Math.ceil(rect.bottom / cell));
      for (let y = minY; y <= maxY; y += 1) {
        for (let x = minX; x <= maxX; x += 1) {
          blocked.add(`${x},${y}`);
        }
      }
    });

    blocked.delete(`${start.x},${start.y}`);
    blocked.delete(`${end.x},${end.y}`);

    const key = (point) => `${point.x},${point.y}`;
    const distance = (point) => Math.abs(point.x - end.x) + Math.abs(point.y - end.y);
    const open = [start];
    const cameFrom = new Map();
    const scores = new Map([[key(start), 0]]);
    const seen = new Set([key(start)]);

    while (open.length) {
      open.sort((left, right) => {
        const leftScore = (scores.get(key(left)) || 0) + distance(left);
        const rightScore = (scores.get(key(right)) || 0) + distance(right);
        return leftScore - rightScore;
      });

      const current = open.shift();
      if (!current) {
        break;
      }

      if (current.x === end.x && current.y === end.y) {
        const path = [end];
        let cursor = key(end);
        while (cameFrom.has(cursor)) {
          const previous = cameFrom.get(cursor);
          path.push(previous);
          cursor = key(previous);
        }
        return path.reverse().map((point) => ({
          x: point.x * cell + cell / 2,
          y: point.y * cell + cell / 2
        }));
      }

      [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ].forEach((next) => {
        const nextKey = key(next);
        if (
          next.x < 0 ||
          next.y < 0 ||
          next.x >= cols ||
          next.y >= rows ||
          blocked.has(nextKey)
        ) {
          return;
        }

        const nextScore = (scores.get(key(current)) || 0) + 1;
        if (!seen.has(nextKey) || nextScore < (scores.get(nextKey) || Infinity)) {
          cameFrom.set(nextKey, current);
          scores.set(nextKey, nextScore);
          seen.add(nextKey);
          open.push(next);
        }
      });
    }

    return [start, end].map((point) => ({
      x: point.x * cell + cell / 2,
      y: point.y * cell + cell / 2
    }));
  }

  function spawnSnake() {
    if (!pointer.ready) {
      return;
    }

    const path = createSnakePath(pointer.x, pointer.y);
    snake = {
      path,
      progress: 0,
      speed: 0.42,
      pickups: path.filter((_, index) => index > 4 && index % 7 === 3),
      hazards: path.filter((_, index) => index > 8 && index % 15 === 5)
    };
    startLoop();
  }

  function scheduleSnake() {
    if (idleTimer) {
      window.clearTimeout(idleTimer);
    }
    idleTimer = window.setTimeout(spawnSnake, 950);
  }

  function drawSnake() {
    if (!snake || snake.path.length < 2) {
      return;
    }

    snake.progress = Math.min(snake.path.length - 1, snake.progress + snake.speed);
    const visibleCount = Math.max(1, Math.floor(snake.progress));
    const visible = snake.path.slice(0, visibleCount + 1);

    snake.pickups.forEach((point, index) => {
      const reached = snake.path.indexOf(point) <= visibleCount;
      ctx.save();
      ctx.globalAlpha = reached ? 0.18 : 0.58;
      ctx.fillStyle = reached ? "#13727a" : "#b9892c";
      ctx.beginPath();
      ctx.arc(point.x, point.y, reached ? 2 : 5, 0, Math.PI * 2);
      ctx.fill();
      if (reached && index % 2 === 0) {
        ctx.fillRect(point.x - 7, point.y - 1, 14, 2);
        ctx.fillRect(point.x - 1, point.y - 7, 2, 14);
      }
      ctx.restore();
    });

    snake.hazards.forEach((point) => {
      const reached = snake.path.indexOf(point) <= visibleCount;
      ctx.save();
      ctx.translate(point.x, point.y);
      ctx.rotate(Math.PI / 4);
      ctx.globalAlpha = reached ? 0.14 : 0.5;
      ctx.fillStyle = reached ? "#b9892c" : "#d94d4d";
      ctx.fillRect(-5, -5, 10, 10);
      ctx.restore();
    });

    visible.forEach((point, index) => {
      const tailAlpha = Math.min(1, 0.28 + index / Math.max(1, visible.length));
      ctx.save();
      ctx.globalAlpha = tailAlpha * 0.78;
      ctx.fillStyle = index === visible.length - 1 ? "#d94d4d" : "#13727a";
      ctx.fillRect(point.x - 5, point.y - 5, 10, 10);
      ctx.restore();
    });

    const head = visible[visible.length - 1];
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#112133";
    ctx.fillRect(head.x - 3, head.y - 3, 3, 3);
    ctx.fillRect(head.x + 1, head.y - 3, 3, 3);
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    updateParticles();
    drawSnake();
    drawParticles();

    if (particles.length || snake) {
      window.requestAnimationFrame(tick);
      return;
    }

    running = false;
  }

  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    clearSnake();
  });

  window.addEventListener("pointerdown", (event) => {
    burst(event.clientX, event.clientY);
  });

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.ready = true;
    clearSnake();
    scheduleSnake();
  });

  window.addEventListener("scroll", clearSnake, { passive: true });
  scheduleSnake();
}

function bootstrap() {
  renderHeroBadges();
  renderContacts();
  renderMetrics();
  renderSelectedPublications();
  setupRetroSprites();
  setupCopyButtons();
  setupRevealObserver();
  setupCursorGlow();
  setupTiltCards();
  setupPlaygroundEffects();
  setupVisitorMap();

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
