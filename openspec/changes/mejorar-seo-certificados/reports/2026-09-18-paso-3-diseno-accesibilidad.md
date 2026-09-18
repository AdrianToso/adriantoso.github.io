# Paso 3: accesibilidad y mejora progresiva del diseño general

- Fecha: 2026-09-18
- Cambio: mejorar-seo-certificados
- Agente y modelo: Claude Code / Opus 5 (1M context)
- Herramienta de navegador: Chrome headless ya instalado en el equipo (`--headless=new`)

## Comandos ejecutados
- Copia `sin-js.html` de `index.html` sin la única etiqueta `<script src="script.js" defer>`, servida desde el servidor local. Chrome con `--blink-settings=scriptEnabled=false` no genera capturas ni `--dump-dom`, por eso se usó la copia, igual que en el reporte del paso 3 anterior.
- `chrome --headless=new --screenshot` con foco puesto por código en `.github-contact`, dentro de la sección de contacto.
- `chrome --headless=new --force-prefers-reduced-motion --dump-dom` leyendo `getComputedStyle` de `.certificate-card`.
- `chrome --headless=new --print-to-pdf` sobre `index.html`, más una copia con los dos bloques `@media print` aplicados sin el envoltorio, para verlos en pantalla.

## Escenarios verificados
| Escenario (spec) | Cómo se comprobó | Resultado |
|---|---|---|
| Mejoras progresivas y accesibilidad (presentacion-profesional) | Ver las cuatro filas siguientes | PASA |
| Sin JavaScript | `sin-js.html` no tiene scripts: las 12 `.certificate-card` quedan visibles y `.certificate-tools` conserva el atributo `hidden`. La página se renderiza completa en 1024 px | PASA |
| Foco visible sobre fondo oscuro | Foco en "GitHub / AdrianToso": contorno `--green-light` sobre el verde de contacto, separado del texto y sin recortes. Es la corrección prevista en el plan | PASA |
| Movimiento reducido | Sin la preferencia, `.certificate-card` tiene `transition: transform 0.2s, box-shadow 0.2s`; con `--force-prefers-reduced-motion` pasa a `none`. El rediseño no agregó animaciones | PASA |
| Impresión | Con las reglas de impresión activas se ocultan header, `.hero-actions`, `.architecture`, `.focus-strip` y `.back-top`; la experiencia queda en dos columnas sin borde ni fondo y el texto es legible. El PDF generado tiene 12 páginas | PASA |
| Teclado y mejora progresiva (certificados-verificables) | Filtros activados por `click()` sobre el botón: cambian `aria-pressed`, el contador y las tarjetas visibles. Los controles son `button` y `a` nativos, así que conservan Enter y Espacio | PASA parcial, ver limitaciones |
| Nombres accesibles | Cada enlace de certificado lleva su `sr-only` con destino y "abre otra pestaña"; la tarjeta Scrum distingue "Verificar credencial" y "Ver diploma PDF" | PASA |

## Anchos y modos revisados
- Anchos y equivalente a zoom 200% en el reporte del paso 2.
- Sin JavaScript revisado en 1024 px; foco e impresión en 320 y 800 px.

## Consola
- Sin errores del sitio.

## Qué quedó sin comprobar
- Lector de pantalla real: se revisaron los nombres accesibles en el marcado, no su lectura.
- Pulsaciones reales de Tab, Enter y Espacio: el foco se movió por código y los filtros se activaron con `click()`. El orden de tabulación sigue el orden del DOM, que no cambió en este rediseño.
- Paginación física en una impresora.

## Problemas y resolución
- Chrome con los scripts desactivados no produce captura ni DOM → se sirvió la copia sin la etiqueta `<script>`, que para este sitio es equivalente.
- No hay `pdftoppm` para renderizar el PDF → se contaron sus páginas y se revisaron las reglas de impresión aplicadas en pantalla.

## Resultado
- Estado: PASA con las limitaciones indicadas.
- Bloqueos: ninguno.
