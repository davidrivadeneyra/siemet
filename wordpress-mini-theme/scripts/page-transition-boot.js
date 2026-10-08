try {
  const state = JSON.parse(sessionStorage.getItem("siemet:page-transition"));
  const isRecentTransition = state && Date.now() - state.createdAt < 15000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isRecentTransition && !reducedMotion) {
    document.documentElement.classList.add("is-page-transition-arrival");
    document.documentElement.dataset.pageTransitionTitle = state.title || "";
    window.setTimeout(() => {
      document.documentElement.classList.remove("is-page-transition-arrival");
      delete document.documentElement.dataset.pageTransitionTitle;
    }, 4000);
  }
} catch {
  // Keep regular document navigation when storage is unavailable.
}
