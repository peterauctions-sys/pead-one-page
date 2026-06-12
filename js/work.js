(function () {
  "use strict";

  const projects = window.PEAD_WORK || [];
  const awards = window.PEAD_AWARDS || [];
  const grid = document.getElementById("workGrid");
  const featured = document.getElementById("workFeatured");
  const countEl = document.getElementById("workCount");
  const awardsList = document.getElementById("awardsList");
  const filterBtns = document.querySelectorAll(".work-filter-btn");

  if (!grid || !projects.length) return;

  const categoryLabels = {
    award: "Award-winning",
    corporate: "Corporate",
    consumer: "Consumer",
    purpose: "Purpose",
    events: "Events"
  };

  let activeFilter = "all";

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  function observeReveal(root) {
    root.querySelectorAll(".reveal:not(.visible)").forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 0.08}s`;
      revealObserver.observe(el);
    });
  }

  function getFiltered() {
    const base = projects.filter((p) => !p.featured);
    if (activeFilter === "all") return base;
    return base.filter((p) => p.category === activeFilter);
  }

  function renderFeatured() {
    const item = projects.find((p) => p.featured) || projects[0];
    if (!featured || !item) return;

    featured.innerHTML = `
      <div class="work-featured-card reveal">
        <div class="work-featured-media">
          <img src="${item.image}" alt="${item.title}" loading="eager" />
        </div>
        <div class="work-featured-content container">
          <span class="work-tag">${item.tag}</span>
          <h2>${item.title}</h2>
          <p>${item.excerpt}</p>
          <span class="work-featured-client">${item.client}</span>
        </div>
      </div>
    `;

    const card = featured.querySelector(".reveal");
    if (card) requestAnimationFrame(() => card.classList.add("visible"));
  }

  function renderCard(item) {
    const label = categoryLabels[item.category] || "Client work";
    return `
      <article class="work-card reveal">
        <div class="work-card-media">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
        </div>
        <div class="work-card-content">
          <span class="work-tag">${item.tag}</span>
          <h3>${item.title}</h3>
          <p class="work-card-client">${item.client}</p>
          <p>${item.excerpt}</p>
          <span class="work-card-category">${label}</span>
        </div>
      </article>
    `;
  }

  function renderGrid() {
    const items = getFiltered();
    grid.innerHTML = items.map(renderCard).join("");

    if (countEl) {
      countEl.textContent = `${items.length} project${items.length === 1 ? "" : "s"}`;
    }

    observeReveal(grid);
  }

  function renderAwards() {
    if (!awardsList || !awards.length) return;

    awardsList.innerHTML = awards
      .map(
        (a) => `
      <div class="award-item reveal">
        <span class="award-year">${a.year}</span>
        <div>
          <strong>${a.title}</strong>
          <p>${a.detail}</p>
        </div>
      </div>
    `
      )
      .join("");

    observeReveal(awardsList);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter || "all";
      filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
      renderGrid();
    });
  });

  renderFeatured();
  renderGrid();
  renderAwards();
})();
