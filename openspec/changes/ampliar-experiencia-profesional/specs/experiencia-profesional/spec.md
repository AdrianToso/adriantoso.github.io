## ADDED Requirements

### Requirement: Experiencias ampliadas y verificables
El sitio SHALL mostrar las seis experiencias con fechas y puestos respaldados por el CV, contexto de negocio y aportes concretos, sin métricas inventadas ni atribución de resultados no demostrados.

#### Scenario: Lectura de la trayectoria
- **WHEN** el visitante abre la sección Experiencia
- **THEN** encuentra seis empresas en orden cronológico inverso y en cada una un aporte destacado y una lista de contribuciones
- **AND** NEORIS diferencia la aplicación de ejemplo del trabajo en SIGMA y Concrete-Quality describe la integración de IA sin afirmar autoría original del agente

### Requirement: Lectura accesible
El contenido ampliado SHALL estar disponible sin JavaScript, sin nuevos controles obligatorios y sin desbordamiento horizontal entre 320 y 1920 px.

#### Scenario: Lectura sin scripts y con teclado
- **WHEN** el visitante navega sin JavaScript y usa el teclado
- **THEN** puede leer todas las contribuciones, llegar a Experiencia y descargar el CV

#### Scenario: Lectura en pantallas pequeñas e impresión
- **WHEN** se visualiza la página a 320 px, a un ancho equivalente al zoom 200% o en impresión
- **THEN** los textos nuevos se mantienen legibles y completos

### Requirement: CV completo y coherente
El PDF SHALL ampliar la misma trayectoria, conservar texto seleccionable y contactos profesionales, y mantener su ruta de descarga sin publicar datos sensibles.

#### Scenario: Descarga del CV
- **WHEN** el visitante activa Descargar CV
- **THEN** obtiene Adrian-Toso-CV.pdf con las seis experiencias ampliadas, tecnologías y formación
- **AND** la cantidad de páginas coincide con las leyendas de la web y no hay cortes de texto, superposiciones ni datos personales sensibles
