const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function initProjectCta(root) {
  const image = root.querySelector(".project-cta__image");
  if (!image || window.matchMedia(REDUCED_MOTION_QUERY).matches || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.fromTo(
    image,
    { yPercent: -5 },
    {
      yPercent: 5,
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
