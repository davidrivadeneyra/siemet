import { initClientWall } from "./clients.js";
import { renderSharedComponents } from "./components/shared-components.js";
import { initFaq } from "./faq.js";
import { initGallery } from "./gallery.js";
import { initHeroSlideshow } from "./hero-slideshow.js";
import { initIndustries } from "./industries.js";
import { initPageTransition } from "./page-transition.js";
import { initProcess } from "./process.js";
import { initProjectCta } from "./project-cta.js";
import { initProducts } from "./products.js";
import { initProjectCard } from "./projects.js";
import { initResources } from "./resources.js";
import { initScrambleTextHovers } from "./scramble-text.js";
import { initSolutionCard } from "./solutions.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { initTrajectory } from "./trajectory.js";

document.documentElement.classList.add("js");
renderSharedComponents();
initPageTransition();
const smoothScroll = initSmoothScroll();

document.querySelectorAll('[data-slideshow="wrap"]').forEach(initHeroSlideshow);
document.querySelectorAll("[data-client-wall]").forEach(initClientWall);
document.querySelectorAll("[data-faq]").forEach(initFaq);
document.querySelectorAll("[data-gallery]").forEach(initGallery);
document.querySelectorAll("[data-industries]").forEach(initIndustries);
document.querySelectorAll("[data-process]").forEach(initProcess);
document.querySelectorAll(".project-cta").forEach(initProjectCta);
document.querySelectorAll("[data-products]").forEach(initProducts);
document.querySelectorAll(".featured-project, .project-card").forEach(initProjectCard);
document.querySelectorAll("[data-resources]").forEach(initResources);
document.querySelectorAll(".solution-card").forEach(initSolutionCard);
document.querySelectorAll("[data-trajectory]").forEach(initTrajectory);
initScrambleTextHovers();

const siteHeader = document.querySelector(".site-header");
const headerThemeSections = [...document.querySelectorAll("[data-header-theme]")];

if (siteHeader && headerThemeSections.length) {
  let headerThemeFrame;

  const syncHeaderTheme = () => {
    headerThemeFrame = undefined;
    const probeY = siteHeader.getBoundingClientRect().height / 2;
    let activeSection;
    headerThemeSections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top <= probeY && bounds.bottom > probeY) activeSection = section;
    });

    siteHeader.classList.toggle("is-on-light", activeSection?.dataset.headerTheme === "light");
    siteHeader.classList.toggle("is-on-blue", activeSection?.dataset.headerSurface === "blue");
  };

  const requestHeaderThemeSync = () => {
    if (headerThemeFrame) return;
    headerThemeFrame = window.requestAnimationFrame(syncHeaderTheme);
  };

  syncHeaderTheme();
  window.addEventListener("scroll", requestHeaderThemeSync, { passive: true });
  window.addEventListener("resize", requestHeaderThemeSync);
}

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => link.closest("details")?.removeAttribute("open"));
});

document.querySelectorAll('a[href="#contacto"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const footer = document.querySelector("#contacto");
    if (!footer) return;

    event.preventDefault();
    link.closest("details")?.removeAttribute("open");

    if (smoothScroll?.scrollTo) {
      smoothScroll.scrollTo(footer);
      return;
    }

    footer.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  });
});
