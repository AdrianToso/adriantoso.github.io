---
description: Pasos obligatorios al crear o ejecutar un tasks.md de OpenSpec en este sitio estático. El agente ejecuta él mismo todas las verificaciones.
alwaysApply: true
---

# Tareas de OpenSpec: pasos obligatorios

Al crear o actualizar un `tasks.md` en `openspec/changes/<cambio>/`:

## 1. Leer primero `openspec/config.yaml`

**Antes** de crear o actualizar un `tasks.md`, leé `openspec/config.yaml` (contexto y reglas por artefacto) y `docs/base-standards.md`.

## 2. Estructura obligatoria

### Paso 0: crear la rama (SIEMPRE PRIMERO)

- Rama `feature/<nombre-del-cambio>` desde `main`.
- Crearla y cambiarse a ella antes de tocar cualquier archivo.
- **En un worktree** (skill `using-git-worktrees`), antes de tocar archivos:
  1. Confirmá que la base incluye tu `main` local con `git merge-base --is-ancestor main HEAD`. Si no lo incluye y la rama no tiene commits propios, ejecutá `git merge --ff-only main`.
  2. Si la rama del worktree no se llama `feature/<nombre-del-cambio>`, creala ahí mismo con `git switch -c feature/<nombre-del-cambio>` (ver `docs/development_guide.md` §5).

### Pasos obligatorios al final (en este orden)

- **Paso N**: verificación local en el navegador (OBLIGATORIO, LO EJECUTA EL AGENTE)
- **Paso N+1**: accesibilidad y mejora progresiva (OBLIGATORIO, LO EJECUTA EL AGENTE)
- **Paso N+2**: verificación de publicación y del harness (OBLIGATORIO, LO EJECUTA EL AGENTE)
- **Paso N+3**: actualización de la documentación (OBLIGATORIO)

Los cambios que solo tocan documentación o `ai-specs/` pueden omitir N y N+1 si lo justifican en `tasks.md`.

## 3. Las verificaciones las ejecuta el agente

**IMPORTANTE**: el agente ejecuta todas las verificaciones. **Nunca se las delega al usuario.** Una tarea se marca `[x]` solo después de ejecutarla, dejar el reporte con la plantilla de abajo y obtener resultado PASA (o una excepción aprobada por el usuario y registrada en el reporte).

Los reportes se guardan en `openspec/changes/<cambio>/reports/` con el nombre `AAAA-MM-DD-paso-<n>-<tema>.md`. Al archivar, OpenSpec los mueve a `openspec/changes/archive/<fecha>-<cambio>/reports/`.

Si no hay automatización de navegador disponible (ver `docs/development_guide.md` §1), el agente lo informa, registra qué quedó sin comprobar y deja la tarea sin marcar hasta que se pueda verificar.

### Plantilla de reporte

```markdown
# Paso <n>: <tema>

- Fecha: AAAA-MM-DD
- Cambio: <nombre-del-cambio>
- Agente y modelo: <agente / modelo>
- Herramienta de navegador: <Playwright MCP / otra / ninguna>

## Comandos ejecutados
- `<comando>`: <resultado resumido>

## Escenarios verificados
| Escenario (spec) | Cómo se comprobó | Resultado |
|---|---|---|
| <escenario> | <acciones> | PASA / FALLA |

## Anchos y modos revisados
- 1920 / 1440 / 1024 / 768 / 390 / 360 / 320 px, zoom 200%: <observaciones>
- Sin JavaScript, teclado, impresión, movimiento reducido (si aplica): <observaciones>

## Consola
- <sin errores / errores encontrados>

## Qué quedó sin comprobar
- <nada / detalle y motivo>

## Problemas y resolución
- <problema> → <cómo se resolvió>

## Resultado
- Estado: PASA / FALLA
- Bloqueos: <ninguno / lista>
```

### Paso N: verificación local en el navegador

1. Comprobar qué herramientas de navegador hay disponibles (por ejemplo, `browser_*` de Playwright MCP). Si no hay, aplicar la regla anterior.
2. Levantar el servidor local: `python -m http.server 8000 --bind 127.0.0.1`.
3. Recorrer cada escenario de las specs del cambio y comprobar el resultado esperado.
4. Revisar los anchos de 1920, 1440, 1024, 768, 390, 360 y 320 px, y un zoom del 200%: sin desplazamiento horizontal, sin superposiciones y sin texto cortado.
5. Revisar la consola del navegador: sin errores.
6. Si el cambio toca filtros o navegación, comprobar la cantidad de tarjetas por filtro, `aria-pressed`, el contador y `aria-current`.
7. Si el cambio toca CSS responsive, confirmar que ninguna media query posterior anule el ajuste (`docs/frontend-standards.md` §4).
8. Detener el servidor y dejar el reporte `AAAA-MM-DD-paso-N-verificacion-local.md`.

### Paso N+1: accesibilidad y mejora progresiva

