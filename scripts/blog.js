import { blogCategories, blogPosts, getBlogPost, getPostUrl } from "./blog-data.js";
import { scrambleText } from "./scramble-text.js";

const arrowIcon = `<svg class="lucide lucide-arrow-up-right" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`;
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

const formatDate = (date) =>
  new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

const categoryKey = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");

const renderCard = (post) => `
  <article class="blog-card" data-blog-card data-categories="${post.categories.map(categoryKey).join(" ")}">
    <a class="blog-card__media" href="${getPostUrl(post)}" aria-label="Leer ${post.title}" data-no-scramble>
      <img src="${post.image}" alt="${post.imageAlt}" loading="lazy" />
    </a>
    <div class="blog-card__body">
      <p class="blog-card__category eyebrow"><span class="eyebrow__marker" aria-hidden="true"></span>${post.categories[0]}</p>
      <div class="blog-card__copy">
        <h2 class="heading heading--small"><a href="${getPostUrl(post)}" data-no-scramble>${post.title}</a></h2>
        <p class="text-body">${post.excerpt}</p>
        <a class="blog-card__link" href="${getPostUrl(post)}" data-no-scramble>Leer artículo ${arrowIcon}</a>
      </div>
    </div>
  </article>`;

function initBlogCard(card) {
  const link = card.querySelector(".blog-card__link");
  if (!link) return;

  card.classList.add("is-clickable");

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

function initBlogIndex() {
  const grid = document.querySelector("[data-blog-grid]");
  const filters = document.querySelector("[data-blog-filters]");
  if (!grid || !filters) return;

  grid.innerHTML = blogPosts.map(renderCard).join("");
  grid.querySelectorAll("[data-blog-card]").forEach(initBlogCard);
  filters.innerHTML = ["Todos los artículos", ...blogCategories]
    .map((category, index) => `<button class="blog-filter${index === 0 ? " is-active" : ""}" type="button" data-category="${index === 0 ? "all" : categoryKey(category)}" aria-pressed="${index === 0}">${category}</button>`)
    .join("");

  filters.addEventListener("click", (event) => {
    const selected = event.target.closest("[data-category]");
    if (!selected) return;
    filters.querySelectorAll("[data-category]").forEach((button) => {
      const active = button === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    grid.querySelectorAll("[data-blog-card]").forEach((card) => {
      card.hidden = selected.dataset.category !== "all" && !card.dataset.categories.split(" ").includes(selected.dataset.category);
    });
  });
}

const renderSection = ([title, content], index) => {
  const id = `seccion-${index + 1}`;
  return `<section class="article-section" id="${id}" data-article-section>
    <h2 class="heading heading--medium">${index + 1}. ${title}</h2>
    <p class="text-body">${content}</p>
  </section>`;
};

const renderRelated = (post) =>
  blogPosts
    .filter((candidate) => candidate.slug !== post.slug && candidate.categories.some((category) => post.categories.includes(category)))
    .slice(0, 2)
    .map(renderCard)
    .join("");

function initBlogPost() {
  const root = document.querySelector("[data-blog-post]");
  if (!root) return;
  const post = getBlogPost(new URLSearchParams(window.location.search).get("slug"));
  const canonicalUrl = `${window.location.origin}${getPostUrl(post)}`;

  document.title = `${post.title} | SIEMET`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", post.excerpt);
  document.querySelector("[data-post-title]").textContent = post.title;
  document.querySelector("[data-post-breadcrumb]").textContent = post.title;
  document.querySelector("[data-post-date]").textContent = formatDate(post.date);
  const hero = document.querySelector("[data-post-hero-image]");
  hero.src = post.image;
  hero.alt = post.imageAlt;

  document.querySelector("[data-post-tags]").innerHTML = post.categories.map((category) => `<span># ${category}</span>`).join("");
  document.querySelector("[data-post-excerpt]").textContent = post.excerpt;
  document.querySelector("[data-post-essentials]").innerHTML = post.essentials.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("[data-post-sections]").innerHTML = post.sections.map(renderSection).join("");
  document.querySelector("[data-post-toc]").innerHTML = [
    '<a class="is-active" href="#inicio" data-toc-link>Inicio</a>',
    ...post.sections.map(([title], index) => `<a href="#seccion-${index + 1}" data-toc-link>${index + 1}. ${title}</a>`),
  ].join("");
  document.querySelector("[data-related-posts]").innerHTML = renderRelated(post);
  document.querySelectorAll("[data-related-posts] [data-blog-card]").forEach(initBlogCard);

  document.querySelectorAll("[data-share]").forEach((link) => {
    const target = link.dataset.share;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`,
      x: `https://x.com/intent/post?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`,
    };
    link.href = urls[target];
  });

  const tocLinks = [...document.querySelectorAll("[data-toc-link]")];
  const sections = [document.querySelector("#inicio"), ...document.querySelectorAll("[data-article-section]")];
  const setActiveLink = (id) => tocLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${id}`));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) setActiveLink(visible.target.id);
  }, { rootMargin: "-18% 0px -68%", threshold: 0 });
  sections.filter(Boolean).forEach((section) => observer.observe(section));
  tocLinks.forEach((link) => link.addEventListener("click", () => setActiveLink(link.hash.slice(1))));
}

initBlogIndex();
initBlogPost();
