# Paso 3: accesibilidad

- Fecha: 2026-09-18
- Cambio: mejorar-seo-certificados
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: CUA

## Comandos ejecutados
- CUA: Enter en filtro Agilidad y Tab entre las dos acciones Scrum; inspección de foco y nombres accesibles.
- Servidor temporal sobre _site: HTML sin el único script y variante con reglas de impresión activas, sin archivos adicionales publicables.

## Escenarios verificados
| Escenario | Cómo se comprobó | Resultado |
|---|---|---|
| Teclado | Foco solid visible, Tab pasa de registro a PDF; controles nativos y etiquetas distintivas | PASA |
| Sin JavaScript | Cero scripts, doce tarjetas visibles, dos enlaces Scrum y filtros ocultos | PASA |
| Impresión | Header y herramientas ocultos, doce tarjetas visibles; captura de grilla legible | PASA |
| Contraste y movimiento | Colores existentes --green/--muted sobre --white; sin animaciones nuevas; regla reduce conserva transición none | PASA |

## Anchos y modos revisados
- Anchos y equivalente 200% en reporte 2. Captura móvil muestra contorno de foco separado del texto.
- Impresión revisada con reglas CSS activas, sin verificar paginación física. No se ejecutó lector de pantalla real; se revisó árbol accesible.

## Consola
- Sin errores ni advertencias del sitio.

## Qué quedó sin comprobar
- Paginación de impresora y lector de pantalla real.

## Problemas y resolución
- Ninguno nuevo.

## Resultado
- Estado: PASA con los límites de verificación indicados.
- Bloqueos: ninguno.
