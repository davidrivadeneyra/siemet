import { scrambleText } from "./scramble-text.js";

const LOOP_DELAY = 1.5;
const ANIMATION_DURATION = 0.9;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function shuffleArray(items) {
  const shuffled = items.slice();

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

export function initClientWall(root) {
  const cards = [...root.querySelectorAll("[data-client-card]")];
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (cards.length < 2 || !gsap) return;
  if (window.matchMedia(MOTION_QUERY).matches) return;

  let order = [];
  let orderIndex = 0;
  let isAnimating = false;
  let isInView = false;

  function resetOrder() {
    order = shuffleArray(cards.map((_, index) => index));
    orderIndex = 0;
  }

  function nextPair() {
    if (orderIndex + 1 >= order.length) resetOrder();
    const first = order[orderIndex];
    const second = order[orderIndex + 1];
    orderIndex += 2;
    return [first, second];
  }

  function cloneTarget(target) {
    const clone = target.cloneNode(true);
    clone.querySelector("img")?.setAttribute("loading", "lazy");
    return clone;
  }

  function swapTarget(card, sourceTarget) {
    const parent = card.querySelector("[data-client-target-parent]");
    const current = parent?.querySelector("[data-client-target]");
    const label = card.querySelector("[data-client-label]");

    if (!parent || !current) return [];

    const incoming = cloneTarget(sourceTarget);
    const incomingName = incoming.dataset.clientName ?? "";
    gsap.set(incoming, { yPercent: 50, autoAlpha: 0 });
    parent.appendChild(incoming);

    if (label && incomingName) {
      scrambleText(label, incomingName, { duration: ANIMATION_DURATION * 1000, speed: 1.2 });
    }

    return [
      gsap.to(current, {
        yPercent: -50,
        autoAlpha: 0,
        duration: ANIMATION_DURATION,
        ease: "expo.inOut",
        onComplete: () => current.remove(),
      }),
      gsap.to(incoming, {
        yPercent: 0,
        autoAlpha: 1,
        duration: ANIMATION_DURATION,
        delay: 0.1,
        ease: "expo.inOut",
      }),
    ];
  }

  function swapNext() {
    if (isAnimating) return;

    const [firstIndex, secondIndex] = nextPair();
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];
    const firstTarget = firstCard.querySelector("[data-client-target]");
    const secondTarget = secondCard.querySelector("[data-client-target]");

    if (!firstTarget || !secondTarget) return;

    const firstSource = cloneTarget(firstTarget);
    const secondSource = cloneTarget(secondTarget);
    isAnimating = true;

    const tweens = [...swapTarget(firstCard, secondSource), ...swapTarget(secondCard, firstSource)];
    Promise.all(tweens.map((tween) => tween.then())).finally(() => {
      isAnimating = false;
    });
  }

  resetOrder();
  const timeline = gsap.timeline({ paused: true, repeat: -1, repeatDelay: LOOP_DELAY });
  timeline.call(swapNext);

  function syncPlayback() {
    if (isInView && !document.hidden) timeline.play();
    else timeline.pause();
  }

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        isInView = true;
        syncPlayback();
      },
      onLeave: () => {
        isInView = false;
        syncPlayback();
      },
      onEnterBack: () => {
        isInView = true;
        syncPlayback();
      },
      onLeaveBack: () => {
        isInView = false;
        syncPlayback();
      },
    });
  } else {
    isInView = true;
    syncPlayback();
  }

  document.addEventListener("visibilitychange", syncPlayback);
}
