# Decisiones del proyecto web SIEMET

## Objetivo

Crear una web corporativa para SIEMET completamente personalizada. La primera versión se desarrollará con HTML semántico, CSS y JavaScript vanilla. Posteriormente se transformará en una solución propia para WordPress.

## Decisiones generales

- No se utilizarán constructores visuales como Elementor.
- No se partirá de un tema existente ni de una plantilla comercial.
- El diseño, los componentes y el código serán desarrollados a medida.
- La primera etapa será un frontend estático en HTML, CSS y JavaScript vanilla.
- El frontend se estructurará desde el inicio para facilitar su posterior integración con WordPress.
- Se evitarán dependencias innecesarias y frameworks de frontend.
- Las páginas compartirán componentes, estilos y comportamientos reutilizables.
- Todos los íconos de interfaz utilizarán Lucide Icons. No se dibujarán íconos personalizados ni se mezclarán otras bibliotecas, salvo una excepción aprobada explícitamente.
- La tipografía se utilizará siempre en estilo normal; no se usarán cursivas en ningún componente o contenido.
- Todo cambio de tamaños, colores o configuración tipográfica deberá actualizarse también en `design-system.html`, dentro de Fundamentos y componentes.
- Se podrán incorporar View Transitions como mejora progresiva entre páginas.

## Páginas principales

- Home
- Nosotros
- Soluciones
- Productos
- Recursos
- Proyectos
- Blog
- Contacto

## Soluciones

Cada solución tendrá una página individual. El contenido inicial contempla:

1. Protección contra Descargas Atmosféricas
2. Postes Metálicos
3. Torres Ventadas
4. Torres Auto Soportadas
5. Ingeniería y Diseño

En WordPress, el cliente deberá poder crear, editar, ordenar y publicar nuevas soluciones sin modificar código.

## Productos

### Acero estructural

#### Postes

1. Postes cónicos hexagonales
2. Postes cónicos octogonales
3. Postes cónicos circulares
4. Postes cónicos cuadrados
5. Postes redondos rectos
6. Postes cuadrados rectos
7. Postes monopolos
8. Postes publicitarios

#### Torres

1. Torre autosoportada cuadrada
2. Torre autosoportada triangular
3. Torre ventada
4. Torre abatible

### Protección atmosférica

#### Pararrayos y contador de descargas

1. PDC30
2. PDC60
3. Franklin tetrapuntal
4. Franklin pentapuntal
5. Punta Franklin
6. Contador Digital

Cada producto tendrá su propia página. En WordPress se podrán crear nuevas familias, categorías y productos.

## Recursos

Los recursos serán elementos descargables administrables.

### Catálogos

- Catálogo de Postes Metálicos SIEMET
- Catálogo de Torres Autosoportadas SIEMET
- Protección Atmosférica SIEMET

### Fichas técnicas

- Poste Cónico Octogonal
- Pararrayos y puntas captadoras

### Guías

- Catálogo de torres Ventadas SIEMET

### Manuales

- Manual de Puesta a Tierra

### Documentación

- Datos requeridos para cotizar

En WordPress, el cliente podrá crear nuevas categorías de recursos, cargar archivos mediante la Biblioteca de Medios y reemplazar los documentos existentes.

## Proyectos

Los proyectos se mostrarán mediante tarjetas y cada registro podrá contener sector, cliente, alcance, descripción, imágenes, video y demás información relacionada.

### Agua y saneamiento

- Torres ventadas y autosoportadas
  - Cliente: SEDAPAL
  - Alcance: Diseño, fabricación e instalación

### Infraestructura portuaria

- Torre móvil
  - Cliente: Terminal Portuario de Paracas
  - Alcance: Diseño, fabricación e instalación

### Energías renovables

- Torres ventadas de 120 metros
  - Cliente: Barlovento Applus
  - Alcance: Diseño y fabricación

### Minería

- Sistema de protección contra rayos para operación minera
  - Cliente: Antamina
  - Alcance: Instalación
- Postes metálicos para sistemas de pararrayos
  - Cliente: Minera Las Bambas
  - Alcance: Diseño y fabricación

### Iluminación e infraestructura

- Postes poligonales para sistemas de protección
  - Cliente: SERTEPEC
  - Alcance: Diseño y fabricación

En WordPress, el cliente podrá crear nuevos proyectos y sectores. Los listados y las tarjetas se generarán dinámicamente.

## Criterios para la futura integración con WordPress

- Se desarrollará una solución personalizada, sin depender de temas de terceros.
- Soluciones, productos, recursos y proyectos serán colecciones de contenido dinámico.
- Cada texto o sección autorizada será editable desde WordPress.
- Las imágenes, videos y archivos podrán reemplazarse usando la Biblioteca de Medios.
- El cliente podrá crear nuevos elementos sin alterar plantillas ni código.
- Las plantillas mantendrán la consistencia visual y responsive del sitio.
- Los componentes del prototipo vanilla servirán como base para las plantillas dinámicas.
- La estructura de URLs se preparará para enlaces permanentes legibles.

### Contenido administrable del Home

Al convertir el frontend en un tema de WordPress, el cliente podrá editar desde el CMS el contenido de las siguientes secciones del Home, sin modificar las plantillas ni el código:

- **Hero:** imagen o video, título, subtítulo, descripción, texto del botón y enlace del botón.
- **Quiénes somos:** descripción y una lista administrable de elementos, cada uno con título, descripción e imagen.
- **Proceso:** título, descripción e imagen de cada paso.
- **Industrias:** título e imagen de cada industria.
- **Clientes:** logotipo y nombre de cada cliente.
- **Preguntas frecuentes:** pregunta y respuesta de cada elemento.

La estructura visual, los componentes, el comportamiento responsive y las animaciones permanecerán definidos en el tema. WordPress administrará únicamente el contenido y el orden de los elementos correspondientes.

## View Transitions

- Las transiciones se desarrollarán inicialmente en la versión vanilla.
- Deberán conservarse en el sitio final de WordPress.
- Se aplicarán como mejora progresiva: la navegación seguirá funcionando en navegadores sin soporte.
- Las transiciones entre páginas se limitarán a navegación dentro del mismo dominio.
- Se respetará la preferencia `prefers-reduced-motion`.
- No será necesario convertir el sitio en una SPA para disponer de transiciones entre documentos compatibles.

## Estado actual

Las decisiones de arquitectura y alcance han sido registradas. No se ha iniciado todavía la implementación del sitio; el desarrollo comenzará cuando se reciba la orden de ejecución.
