const topbar = document.getElementById("topbar");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const bottomTabs = Array.from(document.querySelectorAll("[data-tab]"));

const progressChecks = Array.from(document.querySelectorAll('input[type="checkbox"][data-week], input[type="checkbox"][data-progress-key]'));
const progressCountNodes = Array.from(document.querySelectorAll("[data-progress-count]"));
const progressBars = Array.from(document.querySelectorAll("[data-progress-bar]"));
const continueButtons = Array.from(document.querySelectorAll("[data-continue-week]"));
const resetButtons = Array.from(document.querySelectorAll("[data-reset-progress]"));

const moduleSearch = document.getElementById("moduleSearch");
const clearSearch = document.getElementById("clearSearch");
const searchEmpty = document.getElementById("searchEmpty");
const moduleGroups = Array.from(document.querySelectorAll(".module-group"));
const lessons = Array.from(document.querySelectorAll("[data-lesson]"));

const redirectNotice = document.getElementById("redirectNotice");
const page = document.body.dataset.page || "";

const STORAGE_KEY = "vibe-course-progress";
const FOUNDATION_ITEMS = [
  { key: "foundation.f1", label: "Foundation 1", href: "./foundation/f1.html" },
  { key: "foundation.f2", label: "Foundation 2", href: "./foundation/f2.html" },
  { key: "foundation.f3", label: "Foundation 3", href: "./foundation/f3.html" },
  { key: "foundation.f4", label: "Foundation 4", href: "./foundation/f4.html" },
];
const MODULE_ITEMS = Array.from({ length: 12 }, (_, index) => {
  const week = index + 1;
  return { key: `modules.w${week}`, label: `Tuần ${week}`, href: `./modules/w${week}.html` };
});
const PROGRESS_ITEMS = [...FOUNDATION_ITEMS, ...MODULE_ITEMS];
const TOTAL_ITEMS = PROGRESS_ITEMS.length;

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function updateLayoutVars() {
  const root = document.documentElement;
  const topbarHeight = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 74;
  root.style.setProperty("--topbar-offset", `${topbarHeight}px`);
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (topbar) {
    topbar.classList.toggle("scrolled", scrollTop > 8);
  }
}

function setActiveNavigation() {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });

  bottomTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === page);
  });
}

function createEmptyProgress() {
  const progress = {};
  PROGRESS_ITEMS.forEach((item) => {
    progress[item.key] = false;
  });
  return progress;
}

function normalizeProgress(rawData) {
  const normalized = createEmptyProgress();
  if (!rawData || typeof rawData !== "object") {
    return normalized;
  }

  PROGRESS_ITEMS.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(rawData, item.key)) {
      normalized[item.key] = Boolean(rawData[item.key]);
    }
  });

  for (let week = 1; week <= 12; week += 1) {
    const legacyKey = String(week);
    if (Object.prototype.hasOwnProperty.call(rawData, legacyKey)) {
      normalized[`modules.w${week}`] = Boolean(rawData[legacyKey]);
    }
  }

  return normalized;
}

function getProgressKey(element) {
  if (!element) return "";
  if (element.dataset.progressKey) return element.dataset.progressKey;
  if (element.dataset.week) return `modules.w${element.dataset.week}`;
  return "";
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return normalizeProgress(parsed);
  } catch {
    return createEmptyProgress();
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(data)));
  } catch {
    // ignore storage failures
  }
}

function getFirstIncompleteItem(progressData) {
  for (const item of PROGRESS_ITEMS) {
    if (!progressData[item.key]) return item;
  }
  return null;
}

function updateProgressUI() {
  const progressData = loadProgress();
  const completed = PROGRESS_ITEMS.reduce((sum, item) => sum + (progressData[item.key] ? 1 : 0), 0);

  progressCountNodes.forEach((node) => {
    node.textContent = `${completed}/${TOTAL_ITEMS}`;
  });

  const percent = (completed / TOTAL_ITEMS) * 100;
  progressBars.forEach((bar) => {
    bar.style.width = `${percent}%`;
  });

  const nextItem = getFirstIncompleteItem(progressData);
  continueButtons.forEach((button) => {
    if (!nextItem) {
      button.textContent = "Đã hoàn thành - Xem dự án";
      button.setAttribute("href", "./projects.html");
      return;
    }

    button.textContent = `Tiếp tục: ${nextItem.label}`;
    button.setAttribute("href", nextItem.href);
  });
}

if (progressChecks.length) {
  const saved = loadProgress();
  progressChecks.forEach((check) => {
    const key = getProgressKey(check);
    if (!key) return;

    check.checked = Boolean(saved[key]);

    check.addEventListener("change", () => {
      const updated = loadProgress();
      updated[key] = check.checked;
      saveProgress(updated);
      updateProgressUI();
    });
  });
}

if (resetButtons.length) {
  resetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const cleared = createEmptyProgress();
      saveProgress(cleared);
      progressChecks.forEach((check) => {
        check.checked = false;
      });
      updateProgressUI();
    });
  });
}

if (moduleSearch && lessons.length) {
  lessons.forEach((lesson) => {
    lesson.dataset.searchIndex = normalizeText(`${lesson.id} ${lesson.textContent}`);
  });

  const applyModuleFilter = () => {
    const query = normalizeText(moduleSearch.value || "");
    let visibleCount = 0;

    lessons.forEach((lesson) => {
      const index = lesson.dataset.searchIndex || "";
      const matched = query.length === 0 || index.includes(query);
      lesson.hidden = !matched;
      lesson.classList.toggle("is-match", Boolean(query) && matched);
      if (matched) visibleCount += 1;
    });

    moduleGroups.forEach((group) => {
      if (!query) {
        group.classList.remove("is-filtered-out");
        return;
      }

      const visibleInGroup = group.querySelectorAll("[data-lesson]:not([hidden])").length;
      group.classList.toggle("is-filtered-out", visibleInGroup === 0);
    });

    if (searchEmpty) {
      searchEmpty.hidden = !(query && visibleCount === 0);
    }
  };

  moduleSearch.addEventListener("input", applyModuleFilter);

  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      moduleSearch.value = "";
      applyModuleFilter();
      moduleSearch.focus();
    });
  }

  applyModuleFilter();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = siteNav.contains(event.target);
    const clickedMenuToggle = menuToggle.contains(event.target);
    if (!clickedInsideNav && !clickedMenuToggle) {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function handleLegacyAnchorRedirect() {
  if (page !== "home") return;

  const hash = (window.location.hash || "").replace("#", "").trim();
  if (!hash) return;

  const routeMap = {
    overview: "./overview.html",
    outcomes: "./outcomes.html",
    modules: "./modules.html",
    foundation: "./modules.html#foundation",
    projects: "./projects.html",
    references: "./references.html",
  };

  const target = routeMap[hash];
  if (!target) return;

  if (redirectNotice) {
    redirectNotice.hidden = false;
    redirectNotice.innerHTML = `Đang chuyển bạn sang trang mới: <a href="${target}">${target}</a>`;
  }

  window.setTimeout(() => {
    window.location.replace(target);
  }, 350);
}

let ticking = false;
function requestUIRefresh() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateLayoutVars();
    updateScrollProgress();
  });
}

window.addEventListener("scroll", requestUIRefresh, { passive: true });
window.addEventListener("resize", requestUIRefresh);
window.addEventListener("orientationchange", requestUIRefresh);

setActiveNavigation();
handleLegacyAnchorRedirect();
updateProgressUI();
updateLayoutVars();
updateScrollProgress();
