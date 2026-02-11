const topbar = document.getElementById("topbar");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const bottomTabs = Array.from(document.querySelectorAll("[data-tab]"));

const weekChecks = Array.from(document.querySelectorAll("[data-week]"));
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

const TOTAL_WEEKS = 12;
const STORAGE_KEY = "vibe-course-progress";

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

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const normalized = {};
    for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
      normalized[String(i)] = Boolean(parsed[String(i)]);
    }
    return normalized;
  } catch {
    const fallback = {};
    for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
      fallback[String(i)] = false;
    }
    return fallback;
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage failures
  }
}

function getFirstIncompleteWeek(progressData) {
  for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
    if (!progressData[String(i)]) return i;
  }
  return null;
}

function updateProgressUI() {
  const progressData = loadProgress();
  let completed = 0;

  for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
    if (progressData[String(i)]) completed += 1;
  }

  progressCountNodes.forEach((node) => {
    node.textContent = `${completed}/${TOTAL_WEEKS}`;
  });

  const percent = (completed / TOTAL_WEEKS) * 100;
  progressBars.forEach((bar) => {
    bar.style.width = `${percent}%`;
  });

  const nextWeek = getFirstIncompleteWeek(progressData);
  continueButtons.forEach((button) => {
    if (!nextWeek) {
      button.textContent = "Đã hoàn thành - Xem dự án";
      button.setAttribute("href", "./projects.html");
      return;
    }

    button.textContent = `Tiếp tục: Tuần ${nextWeek}`;
    button.setAttribute("href", `./modules/w${nextWeek}.html`);
  });
}

if (weekChecks.length) {
  const saved = loadProgress();
  weekChecks.forEach((check) => {
    const key = check.dataset.week;
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
      const cleared = {};
      for (let i = 1; i <= TOTAL_WEEKS; i += 1) {
        cleared[String(i)] = false;
      }
      saveProgress(cleared);
      weekChecks.forEach((check) => {
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
