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
    ["pixel-star", 8, 18, 42],
    ["pixel-coin", 18, 72, 48],
    ["pixel-block", 27, 28, 46],
    ["pixel-runner", 41, 82, 50],
    ["pixel-handheld", 57, 14, 50],
    ["pixel-kart", 72, 36, 56],
    ["pixel-castle", 86, 68, 56],
    ["pixel-ghost", 93, 22, 48],
    ["pixel-heart", 12, 88, 42],
    ["pixel-coin", 49, 54, 40],
    ["pixel-mushroom", 66, 91, 54],
    ["pixel-rocket", 83, 9, 54],
    ["pixel-leaf", 33, 8, 46],
    ["pixel-capsule", 6, 44, 50],
    ["pixel-kart", 12, 52, 48],
    ["pixel-handheld", 92, 80, 46],
    ["pixel-ghost", 24, 92, 44],
    ["pixel-mushroom", 79, 84, 46],
    ["pixel-castle", 42, 18, 48],
    ["pixel-rocket", 5, 77, 42],
    ["pixel-leaf", 97, 48, 42],
    ["pixel-capsule", 58, 76, 44],
    ["pixel-block", 74, 12, 40],
    ["pixel-runner", 29, 60, 42],
    ["pixel-controller", 16, 12, 52],
    ["pixel-dino", 38, 45, 58],
    ["pixel-shield", 52, 92, 46],
    ["pixel-squid", 63, 28, 50],
    ["pixel-shell", 88, 38, 48],
    ["pixel-flower", 96, 64, 42],
    ["pixel-trophy", 74, 63, 48],
    ["pixel-cloud", 22, 38, 54],
    ["pixel-controller", 46, 6, 44],
    ["pixel-dino", 69, 72, 50],
    ["pixel-shield", 3, 58, 40],
    ["pixel-squid", 35, 76, 42],
    ["pixel-shell", 54, 37, 42],
    ["pixel-flower", 87, 15, 38],
    ["pixel-trophy", 18, 25, 42],
    ["pixel-cloud", 77, 93, 48],
    ["pixel-star", 61, 58, 36],
    ["pixel-coin", 94, 92, 40],
    ["pixel-dino", 7, 28, 74],
    ["pixel-controller", 53, 22, 66],
    ["pixel-kart", 87, 51, 70],
    ["pixel-ghost", 73, 17, 62],
    ["pixel-flower", 14, 67, 58],
    ["pixel-shield", 36, 89, 62],
    ["pixel-shell", 64, 67, 60],
    ["pixel-trophy", 91, 74, 58],
    ["pixel-mushroom", 4, 92, 64],
    ["pixel-rocket", 30, 14, 68],
    ["pixel-cloud", 49, 84, 72],
    ["pixel-handheld", 98, 34, 62],
    ["pixel-block", 11, 6, 58],
    ["pixel-runner", 82, 94, 58],
    ["pixel-squid", 43, 33, 64]
  ];

  field.replaceChildren(
    ...sprites.map(([shape, left, top, size], index) => {
      const item = document.createElement("span");
      item.className = `retro-sprite ${shape}`;
      item.style.left = `${left}%`;
      item.style.top = `${top}%`;
      item.style.setProperty("--sprite-size", `${size}px`);
      item.style.setProperty("--sprite-speed", `${14 + (index % 7) * 2.4}s`);
      item.style.setProperty("--sprite-delay", `${index * -0.72}s`);
      item.style.setProperty("--sprite-opacity", `${0.5 + (index % 5) * 0.045}`);
      return item;
    })
  );
}

