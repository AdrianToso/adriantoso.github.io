## Why

El CV público de dos páginas y la web omiten responsabilidades y aportes relevantes. El titular solicita desarrollar las seis experiencias y orientarlas a resultados documentados, incorporando el CV ampliado y el contexto de trabajo disponible.

## What Changes

- Ampliar las seis experiencias con contexto de negocio, acciones y valor aportado.
- Regenerar el CV con tipografía legible y extensión suficiente; mantener su URL.
- Presentar en la web un aporte destacado por empresa y detalles accesibles sin JavaScript.
- Separar aplicaciones de ejemplo, evaluaciones y trabajo en curso de resultados desplegados.
- Actualizar las leyendas del PDF y la documentación de contenido.

## Capabilities

### New Capabilities
- `experiencia-profesional`: trayectoria ampliada y verificable, coherente entre web y PDF.

### Modified Capabilities
Ninguna; no existen specs base de esta capacidad.

## Impact

index.html, styles.css, downloads/Adrian-Toso-CV.pdf, README.md y docs/content-model.md. No se agregan archivos públicos, dependencias ni cambios en SITE_FILES. Los documentos fuente privados no se incorporan al repositorio.

## Fuentes

Consultadas el 16 de septiembre de 2026:
- AdrianToso_CV_Resume.pdf: empresas, puestos, fechas, formación y puesto actual en Concrete-Quality.
- CV ampliado enlazado desde el original (Google Docs, ID 1oyenwxIKiozWWISXFON0qbdw63tMYNa0-BAaIaAuoSg), contrastado con Adrian_Toso_Cv_Detallado.pdf: Viterra/SIGMA y aplicación de ejemplo de NEORIS; Metropolitan Touring y migración en Readiness; validación XML y certificación en IT-Desarrollos; dispositivos, persistencia y herramientas en Netcamara; facturación electrónica, soporte y producción en Plenario.
- Conversaciones de trabajo sobre CQAgent y modernización: definición de alcance, evolución del asistente, coordinación del desarrollo con IA y validación por escenarios. No se atribuye autoría original de CQAgent, ni una migración o despliegue final sin confirmación.
- La respuesta anterior de ChatGPT sobre cuatro años Senior no constituye evidencia de antigüedad y no se incorpora.

## Fuera de alcance

Publicar, hacer commits o PR; modificar configuración o reglas del harness; inventar cifras, puestos de liderazgo, conocimientos o resultados. El proyecto personal ArdyonMarket no se atribuye a una empresa. No se divulgan datos sensibles, contactos de referencias ni detalles internos de clientes.

### Evidencia adicional de Concrete-Quality

El titular solicitó incluir la implementación del agente Python. Inventario de repositorios y worktrees locales, con revisión focalizada en CQ, rama feature/chat-ai, commit c74862567. Se comprobaron CQAgent/experts/agent_copperator.py (FastAPI, Agents SDK y herramientas de negocio), routes/spreadsheet_route.py (hojas y permisos), routes/pending_change_route.py (confirmación humana), routes/conversation_route.py (conversaciones), tools/sheet_blocks_tool.py (operaciones de hoja), pruebas unitarias de aislamiento y confirmación, y frontend/src/app/main/admin/ai-chat/ai-chat.component.ts (integración Angular). Revisión estática: no se ejecutaron servicios ni pruebas del sistema CQ, ni se modificaron sus repositorios. No se publica código ni información interna de sus clientes.
