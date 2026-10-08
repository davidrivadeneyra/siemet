import { scrambleText } from "./scramble-text.js";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const AUTOPLAY_DELAY = 10000;

export function initGallery(root) {
  const image = root.querySelector("[data-gallery-image]");
  const title = root.querySelector("[data-gallery-title]");
  const description = root.querySelector("[data-gallery-description]");
  const countCurrent = root.querySelector("[data-gallery-count-current]");
  const countTotal = root.querySelector("[data-gallery-count-total]");
  const progress = root.querySelector("[data-gallery-progress]");
  const thumbs = [...root.querySelectorAll("[data-gallery-thumb]")];
  const previous = root.querySelector("[data-gallery-previous]");
  const next = root.querySelector("[data-gallery-next]");

  if (!image || !thumbs.length) return;

  let currentIndex = Math.max(0, thumbs.findIndex((thumb) => thumb.classList.contains("is-current")));
  let autoplayId;
  let timerAnimation;

  const reducedMotion = () => window.matchMedia(MOTION_QUERY).matches;

  function syncCount(index) {
    const current = String(index + 1).padStart(2, "0");
    const total = String(thumbs.length).padStart(2, "0");
    const countLabel = countCurrent?.closest("[aria-live]");

    if (countTotal) countTotal.textContent = total;
    if (!countCurrent || countCurrent.textContent === current) return;

    const liveSetting = countLabel?.getAttribute("aria-live");
    countLabel?.setAttribute("aria-live", "off");
    scrambleText(countCurrent, current);
    window.setTimeout(() => {
      if (liveSetting) countLabel?.setAttribute("aria-live", liveSetting);
    }, 600);
  }

  function stopAutoplay() {
    window.clearTimeout(autoplayId);
    timerAnimation?.cancel();
    timerAnimation = undefined;

    if (progress) {
      progress.style.removeProperty("transition");
      progress.style.transform = "scaleX(0)";
    }
  }

  function select(index) {
    const normalizedIndex = (index + thumbs.length) % thumbs.length;
    const selected = thumbs[normalizedIndex];

    currentIndex = normalizedIndex;
    image.src = selected.dataset.src;
    image.alt = selected.dataset.alt ?? "";
    if (title) title.textContent = selected.dataset.title ?? "";
    if (description) description.textContent = selected.dataset.description ?? "";
    syncCount(normalizedIndex);

    thumbs.forEach((thumb, thumbIndex) => {
      const isCurrent = thumbIndex === normalizedIndex;
      thumb.classList.toggle("is-current", isCurrent);
      thumb.setAttribute("aria-pressed", String(isCurrent));
    });

    if (!reducedMotion() && image.animate) {
      image.animate([{ opacity: 0.35, transform: "scale(1.02)" }, { opacity: 1, transform: "scale(1)" }], {
        duration: 360,
        easing: "ease-out",
      });
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion() || document.hidden) return;

    const advance = () => {
      select(currentIndex + 1);
      startAutoplay();
    };

    if (progress?.animate) {
      timerAnimation = progress.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
        duration: AUTOPLAY_DELAY,
        easing: "linear",
        fill: "forwards",
      });

      const activeAnimation = timerAnimation;
      activeAnimation.finished
        .then(() => {
          if (timerAnimation !== activeAnimation) return;
          timerAnimation = undefined;
          advance();
        })
        .catch(() => {});
      return;
    }

    if (progress) {
      progress.style.transition = `transform ${AUTOPLAY_DELAY}ms linear`;
      window.requestAnimationFrame(() => {
        progress.style.transform = "scaleX(1)";
      });
    }

    autoplayId = window.setTimeout(advance, AUTOPLAY_DELAY);
  }

  function navigateTo(index) {
    stopAutoplay();
    select(index);
    startAutoplay();
  }

  thumbs.forEach((thumb, index) => thumb.addEventListener("click", () => navigateTo(index)));
  previous?.addEventListener("click", () => navigateTo(currentIndex - 1));
  next?.addEventListener("click", () => navigateTo(currentIndex + 1));

  document.addEventListener("visibilitychange", startAutoplay);
  window.matchMedia(MOTION_QUERY).addEventListener("change", startAutoplay);

  select(currentIndex);
  startAutoplay();
}
