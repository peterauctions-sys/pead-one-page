(function () {
  "use strict";

  const header = document.getElementById("header");
  const hero = document.getElementById("hero");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const cursorGlow = document.querySelector(".cursor-glow");

  // Header scroll behavior
  function updateHeader() {
    const heroBottom = hero.offsetHeight - 100;
    const scrolled = window.scrollY > 40;

    header.classList.toggle("scrolled", scrolled);
    header.classList.toggle("on-hero", window.scrollY < heroBottom);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // Mobile menu
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileNav.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
      document.body.style.overflow = "";
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
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

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  // Capability card expand (touch devices)
  document.querySelectorAll(".cap-expand").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".cap-card");
      const expanded = card.classList.toggle("expanded");
      btn.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded ? "Collapse" : "Explore";
    });
  });

  // Subtle cursor glow on desktop
  if (window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-mouse");
    let rafId = null;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          cursorGlow.style.left = targetX + "px";
          cursorGlow.style.top = targetY + "px";
          rafId = null;
        });
      }
    });
  }

  // Smooth anchor offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();
