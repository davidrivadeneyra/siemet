const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const DEFAULT_CHARACTERS = "XYZxy#&@0$€£";
const runningAnimations = new WeakMap();
const stableTexts = new WeakMap();
const lockedElements = new WeakMap();

function lockElementWidth(element, duration) {
  const currentLock = lockedElements.get(element);

  if (currentLock) {
    window.clearTimeout(currentLock.timeoutId);
    currentLock.timeoutId = window.setTimeout(currentLock.release, duration + 50);
    return;
  }

  const computedDisplay = window.getComputedStyle(element).display;
  const width = element.getBoundingClientRect().width;
  const originalStyles = {
    display: element.style.display,
    inlineSize: element.style.inlineSize,
    minInlineSize: element.style.minInlineSize,
    maxInlineSize: element.style.maxInlineSize,
  };

  if (computedDisplay === "inline") element.style.display = "inline-block";
  element.style.inlineSize = `${width}px`;
  element.style.minInlineSize = `${width}px`;
  element.style.maxInlineSize = `${width}px`;

  const lock = {
    timeoutId: undefined,
    release() {
      element.style.display = originalStyles.display;
      element.style.inlineSize = originalStyles.inlineSize;
      element.style.minInlineSize = originalStyles.minInlineSize;
      element.style.maxInlineSize = originalStyles.maxInlineSize;
      lockedElements.delete(element);
    },
  };

  lock.timeoutId = window.setTimeout(lock.release, duration + 50);
  lockedElements.set(element, lock);
}

function getTextNodes(element) {
  const nodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!node.textContent.trim() || parent?.closest('[aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function animateTextNode(node, finalText, options) {
  const previousAnimation = runningAnimations.get(node);
  if (previousAnimation) window.cancelAnimationFrame(previousAnimation);

  const { characters, duration, speed } = options;
  const leadingSpace = node.textContent.match(/^\s*/)?.[0] ?? "";
  const trailingSpace = node.textContent.match(/\s*$/)?.[0] ?? "";
  const animationDuration = duration / speed;
  const startedAt = performance.now();

  function render(now) {
    const progress = Math.min((now - startedAt) / animationDuration, 1);
    const revealedCharacters = Math.floor(finalText.length * progress);

    node.textContent = `${leadingSpace}${[...finalText]
      .map((character, index) => {
        if (/\s/.test(character) || index < revealedCharacters) return character;
        return characters[Math.floor(Math.random() * characters.length)];
      })
      .join("")}${trailingSpace}`;

    if (progress < 1) {
      runningAnimations.set(node, window.requestAnimationFrame(render));
      return;
    }

    node.textContent = `${leadingSpace}${finalText}${trailingSpace}`;
    runningAnimations.delete(node);
  }

  runningAnimations.set(node, window.requestAnimationFrame(render));
}

export function scrambleText(element, text, options = {}) {
  if (!element) return;

  const textNodes = getTextNodes(element);
  if (!textNodes.length) return;

  const settings = {
    characters: options.characters ?? DEFAULT_CHARACTERS,
    duration: options.duration ?? 600,
    speed: options.speed ?? 1.2,
  };
  const finalTexts = textNodes.map((node, index) => {
    if (text !== undefined && index === 0) {
      stableTexts.set(node, text);
      return text;
    }

    if (!stableTexts.has(node)) stableTexts.set(node, node.textContent.trim());
    return stableTexts.get(node);
  });

  if (window.matchMedia(MOTION_QUERY).matches) {
    textNodes.forEach((node, index) => {
      node.textContent = finalTexts[index] ?? node.textContent.trim();
    });
    return;
  }

  lockElementWidth(element, settings.duration / settings.speed);
  textNodes.forEach((node, index) => {
    animateTextNode(node, finalTexts[index] ?? node.textContent.trim(), settings);
  });
}

export function initScrambleTextHovers(selector = "a, button") {
  if (!window.matchMedia(HOVER_QUERY).matches) return;

  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest(selector);
    if (!target || target.closest("[data-no-scramble]") || target.contains(event.relatedTarget)) return;
    scrambleText(target);
  });

  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest(selector);
    if (!target || target.closest("[data-no-scramble]") || target.contains(event.relatedTarget)) return;
    scrambleText(target);
  });

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest(selector);
    if (target && !target.closest("[data-no-scramble]")) scrambleText(target);
  });
}
