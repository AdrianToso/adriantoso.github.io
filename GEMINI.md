---
description: Reglas de desarrollo de este proyecto para todos los agentes de IA (Claude, Cursor, Codex, Gemini, etc.). Es la fuente única de verdad.
alwaysApply: true
---

# Estándares base · adriantoso.github.io

> Archivo canónico: `docs/base-standards.md`. `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` y `codex.md` son copias generadas por `node ai-specs/scripts/sync-agent-files.mjs`. Editá solo este archivo y volvé a ejecutar el script.

## 0. Contexto del proyecto

Portafolio profesional de Adrián Toso, publicado en GitHub Pages (`https://adriantoso.github.io/`).

- Sitio estático sin compilación ni dependencias: `index.html`, `styles.css`, `script.js`, `favicon.svg` y `downloads/Adrian-Toso-CV.pdf`.
- No hay backend, base de datos, API, formularios, cookies, analítica ni recursos remotos.
- Contenido, secciones y reglas editoriales: `docs/content-model.md`.
- Previsualización, verificación y publicación: `docs/development_guide.md`.

## 1. Principios

- **Tareas pequeñas, de a una**: avanzá paso a paso y no te adelantes más de un paso.
- **Verificar primero**: antes de cambiar un comportamiento, definí cómo se va a comprobar (escenario de la spec y verificación en el navegador). No hay runner de pruebas: no agregues dependencias, frameworks ni herramientas de compilación sin acordarlo antes.
- **Mejora progresiva**: todo el contenido debe funcionar sin JavaScript. El JavaScript solo agrega comodidad (filtros, sección activa).
- **Accesibilidad y privacidad no se negocian**: ver `docs/frontend-standards.md`.
- **Contenido verídico**: no inventes métricas, empresas, fechas, logros, certificados ni enlaces. Todo dato profesional nuevo necesita una fuente del titular.
- **Nombres claros**: nombres descriptivos para clases, variables y funciones.
- **Cambios incrementales**: preferí cambios chicos y enfocados a modificaciones grandes.
- **Cuestionar supuestos**: cuestioná siempre supuestos e inferencias.
- **Detectar patrones**: señalá el código o marcado repetido.

## 2. Idioma

- **Español** en la documentación (`README.md`, `docs/`, `ai-specs/`), los artefactos de OpenSpec, los reportes, los mensajes de commit y los títulos y descripciones de PR.
- **Contenido visible del sitio**: español rioplatense con voseo ("podés", "escribime"), igual que el texto actual.
- **Inglés** en los identificadores de código: clases CSS, custom properties, variables y funciones de JavaScript.
- **Comentarios de código**: en español.
- **Excepción establecida**: los `id` de las secciones y los valores de `data-filter` y `data-category` están en español porque forman parte de las URL y del contenido (`#experiencia`, `desarrollo`). Mantené esa convención.
- Algunas skills genéricas de `ai-specs/skills/` conservan su texto original en inglés. Lo que producen igual va en español.

## 3. Estándares específicos

- `docs/frontend-standards.md`: HTML, CSS, JavaScript, accesibilidad, rendimiento, privacidad y flujo de Git.
- `docs/content-model.md`: secciones, anclas, estructura de tarjetas, categorías de certificados y reglas editoriales.
- `docs/documentation-standards.md`: mantenimiento de la documentación y de las specs de IA.
- `docs/development_guide.md`: previsualización, verificación y publicación.
- `docs/openspec-tasks-mandatory-steps.md`: pasos obligatorios al crear o ejecutar un `tasks.md` de OpenSpec.

Este proyecto no tiene backend, así que no hay `backend-standards.md`, `api-spec.yml` ni `data-model.md`. No los crees salvo que el proyecto incorpore una API.

## 4. Skills del proyecto

- Las skills viven en `ai-specs/skills/`.
- Cuando un pedido coincide con una skill, cargá y seguí su `SKILL.md` antes de continuar.
- Cargá también los archivos de referencia de la skill (por ejemplo, `references/*.md`) cuando la skill los pida.
- Las skills `openspec-*` y los comandos `/opsx:*` los genera OpenSpec en `.claude/` y `.cursor/`. Se actualizan con `openspec update`, no se editan a mano.
- **Skills originales en inglés** (`code-auditing`, `using-git-worktrees`, `writing-skills`): si contradicen estas reglas, prevalecen estas reglas. En particular:
  - Las skills nuevas del proyecto van en `ai-specs/skills/<skill>/` y se sincronizan (no en `~/.claude/skills`).
  - No se recomiendan ni agregan dependencias (sección 1).
  - Los reportes de auditoría o revisión van en `openspec/changes/<cambio>/reports/` o, si no hay un cambio activo, en `docs/agent_outputs/<skill>/`. Nunca en la raíz del proyecto.
  - `using-git-worktrees`: después de crear el worktree, y antes de la verificación base o de cualquier `/opsx:*`, seguí el apartado "Worktrees" de `docs/development_guide.md` §5. Hay que confirmar que el worktree incluye tu `main` local y crear `feature/<cambio>`. Si al worktree le faltan `openspec/config.yaml` o `scripts/package-site.mjs`, no sigas y avisale al usuario.

## 5. Modelo para planificar

