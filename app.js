const topbar = document.getElementById("topbar");
const progressBar = document.getElementById("progressBar");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const sections = document.querySelectorAll("[data-nav]");
const bottomTabs = document.querySelectorAll(".bottom-tabs a");
const weekChecks = document.querySelectorAll("[data-week]");
const progressCount = document.getElementById("progressCount");
const courseProgress = document.getElementById("courseProgress");
const resetProgress = document.getElementById("resetProgress");
const STORAGE_KEY = "vibe-course-progress";

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;

  if (scrollTop > 8) topbar.classList.add("scrolled");
  else topbar.classList.remove("scrolled");
}

window.addEventListener("scroll", updateProgressBar);
updateProgressBar();

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

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const key = entry.target.getAttribute("data-nav");
      bottomTabs.forEach((tab) => {
        const isActive = tab.dataset.tab === key;
        tab.classList.toggle("active", isActive);
      });
    });
  },
  {
    threshold: 0.32,
    rootMargin: "-10% 0px -55% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

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

function updateProgressUI() {
  const total = weekChecks.length;
  let completed = 0;
  weekChecks.forEach((check) => {
    if (check.checked) completed += 1;
  });
  progressCount.textContent = `${completed}/${total}`;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  courseProgress.style.width = `${percent}%`;
}

const saved = loadProgress();
weekChecks.forEach((check) => {
  const key = check.dataset.week;
  if (saved[key]) {
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

updateProgressUI();
