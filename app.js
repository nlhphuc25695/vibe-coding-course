const topbar = document.getElementById("topbar");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const topSearchForm = document.querySelector(".top-search");
const courseTabs = document.getElementById("courseTabs");

const courseLinks = Array.from(document.querySelectorAll("[data-course-link]"));
const courseSections = Array.from(document.querySelectorAll("[data-course-section]"));

const bottomTabs = Array.from(document.querySelectorAll(".bottom-tabs a"));
const mobileSections = Array.from(document.querySelectorAll("[data-mobile-section]"));

const weekChecks = Array.from(document.querySelectorAll("[data-week]"));
const progressCounts = [document.getElementById("progressCount"), document.getElementById("sidebarProgressCount")].filter(Boolean);
const progressBars = [document.getElementById("courseProgress"), document.getElementById("sidebarCourseProgress")].filter(Boolean);
const resetProgress = document.getElementById("resetProgress");
const continueWeek = document.getElementById("continueWeek");

const moduleSearch = document.getElementById("moduleSearch");
const clearSearch = document.getElementById("clearSearch");
const searchEmpty = document.getElementById("searchEmpty");
const moduleGroups = Array.from(document.querySelectorAll("#modules .module-group"));
const lessons = Array.from(document.querySelectorAll("#modules [data-lesson]"));

const STORAGE_KEY = "vibe-course-progress";

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

function updateLayoutVars() {
  const root = document.documentElement;
  const topbarHeight = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 74;
  root.style.setProperty("--topbar-offset", `${topbarHeight}px`);

  if (courseTabs) {
    const tabsHeight = Math.ceil(courseTabs.getBoundingClientRect().height);
    root.style.setProperty("--course-tabs-offset", `${tabsHeight || 58}px`);
  }
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    requestUIRefresh();
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      requestUIRefresh();
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = siteNav.contains(event.target);
    const clickedMenuToggle = menuToggle.contains(event.target);
    if (!clickedInsideNav && !clickedMenuToggle) {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      requestUIRefresh();
    }
  });
}

if (topSearchForm) {
  topSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function setCourseActive(key) {
  courseLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.courseLink === key);
  });
}

function setMobileActive(key) {
  bottomTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === key);
  });
}

function findActiveByViewport(sections, focusRate = 0.32) {
  if (!sections.length) return null;

  const focusY = window.innerHeight * focusRate;
  let best = sections[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const inViewport = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!inViewport) return;

    const distance = Math.abs(rect.top - focusY);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = section;
    }
  });

  return best;
}

function updateActiveStates() {
  const activeCourseSection = findActiveByViewport(courseSections, 0.3);
  if (activeCourseSection) {
    setCourseActive(activeCourseSection.id);
  }

  const activeMobileSection = findActiveByViewport(mobileSections, 0.36);
  if (activeMobileSection) {
    setMobileActive(activeMobileSection.id);
  }
}

let ticking = false;
function requestUIRefresh() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateLayoutVars();
    updateScrollProgress();
    updateActiveStates();
  });
}

window.addEventListener("scroll", requestUIRefresh, { passive: true });
window.addEventListener("resize", requestUIRefresh);
window.addEventListener("orientationchange", requestUIRefresh);
updateLayoutVars();
updateScrollProgress();
updateActiveStates();

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage failures
  }
}

function firstIncompleteWeek() {
  const sorted = [...weekChecks].sort((a, b) => Number(a.dataset.week) - Number(b.dataset.week));
  return sorted.find((check) => !check.checked) || null;
}

function updateContinueButton() {
  if (!continueWeek) return;

  const next = firstIncompleteWeek();
  if (!next) {
    continueWeek.textContent = "Đã hoàn thành • Xem dự án";
    continueWeek.setAttribute("href", "#projects");
    return;
  }

  const week = Number(next.dataset.week);
  continueWeek.textContent = `Tiếp tục: Tuần ${week}`;
  continueWeek.setAttribute("href", `./modules/w${week}.html`);
}

function updateProgressUI() {
  const total = weekChecks.length;
  let completed = 0;

  weekChecks.forEach((check) => {
    if (check.checked) completed += 1;
  });

  progressCounts.forEach((node) => {
    node.textContent = `${completed}/${total}`;
  });

  const percent = total > 0 ? (completed / total) * 100 : 0;
  progressBars.forEach((bar) => {
    bar.style.width = `${percent}%`;
  });

  updateContinueButton();
}

const savedProgress = loadProgress();
weekChecks.forEach((check) => {
  const key = check.dataset.week;
  if (savedProgress[key]) {
    check.checked = true;
  }

  check.addEventListener("change", () => {
    const updated = loadProgress();
    updated[key] = check.checked;
    saveProgress(updated);
    updateProgressUI();
  });
});

if (resetProgress) {
  resetProgress.addEventListener("click", () => {
    weekChecks.forEach((check) => {
      check.checked = false;
    });
    saveProgress({});
    updateProgressUI();
  });
}

lessons.forEach((lesson) => {
  lesson.dataset.searchIndex = normalizeText(`${lesson.id} ${lesson.textContent}`);
});

function applyModuleFilter() {
  if (!moduleSearch) return;

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
}

if (moduleSearch) {
  moduleSearch.addEventListener("input", applyModuleFilter);
}

if (clearSearch && moduleSearch) {
  clearSearch.addEventListener("click", () => {
    moduleSearch.value = "";
    applyModuleFilter();
    moduleSearch.focus();
  });
}

updateProgressUI();
applyModuleFilter();
