(function () {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = themeToggle && themeToggle.querySelector("[data-theme-label]");
  const root = document.documentElement;

  function applyTheme(theme, persist) {
    root.dataset.theme = theme;
    if (persist) {
      try { localStorage.setItem("skill-state-theme", theme); } catch (error) {}
    }
    if (themeToggle) {
      const dark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
      if (themeLabel) themeLabel.textContent = dark ? "светлая" : "тёмная";
    }
  }

  if (themeToggle) {
    applyTheme(root.dataset.theme === "dark" ? "dark" : "light", false);
    themeToggle.addEventListener("click", function () {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
    });
  }

  const main = document.querySelector("main");
  if (main) {
    [
      "abstract", "sec-1", "sec-2", "sec-3", "sec-4", "sec-5",
      "sec-6", "sec-7", "references", "appendix-a", "appendix-b",
      "appendix-c", "appendix-d", "site-footer"
    ].forEach(function (id) {
      const node = document.getElementById(id);
      if (node) main.appendChild(node);
    });
  }

  const printButton = document.querySelector("[data-print]");
  if (printButton) printButton.addEventListener("click", function () { window.print(); });

  const links = Array.from(document.querySelectorAll(".toc a[href^='#']"));
  const targets = links
    .map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && targets.length) {
    const byId = new Map(links.map(function (link) { return [link.getAttribute("href").slice(1), link]; }));
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        const link = byId.get(entry.target.id);
        if (link) link.classList.toggle("current", entry.isIntersecting);
      });
    }, { rootMargin: "-18% 0px -70% 0px", threshold: 0 });
    targets.forEach(function (target) { observer.observe(target); });
  }
}());
