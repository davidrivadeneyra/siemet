import { scrambleText } from "./scramble-text.js";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MODAL_EXIT_DURATION = 320;

export function initProducts(root) {
  const categoryTabs = [...root.querySelectorAll("[data-products-category]")];
  const panels = [...root.querySelectorAll("[data-products-panel]")];
  const heading = root.querySelector("[data-products-heading]");
  const description = root.querySelector("[data-products-description]");
  const filters = root.querySelector("[data-products-filters]");
  const filterButtons = [...root.querySelectorAll("[data-products-filter]")];
  const steelCards = [...root.querySelectorAll('[data-products-panel="steel"] [data-product-group]')];
  const productCards = [...root.querySelectorAll(".product-card")];
  const modal = document.querySelector("[data-product-modal]");

  let currentFilter = filterButtons.find((button) => button.classList.contains("is-current"))?.dataset.productsFilter ?? "postes";

  const selectFilter = (filter) => {
    currentFilter = filter;
    filterButtons.forEach((button) => {
      const isCurrent = button.dataset.productsFilter === filter;
      button.classList.toggle("is-current", isCurrent);
      button.setAttribute("aria-pressed", String(isCurrent));
    });
    steelCards.forEach((card) => {
      card.hidden = card.dataset.productGroup !== filter;
    });
  };

  const selectCategory = (category) => {
    const selectedTab = categoryTabs.find((tab) => tab.dataset.productsCategory === category);

    categoryTabs.forEach((tab) => {
      const isCurrent = tab.dataset.productsCategory === category;
      tab.classList.toggle("is-current", isCurrent);
      tab.setAttribute("aria-selected", String(isCurrent));
      tab.tabIndex = isCurrent ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.productsPanel !== category;
    });
    if (heading && selectedTab?.dataset.productsTitle) heading.textContent = selectedTab.dataset.productsTitle;
    if (description && selectedTab?.dataset.productsDescriptionCopy) {
      description.textContent = selectedTab.dataset.productsDescriptionCopy;
    }
    if (filters) filters.hidden = category !== "steel";
    if (category === "steel") selectFilter(currentFilter);
  };

  categoryTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectCategory(tab.dataset.productsCategory));
    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextTab = categoryTabs[(index + direction + categoryTabs.length) % categoryTabs.length];
      selectCategory(nextTab.dataset.productsCategory);
      nextTab.focus();
    });
  });
  filterButtons.forEach((button) => button.addEventListener("click", () => selectFilter(button.dataset.productsFilter)));

  selectCategory(categoryTabs.find((tab) => tab.classList.contains("is-current"))?.dataset.productsCategory ?? "steel");

  if (!modal || !productCards.length) return;

  const modalImage = modal.querySelector("[data-product-modal-image]");
  const modalFamily = modal.querySelector("[data-product-modal-family]");
  const modalTitle = modal.querySelector("[data-product-modal-title]");
  const modalDescription = modal.querySelector("[data-product-modal-description]");
  const modalMain = modal.querySelector(".product-modal__main");
  const modalCurrent = modal.querySelector("[data-product-modal-current]");
  const modalTotal = modal.querySelector("[data-product-modal-total]");
  const closeButton = modal.querySelector("[data-product-modal-close]");
  const previousButton = modal.querySelector("[data-product-modal-previous]");
  const nextButton = modal.querySelector("[data-product-modal-next]");
  const products = productCards.map((card) => {
    const panel = card.closest("[data-products-panel]");
    const image = card.querySelector(".product-card__image");

    return {
      family: panel?.dataset.productsPanel === "atmospheric" ? "Protección atmosférica" : "Acero estructural",
      imageAlt: image?.alt ?? "",
      imageSrc: image?.getAttribute("src") ?? "",
      title: card.querySelector(".product-card__copy .heading")?.textContent.trim() ?? "",
      description: card.querySelector(".product-card__copy .text-body")?.textContent.trim() ?? "",
    };
  });
  const totalLabel = String(products.length).padStart(2, "0");
  let currentProductIndex = 0;
  let lastTrigger;
  let isChangingProduct = false;
  let closeTimer;

  const renderProduct = (index) => {
    currentProductIndex = (index + products.length) % products.length;
    const product = products[currentProductIndex];

    if (modalImage) {
      modalImage.src = product.imageSrc;
      modalImage.alt = product.imageAlt;
    }
    if (modalFamily) modalFamily.textContent = product.family;
    if (modalTitle) modalTitle.textContent = product.title;
    if (modalDescription) modalDescription.textContent = product.description;
    if (modalCurrent) modalCurrent.textContent = String(currentProductIndex + 1).padStart(2, "0");
    if (modalTotal) modalTotal.textContent = totalLabel;
    modal.scrollTop = 0;
  };

  const openModal = (index, trigger) => {
    lastTrigger = trigger;
    renderProduct(index);
    document.documentElement.classList.add("has-product-modal");
    modal.classList.remove("is-closing");
    modal.classList.add("is-opening");
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  };

  const finishClosingModal = () => {
    window.clearTimeout(closeTimer);
    modal.classList.remove("is-opening", "is-closing");
    if (typeof modal.close === "function") modal.close();
    else {
      modal.removeAttribute("open");
      document.documentElement.classList.remove("has-product-modal");
      lastTrigger?.focus({ preventScroll: true });
    }
  };

  const closeModal = () => {
    if (!modal.open || modal.classList.contains("is-closing")) return;
    modal.classList.remove("is-opening");

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      finishClosingModal();
      return;
    }

    modal.classList.add("is-closing");
    closeTimer = window.setTimeout(finishClosingModal, MODAL_EXIT_DURATION + 80);
  };

  const animateProductChange = async (index, direction) => {
    if (isChangingProduct) return;

    const animationTargets = [modalImage, modalMain].filter(Boolean);
    if (
      window.matchMedia(REDUCED_MOTION_QUERY).matches ||
      !animationTargets.length ||
      animationTargets.some((target) => typeof target.animate !== "function")
    ) {
      renderProduct(index);
      return;
    }

    isChangingProduct = true;
    const exitOffset = direction > 0 ? "-1.5rem" : "1.5rem";
    const enterOffset = direction > 0 ? "1.5rem" : "-1.5rem";
    const exitAnimations = animationTargets.map((target) =>
      target.animate(
        [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: `translateX(${exitOffset})` },
        ],
        { duration: 180, easing: "ease-in", fill: "forwards" },
      ),
    );

    await Promise.all(exitAnimations.map((animation) => animation.finished.catch(() => undefined)));
    renderProduct(index);

    const enterAnimations = animationTargets.map((target) =>
      target.animate(
        [
          { opacity: 0, transform: `translateX(${enterOffset})` },
          { opacity: 1, transform: "translateX(0)" },
        ],
        { duration: 240, easing: "ease-out", fill: "forwards" },
      ),
    );

    await Promise.all(enterAnimations.map((animation) => animation.finished.catch(() => undefined)));
    [...exitAnimations, ...enterAnimations].forEach((animation) => animation.cancel());
    isChangingProduct = false;
  };

  productCards.forEach((card, index) => {
    const trigger = card.querySelector(".product-card__link");
    if (!trigger) return;
    card.classList.add("is-clickable");
    trigger.dataset.noScramble = "";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", modal.id);
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(index, trigger);
    });
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openModal(index, trigger);
    });
    if (window.matchMedia(HOVER_QUERY).matches) {
      card.addEventListener("pointerenter", () => scrambleText(trigger));
      card.addEventListener("pointerleave", () => scrambleText(trigger));
    }
    trigger.addEventListener("focus", () => scrambleText(trigger));
  });

  closeButton?.addEventListener("click", closeModal);
  previousButton?.addEventListener("click", () => animateProductChange(currentProductIndex - 1, -1));
  nextButton?.addEventListener("click", () => animateProductChange(currentProductIndex + 1, 1));

  modal.addEventListener("animationend", (event) => {
    if (event.animationName === "product-modal-enter") modal.classList.remove("is-opening");
    if (event.animationName === "product-modal-exit") finishClosingModal();
  });

  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });

  modal.addEventListener("click", (event) => {
    if (event.target !== modal) return;
    const bounds = modal.getBoundingClientRect();
    const isOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (isOutside) closeModal();
  });

  modal.addEventListener("close", () => {
    document.documentElement.classList.remove("has-product-modal");
    lastTrigger?.focus({ preventScroll: true });
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      animateProductChange(currentProductIndex - 1, -1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      animateProductChange(currentProductIndex + 1, 1);
    }
  });
}
