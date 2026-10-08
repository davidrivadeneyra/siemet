# SIEMET Mini — tema WordPress

Piloto autocontenido que convierte una parte del frontend estático de SIEMET en un tema propio de WordPress.

## Alcance

- Home con el diseño y las interacciones del prototipo actual.
- Archivo dinámico `/proyectos/`.
- Fichas dinámicas `/proyectos/{slug}/`.
- Tipo de contenido `Proyecto` y taxonomía `Sector`.
- Campos nativos para cliente, alcance, ubicación, solución, resultado, CTA, galería y métricas.
- Seis proyectos iniciales creados al activar el tema en una instalación nueva.
- Navegación reducida a Inicio, Proyectos y Contacto.

## Instalación

1. Copiar `wordpress-mini-theme` a `wp-content/themes/siemet-mini`.
2. Activar **SIEMET Mini** desde Apariencia → Temas.
3. Visitar Ajustes → Enlaces permanentes y guardar una vez si las URLs no responden inmediatamente.
4. Editar los registros creados desde Proyectos en el panel de WordPress.

El tema crea una página `Inicio` y la asigna como portada solamente cuando la instalación todavía no tiene una portada estática configurada. No reemplaza contenido existente.

## Límites deliberados del piloto

- El contenido principal del Home conserva los textos iniciales dentro de la plantilla. En la versión completa se migrará a campos administrables.
- La galería de cada proyecto acepta una URL por línea. La versión completa utilizará un selector integrado con la Biblioteca de Medios.
- Los tipos de contenido están dentro del tema para mantener este piloto autocontenido. En producción deben moverse al plugin `siemet-core`.
- Lenis y GSAP conservan las versiones CDN del prototipo. Antes de producción deben evaluarse archivos locales y la política de seguridad de contenido.

