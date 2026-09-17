# Paso 4: Paquete publicable y harness

- Fecha de verificación: 2026-09-16
- Registro completado: 2026-09-17
- Cambio: ampliar-experiencia-profesional
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: Playwright con Microsoft Edge

## Comandos ejecutados y comprobaciones
- `node scripts/package-site.mjs`: PASA, cinco archivos públicos y cuatro referencias locales verificadas.
- Inventario de `_site/`: index.html, styles.css, script.js, favicon.svg y downloads/Adrian-Toso-CV.pdf, sin documentos internos.
- `node ai-specs/scripts/sync-agent-files.mjs --check`: PASA, 46 archivos, 11 skills y dos agentes.
- `openspec validate ampliar-experiencia-profesional --strict`: PASA.
- `git diff --check`: PASA.
- No se añadieron URLs externas al HTML; las descargas mantienen su ruta. Los enlaces del PDF reutilizan destinos profesionales existentes.
- Revisión de privacidad de texto y diff: no se incorporan originales privados, DNI, domicilio, teléfono, nacimiento ni contactos de referencias. Los metadatos de autor y título del PDF son profesionales.
- README.md y docs/content-model.md actualizados con tres páginas, estructura de experiencia y fuentes.
- No se hicieron commits, push, PR ni despliegues. GitHub Pages conserva la versión previamente publicada.

## Escenarios verificados
- Trayectoria ampliada, lectura accesible y PDF coherente según specs/experiencia-profesional/spec.md; cobertura correspondiente al paso descrita arriba.

## Evidencia
- Comprobaciones ejecutadas en esta sesión y capturas locales en experience-preview, fuera del repositorio.
- Fuentes profesionales y evidencia de implementación registradas en proposal.md.

## Resultado
- Estado: PASA
- Bloqueos: ninguno para la entrega local; publicación fuera de alcance.
