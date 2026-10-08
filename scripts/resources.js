import { scrambleText } from "./scramble-text.js";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

export function initResources(root) {
  const categoryButtons = [...root.querySelectorAll("[data-resource-category]")];
  const topicButtons = [...root.querySelectorAll("[data-resource-topic]")];
  const cards = [...root.querySelectorAll("[data-resource-card]")];
  let category = "all";
  let topic = "all";

  cards.forEach((card) => {
    const currentIcon = card.querySelector(".resource-card__file svg");
    if (!currentIcon) return;

    const pdfIcon = document.createElement("img");
    pdfIcon.className = "resource-card__pdf-icon";
    pdfIcon.src = "/assets/icons/pdf-color.svg";
    pdfIcon.alt = "";
    pdfIcon.setAttribute("aria-hidden", "true");
    currentIcon.replaceWith(pdfIcon);
  });

  const updateCards = () => {
    cards.forEach((card) => {
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesTopic = topic === "all" || card.dataset.topic === topic;
      card.hidden = !matchesCategory || !matchesTopic;
    });
  };

  const select = (buttons, selected, dataKey) => {
    buttons.forEach((button) => {
      const isCurrent = button.dataset[dataKey] === selected;
      button.classList.toggle("is-current", isCurrent);
      button.setAttribute("aria-pressed", String(isCurrent));
    });
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.resourceCategory;
      select(categoryButtons, category, "resourceCategory");
      updateCards();
    });
  });

  topicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      topic = button.dataset.resourceTopic;
      select(topicButtons, topic, "resourceTopic");
      updateCards();
    });
  });

  if (window.matchMedia(HOVER_QUERY).matches) {
    cards.forEach((card) => {
      const label = card.querySelector(".resource-card__file-label");
      if (!label) return;
      card.addEventListener("pointerenter", () => scrambleText(label, "PRONTO"));
      card.addEventListener("pointerleave", () => scrambleText(label, "PDF"));
    });
  }
}
