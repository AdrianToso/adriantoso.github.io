---
description: Estándares de frontend del portafolio estático (HTML, CSS y JavaScript sin dependencias), con accesibilidad, rendimiento, privacidad y flujo de Git.
globs: ["index.html", "styles.css", "script.js", "favicon.svg"]
alwaysApply: true
---

# Estándares de frontend

## 1. Stack

- **HTML5** semántico en un solo documento: `index.html`.
- **CSS3** sin preprocesadores: `styles.css`, con custom properties en `:root`.
- **JavaScript** moderno sin librerías: `script.js`, cargado con `defer`.
- **Sin** frameworks, bundlers, gestores de paquetes, fuentes remotas, CDN ni scripts de terceros.
- Para agregar cualquier dependencia o paso de compilación, primero hay que acordarlo con el titular y registrarlo en `docs/base-standards.md`.

## 2. Estructura de archivos

```
index.html                    # Todo el contenido del sitio
styles.css                    # Estilos, responsive, impresión y movimiento reducido
script.js                     # Mejoras progresivas (filtros y sección activa)
favicon.svg                   # Identidad del sitio
downloads/Adrian-Toso-CV.pdf  # CV profesional sin datos sensibles
.nojekyll                     # Solo aplica a la publicación desde rama (legado)
scripts/package-site.mjs      # Arma _site/ con los archivos publicables
```

Solo se publican los archivos listados uno por uno en `SITE_FILES` (`scripts/package-site.mjs`). Un archivo nuevo en `downloads/` o en cualquier otra carpeta no se publica hasta que se agrega a esa lista.

## 3. HTML

- `lang="es"` en `<html>`. Un solo `<h1>` y jerarquía de encabezados sin saltos (`h2` por sección, `h3` por tarjeta).
- Usá landmarks: `header`, `nav` con `aria-label`, `main#contenido`, `section`, `article` y `footer`.
- Cada `section` con ancla lleva `aria-labelledby` apuntando al `id` de su encabezado: el `h2` de la sección o, en `#inicio`, el `h1` `hero-title`.
- Mantené el enlace "Saltar al contenido" como primer elemento enfocable.
- **Enlaces externos**: `target="_blank" rel="noopener noreferrer"`, texto `sr-only` que indique el destino y "(abre otra pestaña)", y la flecha visual con `aria-hidden="true"`.
- **Elementos decorativos** (diagramas, íconos, separadores): `aria-hidden="true"`. Si un bloque visual transmite información, usá `role="img"` con un `aria-label` descriptivo.
- **Fechas exactas** (certificados): `<time datetime="AAAA-MM-DD">` con el texto visible en español abreviado (`25 may. 2025`).
- **Rangos de mes y año** (experiencia): `<span>` con el formato de `docs/content-model.md` §2 (`Sep. 2022 — Nov. 2023`).
- **Descargas**: `href` relativo y atributo `download` con el nombre final del archivo.
- **Metadatos**: mantené al día `description`, `og:*`, `canonical` y `theme-color` cuando cambie el perfil.
- No agregues formularios, iframes ni `<script>` inline.

## 4. CSS

- **Tokens** en `:root`: `--paper`, `--white`, `--ink`, `--muted`, `--green`, `--green-light`, `--line`, `--soft`, `--orange`, `--mono` y `--sans`. Usá los tokens antes de agregar colores nuevos; si un color se repite, convertilo en token.
- **Fuentes del sistema** (`--sans`, `--mono`, Georgia para el acento del `h1`). No uses fuentes web.
- **Formato**: compacto, igual que el archivo actual.
  - Fuera de las media queries, una regla por línea. Solo se admiten dos reglas en una línea si son variantes muy cortas del mismo componente (por ejemplo, `.issuer-neoris` e `.issuer-scrumstudy`).
  - Cada bloque `@media` va en una sola línea, con todas sus reglas adentro. Al agregar un ajuste a un breakpoint existente, sumalo a esa línea.
- **Organización y cascada**: el archivo tiene dos bloques, el base y "Recursos descargables y certificados", y cada uno cierra con sus propias media queries. El segundo bloque va después, así que **sus reglas pisan a las del primero** cuando coinciden el selector y la propiedad. Esa es una deuda conocida: por ejemplo, algunos ajustes de 360 px del primer bloque (`nav`, `.nav-contact`, `.hero-actions`) no se aplican porque los anula el bloque de 620 px posterior. Para un ajuste responsive:
  1. Buscá el selector en las media queries de los dos bloques.
  2. Editá la regla que realmente gana (la última que aplica a ese ancho) o fusioná las dos.
  3. No agregues bloques de media queries nuevos. Si una funcionalidad nueva necesita estilos propios, agregá su bloque con comentario al final y ubicá sus media queries al final de ese bloque.
  4. Verificá en el navegador que ninguna regla posterior anule el ajuste.
