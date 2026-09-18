# Paso 3: accesibilidad y mejora progresiva

- Fecha: 2026-09-17
- Cambio: mejorar-seo-certificados
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: CUA, navegador integrado sin sesión en los emisores

## Comandos ejecutados
- Navegador CUA: press Enter/Space/Tab, inspección de DOM accesible y estilos calculados.
- Servidor temporal de QA: variante sin el único script del sitio; variante con las reglas @media print aplicadas para inspección visual. No son archivos publicables.

## Escenarios verificados
| Escenario (spec) | Cómo se comprobó | Resultado |
|---|---|---|
| Contenido independiente de JavaScript | Variante con document.scripts.length=0: 12 tarjetas visibles, herramientas ocultas, nombre y contenido presentes | PASA |
| Enlaces accesibles | Doce nombres accesibles con destino y aviso de pestaña; noopener noreferrer y flecha decorativa | PASA |
| Teclado | Enter en filtros, Space en IA, Tab desde Agilidad al certificado Angular; foco con contorno solid | PASA |
| Navegación sin scripts | Enter en Saltar al contenido actualiza #contenido | PASA |
| Impresión | Reglas existentes aplicadas en variante QA: encabezado y herramientas ocultos, 12 tarjetas visibles y texto legible | PASA |

## Anchos y modos revisados
- Anchos y equivalente al zoom 200%: reporte del paso 2.
- No hay colores, animaciones, CSS ni JavaScript nuevos. Movimiento reducido conserva las reglas existentes; revisión estática del CSS.
- No se usó un lector de pantalla real; se inspeccionaron los nombres expuestos al árbol accesible.

## Consola
- Sin errores ni advertencias locales.

## Qué quedó sin comprobar
- Paginación física de una impresora: se verificó la presentación de las reglas de impresión mediante variante visual, sin producir un nuevo PDF.
- La herramienta no expuso una nueva pestaña tras Enter en el enlace externo. Los destinos se verificaron por navegación directa y los enlaces son anclas HTML nativas; no se afirma haber comprobado el popup.

## Problemas y resolución
- No se modificaron interacciones ni estilos; el cambio conserva el comportamiento existente y los controles verificados.

## Resultado
- Estado: PASA para la regresión de este cambio de metadatos y destinos, con los límites de verificación detallados.
- Bloqueos: ninguno para el cambio local.
