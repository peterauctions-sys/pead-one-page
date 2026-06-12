(function () {
  "use strict";

  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector(".faq-question");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(open));
    });
  });
})();
