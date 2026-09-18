## ADDED Requirements

### Requirement: Presentación clara y coherente
El portafolio SHALL ofrecer una jerarquía visual coherente en portada, experiencia, proyectos, tecnologías, formación, certificados y contacto, conservando todo el contenido y los enlaces.

#### Scenario: Lectura de experiencia
- **WHEN** un visitante revisa la trayectoria en escritorio
- **THEN** cada experiencia distingue fechas y empresa de los aportes, que ocupan la columna principal, y las seis experiencias con sus 26 contribuciones siguen visibles.

#### Scenario: Adaptación y navegación
- **WHEN** el visitante usa anchos de 320, 360, 390, 768, 1024, 1440 y 1920 px o el equivalente a zoom 200%
- **THEN** no hay desbordes, solapamientos ni títulos cortados; la navegación, los botones principales, la descarga y los detalles de proyectos tienen al menos 44 px de alto.

#### Scenario: Mejoras progresivas y accesibilidad
- **WHEN** el visitante navega con teclado, sin JavaScript, con movimiento reducido o con estilos de impresión
- **THEN** el contenido y los destinos permanecen accesibles, el foco es visible sobre fondos claros y oscuros, no aparecen animaciones innecesarias y las tarjetas se conservan legibles al imprimir.