- Los flujos de planificación (`enrich-us`, `openspec-propose`, `openspec-explore`) deben correr con Opus y esfuerzo alto. Si la sesión usa otro modelo o esfuerzo, avisá al usuario al comenzar y sugerí cambiarlo con `/model`.
- Al terminar la planificación, sugerí volver a Sonnet con esfuerzo medio para implementar (`/opsx:apply`), verificar y commitear.
- El subagente `frontend-developer` usa Sonnet por diseño, igual que en Specboot. Es un apoyo para el plan detallado de frontend, no reemplaza a la planificación principal con Opus.
- En ningún caso modifiques `.claude/settings.json` por tu cuenta.

## 6. Fuente canónica y copias para agentes

- **Fuente canónica**: `ai-specs/` para agentes y skills, y este archivo para las reglas.
- **Copias en lugar de symlinks**: este repo se trabaja en Windows sin symlinks. `node ai-specs/scripts/sync-agent-files.mjs` genera:
  - `.claude/skills/<skill>/` y `.cursor/skills/<skill>/` desde `ai-specs/skills/<skill>/`.
  - `.claude/agents/<agente>.md` y `.cursor/agents/<agente>.md` desde `ai-specs/agents/`.
  - `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` y `codex.md` desde este archivo.
- **Sin enlaces**: no crees symlinks, junctions ni hardlinks para las fuentes, las copias ni sus carpetas, aunque Specboot original use symlinks y Windows permita junctions sin permisos de administrador. A través de un enlace, la "copia" es la fuente. El script corta si encuentra uno en las fuentes o en sus archivos de control, y lo informa como conflicto en las copias y las entradas externas (detalle en la skill `sync-agent-files`).
- **Nunca edites las copias**: editá la fuente y ejecutá el script. El script guarda el hash de cada copia en `ai-specs/sync-manifest.json`. Si alguien edita una copia, la informa como conflicto y no la pisa sin `--force`: el cambio se traslada a la fuente.
- **Después de cada cambio** en `ai-specs/` o en este archivo (crear, editar, renombrar, mover o borrar), ejecutá el script.
- **Control de cierre**: un cambio no está completo si `node ai-specs/scripts/sync-agent-files.mjs --check` falla. Falla, por ejemplo, con:
  - Copias faltantes, desactualizadas, sobrantes o editadas a mano.
  - Skills o agentes creados directamente en `.claude/` o `.cursor/`, sin fuente en `ai-specs/` y sin su motivo registrado en `ai-specs/external-entries.json`. Las skills `openspec-*` y los comandos `opsx` de OpenSpec son la excepción.
- **Personalización externa**: si aparece personalización fuera de `ai-specs/`, evaluá moverla ahí y generarla con el script (skill `sync-agent-files`).

## 7. Cambios después de `apply` y antes de `archive`

Si llega un pedido de corrección o cambio después de `/opsx:apply` y antes de `/opsx:archive`, tratalo primero como una actualización de la spec, no como un arreglo rápido. La documentación es la fuente de verdad.

Orden obligatorio:

1. Actualizá los artefactos afectados del cambio (propuesta, specs, escenarios y `tasks.md`). No agregues tareas como "bugfix": integralas en la sección que corresponda de `tasks.md`, como si fueran parte del plan inicial, y actualizá `design.md` si cambia el diseño.
2. Si hace falta regenerar o completar artefactos, hacelo antes de programar:
   - **Modificar un artefacto existente** (el caso habitual después de `apply`): editalo siguiendo `openspec instructions <artefacto> --change <cambio>`, revisá los artefactos que dependen de él (sobre todo `tasks.md`) y comprobá con `openspec status --change <cambio>` y `openspec validate <cambio>`.
   - **Completar artefactos que faltan**, en el perfil `core` (el instalado): `/opsx:propose <cambio>` con el nombre del cambio existente, eligiendo continuarlo. Solo crea los que faltan; no modifica los existentes.
   - **Perfil ampliado**: `/opsx:continue` o `/opsx:ff` para completar los que faltan.
   - Si `/opsx:apply` sugiere `/opsx:continue` u `openspec-continue-change` y no existen, usá el procedimiento del perfil `core`.
3. Implementá recién cuando los artefactos reflejen el pedido.
4. Volvé a verificar contra los artefactos actualizados antes de archivar.

## 8. Publicación y datos personales

- El sitio se publica con `.github/workflows/pages.yml`, que usa `scripts/package-site.mjs` para copiar a `_site/` solo una lista explícita de archivos.
- Si agregás un archivo que el sitio necesita, sumalo a `SITE_FILES` en `scripts/package-site.mjs`. La lista enumera archivos, no carpetas.
- Esa protección solo funciona si GitHub Pages publica con Actions. Antes de hacer push o merge a `main`, `gh api 'repos/{owner}/{repo}/pages' --jq .build_type` tiene que devolver `workflow`. Escribilo con las comillas: sin ellas, PowerShell no lo ejecuta.
  - Si devuelve otra cosa (`legacy`) o el comando falla (error, 404, `gh` sin autenticar), no hagas push ni recomiendes el merge, y avisale al usuario (ver `docs/development_guide.md` §4).
- Nunca publiques `docs/`, `ai-specs/`, `openspec/`, `.claude/`, `.cursor/`, `.github/`, `scripts/` ni los archivos raíz de agentes (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `codex.md`).
- No agregues datos personales sensibles (DNI, domicilio, teléfono, fecha de nacimiento, datos de referencias). No reemplaces `downloads/Adrian-Toso-CV.pdf` por el CV original sin revisar su contenido.
- No hagas `push`, no abras PR y no cambies la configuración de GitHub sin un pedido explícito del usuario (por ejemplo, `/commit`).