function setupVisitorMap() {
  const button = document.getElementById("locate-visitor");
  const dot = document.getElementById("visitor-dot");
  const dotLabel = document.getElementById("visitor-dot-label");
  const map = document.getElementById("visitor-map-canvas");
  const mapImage = map ? map.querySelector(".world-map-image") : null;
  const status = document.getElementById("visitor-status");
  const details = document.getElementById("visitor-details");
  if (!button || !dot || !dotLabel || !map || !status || !details) {
    return;
  }

  let activeLocation = null;

  function setStatus(message) {
    status.textContent = message;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeLongitude(longitude) {
    return ((((longitude + 180) % 360) + 360) % 360) - 180;
  }

  function getProjectionRect() {
    const mapRect = map.getBoundingClientRect();
    const imageRect = mapImage ? mapImage.getBoundingClientRect() : mapRect;

    return {
      left: imageRect.left - mapRect.left,
      top: imageRect.top - mapRect.top,
      width: imageRect.width || mapRect.width,
      height: imageRect.height || mapRect.height
    };
  }

  function projectLocation(latitude, longitude) {
    const rect = getProjectionRect();
    const safeLatitude = clamp(Number(latitude), -86, 86);
    const safeLongitude = normalizeLongitude(Number(longitude));
    const xRatio = (safeLongitude + 180) / 360;
    const yRatio = (90 - safeLatitude) / 180;

    return {
      left: rect.left + rect.width * xRatio,
      top: rect.top + rect.height * yRatio,
      xRatio,
      yRatio,
      clamped: safeLatitude !== Number(latitude)
    };
  }

  function createDetail(label, value) {
    const item = document.createElement("span");
    const strong = document.createElement("strong");
    const small = document.createElement("small");

    strong.textContent = value;
    small.textContent = label;
    item.replaceChildren(strong, small);
    return item;
  }

  function renderDetails(location) {
    const items = [
      ["Location", location.place],
      ["Method", location.method],
      ["Coordinates", `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`]
    ];

    if (location.accuracy) {
      items.push(["Accuracy", location.accuracy]);
    }

    if (location.note) {
      items.push(["Note", location.note]);
    }

    details.replaceChildren(...items.map(([label, value]) => createDetail(label, value)));
    details.hidden = false;
  }

  function placeDot(location) {
    const point = projectLocation(location.latitude, location.longitude);
    activeLocation = location;

    dot.hidden = false;
    dot.classList.remove("is-placed");
    dot.classList.toggle("is-east", point.xRatio > 0.78);
    dot.classList.toggle("is-west", point.xRatio < 0.2);
    dot.classList.toggle("is-north", point.yRatio < 0.16);
    dot.classList.toggle("is-south", point.yRatio > 0.84);
    dot.style.left = `${point.left}px`;
    dot.style.top = `${point.top}px`;
    dotLabel.textContent = location.shortLabel || "You";
    window.requestAnimationFrame(() => dot.classList.add("is-placed"));

    map.classList.add("has-visitor");
    renderDetails(location);
    setStatus(
      `${location.place} is now glowing on the calibrated map. The marker is approximate and rendered locally in this browser session.`
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
            accuracy: accuracy
              ? accuracy >= 1000
                ? `about ${Math.round(accuracy / 1000)} km`
                : `about ${Math.round(accuracy)} m`
              : "",
            accuracyMeters: Number.isFinite(accuracy) ? accuracy : null,
            place: "Browser-approved location",
            shortLabel: "Here",
            method: "Browser permission"
          });
        },
        reject,
        {
          enableHighAccuracy: true,
          maximumAge: 60000,
          timeout: 10000
        }
      );
    });
  }

  async function getIpLocation() {
    const response = await fetch("https://ipapi.co/json/", {
      cache: "no-store"
    });

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
    button.textContent = "Locating...";
    details.hidden = true;
    map.classList.add("is-scanning");

    try {
      setStatus("Asking the browser for a location signal...");
      const browserLocation = await getBrowserLocation();
      if (browserLocation.accuracyMeters && browserLocation.accuracyMeters > 100000) {
        try {
          setStatus("Browser location was very broad. Refining with an approximate IP lookup...");
          const ipLocation = await getIpLocation();
          placeDot({
            ...ipLocation,
            note: "Used because the browser signal was broader than 100 km."
          });
        } catch (ipError) {
          placeDot({
            ...browserLocation,
            method: "Browser permission (coarse)",
            note: "Browser coordinates were broad, so the dot may only indicate a region."
          });
        }
      } else {
        placeDot(browserLocation);
      }
    } catch (browserError) {
      try {
        setStatus("Browser location was unavailable. Trying an approximate IP lookup...");
        const ipLocation = await getIpLocation();
        placeDot(ipLocation);
      } catch (ipError) {
        setStatus(
          "No location signal could be resolved. The map stays anonymous until the visitor allows a signal."
        );
      }
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
      map.classList.remove("is-scanning");
    }
  });

  window.addEventListener("resize", () => {
    if (activeLocation) {
      placeDot(activeLocation);
    }
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
  let gravityWaves = [];
  let snake = null;
  let idleTimer = null;
  let running = false;
  let lastPointerAt = 0;
  let lastGravityRipple = 0;
  const snakeColors = {
    head: "#e85d75",
    body: "#13727a",
    belly: "#f5d06f",
    outline: "rgba(17, 33, 51, 0.42)",
    egg: "#f3c34e",
    shell: "#fff4c7",
    monster: "#7b5cc9"
  };

  function drawRoundedRect(x, y, rectWidth, rectHeight, radius) {
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, rectWidth, rectHeight, radius);
      return;
    }

    const safeRadius = Math.min(radius, rectWidth / 2, rectHeight / 2);
    ctx.moveTo(x + safeRadius, y);
    ctx.lineTo(x + rectWidth - safeRadius, y);
    ctx.quadraticCurveTo(x + rectWidth, y, x + rectWidth, y + safeRadius);
    ctx.lineTo(x + rectWidth, y + rectHeight - safeRadius);
    ctx.quadraticCurveTo(
      x + rectWidth,
      y + rectHeight,
      x + rectWidth - safeRadius,
      y + rectHeight
    );
    ctx.lineTo(x + safeRadius, y + rectHeight);
    ctx.quadraticCurveTo(x, y + rectHeight, x, y + rectHeight - safeRadius);
    ctx.lineTo(x, y + safeRadius);
    ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  }

  function setPointerTarget(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.ready = true;
    lastPointerAt = performance.now();

    if (lastPointerAt - lastGravityRipple > 62) {
      gravityWaves.push({
        x: pointer.x,
        y: pointer.y,
        radius: 8,
        life: 36,
        maxLife: 36,
        drift: -0.9 + Math.random() * 1.8
      });
      lastGravityRipple = lastPointerAt;
    }

    startLoop();
  }

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
    ctx.clearRect(0, 0, width, height);
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

  function updateGravityWaves() {
    gravityWaves = gravityWaves.filter((wave) => wave.life > 0);
    gravityWaves.forEach((wave) => {
      wave.radius += 4.2;
      wave.y += wave.drift;
      wave.life -= 1;
    });
  }

  function drawGravityField() {
    if (!pointer.ready) {
      return;
    }

    const now = performance.now();
    const activeAlpha = Math.max(0, 1 - (now - lastPointerAt) / 1600);
    if (activeAlpha <= 0 && !gravityWaves.length) {
      return;
    }

    const pulse = now / 520;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    if (activeAlpha > 0) {
      for (let index = 0; index < 4; index += 1) {
        const radius = 18 + index * 15 + Math.sin(pulse + index * 0.8) * 4;
        ctx.globalAlpha = activeAlpha * (0.34 - index * 0.055);
        ctx.strokeStyle = index % 2 ? "#13727a" : "#b9892c";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let index = 0; index < 10; index += 1) {
        const angle = pulse * 0.8 + index * ((Math.PI * 2) / 10);
        const radius = 24 + Math.sin(pulse * 1.4 + index) * 12;
        ctx.globalAlpha = activeAlpha * 0.45;
        ctx.fillStyle = colors[index % colors.length];
        ctx.beginPath();
        ctx.arc(
          pointer.x + Math.cos(angle) * radius,
          pointer.y + Math.sin(angle) * radius,
          1.6 + (index % 3) * 0.45,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    gravityWaves.forEach((wave, index) => {
      const alpha = Math.max(0, wave.life / wave.maxLife);
      ctx.globalAlpha = alpha * 0.28;
      ctx.strokeStyle = colors[index % colors.length];
      ctx.lineWidth = 1 + alpha * 2.2;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = alpha * 0.12;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius * 0.55, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.restore();
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

  function getObstacleRects(targetX, targetY) {
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
      .filter((rect) => {
        if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
          return true;
        }

        return !(
          targetX >= rect.left - 8 &&
          targetX <= rect.right + 8 &&
          targetY >= rect.top - 8 &&
          targetY <= rect.bottom + 8
        );
      })
      .map((rect) => ({
        left: rect.left - 20,
        right: rect.right + 20,
        top: rect.top - 20,
        bottom: rect.bottom + 20
      }));
  }

  function createSnakePath(targetX, targetY) {
    if (!Number.isFinite(targetX) || !Number.isFinite(targetY)) {
      return [
        { x: 0, y: 0 },
        { x: width / 2 || window.innerWidth / 2, y: height / 2 || window.innerHeight / 2 }
      ];
    }

    const safeWidth = Math.min(
      Math.max(Number.isFinite(width) && width > 0 ? width : window.innerWidth || 1280, 320),
      2600
    );
    const safeHeight = Math.min(
      Math.max(Number.isFinite(height) && height > 0 ? height : window.innerHeight || 720, 320),
      1800
    );
    const cell = safeWidth < 720 ? 18 : 22;
    const cols = Math.max(2, Math.ceil(safeWidth / cell));
    const rows = Math.max(2, Math.ceil(safeHeight / cell));
    const end = {
      x: Math.min(cols - 1, Math.max(0, Math.floor(targetX / cell))),
      y: Math.min(rows - 1, Math.max(0, Math.floor(targetY / cell)))
    };
    const key = (point) => `${point.x},${point.y}`;
    const blocked = new Set();

    getObstacleRects(targetX, targetY).forEach((rect) => {
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

    for (let y = Math.max(0, end.y - 1); y <= Math.min(rows - 1, end.y + 1); y += 1) {
      for (let x = Math.max(0, end.x - 1); x <= Math.min(cols - 1, end.x + 1); x += 1) {
        blocked.delete(`${x},${y}`);
      }
    }

    const corners = [
      { x: 0, y: 0 },
      { x: cols - 1, y: 0 },
      { x: 0, y: rows - 1 },
      { x: cols - 1, y: rows - 1 }
    ];
    const edgeCandidates = [];

    for (let x = 0; x < cols; x += 1) {
      edgeCandidates.push({ x, y: 0 }, { x, y: rows - 1 });
    }

    for (let y = 1; y < rows - 1; y += 1) {
      edgeCandidates.push({ x: 0, y }, { x: cols - 1, y });
    }

    const hasExit = (point) =>
      [
        { x: point.x + 1, y: point.y },
        { x: point.x - 1, y: point.y },
        { x: point.x, y: point.y + 1 },
        { x: point.x, y: point.y - 1 }
      ].some(
        (next) =>
          next.x >= 0 &&
          next.y >= 0 &&
          next.x < cols &&
          next.y < rows &&
          !blocked.has(key(next))
      );

    const start =
      edgeCandidates
        .filter((candidate) => !blocked.has(key(candidate)) && hasExit(candidate))
        .sort(
          (left, right) =>
            Math.hypot(right.x - end.x, right.y - end.y) -
            Math.hypot(left.x - end.x, left.y - end.y)
        )[0] ||
      corners.sort(
        (left, right) =>
          Math.hypot(right.x - end.x, right.y - end.y) -
          Math.hypot(left.x - end.x, left.y - end.y)
      )[0];

    blocked.delete(key(start));
    blocked.delete(key(end));

    for (let y = Math.max(0, start.y - 1); y <= Math.min(rows - 1, start.y + 1); y += 1) {
      for (let x = Math.max(0, start.x - 1); x <= Math.min(cols - 1, start.x + 1); x += 1) {
        blocked.delete(`${x},${y}`);
      }
    }

    function getFallbackPath() {
      const edgeInset = cell / 2;
      const sideX = targetX > safeWidth / 2 ? safeWidth - edgeInset : edgeInset;
      const sideY = start.y > rows / 2 ? safeHeight - edgeInset : edgeInset;
      const fallbackPath = [
        {
          x: start.x * cell + cell / 2,
          y: start.y * cell + cell / 2
        },
        { x: start.x * cell + cell / 2, y: sideY },
        { x: sideX, y: sideY },
        { x: sideX, y: end.y * cell + cell / 2 },
        {
          x: end.x * cell + cell / 2,
          y: end.y * cell + cell / 2
        }
      ].filter((point, index, list) => {
        if (index === 0) {
          return true;
        }

        const previous = list[index - 1];
        return Math.hypot(point.x - previous.x, point.y - previous.y) > 1;
      });

      return smoothPath(fallbackPath);
    }

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
        const routeKeys = new Set([cursor]);
        while (cameFrom.has(cursor) && path.length <= cols * rows) {
          const previous = cameFrom.get(cursor);
          if (!previous) {
            return getFallbackPath();
          }

          path.push(previous);
          cursor = key(previous);

          if (routeKeys.has(cursor)) {
            return getFallbackPath();
          }

          routeKeys.add(cursor);
        }

        if (path.length > cols * rows) {
          return getFallbackPath();
        }

        return smoothPath(path.reverse().map((point) => ({
          x: point.x * cell + cell / 2,
          y: point.y * cell + cell / 2
        })));
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

    return getFallbackPath();
  }

  function smoothPath(path) {
    if (path.length < 3) {
      return path;
    }

    const smoothed = [path[0]];
    for (let index = 1; index < path.length - 1; index += 1) {
      const previous = path[index - 1];
      const current = path[index];
      const next = path[index + 1];
      const sameDirection =
        Math.abs(previous.x - current.x) === Math.abs(current.x - next.x) &&
        Math.abs(previous.y - current.y) === Math.abs(current.y - next.y);

      if (!sameDirection || index % 3 === 0) {
        smoothed.push(current);
      }
    }
    smoothed.push(path[path.length - 1]);
    return smoothed;
  }

  function getPointAlongPath(path, distance) {
    if (!path.length) {
      return { x: 0, y: 0, angle: 0 };
    }

    let traveled = 0;
    for (let index = 1; index < path.length; index += 1) {
      const from = path[index - 1];
      const to = path[index];
      const segmentLength = Math.hypot(to.x - from.x, to.y - from.y);
      if (traveled + segmentLength >= distance) {
        const ratio = Math.max(0, Math.min(1, (distance - traveled) / segmentLength));
        return {
          x: from.x + (to.x - from.x) * ratio,
          y: from.y + (to.y - from.y) * ratio,
          angle: Math.atan2(to.y - from.y, to.x - from.x)
        };
      }
      traveled += segmentLength;
    }

    const last = path[path.length - 1];
    const previous = path[path.length - 2] || last;
    return {
      x: last.x,
      y: last.y,
      angle: Math.atan2(last.y - previous.y, last.x - previous.x)
    };
  }

  function getPathLength(path) {
    return path.reduce((total, point, index) => {
      if (index === 0) {
        return total;
      }
      const previous = path[index - 1];
      return total + Math.hypot(point.x - previous.x, point.y - previous.y);
    }, 0);
  }

  function createCollectibles(path, totalLength) {
    const eggs = [];
    const monsters = [];
    const eggCount = Math.min(8, Math.max(4, Math.floor(totalLength / 260)));
    const monsterCount = Math.min(5, Math.max(2, Math.floor(totalLength / 430)));

    for (let index = 1; index <= eggCount; index += 1) {
      const distance = (totalLength * index) / (eggCount + 1);
      eggs.push({
        ...getPointAlongPath(path, distance),
        distance,
        eaten: false,
        pulse: Math.random() * Math.PI * 2
      });
    }

    for (let index = 1; index <= monsterCount; index += 1) {
      const distance = (totalLength * (index + 0.45)) / (monsterCount + 1.7);
      monsters.push({
        ...getPointAlongPath(path, distance),
        distance,
        defeated: false,
        pulse: Math.random() * Math.PI * 2
      });
    }

    return { eggs, monsters };
  }

  function addTinyBurst(x, y, color, count = 14) {
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.45;
      const speed = 1.4 + Math.random() * 3.2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        size: 2 + Math.random() * 5,
        spin: Math.random() * Math.PI,
        spinSpeed: -0.16 + Math.random() * 0.32,
        life: 26 + Math.random() * 20,
        maxLife: 52,
        color,
        square: index % 2 === 0
      });
    }
  }

  function fireworkBurst(x, y) {
    burst(x, y);
    const rings = [24, 36, 48];

    rings.forEach((radius, ringIndex) => {
      const count = 32 + ringIndex * 10;
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + ringIndex * 0.16;
        const speed = 1.8 + ringIndex * 1.5 + Math.random() * 2.2;
        particles.push({
          x: x + Math.cos(angle) * radius * 0.12,
          y: y + Math.sin(angle) * radius * 0.12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.7,
          size: 2.5 + Math.random() * 6,
          spin: Math.random() * Math.PI,
          spinSpeed: -0.22 + Math.random() * 0.44,
          life: 58 + Math.random() * 34,
          maxLife: 92,
          color: colors[(index + ringIndex * 2) % colors.length],
          square: (index + ringIndex) % 3 !== 0
        });
      }
    });
  }

  function spawnSnake() {
    if (!pointer.ready) {
      return;
    }

    const path = createSnakePath(pointer.x, pointer.y);
    const totalLength = getPathLength(path);
    const collectibles = createCollectibles(path, totalLength);
    snake = {
      path,
      totalLength,
      progress: 0,
      speed: Math.max(3.6, Math.min(6.2, totalLength / 180)),
      baseLength: 112,
      growth: 0,
      segmentGap: 16,
      eggs: collectibles.eggs,
      monsters: collectibles.monsters,
      arrived: false,
      arrivePulse: 0,
      orbitAngle: 0,
      orbitFrames: 0,
      orbitDuration: 300,
      orbitRadius: 32
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

    if (!snake.arrived) {
      snake.progress = Math.min(snake.totalLength, snake.progress + snake.speed);
    }

    snake.eggs.forEach((egg) => {
      if (!egg.eaten && snake.progress + 8 >= egg.distance) {
        egg.eaten = true;
        snake.growth += 28;
        addTinyBurst(egg.x, egg.y, snakeColors.egg, 16);
      }
    });

    snake.monsters.forEach((monster) => {
      if (!monster.defeated && snake.progress + 10 >= monster.distance) {
        monster.defeated = true;
        snake.growth += 12;
        addTinyBurst(monster.x, monster.y, snakeColors.monster, 20);
      }
    });

    if (!snake.arrived && snake.progress >= snake.totalLength - 2) {
      snake.arrived = true;
      snake.arrivePulse = 0;
      snake.orbitAngle = getPointAlongPath(snake.path, snake.totalLength).angle;
      snake.orbitFrames = 0;
      addTinyBurst(pointer.x, pointer.y, snakeColors.head, 24);
    }

    drawCollectibles(snake);
    drawSnakeBody(snake);

    if (snake.arrived) {
      drawArrival(snake);
      snake.arrivePulse += 0.045;
      snake.orbitAngle += 0.105;
      snake.orbitFrames += 1;

      if (snake.orbitFrames >= snake.orbitDuration) {
        fireworkBurst(pointer.x, pointer.y);
        snake = null;
      }
    }
  }

  function drawCollectibles(currentSnake) {
    const time = performance.now() / 280;

    currentSnake.eggs.forEach((egg) => {
      if (egg.eaten) {
        return;
      }

      const bob = Math.sin(time + egg.pulse) * 2.5;
      ctx.save();
      ctx.translate(egg.x, egg.y + bob);
      ctx.globalAlpha = 0.86;
      ctx.fillStyle = snakeColors.shell;
      ctx.strokeStyle = "rgba(185, 137, 44, 0.42)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = snakeColors.egg;
      ctx.beginPath();
      ctx.arc(1, -1, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    currentSnake.monsters.forEach((monster) => {
      if (monster.defeated) {
        return;
      }

      const wobble = Math.sin(time + monster.pulse) * 0.18;
      ctx.save();
      ctx.translate(monster.x, monster.y);
      ctx.rotate(wobble);
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = snakeColors.monster;
      ctx.strokeStyle = "rgba(17, 33, 51, 0.28)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      drawRoundedRect(-9, -8, 18, 16, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.fillRect(-5, -3, 3, 3);
      ctx.fillRect(3, -3, 3, 3);
      ctx.fillStyle = "#112133";
      ctx.fillRect(-4, -2, 1.5, 1.5);
      ctx.fillRect(4, -2, 1.5, 1.5);
      ctx.restore();
    });
  }

  function drawSnakeSegment(point, radius, isHead, alpha, showBelly) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(point.x, point.y);
    ctx.rotate(point.angle);
    ctx.fillStyle = isHead ? snakeColors.head : snakeColors.body;
    ctx.strokeStyle = snakeColors.outline;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    drawRoundedRect(-radius, -radius * 0.72, radius * 2, radius * 1.44, radius * 0.55);
    ctx.fill();
    ctx.stroke();

    if (showBelly) {
      ctx.fillStyle = "rgba(245, 208, 111, 0.62)";
      ctx.fillRect(-radius * 0.18, -radius * 0.52, radius * 0.42, radius * 1.04);
    }
    ctx.restore();
  }

  function drawSnakeEyes(head) {
    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(head.angle);
    ctx.fillStyle = "#fff";
    ctx.fillRect(1, -7, 4, 4);
    ctx.fillRect(1, 3, 4, 4);
    ctx.fillStyle = "#112133";
    ctx.fillRect(3, -5, 1.5, 1.5);
    ctx.fillRect(3, 5, 1.5, 1.5);
    ctx.restore();
  }

  function drawOrbitingSnakeBody(currentSnake) {
    const length = currentSnake.baseLength + currentSnake.growth;
    const segmentCount = Math.max(7, Math.floor(length / currentSnake.segmentGap));
    const orbitAlpha = Math.max(0, 1 - Math.max(0, currentSnake.orbitFrames - 230) / 70);
    let head = null;

    for (let index = segmentCount; index >= 0; index -= 1) {
      const angle = currentSnake.orbitAngle - index * 0.28;
      const wave = Math.sin(currentSnake.arrivePulse * 3.2 + index * 0.72) * 5;
      const orbitRadius = currentSnake.orbitRadius + Math.min(26, index * 1.18) + wave;
      const scale = 1 - Math.min(0.5, index / (segmentCount * 2.4));
      const radius = 10.5 * scale;
      const point = {
        x: pointer.x + Math.cos(angle) * orbitRadius,
        y: pointer.y + Math.sin(angle) * orbitRadius,
        angle: angle + Math.PI / 2
      };

      if (index === 0) {
        head = point;
      }

      drawSnakeSegment(
        point,
        radius,
        index === 0,
        Math.min(0.92, orbitAlpha * (0.4 + (segmentCount - index) / segmentCount)),
        index % 2 === 0 && index > 0
      );
    }

    if (head) {
      drawSnakeEyes(head);
    }
  }

  function drawSnakeBody(currentSnake) {
    if (currentSnake.arrived) {
      drawOrbitingSnakeBody(currentSnake);
      return;
    }

    const head = getPointAlongPath(currentSnake.path, currentSnake.progress);
    const length = currentSnake.baseLength + currentSnake.growth;
    const segmentCount = Math.max(7, Math.floor(length / currentSnake.segmentGap));

    for (let index = segmentCount; index >= 0; index -= 1) {
      const distance = Math.max(0, currentSnake.progress - index * currentSnake.segmentGap);
      const point = getPointAlongPath(currentSnake.path, distance);
      const scale = 1 - Math.min(0.48, index / (segmentCount * 2.2));
      const radius = 10.5 * scale;

      drawSnakeSegment(
        point,
        radius,
        index === 0,
        Math.min(0.9, 0.36 + (segmentCount - index) / segmentCount),
        index % 2 === 0 && index > 0
      );
    }

    drawSnakeEyes(head);
  }

  function drawArrival(currentSnake) {
    const pulse = currentSnake.arrivePulse;
    const ring = 24 + Math.sin(pulse * Math.PI * 2) * 6;
    const head = getPointAlongPath(currentSnake.path, currentSnake.totalLength);

    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = snakeColors.head;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, ring, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = snakeColors.body;
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.quadraticCurveTo((head.x + pointer.x) / 2, head.y - 28, pointer.x, pointer.y);
    ctx.stroke();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    updateGravityWaves();
    updateParticles();
    drawGravityField();
    drawSnake();
    drawParticles();

    if (
      particles.length ||
      gravityWaves.length ||
      snake ||
      (pointer.ready && performance.now() - lastPointerAt < 1400)
    ) {
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
    setPointerTarget(event);
    clearSnake();
    scheduleSnake();
    burst(event.clientX, event.clientY);
  });

  function handlePointerHover(event) {
    setPointerTarget(event);
    clearSnake();
    scheduleSnake();
  }

  window.addEventListener("pointermove", handlePointerHover);
  window.addEventListener("mousemove", handlePointerHover);

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
