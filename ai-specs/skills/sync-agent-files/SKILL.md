---
name: sync-agent-files
description: Sincronizar las copias de skills, agentes y reglas para cada herramienta (.claude, .cursor, CLAUDE.md, AGENTS.md…) después de crear, editar, renombrar o borrar algo en ai-specs/ o en docs/base-standards.md. Reemplaza a sync-agent-symlinks porque este repo no usa symlinks.
author: LIDR.co (adaptada para adriantoso.github.io)
version: 1.5.0
---

# Skill sync-agent-files

Mantiene las copias para cada agente alineadas con las fuentes canónicas. En Specboot original son symlinks; acá son copias porque el repo se trabaja en Windows sin symlinks.

## Fuentes y copias

| Fuente canónica | Copias generadas |
|---|---|
| `ai-specs/skills/<skill>/` (con `SKILL.md`) | `.claude/skills/<skill>/`, `.cursor/skills/<skill>/` |
| `ai-specs/agents/<agente>.md` | `.claude/agents/<agente>.md`, `.cursor/agents/<agente>.md` |
| `docs/base-standards.md` | `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `codex.md` |

- El script registra en `ai-specs/sync-manifest.json` cada copia que administra, con el hash de su contenido. Así distingue si cambió la fuente o si alguien editó la copia.
- **Archivos ignorados**: no copia lo que las reglas de git ignoran (`Thumbs.db`, `*.log`, `node_modules/`, etc.), aunque alguien lo haya versionado con `git add -f`. Tampoco lo cuenta como extra dentro de una copia. Así usa lo mismo que va a ver CI.
- **Git**: solo se usa si la raíz del repo es la del proyecto. Si git no está instalado, el proyecto no es un repo o está dentro de otro repo, el script avisa y copia todo lo que hay en disco. Cualquier otro error de git (por ejemplo, `dubious ownership`) corta la ejecución con código 2.
- **Enlaces** (symlinks, junctions de Windows y hardlinks): el script nunca lee, escribe ni borra a través de uno.
  - **En las fuentes** (`ai-specs/`, `ai-specs/skills/`, `ai-specs/agents/`, cualquier skill o archivo dentro de ellas, `docs/`) o **en los archivos de control** (`docs/base-standards.md`, `ai-specs/sync-manifest.json`, `ai-specs/external-entries.json`, que además no pueden ser hardlinks): el script corta con código 2 antes de tocar nada. Los enlaces dentro de carpetas que git ignora (por ejemplo, `node_modules/`) no cuentan.
  - **En `.claude/`, `.cursor/` o sus carpetas `skills/` y `agents/`**: conflicto que `--force` no toca, porque ahí vive contenido que el script no administra (OpenSpec, settings, commands). Se resuelve a mano.
  - **En una copia, en la carpeta de una skill copiada o dentro de ella**, o una copia que es un **hardlink**: conflicto, aunque el enlace apunte a la fuente y "coincida". `--force` quita solo el enlace (sin tocar su destino) y escribe la copia.
  - **Entradas externas que son enlaces** (o que tienen enlaces adentro): conflicto, aunque estén registradas.
  - Fuera de esas rutas (por ejemplo, `.claude/commands/` o `.claude/settings.json`) el script no revisa enlaces.
- **Idioma de git**: el script ejecuta git con `LC_ALL=C`, así que reconoce sus mensajes aunque git esté traducido.
- **Skills válidas**: una carpeta de `ai-specs/skills/` es una skill solo si tiene un archivo llamado exactamente `SKILL.md`.
- **No toca** lo que no administra: las skills `openspec-*` y los comandos `opsx` que genera OpenSpec, ni las entradas creadas a mano en `.claude/` o `.cursor/`.
- **Registro de externas**: las entradas creadas a mano se aceptan solo si están en `ai-specs/external-entries.json` con su motivo (`"ruta": "motivo"`).
- **Códigos de salida**: 0 si todo está bien, 1 si hay diferencias o conflictos y 2 ante un error (por ejemplo, un argumento desconocido, un registro de externas con formato inválido o un error de git).

## Límites conocidos

Casos poco comunes que el script no cubre. Evitalos:

- **Hardlinks dentro de las skills fuente**: no se detectan.
- **Nombres ignorados** (`.DS_Store`, `Thumbs.db`, `desktop.ini`, `.git`): no se copian ni se revisan, aunque sean enlaces. Una skill que sea un repo o submódulo se copia sin su `.git`.
- **Cambio de archivo a carpeta** (o al revés) con el mismo nombre en una fuente: la primera sincronización puede informar un conflicto; la segunda queda bien.
- **Nombres con caracteres de control** (por ejemplo, saltos de línea): no se registran en el manifiesto. Además, Windows no los admite.
- **Enlaces fuera de las rutas que revisa** (`.claude/commands/`, `.claude/settings.json`, `.cursor/rules/`): no se revisan.

## Reglas

- `ai-specs/` y `docs/base-standards.md` son siempre la fuente. Nunca edites las copias.
- No borres ni sobrescribas copias editadas a mano ni archivos no administrados sin un pedido explícito (`--force`).
- No dejes el repo con `--check` fallando.

## Flujo

### Paso 1: diagnosticar

```bash
node ai-specs/scripts/sync-agent-files.mjs --check
```

Clasificación del resultado:

| Categoría | Qué significa | ¿Falla `--check`? |
|---|---|---|
| **Faltan** | Skills, agentes o reglas nuevas sin copiar | Sí |
| **Desactualizados (cambió la fuente)** | La fuente cambió y la copia está intacta | Sí |
| **Sobrantes** | Copias intactas de fuentes que ya no existen (renombradas o borradas) | Sí |
| **Conflictos** | Copias editadas a mano; archivos no administrados que difieren; archivos extra dentro de una skill administrada o restos en la copia de una skill borrada; enlaces, junctions, hardlinks o archivos donde debería haber una copia o una carpeta real; entradas externas que son enlaces; `skill.md` con otras mayúsculas; rutas que git tiene registradas con otras mayúsculas | Sí |
| **Enlaces o hardlinks que --force reemplazaría** | Solo aparece con `--check --force` | Sí |
| **Manifiesto desactualizado** | El registro no coincide con las fuentes, o no se puede leer (por ejemplo, por un conflicto de merge) | Sí |
| **Entradas externas sin motivo registrado** | Skills o agentes en `.claude/` o `.cursor/` sin fuente en `ai-specs/` y sin entrada en `ai-specs/external-entries.json` | Sí |
| **Entradas externas registradas** | Las mismas, pero con su motivo en el registro | No, se informan |
| **Carpetas sin `SKILL.md`** | Carpetas de `ai-specs/skills/` que no son skills (por ejemplo, borradores) | No, se informan |
| **Carpetas sin archivos versionables** | Carpetas de `.claude/` o `.cursor/` vacías o con solo archivos ignorados | No, se informan (se pueden borrar) |
| **Skills generadas por OpenSpec** | `openspec-*` | No, se cuentan |

Antes de sincronizar, si algo figura como desactualizado y dudás de su origen, revisá `git diff -- <copia>` y `git log -1 -- <copia>`.

### Paso 2: resolver los conflictos y las entradas externas

- **Copia editada a mano**: trasladá el cambio a la fuente en `ai-specs/` o `docs/`. Después descartá la edición con `--force` o restaurando la copia.
- **Archivo extra en una skill copiada**: movelo a `ai-specs/skills/<skill>/`.
- **Archivo no administrado que difiere**: revisalo. Usá `--force` solo si el usuario confirma que se puede sobrescribir.
- **Enlace, junction, hardlink o archivo donde debería haber una copia o una carpeta de skill** (por ejemplo, el layout de Specboot: symlinks reales, o archivos de texto si se clonó en Windows sin symlinks): borralo, o usá `--force` para que el script quite el enlace (sin tocar su destino) y escriba la copia.
- **`.claude/`, `.cursor/` o sus `skills/`/`agents/` como enlace**: resolvelo a mano. Reemplazá el enlace por una carpeta real que conserve lo que había adentro (OpenSpec, settings, commands) y volvé a sincronizar.
- **Error por enlaces en las fuentes**: reemplazá cada enlace por la carpeta o el archivo real y volvé a ejecutar.
- **Restos en la copia de una skill borrada**: borralos, o movelos a `ai-specs/` si forman parte de otra skill.
- **`skill.md` con otras mayúsculas**: renombralo a `SKILL.md` (en Windows, con el procedimiento del escenario E).
- **Mayúsculas registradas en git**: seguí el escenario E.
- **Entrada externa sin motivo**: evaluá con el usuario si conviene moverla a `ai-specs/` (ver `docs/base-standards.md` §6). Si queda donde está, registrala en `ai-specs/external-entries.json` con su motivo:

  ```json
  { "entries": { ".claude/skills/mi-skill": "Solo aplica a Claude Code porque…" } }
  ```

### Paso 3: sincronizar

```bash
node ai-specs/scripts/sync-agent-files.mjs
```

### Paso 4: verificar

```bash
node ai-specs/scripts/sync-agent-files.mjs --check
```

Tiene que terminar con "Copias sincronizadas". Confirmá también que las entradas externas y las skills de OpenSpec sigan intactas, y prestá atención a los avisos por stderr (git no disponible, manifiesto ilegible). El workflow `.github/workflows/harness.yml` hace la misma verificación en CI.

### Paso 5: informar

- Cantidad de skills, agentes y archivos administrados.
- Qué se creó, actualizó o eliminó.
- Conflictos resueltos o pendientes.
- Entradas externas encontradas y qué se decidió con cada una.
- Bloqueos que queden.

## Escenarios

### A: skill nueva en `ai-specs/skills/`

Se crean `.claude/skills/<skill>/` y `.cursor/skills/<skill>/`, y se actualiza el manifiesto.

### B: skill renombrada o borrada

Se eliminan las copias intactas del nombre anterior y los directorios que queden vacíos. Si una copia tenía ediciones a mano, se conserva y se informa como conflicto. Si en la copia vieja hay archivos que el script no generó, se informan en esa misma ejecución. Las skills que no administra el script quedan intactas y se informan. Si el cambio de nombre es solo de mayúsculas, seguí el escenario E.

### C: cambio en `docs/base-standards.md`

Se actualizan `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` y `codex.md`.

### D: alguien editó una copia

`--check` falla con un conflicto. Se traslada el cambio a la fuente y se vuelve a sincronizar.

### E: renombre que solo cambia mayúsculas (Windows)

Con `core.ignorecase=true`, git no registra solo este tipo de renombre. En el disco queda bien, pero en Linux (CI) fallaría. El script lo detecta y lo informa como conflicto. Procedimiento verificado, en Git Bash.

**Skill** (por ejemplo, de `explain` a `Explain`):

```bash
git mv ai-specs/skills/explain ai-specs/skills/tmp-renombre
git mv ai-specs/skills/tmp-renombre ai-specs/skills/Explain
node ai-specs/scripts/sync-agent-files.mjs            # sale con 1: todavía informa las copias con el nombre viejo en git
git rm -r -q --cached .claude/skills/explain .cursor/skills/explain
git add .claude/skills .cursor/skills ai-specs/sync-manifest.json
node ai-specs/scripts/sync-agent-files.mjs --check    # tiene que pasar
git ls-files | grep -i "skills/explain/"               # solo rutas con Explain/
```

**Agente** (por ejemplo, de `frontend-developer.md` a `Frontend-Developer.md`):

```bash
git mv ai-specs/agents/frontend-developer.md ai-specs/agents/tmp-renombre.md
git mv ai-specs/agents/tmp-renombre.md ai-specs/agents/Frontend-Developer.md
node ai-specs/scripts/sync-agent-files.mjs            # sale con 1: todavía informa las copias con el nombre viejo en git
git rm -q --cached .claude/agents/frontend-developer.md .cursor/agents/frontend-developer.md
git add .claude/agents .cursor/agents ai-specs/sync-manifest.json
node ai-specs/scripts/sync-agent-files.mjs --check
git ls-files | grep -i "frontend-developer.md"         # exactamente tres rutas, todas con el nombre nuevo
```

Si en las copias viejas quedaron archivos ignorados por git (por ejemplo, `debug.log`), borralos antes del `--check` final con `git clean -fdX -- <copias viejas>`. Así la carpeta no queda como entrada externa.

### F: conflicto de merge en `ai-specs/sync-manifest.json`

Pasa cuando dos ramas agregan skills. Quedate con cualquiera de las dos versiones (`git checkout --ours ai-specs/sync-manifest.json`), ejecutá el script para regenerarlo y verificá con `--check`. Si el archivo quedó con marcas de conflicto, el script avisa, lo regenera sin borrar ni pisar copias y `--check` falla hasta que se regenere.

## Señales de alerta

Nunca:

- Edites `CLAUDE.md`, `AGENTS.md` ni las copias de `.claude/` o `.cursor/`.
- Uses `--force` sin revisar qué se descarta.
- Borres a mano skills de OpenSpec (`openspec-*`): se regeneran con `openspec update`.
- Commitees con `--check` fallando.
