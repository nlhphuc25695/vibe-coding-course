const topbar = document.getElementById("topbar");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const topSearchForm = document.querySelector(".top-search");

const courseLinks = document.querySelectorAll("[data-course-link]");
const courseSections = document.querySelectorAll("[data-course-section]");

const bottomTabs = document.querySelectorAll(".bottom-tabs a");
const mobileSections = document.querySelectorAll("[data-mobile-section]");

const weekChecks = document.querySelectorAll("[data-week]");
const progressCounts = [
  document.getElementById("progressCount"),
  document.getElementById("sidebarProgressCount"),
].filter(Boolean);
const progressBars = [
  document.getElementById("courseProgress"),
  document.getElementById("sidebarCourseProgress"),
].filter(Boolean);
const resetProgress = document.getElementById("resetProgress");
const continueWeek = document.getElementById("continueWeek");

const moduleSearch = document.getElementById("moduleSearch");
const clearSearch = document.getElementById("clearSearch");
const searchEmpty = document.getElementById("searchEmpty");
const moduleGroups = document.querySelectorAll("#modules .module-group");
const lessons = Array.from(document.querySelectorAll("#modules details.lesson"));

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
    if (scrollTop > 8) topbar.classList.add("scrolled");
    else topbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

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

if (topSearchForm) {
  topSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function setCourseActive(key) {
  courseLinks.forEach((link) => {
    const isActive = link.dataset.courseLink === key;
    link.classList.toggle("active", isActive);
  });
}

function setMobileActive(key) {
  bottomTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === key);
  });
}

function setupObserver(sections, onActive, options) {
  if (!sections.length) return;

  if (!("IntersectionObserver" in window)) {
    const update = () => {
      let activeId = sections[0].id;
      let bestDistance = Infinity;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - window.innerHeight * 0.32);
        if (distance < bestDistance) {
          bestDistance = distance;
          activeId = section.id;
        }
      });
      onActive(activeId);
    };

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let candidate = null;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!candidate || entry.intersectionRatio > candidate.intersectionRatio) {
          candidate = entry;
        }
      });
      if (candidate) {
        onActive(candidate.target.id);
      }
    },
    options
  );

  sections.forEach((section) => observer.observe(section));
}

setupObserver(
  Array.from(courseSections),
  (id) => setCourseActive(id),
  { threshold: [0.3, 0.45, 0.65], rootMargin: "-16% 0px -50% 0px" }
);

setupObserver(
  Array.from(mobileSections),
  (id) => setMobileActive(id),
  { threshold: [0.3, 0.45, 0.65], rootMargin: "-12% 0px -58% 0px" }
);

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
  const sorted = Array.from(weekChecks).sort((a, b) => {
    return Number(a.dataset.week) - Number(b.dataset.week);
  });
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
  continueWeek.setAttribute("href", `#w${week}`);
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

if (continueWeek) {
  continueWeek.addEventListener("click", () => {
    const targetId = continueWeek.getAttribute("href");
    if (!targetId || !targetId.startsWith("#w")) return;
    const lesson = document.querySelector(targetId);
    if (lesson && lesson.tagName.toLowerCase() === "details") {
      lesson.open = true;
    }
  });
}

lessons.forEach((lesson) => {
  const summary = lesson.querySelector("summary")?.textContent || "";
  lesson.dataset.searchIndex = normalizeText(`${lesson.id} ${summary} ${lesson.textContent}`);
});

function applyModuleFilter() {
  if (!moduleSearch) return;

  const query = normalizeText(moduleSearch.value || "");
  let visibleCount = 0;

  lessons.forEach((lesson) => {
    const index = lesson.dataset.searchIndex || "";
    const matched = query.length === 0 || index.includes(query);
    lesson.hidden = !matched;
    if (matched) visibleCount += 1;
  });

  moduleGroups.forEach((group) => {
    if (!query) {
      group.classList.remove("is-filtered-out");
      return;
    }

    const visibleInGroup = group.querySelectorAll("details.lesson:not([hidden])").length;
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