- **Breakpoints**: `min-width:1500px` y `max-width` en `1100px`, `850px`, `620px` y `360px`. No inventes breakpoints nuevos sin necesidad.
- **Foco**: `:focus-visible` en enlaces, botones y `summary`, con un contorno que tenga contraste de 3:1 con el fondo. `--orange` cumple sobre los fondos claros, pero no sobre `--green`: en la sección de contacto hay que usar un color claro como `--green-light`, algo que todavía está pendiente de corregir. Nunca quites el foco sin reemplazarlo.
- **Visibilidad**: se controla con el atributo `hidden` (`[hidden]{display:none!important}`), no con estilos inline.
- **Movimiento reducido**: toda transición o animación nueva se anula en `@media (prefers-reduced-motion: reduce)`.
- **Impresión**: revisá `@media print` al agregar secciones. En papel se ocultan la navegación y los controles, y se muestran todos los certificados.
- **Áreas táctiles**:
  - **Mínimo AA** (WCAG 2.2, criterio 2.5.8): 24×24 px.
    - La excepción es un control más chico cuyo círculo de 24 px, centrado en él, no toque otro control ni el círculo de otro control chico (excepción de espaciado). En la práctica, los centros de dos controles chicos tienen que quedar a 24 px o más.
    - Hoy cumplen solo por esa excepción algunos enlaces de texto de unos 19 a 21 px de alto: la navegación en anchos mayores a 620 px, "Ver certificados" del inicio, y "Ver GitHub" y "Ver carpeta completa" en anchos mayores a 620 px. No reduzcas su separación.
  - **Objetivo del proyecto**: 44 px de alto en mobile (`min-height`) para los controles nuevos. Controles actuales que no llegan (medidas aproximadas entre 320 y 390 px), pendientes de mejorar:
    - Botones de filtro de certificados: 42 px (`min-height:42px`).
    - Enlace "Abrir PDF" del CV: 35 px (`min-height:35px`).
    - Enlaces de la navegación en 620 px o menos: unos 32 px.
    - Resumen "Qué podés encontrar" de los proyectos: unos 31 px, en todos los anchos.
    - Enlace "GitHub / AdrianToso" del contacto: unos 42 px.
    - Botones "Explorar proyectos" y "Descargar CV" del inicio en 620 px o menos: unos 43,6 px.
    - Marca del encabezado en 620 px o menos: unos 24 px. Marca del pie: unos 32 px.
    - Enlace "Ver certificados" del inicio: unos 19 a 21 px.
  - Esta lista puede quedar desactualizada: al tocar un control, medí su alto en 390, 360 y 320 px.

## 5. JavaScript

- Todo el código va dentro de una IIFE con `'use strict'` y sin variables globales.
- **Mejora progresiva**: los controles que dependen de JS empiezan con `hidden` en el HTML y se muestran solo cuando el script se inicializa bien.
- Antes de enganchar eventos, verificá que existan los elementos. Si falta algo, no hagas nada y no lances errores.
- **Estado accesible**: reflejá el estado con ARIA (`aria-pressed` en los filtros, `aria-current="location"` en la navegación) y anunciá los cambios en regiones `role="status"`.
- **Rendimiento**: listeners de `scroll` y `resize` con `{passive: true}` y trabajo agrupado con `requestAnimationFrame`.
- **Prohibido**: `fetch` a servicios externos, `localStorage`, cookies, analítica y `eval`/`innerHTML` con datos dinámicos (usá `textContent`).
- **Identificadores en inglés** (`updateNavigation`) y textos visibles en español.

## 6. Accesibilidad (WCAG 2.2 AA)

- Navegación completa con teclado, en un orden lógico y con el foco siempre visible.
- Contraste mínimo de 4.5:1 en el texto normal y 3:1 en el texto grande y los componentes de interfaz.
- Todo control tiene un nombre accesible. Los íconos de texto (`↗`, `↓`, `{ }`) van ocultos para los lectores de pantalla.
- La información no depende solo del color.
- El contenido tiene que ser legible con un zoom del 200% y a 320px de ancho sin desplazamiento horizontal.

## 7. Rendimiento

- Sin recursos remotos: la página carga solo `styles.css`, `script.js` y `favicon.svg`.
- Las ilustraciones se hacen con HTML y CSS o con SVG liviano. Evitá imágenes rasterizadas. Si hacen falta, optimizalas y declará `width`, `height` y `alt`.
- Mantené el PDF del CV liviano (hoy pesa menos de 100 KB).

## 8. Privacidad y seguridad

- Sin cookies, analítica, formularios, píxeles ni scripts de terceros.
- El único contacto publicado es el correo profesional (`mailto:`), que abre la aplicación de correo del visitante.
- Nunca publiques DNI, domicilio, teléfono, fecha de nacimiento ni datos de referencias. Tampoco en comentarios HTML ni en metadatos del PDF.
- Los enlaces a comprobantes deben ser públicos y no pedir inicio de sesión. Verificalos antes de publicarlos.

## 9. Flujo de Git

- **Ramas**: `feature/<nombre-del-cambio>` desde `main`. Los cambios chicos de contenido pueden ir directo a `main` si el titular lo pide.
- **Commits**: en español, en infinitivo y descriptivos, como el historial actual ("Agregar certificados filtrables y descarga del CV profesional"). Un commit por cambio coherente.
- **PR**: con `gh`, en español, con un resumen, los escenarios verificados y las capturas si cambia la interfaz.
- Todo lo que se sube a `main` se publica automáticamente. Antes, verificá según `docs/development_guide.md`.
