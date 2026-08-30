const pageLoader = document.querySelector("#pageLoader");
let loaderDismissed = false;
const dismissLoader = () => {
  if (!pageLoader || loaderDismissed) return;
  loaderDismissed = true;
  pageLoader.classList.add("is-hidden");
  window.setTimeout(() => pageLoader.remove(), 750);
};

window.addEventListener("load", () => window.setTimeout(dismissLoader, 520), { once: true });
window.setTimeout(dismissLoader, 2200);

document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Missing local images become intentional paper placeholders instead of broken icons.
  document.querySelectorAll("img").forEach((image) => {
    const markMissing = () => image.classList.add("image-missing");
    image.addEventListener("error", markMissing, { once: true });
    if (image.complete && image.naturalWidth === 0) markMissing();
  });

  // Subtle reveal as notebook pages enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Keep the music controls mutually exclusive.
  const allAudio = [...document.querySelectorAll("audio")];
  const stopOtherAudio = (current) => {
    allAudio.forEach((audio) => {
      if (audio !== current) {
        audio.pause();
        audio.closest(".track")?.classList.remove("is-playing");
      }
    });
  };

  document.querySelectorAll(".track").forEach((track) => {
    const button = track.querySelector(".track-play");
    const audio = track.querySelector("audio");
    button.addEventListener("click", () => {
      if (audio.paused) {
        stopOtherAudio(audio);
        audio.play().catch(() => {
          // Browsers may block local files until the user chooses a valid audio file.
          track.classList.remove("is-playing");
        });
        track.classList.add("is-playing");
        button.textContent = "Ⅱ";
        button.setAttribute("aria-label", "Pause this track");
      } else {
        audio.pause();
        track.classList.remove("is-playing");
        button.textContent = "▶";
        button.setAttribute("aria-label", "Play this track");
      }
    });
    audio.addEventListener("ended", () => {
      track.classList.remove("is-playing");
      button.textContent = "▶";
      button.setAttribute("aria-label", "Play this track");
    });
  });

  const ambientButton = document.querySelector("#ambientToggle");
  const ambientAudio = document.querySelector("#ambientAudio");
  if (ambientButton && ambientAudio) {
    ambientButton.addEventListener("click", () => {
      if (ambientAudio.paused) {
        stopOtherAudio(ambientAudio);
        ambientAudio.play().catch(() => {});
        ambientButton.classList.add("is-playing");
        ambientButton.setAttribute("aria-pressed", "true");
        ambientButton.innerHTML = '<span class="speaker-icon">◖))</span> pause ambient loop';
      } else {
        ambientAudio.pause();
        ambientButton.classList.remove("is-playing");
        ambientButton.setAttribute("aria-pressed", "false");
        ambientButton.innerHTML = '<span class="speaker-icon">◖))</span> play ambient loop';
      }
    });
  }

  // Gentle mouse tilt on desktop cards; touch screens keep their natural layout.
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (window.matchMedia("(hover: none)").matches) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      const base = card.classList.contains("hero-note") ? 4 : 0;
      card.style.transform = `perspective(800px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) rotate(${base + x * 1.5}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = card.classList.contains("hero-note") ? "rotate(4deg)" : "";
    });
  });

  // Mark the current notebook section in the small top navigation.
  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => navObserver.observe(section));
});