(function () {
  "use strict";

  const articles = window.PEAD_INSIGHTS || [];
  const grid = document.getElementById("insightsGrid");
  const featured = document.getElementById("featuredInsight");
  const countEl = document.getElementById("insightsCount");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const filterBtns = document.querySelectorAll(".filter-btn");

  if (!grid || !articles.length) return;

  const PAGE_SIZE = 9;
  let activeFilter = "all";
  let visibleCount = PAGE_SIZE;

  const categoryLabels = {
    crisis: "Crisis & Issues",
    digital: "Digital & AI",
    leadership: "Leadership",
    strategy: "Strategy",
    industry: "Industry",
    media: "Media",
    news: "News"
  };

  function formatDate(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-NZ", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function getFiltered() {
    if (activeFilter === "all") return articles;
    if (activeFilter === "media") {
      return articles.filter((a) => a.category === "media");
    }
    return articles.filter((a) => a.category === activeFilter);
  }

  function renderFeatured() {
    const item = articles.find((a) => a.featured) || articles[0];
    if (!featured || !item) return;

    featured.innerHTML = `
      <a href="${item.url}" class="featured-card reveal" target="_blank" rel="noopener">
        <div class="featured-card-media">
          <img src="${item.image}" alt="" loading="eager" />
        </div>
        <div class="featured-card-content container">
          <span class="work-tag">Featured insight</span>
          <h2>${item.title}</h2>
          <p>${item.excerpt}</p>
          <div class="featured-meta">
            <span>${item.author}</span>
            <span>${formatDate(item.date)}</span>
          </div>
          <span class="work-link">Read article <span aria-hidden="true">→</span></span>
        </div>
      </a>
    `;

    const card = featured.querySelector(".reveal");
    if (card) requestAnimationFrame(() => card.classList.add("visible"));
  }

  function renderCard(item) {
    const label = categoryLabels[item.category] || "Insight";
    return `
      <article class="insight-card reveal">
        <a href="${item.url}" class="insight-card-link" target="_blank" rel="noopener">
          <div class="insight-card-media">
            <img src="${item.image}" alt="" loading="lazy" />
            <span class="insight-category">${label}</span>
          </div>
          <div class="insight-card-body">
            <time datetime="${item.date}">${formatDate(item.date)}</time>
            <h3>${item.title}</h3>
            <p>${item.excerpt}</p>
            <span class="insight-author">${item.author}</span>
          </div>
        </a>
      </article>
    `;
  }

  function observeNewCards() {
    const revealEls = grid.querySelectorAll(".reveal:not(.visible)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 3) * 0.06}s`;
      observer.observe(el);
    });
  }

  function renderGrid() {
    const filtered = getFiltered();
    const slice = filtered.slice(0, visibleCount);

    grid.innerHTML = slice.map(renderCard).join("");

    if (countEl) {
      countEl.textContent = `${filtered.length} article${filtered.length === 1 ? "" : "s"}`;
    }

    if (loadMoreBtn) {
      loadMoreBtn.hidden = visibleCount >= filtered.length;
    }

    observeNewCards();
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      visibleCount = PAGE_SIZE;
      renderGrid();
    });
  });

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleCount += PAGE_SIZE;
      renderGrid();
    });
  }

  renderFeatured();
  renderGrid();
})();
