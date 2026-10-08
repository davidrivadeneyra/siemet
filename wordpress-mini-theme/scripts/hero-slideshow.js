import { scrambleText } from "./scramble-text.js";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const AUTOPLAY_DELAY = 10000;

export function initHeroSlideshow(root) {
  const slides = [...root.querySelectorAll('[data-slideshow="slide"]')];
  const copies = [...root.querySelectorAll('[data-slideshow="copy"]')];
  const progress = root.querySelector('[data-slideshow="progress"]');
  const currentCount = root.querySelector('[data-slideshow="count-current"]');
  const totalCount = root.querySelector('[data-slideshow="count-total"]');
  const previousButton = root.querySelector('[data-slideshow="previous"]');
  const nextButton = root.querySelector('[data-slideshow="next"]');

  if (slides.length < 2) return;

  let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-current")));
  let isAnimating = false;
  let autoplayId;
  let timerAnimation;
  let pointerStartX;

  const reducedMotion = () => window.matchMedia(MOTION_QUERY).matches;

  function syncControls(index) {
    if (currentCount) {
      const current = String(index + 1).padStart(2, "0");
      const total = String(slides.length).padStart(2, "0");
      const countLabel = currentCount.closest("[aria-live]");

      if (totalCount) totalCount.textContent = total;

      if (currentCount.textContent !== current) {
        const liveSetting = countLabel?.getAttribute("aria-live");
        countLabel?.setAttribute("aria-live", "off");
        scrambleText(currentCount, current);
        window.setTimeout(() => {
          if (liveSetting) countLabel?.setAttribute("aria-live", liveSetting);
        }, 600);
      }
    }
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

  function syncMedia(index) {
    slides.forEach((slide, slideIndex) => {
      const media = slide.querySelector("video");
      if (!media) return;

      if (reducedMotion()) {
        media.pause();
        media.currentTime = 0;
        return;
      }

      if (slideIndex === index) {
        media.currentTime = 0;
        media.play().catch(() => {});
      } else {
        media.pause();
      }
    });
  }

  function setCurrent(index) {
    slides.forEach((slide, slideIndex) => {
      const selected = slideIndex === index;
      slide.classList.toggle("is-current", selected);
      slide.style.removeProperty("transform");
      slide.style.removeProperty("opacity");
      slide.style.removeProperty("visibility");
    });

    copies.forEach((copy, copyIndex) => {
      const selected = copyIndex === index;
      copy.classList.toggle("is-current", selected);
      copy.setAttribute("aria-hidden", String(!selected));
      copy.style.removeProperty("transform");
      copy.style.removeProperty("opacity");
      copy.style.removeProperty("visibility");
    });

    currentIndex = index;
    syncControls(index);
    syncMedia(index);
  }

  async function goTo(index, requestedDirection) {
    if (isAnimating || index === currentIndex || index < 0 || index >= slides.length) return;

    const previousIndex = currentIndex;
    const direction = requestedDirection ?? (index > previousIndex ? 1 : -1);
    const outgoing = slides[previousIndex];
    const incoming = slides[index];
    const outgoingMedia = outgoing.querySelector('[data-slideshow="parallax"]');
    const incomingMedia = incoming.querySelector('[data-slideshow="parallax"]');
    const outgoingCopy = copies[previousIndex];
    const incomingCopy = copies[index];

    if (reducedMotion() || !Element.prototype.animate) {
      setCurrent(index);
      return;
    }

    isAnimating = true;
    incoming.classList.add("is-current");
    incomingCopy?.classList.add("is-current");
    incomingCopy?.setAttribute("aria-hidden", "false");
    incoming.style.zIndex = "2";
    outgoing.style.zIndex = "1";

    const options = {
      duration: 900,
      easing: "cubic-bezier(0.77, 0, 0.18, 1)",
      fill: "both",
    };

    const animations = [
      outgoing.animate(
        [
          { transform: "translateX(0%)", opacity: 1 },
          { transform: `translateX(${-direction * 100}%)`, opacity: 1 },
        ],
        options,
      ),
      incoming.animate(
        [
          { transform: `translateX(${direction * 100}%)`, opacity: 1 },
          { transform: "translateX(0%)", opacity: 1 },
        ],
        options,
      ),
      outgoingMedia?.animate(
        [{ transform: "translateX(0%) scale(1.02)" }, { transform: `translateX(${direction * 35}%) scale(1.08)` }],
        options,
      ),
      incomingMedia?.animate(
        [{ transform: `translateX(${-direction * 35}%) scale(1.08)` }, { transform: "translateX(0%) scale(1.02)" }],
        options,
      ),
      outgoingCopy?.animate(
        [
          { transform: "translateX(0)", opacity: 1 },
          { transform: `translateX(${-direction * 1.5}rem)`, opacity: 0 },
        ],
        options,
      ),
      incomingCopy?.animate(
        [
          { transform: `translateX(${direction * 1.5}rem)`, opacity: 0 },
          { transform: "translateX(0)", opacity: 1 },
        ],
        options,
      ),
    ].filter(Boolean);

    syncControls(index);

    await Promise.allSettled(animations.map((animation) => animation.finished));
    animations.forEach((animation) => animation.cancel());
    setCurrent(index);
    isAnimating = false;
  }

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion() || document.hidden) return;

    const advance = async () => {
      await goTo((currentIndex + 1) % slides.length, 1);
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
          return advance();
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

  async function navigateTo(index, direction) {
    stopAutoplay();
    await goTo(index, direction);
    startAutoplay();
  }

  previousButton?.addEventListener("click", () => {
    navigateTo((currentIndex - 1 + slides.length) % slides.length, -1);
  });

  nextButton?.addEventListener("click", () => {
    navigateTo((currentIndex + 1) % slides.length, 1);
  });

  root.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
  });

  root.addEventListener("pointerup", (event) => {
    if (pointerStartX === undefined) return;
    const distance = event.clientX - pointerStartX;
    pointerStartX = undefined;
    if (Math.abs(distance) < 48) return;

    const direction = distance < 0 ? 1 : -1;
    const target = Math.min(Math.max(currentIndex + direction, 0), slides.length - 1);
    if (target !== currentIndex) navigateTo(target, direction);
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const target = Math.min(Math.max(currentIndex + direction, 0), slides.length - 1);
    if (target === currentIndex) return;
    event.preventDefault();
    navigateTo(target, direction);
  });

  document.addEventListener("visibilitychange", startAutoplay);
  window.matchMedia(MOTION_QUERY).addEventListener("change", startAutoplay);

  setCurrent(currentIndex);
  startAutoplay();
}
