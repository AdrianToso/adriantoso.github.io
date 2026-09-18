# Paso 4: publicación y harness del diseño general

- Fecha: 2026-09-18
- Cambio: mejorar-seo-certificados
- Agente y modelo: Claude Code / Opus 5 (1M context)
- Herramienta de navegador: no aplica en este paso

## Comandos ejecutados
- `node scripts/package-site.mjs`: "_site/ listo: 7 archivos (4 referencias locales verificadas)", sin errores.
- `find _site -type f`: `index.html`, `styles.css`, `script.js`, `favicon.svg`, `robots.txt`, `sitemap.xml` y `downloads/Adrian-Toso-CV.pdf`. Coincide exactamente con `SITE_FILES`.
- `node ai-specs/scripts/sync-agent-files.mjs --check`: 46 copias sincronizadas (11 skills, 2 agentes), 10 skills de OpenSpec sin tocar.
- `openspec validate mejorar-seo-certificados`: válido. `openspec status --change`: 4/4 artefactos completos.
- `git diff --check`: sin problemas de espacios.
- SHA256 de `downloads/Adrian-Toso-CV.pdf`: `FA8EAA2E5733BB88A4A5FE5DC8E6F8728E887520B0A460382917B468AFDFA4FD`, igual al del reporte del 18/09 anterior.

## Escenarios verificados
| Escenario | Cómo se comprobó | Resultado |
|---|---|---|
| Publicación acotada | `_site/` contiene solo los siete archivos de `SITE_FILES`. No aparecen `docs/`, `ai-specs/`, `openspec/`, `.claude/`, `.cursor/`, `.github/`, `scripts/` ni los archivos raíz de agentes | PASA |
| Archivos nuevos en la lista | El rediseño no agregó archivos al sitio: solo cambian `styles.css` y la versión de la URL del CSS en `index.html` | PASA |
| CV intacto | SHA256 sin cambios respecto del reporte previo | PASA |
| Privacidad | El diff del rediseño toca únicamente reglas CSS y la cadena de versión del CSS. Sin datos personales nuevos | PASA |
| Harness sincronizado | `--check` pasa; no se tocaron `ai-specs/` ni `docs/base-standards.md` en este paso | PASA |

## Anchos y modos revisados
- No aplica; ver los reportes de los pasos 2 y 3.

## Consola
- Sin errores en el empaquetado ni en las validaciones.

## Qué quedó sin comprobar
- `gh api 'repos/{owner}/{repo}/pages' --jq .build_type`: no se ejecutó porque la publicación remota queda fuera de este cambio hasta un pedido explícito del titular. Hay que correrlo y obtener `workflow` antes de cualquier push o merge a `main`.
- Despliegue remoto y Search Console.

## Problemas y resolución
- Ninguno.

## Resultado
- Estado: PASA
- Bloqueos: ninguno para el trabajo local. Para publicar queda pendiente el control de `build_type`.
