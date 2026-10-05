# Lenis y GSAP en SIEMET

Sí, Lenis y GSAP son compatibles tanto con el frontend vanilla actual como con la futura migración a WordPress. WordPress no impone restricciones: ambos son JavaScript independiente del framework y pueden cargarse desde un tema propio. GSAP incluso documenta expresamente compatibilidad con WordPress. [Documentación oficial de GSAP](https://gsap.com/docs/v3/Installation/)

## Recomendación para SIEMET

- Incorporar **Lenis ahora** para el smooth scroll.
- No incorporar GSAP todavía solo para hacer funcionar Lenis; Lenis puede usar su propio `requestAnimationFrame`.
- Añadir **GSAP + ScrollTrigger** más adelante únicamente si aparecen animaciones complejas ligadas al scroll, timelines coordinados, pinning o parallax.
- Mantener las animaciones actuales de sliders y acordeones con Web Animations API, porque ya funcionan y migrarán sin problemas.

Esto respeta la decisión de “[evitar dependencias innecesarias](./decisiones-web-siemet.md)”. Lenis está justificado por la experiencia de scroll; GSAP solo estaría justificado cuando exista una necesidad concreta.

## Consideraciones para WordPress

- Encapsular Lenis en un módulo propio, por ejemplo `smooth-scroll.js`.
- Guardar una versión fija localmente o instalarla como dependencia; evitar depender de un CDN sin versión.
- En WordPress, cargar el mismo archivo mediante `wp_enqueue_script`.
- Activar `anchors: true` y considerar el offset del header fijo.
- Mantener el scroll nativo como fallback si JavaScript falla.
- Respetar `prefers-reduced-motion`; la versión actual de Lenis ya lo contempla por defecto. [Documentación oficial de Lenis](https://github.com/darkroomengineering/lenis/blob/main/README.md)

## Momento de implementación

La configuración de Lenis se realizará al final del proyecto, justo antes de comenzar la migración a WordPress.
