# Guía de desarrollo

## 1. Requisitos

| Herramienta | Para qué | ¿Obligatoria? |
|---|---|---|
| Navegador actualizado | Ver y verificar el sitio | Sí |
| Python 3.7 o superior | Servidor local (`http.server`, con `--directory`) | Para el flujo de specs (paso N); recomendada para previsualizar |
| Node.js 18 o superior | `scripts/package-site.mjs` y `ai-specs/scripts/sync-agent-files.mjs` | Para publicar y para el harness |
| Automatización de navegador (por ejemplo, Playwright MCP) | Pasos obligatorios N y N+1 de `tasks.md` y skill `show-spec-working` | Para el flujo de specs |
| OpenSpec CLI 1.4.0 (`npm install -g @fission-ai/openspec@1.4.0`, Node 20.19 o superior) | Flujo de specs (`/opsx:*`) | Para el flujo de specs |
| GitHub CLI (`gh`) | PR, checks y estado de Pages | Para `/commit` |

El sitio no tiene dependencias: no hay `package.json` ni `node_modules`.

**Versión de OpenSpec**: el harness se adaptó con la 1.4.0. Las versiones nuevas cambian los workflows del perfil `core`: por ejemplo, la 1.13 suma `/opsx:update`, que en Cursor es `/opsx-update`. Antes de actualizar, revisá sus notas de versión. Después de actualizar:

1. Ejecutá `openspec update`.
2. Actualizá la tabla de la sección 5, `docs/base-standards.md` §7 y `ai-specs/specboot-instructions.md`.

### Automatización de navegador (Playwright MCP)

Los agentes necesitan manejar un navegador para ejecutar las verificaciones por su cuenta. Es opcional para ver el sitio, pero sin ella las tareas de verificación quedan sin marcar. Instalación, según la documentación oficial de `microsoft/playwright-mcp`:

- **Claude Code**: `claude mcp add playwright npx @playwright/mcp@latest`
- **Cursor**: Settings → MCP → Add new MCP Server, tipo `command`, con `npx @playwright/mcp@latest`.

Para confirmar que está disponible, buscá herramientas `browser_*` en la sesión (en Claude Code, con `/mcp`).

## 2. Previsualizar

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Abrí `http://127.0.0.1:8000`. También se puede abrir `index.html` directamente, aunque el servidor local se parece más a GitHub Pages.

Para ver exactamente lo que se va a publicar:

```bash
node scripts/package-site.mjs
python -m http.server 8001 --bind 127.0.0.1 --directory _site
```

## 3. Verificar un cambio

El agente ejecuta estas comprobaciones por su cuenta y deja registrados los resultados (ver `docs/openspec-tasks-mandatory-steps.md`). Si tiene disponible automatización de navegador (sección 1), la usa. Si no, informa qué no pudo comprobar y no marca la tarea como terminada.

1. **Escenarios de la spec**: cada escenario del cambio se comprueba en el navegador.
2. **Anchos**: 1920 (breakpoint `min-width:1500px`), 1440, 1024, 768, 390, 360 y 320 px, más un zoom del 200% (o un viewport equivalente de 640 a 720 px). Sin desplazamiento horizontal ni texto cortado.
3. **Sin JavaScript**: todo el contenido es visible, los filtros quedan ocultos y los enlaces y la descarga funcionan.
4. **Teclado**: el enlace para saltar al contenido, el orden de tabulación, el foco visible y la activación de filtros y `details`.
5. **Filtros de certificados**: cada filtro muestra la cantidad correcta, actualiza `aria-pressed` y el contador anuncia el cambio.
6. **Navegación**: la sección activa se marca con `aria-current` al desplazarse.
7. **Consola**: sin errores ni advertencias.
8. **Movimiento reducido e impresión**: emulá `prefers-reduced-motion` y revisá la vista previa de impresión.
9. **Enlaces**: los externos nuevos responden y no piden inicio de sesión; los locales existen. `node scripts/package-site.mjs` falla si falta alguno, si alguno sale de `_site/` o si un `target="_blank"` no tiene `rel="noopener"`.
10. **Harness**: si cambió `docs/base-standards.md` o `ai-specs/`, `node ai-specs/scripts/sync-agent-files.mjs --check` pasa.

**Verificación base** (por ejemplo, al crear un worktree con `using-git-worktrees`): `node scripts/package-site.mjs` y `node ai-specs/scripts/sync-agent-files.mjs --check`. No hay suite de pruebas ni dependencias que instalar.

## 4. Publicar

- La publicación la hace `.github/workflows/pages.yml` en cada push a `main`:
  1. Ejecuta `node scripts/package-site.mjs`, que copia a `_site/` solo los archivos de `SITE_FILES` y valida `index.html`.
  2. Sube `_site/` como artefacto y lo despliega en GitHub Pages.
