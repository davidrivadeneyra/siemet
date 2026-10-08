const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COUNTER_DURATION = 2000;

function setCounterValue(counter, value) {
  const output = counter.querySelector("[data-counter-value]");
  if (output) output.textContent = String(value);
}

function animateCounter(counter) {
  const target = Number.parseInt(counter.dataset.counterTarget, 10);
  if (!Number.isFinite(target)) return;

  const startedAt = performance.now();

  function render(now) {
    const elapsed = Math.min((now - startedAt) / COUNTER_DURATION, 1);
    const eased = 1 - Math.pow(1 - elapsed, 4);
    setCounterValue(counter, Math.round(target * eased));

    if (elapsed < 1) window.requestAnimationFrame(render);
  }

  window.requestAnimationFrame(render);
}

function initMarqueeDirection(track) {
  let lastScrollY = window.scrollY;
  let scrollFrame;
  let currentDirection = "down";

  const setDirection = (direction) => {
    if (direction === currentDirection) return;

    const animation = track
      .getAnimations()
      .find((candidate) => candidate.animationName === "trajectory-marquee");
    if (!animation) return;

    const playbackRate = direction === "up" ? -1 : 1;
    const duration = Number(animation.effect?.getTiming().duration);

    if (playbackRate < 0 && Number.isFinite(duration)) {
      const currentTime = Number(animation.currentTime) || 0;
      animation.currentTime = currentTime + duration * 10000;
    }

    animation.playbackRate = playbackRate;
    currentDirection = direction;
  };

  const syncDirection = () => {
    scrollFrame = undefined;
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (scrollDelta === 0) return;
    setDirection(scrollDelta < 0 ? "up" : "down");
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(syncDirection);
    },
    { passive: true },
  );
}

export function initTrajectory(root) {
  const track = root.querySelector("[data-trajectory-track]");
  const group = root.querySelector("[data-trajectory-group]");
  if (!track || !group) return;

  const duplicate = group.cloneNode(true);
  duplicate.removeAttribute("data-trajectory-group");
  duplicate.setAttribute("aria-hidden", "true");
  track.append(duplicate);

  const counters = [...root.querySelectorAll("[data-counter]")];
  const reducedMotion = window.matchMedia(MOTION_QUERY).matches;

  if (!reducedMotion) initMarqueeDirection(track);

  if (reducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((counter) => setCounterValue(counter, counter.dataset.counterTarget));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      counters.forEach(animateCounter);
      observer.disconnect();
    },
    { threshold: 0.25 },
  );

  observer.observe(root);
}
