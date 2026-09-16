---
description: Estándares para mantener la documentación técnica y las specs de IA del proyecto, con el proceso de actualización y las reglas de idioma.
globs:
alwaysApply: true
---

# Documentación y specs de IA

## Introducción

- **Documentación técnica**: `README.md` y `docs/`. Describe qué contiene el sitio, cómo se previsualiza, verifica y publica, y de dónde sale su contenido.
- **Specs de IA**: `docs/base-standards.md`, `ai-specs/` y `openspec/`. Indican a los agentes cómo comportarse, planificar, documentar y programar.

## Reglas generales

- Escribí en español, con el mismo tono y formato que los documentos existentes.
- No dupliques contenido: enlazá la fuente única (`docs/base-standards.md`, `docs/content-model.md`).
- Las rutas se escriben relativas a la raíz del repo (`docs/frontend-standards.md`).

## Documentación técnica

Antes de cada commit o push, o cuando te pidan documentar un cambio, revisá qué documentación hay que actualizar.

Proceso:

1. Revisá los cambios recientes: `git status` y `git diff` si no están commiteados, o `git show <commit>` y, después de `git fetch`, `git diff origin/main...HEAD` si ya lo están.
2. Identificá qué archivos se ven afectados. Referencia rápida:

   | Cambio | Actualizar |
   |---|---|
   | Secciones, anclas, tarjetas, categorías o fuentes del contenido | `docs/content-model.md` y, si corresponde, `README.md` |
   | Cantidad de certificados | `.certificate-count` en `index.html`, `docs/content-model.md` y `README.md` |
   | CV (`downloads/Adrian-Toso-CV.pdf`) | Textos del inicio y de la sección del CV en `index.html`, `docs/content-model.md` §7, `README.md` y, si cambia el nombre, todo lo que indica `docs/content-model.md` §7 |
   | Archivo nuevo que el sitio necesita | `SITE_FILES` en `scripts/package-site.mjs`, `docs/frontend-standards.md` (estructura) y `README.md` |
   | Convenciones de HTML, CSS o JS, breakpoints o tokens | `docs/frontend-standards.md` |
   | Forma de previsualizar, verificar o publicar | `docs/development_guide.md` y `README.md` |
   | Pasos obligatorios de las tareas | `docs/openspec-tasks-mandatory-steps.md` y `openspec/config.yaml` |
   | Reglas generales, idioma o harness | `docs/base-standards.md` y después `node ai-specs/scripts/sync-agent-files.mjs` |
   | Agentes o skills | `ai-specs/` y después `node ai-specs/scripts/sync-agent-files.mjs` |
   | Skill o agente que queda solo en `.claude/` o `.cursor/` | Su motivo en `ai-specs/external-entries.json` |
   | Versión de OpenSpec | `docs/development_guide.md` §1 y §5, `docs/base-standards.md` §7 y `ai-specs/specboot-instructions.md` |

3. Actualizá cada archivo afectado y mantené la coherencia con el resto.
4. Verificá que el formato y los enlaces sean correctos y que todos los cambios queden reflejados con exactitud. Cada afirmación sobre el sitio (ids, conteos, clases, medidas) tiene que coincidir con el código.
5. Informá qué archivos cambiaste y qué cambió en cada uno.

## Specs de IA

Esta regla obliga al agente a:

- Aprender de las correcciones, sugerencias y preferencias del usuario durante la sesión.
- Detectar oportunidades para mejorar las reglas existentes a partir de ese aprendizaje.
- Mantener la asistencia alineada con las necesidades del proyecto.

Aplica después de cualquier interacción en la que el usuario dé feedback explícito o implícito. **El agente debe analizar activamente cada interacción en busca de aprendizajes, no esperar a que se lo pidan.** Toda modificación de reglas se propone y se aplica solo con la aprobación del usuario.

### Errores que el agente debe evitar

- **Saltear la aprobación**: modificar reglas sin que el usuario las revise y apruebe.
- **Propuestas sin vínculo**: proponer cambios sin conectarlos con el feedback que los origina.
- **Modificaciones imprecisas**: no indicar exactamente qué regla o sección cambia.
- **Feedback ignorado**: no iniciar el proceso cuando el usuario da feedback relevante.
- **Exceso de alcance**: cambiar varias reglas no relacionadas o ir más allá del feedback recibido.
- **Cambios sin motivo**: modificar reglas sin un aprendizaje concreto que los justifique.
- **Falta de confirmación**: no avisar al usuario cuando la modificación aprobada ya se aplicó.
- **Copias desincronizadas**: editar `CLAUDE.md`, `AGENTS.md` o `.claude/`/`.cursor/` en lugar de la fuente en `docs/` o `ai-specs/`.
