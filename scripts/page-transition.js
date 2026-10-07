import { getBlogPost } from "./blog-data.js";

const STORAGE_KEY = "siemet:page-transition";
const TRANSITION_DURATION = 850;
const ENTER_DELAY = 280;

const pageNames = new Map([
  ["/", "Inicio"],
  ["/nosotros/", "Nosotros"],
  ["/soluciones/", "Soluciones"],
  ["/soluciones/proteccion-contra-descargas-atmosfericas/", "Protección contra Descargas Atmosféricas"],
  ["/soluciones/postes-metalicos/", "Postes Metálicos"],
  ["/soluciones/torres-ventadas/", "Torres Ventadas"],
  ["/soluciones/torres-auto-soportadas/", "Torres Auto Soportadas"],
  ["/soluciones/ingenieria-y-diseno/", "Ingeniería y Diseño"],
  ["/productos/", "Productos"],
  ["/recursos/", "Recursos"],
  ["/proyectos/", "Proyectos"],
  ["/proyectos/torres-ventadas-y-autosoportadas/", "Torres Ventadas y Autosoportadas"],
  ["/proyectos/torre-movil/", "Torre Móvil"],
  ["/proyectos/torres-ventadas-120-metros/", "Torres Ventadas de 120 Metros"],
  ["/proyectos/proteccion-contra-rayos-operacion-minera/", "Protección contra Rayos para Operación Minera"],
  ["/proyectos/postes-metalicos-sistemas-pararrayos/", "Postes Metálicos para Sistemas de Pararrayos"],
  ["/proyectos/postes-poligonales-sistemas-proteccion/", "Postes Poligonales para Sistemas de Protección"],
  ["/blog/", "Blog"],
  ["/contacto/", "Contacto"],
]);

const normalizePath = (pathname) => {
  if (pathname.endsWith("/index.html")) {
    return pathname.slice(0, -"index.html".length);
  }

  return pathname.endsWith("/") ? pathname : `${pathname}/`;
};

const titleCase = (value) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

const getPageName = (link, url) => {
  const explicitName = link.dataset.transitionTitle?.trim();
  if (explicitName) return explicitName;

  const pathname = normalizePath(url.pathname);
  if (pathname === "/blog/post/") {
    return getBlogPost(url.searchParams.get("slug")).title;
  }

  const knownName = pageNames.get(pathname);
  if (knownName) return knownName;

  const segments = pathname.split("/").filter(Boolean);
  return titleCase(segments.at(-1) || "Inicio");
};

const canTransition = (event, link, url) => {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.hasAttribute("download") || link.dataset.noPageTransition !== undefined) return false;
  if (link.target && link.target !== "_self") return false;
  if (url.origin !== window.location.origin) return false;
  if (!["http:", "https:"].includes(url.protocol)) return false;

  const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search;
  if (sameDocument && url.hash) return false;

  return url.href !== window.location.href;
};

const createTransition = () => {
  const transition = document.createElement("div");
  transition.className = "page-transition";
  transition.dataset.pageTransition = "";
  transition.setAttribute("aria-hidden", "true");
  transition.innerHTML = `
    <div class="page-transition__panel">
      <p class="page-transition__title" data-page-transition-title></p>
    </div>
  `;
  document.body.append(transition);
  return transition;
};

const writeTransitionState = (title) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ title, createdAt: Date.now() }));
  } catch {
    // The animation still works when storage is unavailable; only the arrival title is omitted.
  }
};

const readTransitionState = () => {
  try {
    const value = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    sessionStorage.removeItem(STORAGE_KEY);

    if (!value || Date.now() - value.createdAt > 15000) return undefined;
    return value;
  } catch {
    return undefined;
  }
};

const animateArrival = (transition, titleElement, title) => {
  transition.style.transform = "translate3d(0, 0, 0)";
  transition.style.pointerEvents = "auto";
  titleElement.textContent = title;
  titleElement.style.opacity = "1";

  const panelAnimation = transition.animate(
    [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(0, -100%, 0)" },
    ],
    {
      duration: TRANSITION_DURATION,
      delay: ENTER_DELAY,
      easing: "cubic-bezier(0.625, 0.05, 0, 1)",
      fill: "forwards",
    },
  );

  titleElement.animate(
    [
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
      { opacity: 0, transform: "translate3d(0, -1.5rem, 0)" },
    ],
    {
      duration: 450,
      delay: ENTER_DELAY,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    },
  );

  document.querySelectorAll("main").forEach((element) => {
    element.animate(
      [
        { transform: "translate3d(0, 18dvh, 0)" },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: TRANSITION_DURATION,
        delay: ENTER_DELAY,
        easing: "cubic-bezier(0.625, 0.05, 0, 1)",
      },
    );
  });

  panelAnimation.finished
    .then(() => {
      transition.style.pointerEvents = "none";
    })
    .catch(() => {});
};

const animateDeparture = async (transition, titleElement, title) => {
  transition.style.pointerEvents = "auto";
  titleElement.textContent = title;

  const panelAnimation = transition.animate(
    [
      { transform: "translate3d(0, 100%, 0)" },
      { transform: "translate3d(0, 0, 0)" },
    ],
    {
      duration: TRANSITION_DURATION,
      easing: "cubic-bezier(0.625, 0.05, 0, 1)",
      fill: "forwards",
    },
  );

  titleElement.animate(
    [
      { opacity: 0, transform: "translate3d(0, 1.5rem, 0)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
    ],
    {
      duration: 520,
      delay: 280,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "forwards",
    },
  );

  document.querySelectorAll("main").forEach((element) => {
    element.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(0, -12dvh, 0)" },
      ],
      {
        duration: TRANSITION_DURATION,
        easing: "cubic-bezier(0.625, 0.05, 0, 1)",
        fill: "forwards",
      },
    );
  });

  await panelAnimation.finished;
};

export function initPageTransition() {
  if (typeof Element.prototype.animate !== "function") {
    document.documentElement.classList.remove("is-page-transition-arrival");
    delete document.documentElement.dataset.pageTransitionTitle;
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const transition = createTransition();
  const titleElement = transition.querySelector("[data-page-transition-title]");
  const arrivalState = readTransitionState();
  let isTransitioning = false;

  if (!reducedMotion.matches && arrivalState?.title) {
    animateArrival(transition, titleElement, arrivalState.title);
  }
  document.documentElement.classList.remove("is-page-transition-arrival");
  delete document.documentElement.dataset.pageTransitionTitle;

  document.addEventListener("click", async (event) => {
    const link = event.target.closest("a[href]");
    if (!link || isTransitioning || reducedMotion.matches) return;

    const url = new URL(link.href, window.location.href);
    if (!canTransition(event, link, url)) return;

    event.preventDefault();
    isTransitioning = true;

    const title = getPageName(link, url);
    writeTransitionState(title);

    try {
      await animateDeparture(transition, titleElement, title);
    } finally {
      window.location.assign(url.href);
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;

    isTransitioning = false;
    transition.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    document.querySelectorAll("main").forEach((element) => {
      element.getAnimations().forEach((animation) => animation.cancel());
    });
    transition.removeAttribute("style");
    titleElement.removeAttribute("style");
    titleElement.textContent = "";
  });
}