1. **Sin JavaScript**: todo el contenido es visible y los controles que dependen de JS quedan ocultos.
2. **Teclado**: orden de tabulación, foco visible y activación con Enter y Espacio.
3. **Lectores de pantalla**: nombres accesibles, `aria-hidden` en lo decorativo, `sr-only` en los enlaces externos y anuncios en `role="status"`.
4. **Contraste** de los colores nuevos (AA) y **movimiento reducido** para las animaciones nuevas.
5. **Impresión**: la vista previa sigue siendo legible.
6. Dejar el reporte `AAAA-MM-DD-paso-N+1-accesibilidad.md`.

### Paso N+2: verificación de publicación y del harness

1. Ejecutar `node scripts/package-site.mjs` y confirmar que termina sin errores (referencias locales existentes y dentro de `_site/`, y `rel="noopener"` en los `target="_blank"`).
2. Si el cambio agrega archivos que el sitio necesita, confirmar que estén en `SITE_FILES`.
3. Confirmar que `_site/` contiene solo los archivos de `SITE_FILES`: nada de `docs/`, `ai-specs/`, `openspec/`, `.claude/`, `.cursor/`, `.github/` ni `scripts/`, ni `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` o `codex.md`.
4. Si cambió `docs/base-standards.md`, `ai-specs/`, `.claude/`, `.cursor/` o los archivos raíz de agentes, ejecutar `node ai-specs/scripts/sync-agent-files.mjs` y luego `--check`.
5. Si el cambio se va a publicar, confirmar que `gh api 'repos/{owner}/{repo}/pages' --jq .build_type` devuelva `workflow` (ver `docs/base-standards.md` §8). Si no, anotarlo como bloqueo del merge.
6. Revisar que el diff no contenga datos personales sensibles.
7. Dejar el reporte `AAAA-MM-DD-paso-N+2-publicacion.md`.

### Paso N+3: actualización de la documentación

Seguir `docs/documentation-standards.md` (skill `update-docs`) e indicar qué documentos se actualizaron.

## 4. Lista de control

Antes de dar por terminado un `tasks.md`, verificá que:

- [ ] El paso 0 (crear la rama) sea el primero.
- [ ] Estén los cuatro pasos obligatorios, en orden y marcados como "(OBLIGATORIO)". Si el cambio solo toca documentación o `ai-specs/`, alcanza con N+2 y N+3, siempre que `tasks.md` justifique la omisión.
- [ ] Los pasos se numeren en forma consecutiva.
- [ ] Los pasos de verificación indiquen "LO EJECUTA EL AGENTE" y la ruta de su reporte.
- [ ] Los reportes sigan la plantilla de la sección 3.
- [ ] Los anchos incluyan 1920 y 320 px, y el zoom del 200%.
- [ ] Las tareas de contenido citen la fuente del dato.

## 5. Cuándo aplica

- Al crear un `tasks.md` con `/opsx:propose` (en Cursor, `/opsx-propose`; skill `openspec-propose`) o, en el perfil ampliado, con `/opsx:ff` y `/opsx:continue`.
- Al actualizar un `tasks.md` existente, por ejemplo al retomar un cambio (ver `docs/base-standards.md` §7).
- Al implementar con `/opsx:apply` (en Cursor, `/opsx-apply`; skill `openspec-apply-change`): el agente ejecuta las verificaciones.

## 6. Ejemplo

```markdown
## 0. Preparación: crear la rama (OBLIGATORIO, PRIMER PASO)

- [ ] 0.1 Crear la rama `feature/agregar-certificado-azure` desde `main`
- [ ] 0.2 Confirmar la rama actual

## 1. Contenido: tarjeta de certificado

- [ ] 1.1 Verificar el comprobante (titular, título, fecha) y que el enlace sea público
- [ ] 1.2 Agregar `article.certificate-card` con `data-category="arquitectura"`
- [ ] 1.3 Actualizar el contador inicial a "13 certificados"

## 2. Verificación local en el navegador (OBLIGATORIO, LO EJECUTA EL AGENTE)

- [ ] 2.1 Levantar el servidor local
- [ ] 2.2 Comprobar los filtros "Todos" (13) y "Arquitectura" (4)
- [ ] 2.3 Revisar los anchos de 1920, 1440, 1024, 768, 390, 360 y 320 px, el zoom del 200% y la consola
- [ ] 2.4 Reporte `reports/AAAA-MM-DD-paso-2-verificacion-local.md`

## 3. Accesibilidad y mejora progresiva (OBLIGATORIO, LO EJECUTA EL AGENTE)

- [ ] 3.1 Sin JS, con teclado, lector de pantalla e impresión
- [ ] 3.2 Reporte `reports/AAAA-MM-DD-paso-3-accesibilidad.md`

## 4. Verificación de publicación y del harness (OBLIGATORIO, LO EJECUTA EL AGENTE)

- [ ] 4.1 `node scripts/package-site.mjs` sin errores
- [ ] 4.2 Reporte `reports/AAAA-MM-DD-paso-4-publicacion.md`

## 5. Actualización de la documentación (OBLIGATORIO)

- [ ] 5.1 Actualizar `docs/content-model.md` (conteos) y `README.md`
```

## Incumplimiento

Crear tareas sin estos pasos o marcarlas como hechas sin ejecutar las verificaciones viola esta regla.
