## ADDED Requirements

### Requirement: Identidad profesional rastreable
El sitio SHALL presentar título, descripción y datos estructurados coherentes con el perfil visible de Adrián Toso, sin datos privados ni conocimientos añadidos.

#### Scenario: Metadatos y perfil
- **WHEN** un visitante abre la portada y se inspecciona su HTML
- **THEN** el título identifica a Adrián Toso y su especialidad .NET y Angular, canonical y Open Graph apuntan a la raíz HTTPS, y ProfilePage tiene como mainEntity una Person con nombre, puesto, descripción y GitHub coincidentes con el contenido visible.

#### Scenario: Rastreo de la página canónica
- **WHEN** se abren robots.txt y sitemap.xml del paquete publicable
- **THEN** robots permite rastreo y anuncia el sitemap, y el XML contiene solamente https://adriantoso.github.io/ sin fragmentos, rutas locales ni documentación privada.

#### Scenario: Contenido independiente de JavaScript
- **WHEN** se consulta el HTML sin ejecutar scripts
- **THEN** la identidad, las experiencias, los doce certificados y los enlaces siguen presentes, y los microdatos no necesitan ejecución de JavaScript.