- En los pull requests solo se construye y valida; no se despliega. Los checks son **Armar y validar** (`pages.yml`) y **Copias sincronizadas** (`harness.yml`).
- **Configuración única**: en GitHub, **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- **Antes de cada push o merge a `main`**, confirmá la configuración. Las comillas son necesarias en PowerShell:

  ```bash
  gh api 'repos/{owner}/{repo}/pages' --jq .build_type   # tiene que devolver "workflow"
  ```

  Si devuelve `legacy`, GitHub publica todo el repo desde la rama, incluidos `docs/` y `ai-specs/`. Si el comando falla (error, 404, `gh` sin autenticar), no se puede confirmar. En los dos casos, no hagas push ni merge hasta resolverlo.
- `.nojekyll` solo sirve para la publicación desde rama. Se conserva por si alguna vez se vuelve a ese modo.
- **Después de cada push**, seguí la ejecución de ese commit y revisá `https://adriantoso.github.io/`:
  1. `gh run list --workflow pages.yml --commit <sha>`, con el sha de `git rev-parse HEAD`. La ejecución puede tardar unos segundos en aparecer.
  2. `gh run watch <id> --exit-status`.

## 5. Harness de IA (Specboot)

- Las reglas están en `docs/base-standards.md`, y los agentes y skills en `ai-specs/`.
- Sincronizá las copias para cada herramienta (skill `sync-agent-files`):

  ```bash
  node ai-specs/scripts/sync-agent-files.mjs          # genera o actualiza
  node ai-specs/scripts/sync-agent-files.mjs --check  # solo verifica (lo usa CI)
  ```

- Flujo de specs con OpenSpec (perfil `core`):

  | Paso | Claude Code | Cursor |
  |---|---|---|
  | Aislar el trabajo en un worktree (opcional, recomendado; limpiarlo al terminar) | skill `using-git-worktrees` | igual |
  | Refinar una idea o historia (opcional) | `/enrich-us <texto o ticket>` | skill `enrich-us` |
  | Explorar alternativas (opcional) | `/opsx:explore` | `/opsx-explore` |
  | Crear el cambio con propuesta, specs, diseño y tareas | `/opsx:propose <idea>` | `/opsx-propose` |
  | Implementar las tareas | `/opsx:apply` | `/opsx-apply` |
  | Demostrar el cambio en el navegador | skill `show-spec-working` ("mostrame…") | igual |
  | Revisión adversarial antes de archivar (en otra sesión o con otro agente) | `/adversarial-review` | skill `adversarial-review` |
  | Consolidar specs sin archivar (opcional) | `/opsx:sync` | `/opsx-sync` |
  | Archivar y consolidar las specs | `/opsx:archive` | `/opsx-archive` |
  | Commit y PR | `/commit` | skill `commit` |

- **Worktrees**: la skill `using-git-worktrees` prefiere la herramienta nativa.
  - En Claude Code, `EnterWorktree` crea el worktree en `.claude/worktrees/<nombre>`, sobre una rama nueva con un nombre que elige la herramienta. La rama parte de `origin/main`, salvo que la configuración `worktree.baseRef` valga `head`. Por eso no incluye los commits locales que todavía no subiste.
  - Antes de tocar archivos en el worktree:
    1. Confirmá que incluye tu `main` local con `git merge-base --is-ancestor main HEAD`. Si no lo incluye y la rama no tiene commits propios, ejecutá `git merge --ff-only main`.
    2. Creá la rama del cambio con `git switch -c feature/<cambio>`.
    3. Ejecutá la verificación base (sección 3).
  - Con el mecanismo manual de git, los worktrees van en `.worktrees/`. Las dos carpetas están en `.gitignore`.
- **Validar la implementación contra los artefactos**: en el perfil `core` no existe `/opsx:verify`. Lo reemplazan los reportes obligatorios de `tasks.md` (`openspec/changes/<cambio>/reports/`), `openspec validate <cambio>` y la revisión adversarial.
- **Modificar o completar artefactos** (ver `docs/base-standards.md` §7):
  - Para cambiar un artefacto existente, editalo siguiendo `openspec instructions <artefacto> --change <cambio>`, revisá los que dependen de él y comprobá con `openspec status --change <cambio>` y `openspec validate <cambio>`.
  - Para crear los que faltan (el caso "blocked" de `/opsx:apply`), usá `/opsx:propose <cambio-existente>` y elegí continuarlo. Solo crea los faltantes.
  - Si `/opsx:apply` sugiere `/opsx:continue`, usá este procedimiento.
- **Perfil ampliado**: los comandos `/opsx:new`, `/opsx:ff`, `/opsx:continue` y `/opsx:verify` lo requieren (`openspec config profile`, y después `openspec update`). Ese cambio es global, así que afecta a todos tus proyectos.
- Después de actualizar OpenSpec, ejecutá `openspec update` para regenerar sus skills y comandos en `.claude/` y `.cursor/`.
