---
name: sync-agent-files
description: Sincronizar las copias de skills, agentes y reglas para cada herramienta (.claude, .cursor, CLAUDE.md, AGENTS.md…) después de crear, editar, renombrar o borrar algo en ai-specs/ o en docs/base-standards.md. Reemplaza a sync-agent-symlinks porque este repo no usa symlinks.
author: LIDR.co (adaptada para adriantoso.github.io)
version: 1.1.0
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
- **Git**: solo se usa si la raíz del repo es la del proyecto. Si git no está disponible o el proyecto está dentro de otro repo, el script avisa y copia todo lo que hay en disco.
- **Skills válidas**: una carpeta de `ai-specs/skills/` es una skill solo si tiene un archivo llamado exactamente `SKILL.md`.
- **No toca** lo que no administra: las skills `openspec-*` y los comandos `opsx` que genera OpenSpec, ni las entradas creadas a mano en `.claude/` o `.cursor/`.
- **Registro de externas**: las entradas creadas a mano se aceptan solo si están en `ai-specs/external-entries.json` con su motivo (`"ruta": "motivo"`).
- **Códigos de salida**: 0 si todo está bien, 1 si hay diferencias o conflictos y 2 ante un error (por ejemplo, un argumento desconocido o un registro con JSON inválido).

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
| **Conflictos** | Copias editadas a mano; archivos no administrados que difieren; archivos extra dentro de una skill administrada; un archivo donde debería haber una carpeta (o al revés); `skill.md` con otras mayúsculas; rutas que git tiene registradas con otras mayúsculas | Sí |
| **Manifiesto desactualizado** | El registro no coincide con las fuentes, o no se puede leer (por ejemplo, por un conflicto de merge) | Sí |
| **Entradas externas sin motivo registrado** | Skills o agentes en `.claude/` o `.cursor/` sin fuente en `ai-specs/` y sin entrada en `ai-specs/external-entries.json` | Sí |
| **Entradas externas registradas** | Las mismas, pero con su motivo en el registro | No, se informan |
| **Carpetas sin `SKILL.md`** | Carpetas de `ai-specs/skills/` que no son skills (por ejemplo, borradores) | No, se informan |
| **Skills generadas por OpenSpec** | `openspec-*` | No, se cuentan |

Antes de sincronizar, si algo figura como desactualizado y dudás de su origen, revisá `git diff -- <copia>` y `git log -1 -- <copia>`.

### Paso 2: resolver los conflictos y las entradas externas

- **Copia editada a mano**: trasladá el cambio a la fuente en `ai-specs/` o `docs/`. Después descartá la edición con `--force` o restaurando la copia.
- **Archivo extra en una skill copiada**: movelo a `ai-specs/skills/<skill>/`.
- **Archivo no administrado que difiere**: revisalo. Usá `--force` solo si el usuario confirma que se puede sobrescribir.
- **Archivo donde debería haber una carpeta** (por ejemplo, un symlink de Specboot clonado en Windows como archivo de texto): borralo, o usá `--force` para que el script lo reemplace.
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

Se eliminan las copias intactas del nombre anterior y los directorios que queden vacíos. Si una copia tenía ediciones a mano, se conserva y se informa como conflicto. Las skills que no administra el script quedan intactas y se informan. Si el cambio de nombre es solo de mayúsculas, seguí el escenario E.

### C: cambio en `docs/base-standards.md`

Se actualizan `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` y `codex.md`.

### D: alguien editó una copia

`--check` falla con un conflicto. Se traslada el cambio a la fuente y se vuelve a sincronizar.

### E: renombre que solo cambia mayúsculas (Windows)

Con `core.ignorecase=true`, git no registra solo este tipo de renombre. En el disco queda bien, pero en Linux (CI) fallaría. El script lo detecta y lo informa como conflicto. Procedimiento verificado, por ejemplo para pasar `explain` a `Explain`:

```bash
git mv ai-specs/skills/explain ai-specs/skills/tmp-renombre
git mv ai-specs/skills/tmp-renombre ai-specs/skills/Explain
node ai-specs/scripts/sync-agent-files.mjs
git rm -r -q --cached .claude/skills/explain .cursor/skills/explain
git add .claude/skills .cursor/skills ai-specs/sync-manifest.json
node ai-specs/scripts/sync-agent-files.mjs --check
git ls-files | grep -i "skills/explain/"   # solo tienen que aparecer rutas con el nombre nuevo
```

Para un agente, cambiá las rutas por `ai-specs/agents/<archivo>.md`, `.claude/agents/<archivo>.md` y `.cursor/agents/<archivo>.md`.

### F: conflicto de merge en `ai-specs/sync-manifest.json`

Pasa cuando dos ramas agregan skills. Quedate con cualquiera de las dos versiones (`git checkout --ours ai-specs/sync-manifest.json`), ejecutá el script para regenerarlo y verificá con `--check`. Si el archivo quedó con marcas de conflicto, el script avisa, lo regenera sin borrar ni pisar copias y `--check` falla hasta que se regenere.

## Señales de alerta

Nunca:

- Edites `CLAUDE.md`, `AGENTS.md` ni las copias de `.claude/` o `.cursor/`.
- Uses `--force` sin revisar qué se descarta.
- Borres a mano skills de OpenSpec (`openspec-*`): se regeneran con `openspec update`.
- Commitees con `--check` fallando.
