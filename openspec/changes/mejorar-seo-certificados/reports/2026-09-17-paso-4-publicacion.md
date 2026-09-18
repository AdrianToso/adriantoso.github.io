# Paso 4: publicación y harness

- Fecha: 2026-09-17
- Cambio: mejorar-seo-certificados
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: CUA, navegador integrado sin sesión en los emisores

## Comandos ejecutados
- node scripts/package-site.mjs: siete archivos, cuatro referencias locales, sin errores.
- node ai-specs/scripts/sync-agent-files.mjs --check: 46 copias sincronizadas (11 skills y 2 agentes).
- openspec validate mejorar-seo-certificados: válido.
- git diff --check: sin errores (avisos informativos LF/CRLF).
- Verificador temporal Python: anclas válidas, 12 certificados únicos, 6 Udemy y 6 Drive, propiedades del perfil, XML y lista exacta de archivos.

## Escenarios verificados
| Escenario (spec) | Cómo se comprobó | Resultado |
|---|---|---|
| Rastreo canónico publicable | robots.txt y sitemap.xml incluidos en SITE_FILES y _site | PASA |
| Solo archivos públicos | Lista exacta index.html, styles.css, script.js, favicon.svg, robots.txt, sitemap.xml y downloads/Adrian-Toso-CV.pdf | PASA |
| Privacidad | Diff acotado a metadatos, identidad pública y destinos; sin datos sensibles ni originales del CV | PASA |
| CV intacto | SHA256 FA8EAA2E5733BB88A4A5FE5DC8E6F8728E887520B0A460382917B468AFDFA4FD | PASA |

## Anchos y modos revisados
- Ver reportes 2 y 3.

## Consola
- Sin errores en las verificaciones anteriores.

## Qué quedó sin comprobar
- Publicación remota y configuración Pages previa al próximo push: este pedido se implementa localmente; no se hizo push, PR ni cambio de cuentas.
- Search Console no configurado; pasos pendientes documentados en docs/seo.md.

## Problemas y resolución
- Ninguno.

## Resultado
- Estado: PASA para preparar el paquete local.
- Bloqueos: ninguno. La publicación requiere el pedido explícito del titular según las reglas del repo.
