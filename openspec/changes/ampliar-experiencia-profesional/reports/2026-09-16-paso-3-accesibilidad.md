# Paso 3: Accesibilidad y mejora progresiva

- Fecha de verificación: 2026-09-16
- Registro completado: 2026-09-17
- Cambio: ampliar-experiencia-profesional
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: Playwright con Microsoft Edge

## Comandos ejecutados y comprobaciones
- Playwright sin JavaScript: las 26 contribuciones y los 12 certificados permanecen visibles; controles de filtrado ocultos; PDF accesible.
- Teclado: foco visible antes de activar el enlace Experiencia con Enter; destino y estado activo correctos.
- HTML inspeccionado: listas semánticas ul/li, encabezados de empresas h3, ninguna interacción nueva ni contenido oculto. No se ejecutó un lector de pantalla real.
- Los nuevos textos usan los colores existentes del sitio; no se añadieron animaciones. Pruebas realizadas con preferencia de movimiento reducido.
- Impresión: las 26 contribuciones siguen visibles; grilla adaptada a dos columnas con espacio para las descripciones y break-inside:avoid en las empresas. Captura de impresión inspeccionada; no se evaluó paginación física del sitio.
- PDF: las tres páginas completas tienen encabezados, pies y numeración coherente; sin superposiciones ni texto recortado.

## Escenarios verificados
- Trayectoria ampliada, lectura accesible y PDF coherente según specs/experiencia-profesional/spec.md; cobertura correspondiente al paso descrita arriba.

## Evidencia
- Comprobaciones ejecutadas en esta sesión y capturas locales en experience-preview, fuera del repositorio.
- Fuentes profesionales y evidencia de implementación registradas en proposal.md.

## Resultado
- Estado: PASA
- Bloqueos: ninguno para la entrega local; publicación fuera de alcance.
