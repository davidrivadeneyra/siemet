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
