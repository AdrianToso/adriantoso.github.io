---
name: commit
description: Crear commits enfocados y pull requests según las convenciones del repositorio. Usar cuando el usuario pide commitear, subir cambios, hacer push o abrir un PR.
author: LIDR.co (adaptada para adriantoso.github.io)
version: 1.2.0
---

# Skill commit

## Rol

Sos experto en control de versiones. Creás commits y pull requests claros, que siguen las convenciones del proyecto y facilitan la revisión y la trazabilidad.

## Argumentos

`$ARGUMENTS` es **opcional** y puede contener:

- **Nada**: incluir en el commit todos los cambios relevantes y abrir un solo PR.
- **Identificadores de cambio**: nombres de cambios de OpenSpec, claves de ticket (por ejemplo, de Jira: `SCRUM-123`), nombres de rama o etiquetas cortas. Se preparan y se incluyen en el PR **solo** los cambios de esos identificadores; el resto queda sin preparar.
- **Modo solo descripción**: si el usuario pide **explícitamente** no tocar el repositorio ("solo el mensaje", "solo la descripción", "no toques git", "dry run"), no se modifica nada. Solo se define el alcance y se propone el mensaje (ver el paso 0).
  - "Sin PR" por sí solo **no** activa este modo. Si el usuario pidió commitear (o hacer push) sin PR, commiteá y no abras el PR. Ante la duda, preguntá.

## Objetivo

1. Crear **un commit completo** que describa con precisión los cambios.
2. Hacer **push** de la rama y **crear o actualizar el PR**. Si se commitea directamente en `main`, no hay PR: se sigue la publicación.
3. Si hay argumentos, incluir **solo** los cambios de esos identificadores.

## Control de publicación

Todo push a `main` publica el sitio, pero la lista explícita de `scripts/package-site.mjs` solo protege si GitHub Pages publica con Actions. Para comprobarlo (con comillas, que funcionan en Bash y en PowerShell):

```bash
gh api 'repos/{owner}/{repo}/pages' --jq .build_type
```

- `workflow`: se puede hacer push o merge a `main`.
- `legacy`, cualquier otro valor, o un comando que falle (error, 404, `gh` sin autenticar): **no hagas push a `main` ni recomiendes el merge**. Avisale al usuario que primero cambie **Settings → Pages → Source** a **GitHub Actions**, porque la publicación desde la rama publicaría todo el repo, incluido el harness.

## Proceso

### 0. Modo solo descripción (verificar primero)

Si el usuario pidió explícitamente no tocar el repositorio:

- **No modifiques el repositorio de ninguna forma**: nada de `git add`, `git commit`, `git push`, `gh pr create`, crear o cambiar de rama, ni ejecutar scripts que escriban archivos.
- Ejecutá solo lo que es de lectura:
  - **Paso 1**: revisar el estado. Si estás en `main`, indicá qué rama habría que crear, pero no la crees.
  - **Paso 3**: solo las comprobaciones de lectura (`node ai-specs/scripts/sync-agent-files.mjs --check`, revisión del diff). Informá como pendiente lo que requiera escribir archivos: sincronizar las copias, `node scripts/package-site.mjs` o actualizar documentación.
  - **Paso 4**: definir el alcance y listar los archivos (y fragmentos, si es parcial) que se prepararían, sin prepararlos.
  - **Paso 5**: escribir el mensaje completo.
- Entregá la lista de archivos, los pendientes y el mensaje propuesto en un bloque copiable. Terminá ahí.

### 1. Revisar el estado

- Ejecutar `git status` y `git diff` (y `git diff --staged` si hace falta).
- Identificar la rama actual. Si estás en `main`, crear una rama `feature/<cambio>` antes de commitear, salvo que el usuario pida explícitamente commitear en `main`.

### 2. Controlar la publicación (si el push va a `main`)

Si vas a commitear directamente en `main`, ejecutá el control de publicación **antes** de commitear. Si no da `workflow`, no commitees en `main`: proponé una rama `feature/<cambio>` y avisale al usuario.

### 3. Verificar y completar antes de preparar

Estas comprobaciones miran el árbol de trabajo, así que hacelas antes de preparar los archivos:

