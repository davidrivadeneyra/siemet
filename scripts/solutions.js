import { scrambleText } from "./scramble-text.js";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

export function initSolutionCard(card) {
  const link = card.querySelector(".solution-card__link");
  if (!link) return;

  card.classList.add("is-clickable");
  link.dataset.noScramble = "";

  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    link.click();
  });

  if (window.matchMedia(HOVER_QUERY).matches) {
    card.addEventListener("pointerenter", () => scrambleText(link));
    card.addEventListener("pointerleave", () => scrambleText(link));
  }

  link.addEventListener("focus", () => scrambleText(link));
}
