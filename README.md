# SIEMET — base web

Base estática del sitio corporativo de SIEMET. El proyecto usa HTML semántico,
CSS y JavaScript vanilla, sin frameworks ni dependencias de ejecución.

## Estructura

- `index.html`: documento raíz vacío, preparado para el futuro home.
- `design-system.html`: referencia interna de fundamentos y componentes.
- `assets/brand`: variantes oficiales del logotipo.
- `assets/fonts`: ubicación reservada para las fuentes locales.
- `styles/settings`: tokens del sistema visual.
- `styles/base`: normalización y estilos globales.
- `styles/layout`: primitivas de composición.
- `styles/components`: componentes reutilizables.
- `styles/utilities`: utilidades de accesibilidad.
- `scripts`: comportamiento progresivo compartido.
- `pages`: futuras páginas interiores del prototipo estático.

## Uso local

El sitio no requiere compilación. Puede servirse con cualquier servidor estático,
por ejemplo desde la raíz del proyecto:

```sh
python3 -m http.server 8080
```

La guía interna queda disponible en `/design-system.html`. El home todavía no ha
sido implementado.

## Criterios

La arquitectura sigue `decisiones-web-siemet.md`: componentes compartidos,
HTML semántico, mejora progresiva y una organización que pueda trasladarse a un
tema propio de WordPress. Los tokens iniciales provienen del archivo de Figma
“Siemet Web” y están documentados en `estilos-figma-siemet.md`. Los dos estilos
locales que Figma denomina `Blue/600` se exponen como `--color-blue-600` y
`--color-blue-600-bright` para evitar referencias ambiguas en el código.
