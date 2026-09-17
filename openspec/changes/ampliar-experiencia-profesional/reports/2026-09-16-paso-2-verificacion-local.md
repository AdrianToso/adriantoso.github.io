# Paso 2: Verificación local

- Fecha de verificación: 2026-09-16
- Registro completado: 2026-09-17
- Cambio: ampliar-experiencia-profesional
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: Playwright con Microsoft Edge

## Comandos ejecutados y comprobaciones
- Servidor HTTP temporal sobre `_site/` y Playwright con Microsoft Edge: PASA; servidor de prueba detenido al terminar.
- Comprobación de 1920, 1440, 1024, 768, 720, 390, 360 y 320 px. 720 px como ancho equivalente al zoom 200% sobre 1440 px; no se simuló el zoom nativo del navegador.
- Sin desbordamiento horizontal, elementos nuevos recortados ni errores o advertencias en consola.
- Seis empresas y 26 contribuciones; anclas e IDs válidos. Navegación a Experiencia y sección activa comprobadas.
- Los seis filtros conservan sus cantidades. Descarga comprobada en los ocho anchos: bytes idénticos al nuevo PDF local.
- Inspección visual de capturas de experiencia a 1440 y 390 px.
- PDF: tres páginas revisadas visualmente; texto seleccionable, seis empresas y 26 contribuciones verificadas por extracción de texto; 83.559 bytes.
- Al retomar el 17/09 se comprobó que el PDF, index.html y styles.css siguen idénticos a los archivos verificados.

## Escenarios verificados
- Trayectoria ampliada, lectura accesible y PDF coherente según specs/experiencia-profesional/spec.md; cobertura correspondiente al paso descrita arriba.

## Evidencia
- Comprobaciones ejecutadas en esta sesión y capturas locales en experience-preview, fuera del repositorio.
- Fuentes profesionales y evidencia de implementación registradas en proposal.md.

## Resultado
- Estado: PASA
- Bloqueos: ninguno para la entrega local; publicación fuera de alcance.
