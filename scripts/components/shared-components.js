const chevronIcon = `
  <svg class="lucide lucide-chevron-down" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
`;

const navigationItems = [
  ["contacto", "Contacto", "#contacto"],
  ["nosotros", "Nosotros", "/nosotros/"],
  ["soluciones", "Soluciones", "/soluciones/"],
  ["productos", "Productos", "/productos/"],
  ["recursos", "Recursos", "/recursos/"],
  ["proyectos", "Proyectos", "/proyectos/"],
  ["blog", "Blog", "/blog/"],
];

const createNavigationLinks = (activePage) =>
  navigationItems
    .map(([key, label, href]) => `<a href="${href}"${key === activePage ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");

const createHeader = (activePage) => `
  <header class="site-header">
    <a class="site-header__brand" href="/" aria-label="SIEMET, inicio">
      <img class="site-header__logo site-header__logo--white" src="/assets/brand/logo-siemet-white.svg" alt="SIEMET" />
      <img class="site-header__logo site-header__logo--blue" src="/assets/brand/logo-siemet-blue.svg" alt="" aria-hidden="true" />
    </a>
    <div class="site-header__menu">
      <nav class="site-nav" aria-label="Navegación principal">${createNavigationLinks(activePage)}</nav>
      <a class="button button--primary site-header__cta" href="https://wa.me/51942676263?text=Hola%2C%20quiero%20cotizar%20un%20proyecto%20con%20SIEMET." target="_blank" rel="noopener noreferrer">Cotiza un proyecto</a>
    </div>
    <details class="mobile-menu">
      <summary aria-label="Abrir menú">
        <svg class="lucide lucide-menu mobile-menu__open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M4 6h16M4 18h16" /></svg>
        <svg class="lucide lucide-x mobile-menu__close" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </summary>
      <nav aria-label="Navegación móvil">${createNavigationLinks(activePage)}</nav>
    </details>
  </header>
`;

const faqItems = [
  {
    question: "¿Qué tipo de soluciones desarrolla SIEMET?",
    answer:
      "SIEMET desarrolla soluciones metálicas para proyectos que requieren seguridad, resistencia y respaldo técnico. Entre sus servicios se encuentran ingeniería y diseño estructural, fabricación de torres, postes metálicos y sistemas de protección contra descargas atmosféricas.",
  },
  {
    question: "¿SIEMET solo fabrica estructuras o también realiza el diseño?",
    answer:
      "SIEMET también realiza el diseño. Antes de fabricar, se evalúan aspectos como cargas, viento, altura, equipos, terreno, montaje, mantenimiento y crecimiento futuro del proyecto. Esto permite desarrollar soluciones más seguras, fabricables y eficientes desde la primera etapa.",
  },
  {
    question: "¿Qué incluye el servicio de ingeniería y diseño?",
    answer:
      "El servicio puede incluir diseño de torres, mástiles, postes, soportería y soluciones móviles, además de memorias de cálculo estructural, cálculo de cimentación, modelado 3D, estudios de mecánica de suelos y evaluación o reforzamiento estructural.",
  },
  {
    question: "¿Qué diferencia hay entre una torre auto soportada y una torre ventada?",
    answer:
      "Las <strong>torres auto soportadas</strong> operan de manera independiente y no requieren arriostramientos externos, por lo que son ideales para proyectos que necesitan alta estabilidad, carga y desempeño permanente.<br><br>Las <strong>torres ventadas</strong> utilizan sistemas arriostrados, lo que permite alcanzar alturas estratégicas con una relación eficiente entre peso, cobertura y costo.",
  },
  {
    question: "¿En qué proyectos se pueden usar los postes metálicos?",
    answer:
      "Los postes metálicos pueden aplicarse en carreteras, parques industriales, proyectos urbanos, iluminación pública o industrial, videovigilancia, seguridad ciudadana, plantas energéticas, centros logísticos y minería. También pueden integrar luminarias, cámaras, antenas, sensores y señalización.",
  },
];

const createFaq = () => `
  <section class="faq section" id="preguntas" aria-labelledby="faq-title" data-header-theme="dark" data-faq>
    <div class="faq__background" aria-hidden="true">
      <img src="/assets/images/home/faq/background.png" alt="" data-faq-parallax />
    </div>
    <div class="container faq__inner">
      <div class="section-heading section-heading--center section-heading--inverse">
        <p class="text-mono">＋ Preguntas frecuentes</p>
        <h2 class="heading heading--regular" id="faq-title">Preguntas frecuentes</h2>
      </div>
      <div class="faq__list">
        ${faqItems
          .map(
            (item, index) => `
              <details class="faq-item" data-faq-item${index === 0 ? " open" : ""}>
                <summary>
                  <span class="heading heading--small">${item.question}</span>
                  <span class="faq-item__toggle" aria-hidden="true">${chevronIcon}</span>
                </summary>
                <div class="faq-item__answer"><p class="text-body">${item.answer}</p></div>
              </details>
            `,
          )
          .join("")}
      </div>
    </div>
  </section>
`;

const createFooter = () => `
  <footer class="site-footer" id="contacto" data-header-theme="dark">
    <div class="site-footer__inner">
      <div class="site-footer__column site-footer__column--primary">
        <div class="site-footer__brand">
          <a href="/" aria-label="SIEMET, inicio">
            <img src="/assets/brand/logo-siemet-white.svg" alt="SIEMET" />
          </a>
          <p class="text-body">SIEMET FZ S.A.C. Trabajamos para convertir la confianza de nuestros clientes en proyectos bien hechos y compromisos cumplidos.</p>
        </div>

        <section class="site-footer__group" aria-labelledby="footer-contact-title">
          <h2 class="site-footer__label heading heading--mini" id="footer-contact-title">Contáctanos</h2>
          <address class="site-footer__links">
            <a class="site-footer__link" href="tel:+51979844607">
              <svg class="lucide lucide-phone" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92z" /></svg>
              <span>+51 979 844 607</span>
            </a>
            <a class="site-footer__link" href="mailto:ventas@siemet.pe">
              <svg class="lucide lucide-mail" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              <span>ventas@siemet.pe</span>
            </a>
            <a class="site-footer__link" href="https://www.google.com/maps/search/?api=1&amp;query=Av.+6+de+Noviembre+Mz.+Q5+Lote+01" target="_blank" rel="noopener noreferrer">
              <svg class="lucide lucide-map-pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>Av. 6 de Noviembre Mz. Q5 Lote 01</span>
            </a>
          </address>
        </section>

        <section class="site-footer__group" aria-labelledby="footer-documents-title">
          <h2 class="site-footer__label heading heading--mini" id="footer-documents-title">Documentos</h2>
          <nav class="site-footer__links" aria-label="Documentos legales">
            <a class="site-footer__link" href="/libro-de-reclamaciones/">
              <svg class="lucide lucide-book-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h5a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3Z" /><path d="M21 18a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2h-5a3 3 0 0 0-3 3v15a3 3 0 0 1 3-3Z" /></svg>
              <span>Libro de reclamaciones</span>
            </a>
            <a class="site-footer__link" href="/terminos-y-condiciones/">
              <svg class="lucide lucide-file-text" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5Z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
              <span>Términos y condiciones</span>
            </a>
            <a class="site-footer__link" href="/politica-de-privacidad/">
              <svg class="lucide lucide-shield-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" /><path d="m9 12 2 2 4-4" /></svg>
              <span>Política de privacidad</span>
            </a>
          </nav>
        </section>
      </div>

      <div class="site-footer__column site-footer__column--secondary">
        <nav class="site-footer__group" aria-labelledby="footer-navigation-title">
          <h2 class="site-footer__label heading heading--mini" id="footer-navigation-title">Navega</h2>
          <div class="site-footer__navigation">
            <a href="/nosotros/">Nosotros</a>
            <a href="/soluciones/">Soluciones</a>
            <a href="/productos/">Productos</a>
            <a href="/recursos/">Recursos</a>
            <a href="/proyectos/">Proyectos</a>
            <a href="/blog/">Blog</a>
            <a href="#contacto">Contacto</a>
          </div>
        </nav>

        <nav class="site-footer__group" aria-labelledby="footer-social-title">
          <h2 class="site-footer__label heading heading--mini" id="footer-social-title">Síguenos</h2>
          <div class="site-footer__links">
            <a class="site-footer__link" href="#" aria-label="SIEMET en Facebook">
              <svg class="lucide lucide-facebook" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" /></svg>
              <span>Facebook</span>
            </a>
            <a class="site-footer__link" href="#" aria-label="SIEMET en Instagram">
              <svg class="lucide lucide-instagram" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              <span>Instagram</span>
            </a>
            <a class="site-footer__link" href="#" aria-label="SIEMET en YouTube">
              <svg class="lucide lucide-youtube" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
              <span>YouTube</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  </footer>
`;

const createProcess = () => `
  <section class="process section" id="proceso" aria-labelledby="process-title" data-header-theme="light">
    <div class="container process__inner">
      <div class="process__heading">
        <span class="diagonal-lines diagonal-lines--blue-600" aria-hidden="true"></span>
        <div class="section-heading section-heading--process">
          <p class="eyebrow"><span class="eyebrow__marker" aria-hidden="true"></span>Proceso</p>
          <div class="process__heading-copy">
            <h2 class="heading heading--regular" id="process-title">De la ingeniería al montaje</h2>
            <p class="text-body">Un proceso integral para entregar soluciones confiables</p>
          </div>
        </div>
      </div>
      <div class="process__steps" data-process>
        <details class="process-step" data-process-step open>
          <summary><span class="text-mono-medium">01</span><span class="heading heading--medium">Evaluamos</span><span class="process-step__toggle" aria-hidden="true"><svg class="process-step__plus lucide lucide-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg><svg class="process-step__minus lucide lucide-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></svg></span></summary>
          <div class="process-step__body"><div class="process-step__description"><p class="text-body">Analizamos el requerimiento, el entorno y las condiciones de operación.</p><div class="process-step__timer" aria-hidden="true"><span data-process-progress></span></div></div><img src="/assets/images/home/process.png" alt="Evaluación técnica de una estructura metálica" loading="lazy" /></div>
        </details>
        <details class="process-step" data-process-step>
          <summary><span class="text-mono-medium">02</span><span class="heading heading--medium">Diseñamos</span><span class="process-step__toggle" aria-hidden="true"><svg class="process-step__plus lucide lucide-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg><svg class="process-step__minus lucide lucide-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></svg></span></summary>
          <div class="process-step__body"><div class="process-step__description"><p class="text-body">Desarrollamos la solución estructural con criterios de seguridad, fabricación y operación.</p><div class="process-step__timer" aria-hidden="true"><span data-process-progress></span></div></div><img src="/assets/images/home/feature-04.png" alt="Diseño estructural de una solución metálica" loading="lazy" /></div>
        </details>
        <details class="process-step" data-process-step>
          <summary><span class="text-mono-medium">03</span><span class="heading heading--medium">Fabricamos</span><span class="process-step__toggle" aria-hidden="true"><svg class="process-step__plus lucide lucide-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg><svg class="process-step__minus lucide lucide-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></svg></span></summary>
          <div class="process-step__body"><div class="process-step__description"><p class="text-body">Fabricamos cada componente bajo procesos controlados y verificaciones de calidad.</p><div class="process-step__timer" aria-hidden="true"><span data-process-progress></span></div></div><img src="/assets/images/home/feature-01.png" alt="Fabricación de componentes metálicos" loading="lazy" /></div>
        </details>
        <details class="process-step" data-process-step>
          <summary><span class="text-mono-medium">04</span><span class="heading heading--medium">Preparamos y transportamos</span><span class="process-step__toggle" aria-hidden="true"><svg class="process-step__plus lucide lucide-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg><svg class="process-step__minus lucide lucide-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></svg></span></summary>
          <div class="process-step__body"><div class="process-step__description"><p class="text-body">Preparamos cada elemento y coordinamos su transporte para una entrega segura y ordenada.</p><div class="process-step__timer" aria-hidden="true"><span data-process-progress></span></div></div><img src="/assets/images/home/feature-02.png" alt="Preparación y transporte de estructuras metálicas" loading="lazy" /></div>
        </details>
        <details class="process-step" data-process-step>
          <summary><span class="text-mono-medium">05</span><span class="heading heading--medium">Montamos y acompañamos</span><span class="process-step__toggle" aria-hidden="true"><svg class="process-step__plus lucide lucide-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg><svg class="process-step__minus lucide lucide-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></svg></span></summary>
          <div class="process-step__body"><div class="process-step__description"><p class="text-body">Ejecutamos el montaje y brindamos soporte técnico durante la puesta en operación.</p><div class="process-step__timer" aria-hidden="true"><span data-process-progress></span></div></div><img src="/assets/images/home/feature-03.png" alt="Montaje de una estructura metálica" loading="lazy" /></div>
        </details>
      </div>
    </div>
  </section>
`;

const replacePlaceholder = (placeholder, markup) => {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  placeholder.replaceWith(template.content);
};

export function renderSharedComponents() {
  document.querySelectorAll("[data-shared-header]").forEach((placeholder) =>
    replacePlaceholder(placeholder, createHeader(placeholder.dataset.activePage)),
  );
  document.querySelectorAll("[data-shared-process]").forEach((placeholder) => replacePlaceholder(placeholder, createProcess()));
  document.querySelectorAll("[data-shared-faq]").forEach((placeholder) => replacePlaceholder(placeholder, createFaq()));
  document.querySelectorAll("[data-shared-footer]").forEach((placeholder) => replacePlaceholder(placeholder, createFooter()));
}
