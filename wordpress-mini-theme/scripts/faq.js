const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const ANIMATION_OPTIONS = {
  duration: 900,
  easing: "cubic-bezier(0.77, 0, 0.18, 1)",
};

export function initFaq(root) {
  const items = [...root.querySelectorAll("[data-faq-item]")];
  const parallaxImage = root.querySelector("[data-faq-parallax]");
  const reducedMotion = window.matchMedia(MOTION_QUERY).matches;
  const animatingItems = new WeakSet();

  async function setOpen(item, opening) {
    if (animatingItems.has(item) || item.open === opening) return;

    const summary = item.querySelector("summary");
    if (!summary || reducedMotion || !Element.prototype.animate) {
      item.open = opening;
      return;
    }

    animatingItems.add(item);
    const startHeight = item.offsetHeight;

    if (opening) item.open = true;
    item.classList.toggle("is-closing", !opening);

    const endHeight = opening ? item.scrollHeight : summary.offsetHeight + 2;
    item.style.height = `${startHeight}px`;

    const animation = item.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { ...ANIMATION_OPTIONS, fill: "both" },
    );

    await animation.finished.catch(() => {});
    animation.cancel();
    if (!opening) item.open = false;
    item.classList.remove("is-closing");
    item.style.removeProperty("height");
    animatingItems.delete(item);
  }

  items.forEach((item) => {
    item.querySelector("summary")?.addEventListener("click", (event) => {
      event.preventDefault();
      const opening = !item.open;

      if (opening) {
        items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.open) setOpen(otherItem, false);
        });
      }

      setOpen(item, opening);
    });
  });

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!parallaxImage || !gsap || !ScrollTrigger || reducedMotion) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo(
    parallaxImage,
    { yPercent: -8 },
    {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}
