const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const STEP_DELAY = 10000;
const TRANSITION_DURATION = 900;
const TRANSITION_EASING = "cubic-bezier(0.77, 0, 0.18, 1)";

export function initProcess(root) {
  const steps = [...root.querySelectorAll("[data-process-step]")];
  if (steps.length < 2) return;

  let currentIndex = Math.max(0, steps.findIndex((step) => step.open));
  let timerId;
  let timerAnimation;
  let isVisible = false;
  let isAnimating = false;

  const motionPreference = window.matchMedia(MOTION_QUERY);
  const rootStyles = getComputedStyle(document.documentElement);
  const white = rootStyles.getPropertyValue("--color-white").trim();
  const blue800 = rootStyles.getPropertyValue("--color-blue-800").trim();
  const blue600 = rootStyles.getPropertyValue("--color-blue-600").trim();

  function stopTimer() {
    window.clearTimeout(timerId);
    timerAnimation?.cancel();
    timerAnimation = undefined;

    steps.forEach((step) => {
      const progress = step.querySelector("[data-process-progress]");
      if (!progress) return;
      progress.style.removeProperty("transition");
      progress.style.transform = "scaleX(0)";
    });
  }

  function startTimer() {
    stopTimer();
    if (!isVisible || document.hidden || motionPreference.matches || isAnimating || currentIndex < 0) return;

    const activeStep = steps[currentIndex];
    const progress = activeStep.querySelector("[data-process-progress]");
    const advance = () => activate((currentIndex + 1) % steps.length);

    if (progress?.animate) {
      timerAnimation = progress.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
        duration: STEP_DELAY,
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
      progress.style.transition = `transform ${STEP_DELAY}ms linear`;
      window.requestAnimationFrame(() => {
        progress.style.transform = "scaleX(1)";
      });
    }

    timerId = window.setTimeout(advance, STEP_DELAY);
  }

  async function activate(index, instant = false) {
    if (isAnimating) return;

    stopTimer();
    const nextIndex = (index + steps.length) % steps.length;

    if (nextIndex === currentIndex || instant || motionPreference.matches || !Element.prototype.animate) {
      currentIndex = nextIndex;
      steps.forEach((step, stepIndex) => {
        step.open = stepIndex === currentIndex;
      });
      startTimer();
      return;
    }

    isAnimating = true;
    const incoming = steps[nextIndex];
    const closedHeight = incoming.getBoundingClientRect().height;

    incoming.open = true;
    const incomingHeight = incoming.getBoundingClientRect().height;
    incoming.style.height = `${closedHeight}px`;
    incoming.style.overflow = "hidden";

    const incomingBody = incoming.querySelector(".process-step__body");
    const incomingTitle = incoming.querySelector(".heading");
    const incomingNumber = incoming.querySelector(".text-mono-medium");
    const incomingToggle = incoming.querySelector(".process-step__toggle");
    const options = {
      duration: TRANSITION_DURATION,
      easing: TRANSITION_EASING,
      fill: "both",
    };

    if (currentIndex < 0) {
      const animations = [
        incoming.animate(
          [
            { height: `${closedHeight}px`, backgroundColor: white },
            { height: `${incomingHeight}px`, backgroundColor: blue800 },
          ],
          options,
        ),
        incomingBody?.animate(
          [
            { opacity: 0, transform: "translateY(1rem)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          options,
        ),
        incomingTitle?.animate([{ color: blue800 }, { color: white }], options),
        incomingNumber?.animate([{ color: blue800 }, { color: white }], options),
        incomingToggle?.animate(
          [
            { color: blue600 },
            { color: white },
          ],
          options,
        ),
      ].filter(Boolean);

      await Promise.allSettled(animations.map((animation) => animation.finished));
      animations.forEach((animation) => animation.cancel());
      incoming.style.removeProperty("height");
      incoming.style.removeProperty("overflow");
      currentIndex = nextIndex;
      isAnimating = false;
      startTimer();
      return;
    }

    const outgoing = steps[currentIndex];
    const outgoingHeight = outgoing.getBoundingClientRect().height;
    outgoing.style.height = `${outgoingHeight}px`;
    outgoing.style.overflow = "hidden";

    const outgoingBody = outgoing.querySelector(".process-step__body");
    const outgoingTitle = outgoing.querySelector(".heading");
    const outgoingNumber = outgoing.querySelector(".text-mono-medium");
    const outgoingToggle = outgoing.querySelector(".process-step__toggle");

    const animations = [
      outgoing.animate(
        [
          { height: `${outgoingHeight}px`, backgroundColor: blue800 },
          { height: `${closedHeight}px`, backgroundColor: white },
        ],
        options,
      ),
      incoming.animate(
        [
          { height: `${closedHeight}px`, backgroundColor: white },
          { height: `${incomingHeight}px`, backgroundColor: blue800 },
        ],
        options,
      ),
      outgoingBody?.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-1rem)" },
        ],
        options,
      ),
      incomingBody?.animate(
        [
          { opacity: 0, transform: "translateY(1rem)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        options,
      ),
      outgoingTitle?.animate([{ color: white }, { color: blue800 }], options),
      incomingTitle?.animate([{ color: blue800 }, { color: white }], options),
      outgoingNumber?.animate([{ color: white }, { color: blue800 }], options),
      incomingNumber?.animate([{ color: blue800 }, { color: white }], options),
      outgoingToggle?.animate(
        [
          { color: white },
          { color: blue600 },
        ],
        options,
      ),
      incomingToggle?.animate(
        [
          { color: blue600 },
          { color: white },
        ],
        options,
      ),
    ].filter(Boolean);

    await Promise.allSettled(animations.map((animation) => animation.finished));
    animations.forEach((animation) => animation.cancel());

    outgoing.open = false;
    incoming.open = true;
    [outgoing, incoming].forEach((step) => {
      step.style.removeProperty("height");
      step.style.removeProperty("overflow");
    });

    currentIndex = nextIndex;
    isAnimating = false;
    startTimer();
  }

  async function closeStep(index) {
    if (isAnimating) return;

    const step = steps[index];
    if (!step?.open) return;

    stopTimer();

    if (motionPreference.matches || !Element.prototype.animate) {
      step.open = false;
      currentIndex = -1;
      return;
    }

    isAnimating = true;
    const expandedHeight = step.getBoundingClientRect().height;
    step.open = false;
    const closedHeight = step.getBoundingClientRect().height;
    step.open = true;
    step.style.height = `${expandedHeight}px`;
    step.style.overflow = "hidden";

    const body = step.querySelector(".process-step__body");
    const title = step.querySelector(".heading");
    const number = step.querySelector(".text-mono-medium");
    const toggle = step.querySelector(".process-step__toggle");
    const options = {
      duration: TRANSITION_DURATION,
      easing: TRANSITION_EASING,
      fill: "both",
    };
    const animations = [
      step.animate(
        [
          { height: `${expandedHeight}px`, backgroundColor: blue800 },
          { height: `${closedHeight}px`, backgroundColor: white },
        ],
        options,
      ),
      body?.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-1rem)" },
        ],
        options,
      ),
      title?.animate([{ color: white }, { color: blue800 }], options),
      number?.animate([{ color: white }, { color: blue800 }], options),
      toggle?.animate(
        [
          { color: white },
          { color: blue600 },
        ],
        options,
      ),
    ].filter(Boolean);

    await Promise.allSettled(animations.map((animation) => animation.finished));
    animations.forEach((animation) => animation.cancel());
    step.open = false;
    step.style.removeProperty("height");
    step.style.removeProperty("overflow");
    currentIndex = -1;
    isAnimating = false;
  }

  function setInitialStep(index) {
    currentIndex = (index + steps.length) % steps.length;
    steps.forEach((step, stepIndex) => {
      step.open = stepIndex === currentIndex;
    });
  }

  steps.forEach((step, index) => {
    step.querySelector("summary")?.addEventListener("click", (event) => {
      event.preventDefault();
      if (step.open) closeStep(index);
      else activate(index);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible) startTimer();
        else stopTimer();
      },
      { threshold: 0.25 },
    );

    observer.observe(root);
  } else {
    isVisible = true;
  }

  document.addEventListener("visibilitychange", startTimer);
  motionPreference.addEventListener("change", startTimer);

  setInitialStep(currentIndex);
  startTimer();
}
