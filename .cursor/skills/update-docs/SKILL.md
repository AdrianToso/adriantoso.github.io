---
name: update-docs
description: Identificar y actualizar la documentación técnica que corresponde según los cambios realizados. Usar antes de commitear o hacer push, o cuando se pide documentar un cambio o un commit.
author: LIDR.co (adaptada para adriantoso.github.io)
version: 1.1.0
---

# Skill update-docs

Seguí `docs/documentation-standards.md` para actualizar la documentación que requieran los cambios:

1. Revisá los cambios:
   - Sin commitear: `git status` y `git diff` (y `git diff --staged`).
   - Ya commiteados: `git show <commit>` para un commit. Para todo lo que todavía no está publicado, ejecutá `git fetch` y después `git log --oneline origin/main..HEAD` y `git diff origin/main...HEAD`. Esto cubre tanto una rama `feature/*` como commits sin push en `main`.
2. Usá la tabla de referencia de `docs/documentation-standards.md` para decidir qué archivos tocar.
3. Actualizalos en español, con el mismo formato y estructura que el resto.
4. Verificá que el formato y los enlaces sean correctos, y que cada cambio del diff quede reflejado con exactitud en la documentación.
5. Si tocaste `docs/base-standards.md` o `ai-specs/`, ejecutá `node ai-specs/scripts/sync-agent-files.mjs` y después `--check`.
6. Informá qué archivos actualizaste y qué cambió en cada uno.
