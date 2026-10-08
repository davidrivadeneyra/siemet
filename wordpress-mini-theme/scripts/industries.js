const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const AUTOPLAY_DELAY = 10000;
const SLIDE_OPTIONS = {
  duration: 900,
  easing: "cubic-bezier(0.77, 0, 0.18, 1)",
  fill: "both",
};

export function initIndustries(root) {
  const tabs = [...root.querySelectorAll("[data-industry-tab]")];
  const slides = [...root.querySelectorAll("[data-industry-slide]")];

  if (tabs.length < 2 || tabs.length !== slides.length) return;

  let currentIndex = Math.max(0, tabs.findIndex((tab) => tab.classList.contains("is-current")));
  let isAnimating = false;
  let isVisible = false;
  let autoplayId;
  let timerAnimation;

  const reducedMotion = () => window.matchMedia(MOTION_QUERY).matches;

  function resetProgress() {
    tabs.forEach((tab) => {
      const progress = tab.querySelector("[data-industry-progress]");
      if (!progress) return;
      progress.style.removeProperty("transition");
      progress.style.transform = "scaleX(0)";
    });
  }

  function stopAutoplay() {
    window.clearTimeout(autoplayId);
    timerAnimation?.cancel();
    timerAnimation = undefined;
    resetProgress();
  }

  function setCurrent(index) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.classList.toggle("is-current", selected);
      tab.setAttribute("aria-pressed", String(selected));
    });

    slides.forEach((slide, slideIndex) => {
      const selected = slideIndex === index;
      slide.classList.toggle("is-current", selected);
      slide.setAttribute("aria-hidden", String(!selected));
      slide.style.removeProperty("transform");
      slide.style.removeProperty("opacity");
      slide.style.removeProperty("visibility");
      slide.style.removeProperty("z-index");
    });

    currentIndex = index;
  }

  async function goTo(index, requestedDirection) {
    if (isAnimating || index === currentIndex || index < 0 || index >= slides.length) return;

    const previousIndex = currentIndex;
    const direction = requestedDirection ?? (index > previousIndex ? 1 : -1);
    const outgoing = slides[previousIndex];
    const incoming = slides[index];
    const outgoingMedia = outgoing.querySelector("[data-industry-parallax]");
    const incomingMedia = incoming.querySelector("[data-industry-parallax]");

    if (reducedMotion() || !Element.prototype.animate) {
      setCurrent(index);
      return;
    }

    isAnimating = true;
    incoming.classList.add("is-current");
    incoming.setAttribute("aria-hidden", "false");
    incoming.style.zIndex = "2";
    outgoing.style.zIndex = "1";

    const animations = [
      outgoing.animate(
        [
          { transform: "translateX(0%)", opacity: 1 },
          { transform: `translateX(${-direction * 100}%)`, opacity: 1 },
        ],
        SLIDE_OPTIONS,
      ),
      incoming.animate(
        [
          { transform: `translateX(${direction * 100}%)`, opacity: 1 },
          { transform: "translateX(0%)", opacity: 1 },
        ],
        SLIDE_OPTIONS,
      ),
      outgoingMedia?.animate(
        [{ transform: "translateX(0%) scale(1.02)" }, { transform: `translateX(${direction * 35}%) scale(1.08)` }],
        SLIDE_OPTIONS,
      ),
      incomingMedia?.animate(
        [{ transform: `translateX(${-direction * 35}%) scale(1.08)` }, { transform: "translateX(0%) scale(1.02)" }],
        SLIDE_OPTIONS,
      ),
    ].filter(Boolean);

    await Promise.allSettled(animations.map((animation) => animation.finished));
    animations.forEach((animation) => animation.cancel());
    setCurrent(index);
    isAnimating = false;
  }

  function startAutoplay() {
    stopAutoplay();
    if (!isVisible || reducedMotion() || document.hidden) return;

    const advance = async () => {
      await goTo((currentIndex + 1) % slides.length, 1);
      startAutoplay();
    };
    const progress = tabs[currentIndex]?.querySelector("[data-industry-progress]");

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
    if (isAnimating) return;
    stopAutoplay();
    await goTo(index, direction);
    startAutoplay();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      navigateTo(index, index >= currentIndex ? 1 : -1);
    });

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
      const target = (index + direction + tabs.length) % tabs.length;
      tabs[target].focus();
      navigateTo(target, direction);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startAutoplay();
        else stopAutoplay();
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
  } else {
    isVisible = true;
  }

  document.addEventListener("visibilitychange", startAutoplay);
  window.matchMedia(MOTION_QUERY).addEventListener("change", startAutoplay);

  setCurrent(currentIndex);
  startAutoplay();
}
