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

function trackContactClick(method) {
  if (typeof gtag === "function") gtag("event", "contact_click", { method });
}

document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => trackContactClick("phone"));
});
document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => trackContactClick("whatsapp"));
});
document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener("click", () => trackContactClick("email"));
});

const heroVideo = document.querySelector(".hero-media video");
const heroPlayBtn = document.querySelector(".hero-play-btn");
if (heroVideo) {
  // autoplay is attempted via JS (instead of the HTML attribute) so a
  // blocked attempt (e.g. iOS Low Power Mode) can reveal a fallback button.
  heroVideo.play().catch(() => {
    if (heroPlayBtn) heroPlayBtn.hidden = false;
  });
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener("click", () => {
      heroVideo.play().then(() => { heroPlayBtn.hidden = true; }).catch(() => {});
    });
  }
}

const MOBILE_QUERY = window.matchMedia("(max-width: 720px)");
const galleryVideos = Array.from(document.querySelectorAll(".gallery-video"));

galleryVideos.forEach((video) => {
  // Tapping the video itself is a fallback for when autoplay is blocked
  // (e.g. iOS Low Power Mode), independent of the desktop play button below.
  video.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
  });

  const playBtn = video.closest(".video-wrap")?.querySelector(".video-play-btn");
  if (!playBtn) return;

  video.addEventListener("play", () => { playBtn.hidden = true; });
  video.addEventListener("pause", () => { playBtn.hidden = false; });

  playBtn.addEventListener("click", () => {
    galleryVideos.forEach((other) => {
      if (other !== video && !other.paused) other.pause();
    });
    video.play().catch(() => {});
  });
});

// Mobile: autoplay whichever video is in view. Desktop: only pause on exit,
// playback is started by the play button instead.
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (MOBILE_QUERY.matches) {
        if (entry.intersectionRatio >= 0.6) {
          if (video.paused) video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      } else if (!entry.isIntersecting && !video.paused) {
        video.pause();
      }
    });
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
