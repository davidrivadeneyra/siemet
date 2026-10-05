export function initSmoothScroll() {
  if (typeof window.Lenis !== "function" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return undefined;
  }

  const lenis = new window.Lenis({
    autoRaf: true,
  });

  if (window.ScrollTrigger?.update) {
    lenis.on("scroll", window.ScrollTrigger.update);
  }

  return lenis;
}
