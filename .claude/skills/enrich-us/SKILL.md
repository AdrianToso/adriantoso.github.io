---
name: enrich-us
description: Analizar y enriquecer una historia de usuario, idea o ticket hasta dejarlo listo para implementar, con criterios de aceptación y detalle técnico. Acepta texto directo o un ticket de Jira.
author: LIDR.co (adaptada para adriantoso.github.io)
version: 1.0.0
---

# Skill enrich-us

Analizá y enriquecé el ticket: $ARGUMENTS.

## Pasos

1. Determiná la fuente:
   - **Texto directo** (predeterminado): usá el contenido que el usuario compartió.
   - **Jira** (opcional): si el usuario da una clave de Jira o pide usar Jira, obtené el ticket con el MCP de Jira si está disponible.
2. Actuá como experto de producto con conocimiento técnico. Recordá que el "producto" es un portafolio estático (ver `docs/base-standards.md`, sección 0).
3. Entendé el problema que describe el ticket.
4. Evaluá si la historia está completa. Tiene que incluir:
   - Descripción completa de la funcionalidad, desde el punto de vista del visitante.
   - Contenido exacto que se agrega o cambia, con la **fuente** de cada dato profesional.
   - Sección o ancla afectada y estructura según `docs/content-model.md`.
   - Archivos que se modifican (`index.html`, `styles.css`, `script.js`, `downloads/`, `scripts/package-site.mjs`).
   - Comportamiento responsive (320 a 1920 px y zoom del 200%), sin JavaScript, con teclado y al imprimir.
   - Criterios de aceptación verificables en el navegador.
   - Documentación que hay que actualizar.
   - Requisitos no funcionales: accesibilidad AA, privacidad (sin datos sensibles ni recursos externos) y rendimiento.
5. Si falta detalle para implementar de forma autónoma, redactá una versión mejorada: más clara, específica y concisa, alineada con el paso 4 y con el contexto de `docs/`. Marcá como **pendiente de confirmar** todo dato que el titular tenga que aportar; no lo inventes.
6. La respuesta siempre incluye estas secciones:
   - `## Original`
   - `## Mejorada`
7. La escritura en Jira es opcional y solo aplica en modo Jira:
   - Agregá el contenido mejorado después del original, con las secciones `h2` `[original]` y `[mejorada]`.
   - Si el estado es `To refine`, pasalo a `Pending refinement validation`.

## Notas

- No exijas Jira si el usuario ya compartió el contenido completo.
- Si la entrada es ambigua (por ejemplo, una referencia corta sin contenido), preguntá si hay que buscarla en Jira o pedí el texto completo.
- Esta skill es de planificación: seguí la sección 5 de `docs/base-standards.md` sobre el modelo.
