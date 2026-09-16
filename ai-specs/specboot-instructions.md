# Harness de IA: Specboot en adriantoso.github.io

Este repo usa una adaptación de [Specboot](https://lidr.co/ia-devs) (LIDR.co): reglas, agentes y skills compartidos por varios asistentes de código, más el flujo de desarrollo guiado por specs de [OpenSpec](https://github.com/Fission-AI/OpenSpec).

## Estructura

```
docs/                                  # Contexto técnico (fuente única de reglas)
├── base-standards.md                  # Reglas base -> CLAUDE.md, AGENTS.md, GEMINI.md, codex.md
├── frontend-standards.md              # HTML, CSS, JS, accesibilidad, privacidad, Git
├── content-model.md                   # Secciones, tarjetas, categorías y reglas editoriales
├── documentation-standards.md         # Qué documentación actualizar y cuándo
├── development_guide.md               # Previsualizar, verificar y publicar
└── openspec-tasks-mandatory-steps.md  # Pasos obligatorios de tasks.md
ai-specs/
├── agents/                            # frontend-developer, product-strategy-analyst
├── skills/                            # Skills del proyecto (fuente canónica)
├── scripts/sync-agent-files.mjs       # Genera las copias para cada herramienta
├── sync-manifest.json                 # Copias administradas y su hash (generado)
├── external-entries.json              # Skills o agentes que viven solo en .claude/ o .cursor/, con su motivo
└── LICENSE-specboot                   # Licencia MIT de Specboot
openspec/
├── config.yaml                        # Contexto y reglas por artefacto
├── specs/                             # Specs consolidadas
└── changes/                           # Cambios en curso y archivados
.claude/  .cursor/                     # Copias generadas y archivos de OpenSpec
.claude/doc/  .claude/sessions/        # Notas locales de subagentes (ignoradas por git)
.cursor/rules/use-base-rules.mdc       # Regla de Cursor que apunta a base-standards
```

## Skills

| Skill | Uso | Origen |
|---|---|---|
| `enrich-us` | Refinar una idea o historia antes de planificar | Adaptada |
| `adversarial-review` | Revisión adversarial antes de archivar | Adaptada |
| `show-spec-working` | Demostrar un cambio en el navegador | Adaptada |
| `commit` | Commits y PR con las convenciones del repo | Adaptada |
| `update-docs` | Actualizar la documentación afectada | Adaptada |
| `sync-agent-files` | Regenerar las copias para cada agente | Nueva (reemplaza a `sync-agent-symlinks`) |
| `explain` | Explicar conceptos con modelos mentales | Traducida |
| `meta-prompt` | Mejorar un prompt | Traducida |
| `code-auditing` | Auditoría de calidad en seis fases | Original, en inglés |
| `using-git-worktrees` | Trabajar en un worktree aislado | Original, en inglés |
| `writing-skills` | Crear y validar skills nuevas | Original, en inglés |

OpenSpec genera y actualiza (`openspec update`) sus propias skills (`openspec-propose`, `openspec-explore`, `openspec-apply-change`, `openspec-sync-specs` y `openspec-archive-change`) y los comandos `/opsx:*`.

## Diferencias con Specboot original

- **Copias en lugar de symlinks**: Windows sin Modo de desarrollador no crea symlinks. `node ai-specs/scripts/sync-agent-files.mjs` genera las copias y `--check` detecta diferencias (también en CI). Para compensar lo que un symlink garantiza solo, el script:
  - Guarda el hash de cada copia y no pisa las editadas a mano.
  - Exige registrar con su motivo las entradas externas.
  - Ignora los archivos que git ignora.
  - Detecta los renombres de mayúsculas que git no registró.
  - Se recupera de un manifiesto dañado sin borrar nada.
- **Español**: reglas, docs, specs y commits en español, como el resto del repo. Las skills genéricas conservan su texto original.
- **Sin backend**: se omitieron `backend-standards.md`, `api-spec.yml`, `data-model.md`, el agente `backend-developer`, la modalidad backend/curl de `show-spec-working` y `ai-specs/scripts/code_review.sh` (depende del CLI `agent` de Cursor). `data-model.md` y `api-spec.yml` se reemplazaron por `docs/content-model.md`.
- **Verificación en el navegador** en lugar de pruebas unitarias, curl y restauración de base de datos, con plantilla de reporte propia (`docs/openspec-tasks-mandatory-steps.md`). Requiere automatización de navegador, como Playwright MCP (`docs/development_guide.md` §1).
- **Modelo**: se recomienda Opus con esfuerzo alto para planificar y Sonnet con esfuerzo medio para el resto, pero el agente no modifica `.claude/settings.json` por su cuenta.
- **Plan del subagente `frontend-developer`**: se guarda en `openspec/changes/<cambio>/frontend-plan.md` y se archiva con el cambio. Sin cambio activo, va en `.claude/doc/`, que es local.
- **Perfil `core` de OpenSpec 1.4.0**:
  - `/opsx:propose` reemplaza a `/new` + `/ff`, y también completa los artefactos que le faltan a un cambio existente (en lugar de `/continue`).
  - `/opsx:verify` se reemplaza por los reportes obligatorios, `openspec validate` y `/adversarial-review`.
  - El perfil ampliado es opcional y global.
- **Publicación**: el workflow de Pages publica solo los archivos del sitio, así que el harness no queda expuesto en `adriantoso.github.io`. Esto vale solo si **Settings → Pages → Source** está en **GitHub Actions** (`build_type` = `workflow`).

## Actualizar desde Specboot

1. Compará la fuente original con `ai-specs/` y `docs/`. No traigas lo omitido (ver la sección anterior), `ai-specs/skills/openspec-sync-specs` (la genera OpenSpec) ni `sync-agent-symlinks` (la reemplaza `sync-agent-files`).
2. Las skills marcadas "Original" se pueden reemplazar directamente. En las adaptadas y traducidas, trasladá los cambios a mano.
3. Ejecutá `node ai-specs/scripts/sync-agent-files.mjs` y después `--check`.

## Créditos

Basado en Specboot de LIDR.co (licencia MIT, ver `ai-specs/LICENSE-specboot`), parte del programa AI4Devs: https://lidr.co/ia-devs. Algunas skills se inspiran en [obra/superpowers](https://github.com/obra/superpowers) (`using-git-worktrees`, `writing-skills`) y en [jeffrigby/somepulp-agents](https://github.com/jeffrigby/somepulp-agents) (`code-auditing`).