- **Documentación**: revisá qué documentación hay que actualizar (skill `update-docs`) y actualizala.
- **Harness**: si hay cambios en `docs/base-standards.md`, `ai-specs/`, `.claude/`, `.cursor/`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` o `codex.md`, `node ai-specs/scripts/sync-agent-files.mjs --check` tiene que pasar.
  - Si informa copias faltantes, desactualizadas o sobrantes, ejecutá el script sin `--check`.
  - Si informa conflictos (copias editadas a mano) o entradas externas sin motivo, resolvelos antes de seguir (skill `sync-agent-files`).
- **Sitio**: si hay cambios en el sitio, `node scripts/package-site.mjs` tiene que terminar sin errores.
- **Datos sensibles**: revisá el diff en busca de datos personales sensibles (ver `docs/base-standards.md` §8).

### 4. Definir el alcance y preparar

- **Sin argumentos**: preparar todos los cambios relevantes. Excluir secretos, `_site/`, `.claude/settings.local.json` y archivos locales.
- **Con argumentos**: asociar cada argumento con sus cambios (por ruta, clave de ticket o nombre en la rama, o contexto del diff) y preparar solo esos archivos o fragmentos.
  - **Fragmentos**: si un archivo mezcla cambios relacionados y ajenos, prepará solo los que corresponden. `git add -p` es interactivo y no funciona en la terminal de un agente. Usá este equivalente no interactivo:
    1. Guardá `git diff -- <archivo>` en un parche **fuera del repo** (en un directorio temporal).
    2. Editá el parche. Quitá los fragmentos ajenos. Si un fragmento mezcla los dos cambios, borrá las líneas `+` ajenas y convertí las `-` ajenas en contexto (reemplazá el `-` por un espacio).
    3. Aplicalo con `git apply --cached --recount <parche>`, confirmá con `git diff --staged` y borrá el parche.
  - Si ningún cambio coincide con los argumentos, informarlo y no commitear.
- **Archivos generados**: prepará también lo que generaron el paso 3 y que corresponde al alcance: la documentación actualizada, las copias de `.claude/` y `.cursor/`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `codex.md` y `ai-specs/sync-manifest.json`. Confirmalo con `git diff --staged`.
- **Límite de los controles**: en un commit con argumentos, los controles locales validan el árbol de trabajo completo. Lo que valida exactamente el commit son los checks del PR.

### 5. Mensaje del commit

- **En español** (`docs/base-standards.md`), con el estilo del historial: verbo en infinitivo y descripción concreta ("Agregar certificados filtrables y descarga del CV profesional").
- **Asunto**: una línea corta. Opcionalmente, empezá con el nombre del cambio de OpenSpec o la clave del ticket (`SCRUM-123: Agregar…`).
- **Cuerpo** (si hace falta): viñetas con qué cambió y por qué. Citá las claves de ticket que correspondan.
- Agregar al final las líneas de atribución que indique el entorno, si corresponde.

### 6. Commit y push

- Crear el commit.
- `git push -u origin <rama>` la primera vez y `git push` las siguientes. Si el push va a `main`, el control de publicación tiene que haber dado `workflow`.

### 7. Pull request o publicación

- **Rama de trabajo**: usar **GitHub CLI (`gh`)** para crear o actualizar el PR.
  - **Título**: en español y alineado con el commit. Si hay ticket, incluí su clave (`[SCRUM-123] Agregar…`).
  - **Descripción**: resumen, enlace al ticket si existe, escenarios verificados, capturas si cambió la interfaz y pendientes.
    - Los reportes de verificación están en `openspec/changes/<cambio>/reports/`, o en `openspec/changes/archive/<fecha>-<cambio>/reports/` si el cambio ya se archivó. Si no hay reportes, indicalo como pendiente.
  - **Estado para el merge**: ejecutá el control de publicación y reflejalo en la descripción y en el resumen.
    - Con `workflow`: el PR queda listo para revisar cuando pasen los checks **Armar y validar** y **Copias sincronizadas** (`gh pr checks`), y al hacer merge en `main` el workflow `pages.yml` publica el sitio.
    - Con cualquier otro resultado: agregá en los pendientes "No hacer merge hasta cambiar Settings → Pages → Source a GitHub Actions: con la publicación desde la rama se publicaría todo el repo, harness incluido". No digas que `pages.yml` publica.
- **Commit directo en `main`**: no se crea PR. Seguí la publicación del commit que acabás de subir:
  1. `gh run list --workflow pages.yml --commit <sha>` (con el sha de `git rev-parse HEAD`). Si todavía no aparece, esperá unos segundos y reintentá.
  2. `gh run watch <id> --exit-status`.
  3. Al terminar, revisá `https://adriantoso.github.io/`.

### 8. Resumen para el usuario

- Qué se commiteó (archivos y alcance).
- Si hubo argumentos, qué cambios se incluyeron y cuáles quedaron sin preparar.
- La URL del PR y su estado para el merge o, si fue directo a `main`, el resultado del workflow de publicación.

## Referencias

- `docs/base-standards.md`: idioma, harness, publicación y datos personales.
- `docs/frontend-standards.md` §9: flujo de Git (ramas, commits y PR).
- `docs/development_guide.md` §4: publicación.

## Notas

- No ejecutes comandos destructivos (`git push --force`, `git reset --hard`) sin un pedido explícito.
- Si hay conflictos o se rechaza el push, informalo y sugerí los próximos pasos (por ejemplo, `git pull --rebase` y volver a hacer push) sin forzar.
- Con argumentos, **solo** se incluyen los cambios de esos identificadores; el resto queda en el árbol de trabajo para otro commit.
