# Paso 2: verificación local del diseño general

- Fecha: 2026-09-18
- Cambio: mejorar-seo-certificados
- Agente y modelo: Claude Code / Opus 5 (1M context)
- Herramienta de navegador: Chrome headless ya instalado en el equipo (`--headless=new`), sin agregar dependencias al proyecto

## Comandos ejecutados
- `node scripts/package-site.mjs`: siete archivos, cuatro referencias locales. Se copió `_site/` a una carpeta temporal fuera del repo para servir exactamente lo publicable.
- `python -m http.server 8000 --bind 127.0.0.1`: servidor local sobre esa copia.
- `chrome --headless=new --dump-dom` con una página de medición (copia de `index.html` con un script agregado) en 1920, 1440, 1024, 768 y 720 px: devuelve `scrollWidth`, elementos fuera del viewport, alturas de controles y errores de consola.
- Chrome no crea ventanas de menos de ~500 px: 390, 360 y 320 px se midieron dentro de un iframe del ancho exacto, que genera su propio viewport para las media queries. Los tres informaron `ancho_viewport` 390, 360 y 320.
- `chrome --headless=new --screenshot` en 320 px sobre portada, experiencia, certificados, tarjeta Scrum, CV y contacto.

## Escenarios verificados
| Escenario (spec) | Cómo se comprobó | Resultado |
|---|---|---|
| Lectura de experiencia (presentacion-profesional) | Conteo en el DOM: 6 `.experience-row` y 26 items en `.experience-contributions`. En escritorio, fechas y empresa en la columna de 230 px y aportes en la principal | PASA |
| Adaptación y navegación (presentacion-profesional) | `scrollWidth` igual al viewport en los siete anchos y en 720 px; lista de elementos desbordados vacía en todos | PASA |
| Lectura y controles táctiles (certificados-verificables) | Alturas medidas en el DOM, ver tabla de abajo | PASA con la excepción registrada |
| Filtrado de certificados | Click programático sobre `[data-filter]`: `agilidad` 2 visibles y 10 ocultas, `desarrollo` 2 y 10, `todos` 12 y 0; un solo `aria-pressed="true"` por vez; contador "2 certificados · Agilidad" y "12 certificados". Coincide con el HTML: 2 agilidad, 3 arquitectura, 3 calidad, 2 desarrollo, 2 IA | PASA |
| Sección activa en la navegación | Al desplazar hasta experiencia, `nav a[aria-current="location"]` es "Experiencia" y toma la superficie `--soft` | PASA |
| Anclas con header sticky | `scrollIntoView` (respeta `scroll-padding-top`) sobre `#certificados` en 320 px: el encabezado "05 / CERTIFICADOS" queda completo debajo del header de dos filas | PASA |

## Anchos y modos revisados
- 1920, 1440, 1024, 768, 390, 360 y 320 px, más 720 px como equivalente a zoom 200% sobre 1440: sin desplazamiento horizontal, sin elementos fuera del viewport y sin texto cortado en las capturas.
- Alturas mínimas de controles, iguales en todos los anchos salvo donde se indica: `nav a` 44 px, `.project-details summary` 44,8 px, "Abrir PDF" 44 px, "Ver certificados" 44 px, "GitHub / AdrianToso" 44 px, botones de portada 48 px (50,8 px arriba de 850 px), filtros 44 px, enlaces de certificado 52 px.
- `.projects-footer .text-link` ("Ver GitHub" y "Ver carpeta completa") mide 20,8 px arriba de 620 px y 44 px en 620 px o menos. Es el caso ya documentado que cumple AA por la excepción de espaciado (`docs/frontend-standards.md` §4), no una regresión del rediseño.

## Consola
- Sin errores ni advertencias en ninguno de los anchos (`errores_consola` vacío en las ocho mediciones).

## Qué quedó sin comprobar
- Zoom del 200% real del navegador: se usó 720 px como ancho equivalente, igual que los reportes previos del cambio.
- Navegadores distintos de Chromium.

## Problemas y resolución
- Chrome no baja de ~500 px de ancho de ventana: las primeras mediciones de 390, 360 y 320 px devolvían 504 px → se repitieron dentro de un iframe del ancho exacto.
- `html{scroll-behavior:smooth}` dejaba las capturas en la posición inicial → se forzó `scrollBehavior:'auto'` y `behavior:'instant'` solo en el banco de medición, sin tocar el sitio.

## Resultado
- Estado: PASA
- Bloqueos: ninguno.
