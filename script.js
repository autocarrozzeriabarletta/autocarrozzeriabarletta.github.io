document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const galleryVideos = Array.from(document.querySelectorAll(".gallery-video"));
const videoRatios = new Map();

function playOnlyMostCentered() {
  const viewportCenter = window.innerHeight / 2;
  let best = null;
  let bestDistance = Infinity;

  galleryVideos.forEach((video) => {
    const ratio = videoRatios.get(video) || 0;
    if (ratio >= 0.6) {
      const rect = video.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = video;
      }
    }
  });

  galleryVideos.forEach((video) => {
    if (video === best) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  });
}

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => videoRatios.set(entry.target, entry.intersectionRatio));
    playOnlyMostCentered();
  },
  { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
);
galleryVideos.forEach((video) => videoObserver.observe(video));

const cardsGrid = document.querySelector(".cards-grid");
if (cardsGrid) {
  const cardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          cardsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  cardsObserver.observe(cardsGrid);
}

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    playOnlyMostCentered();
    scrollTicking = false;
  });
});
