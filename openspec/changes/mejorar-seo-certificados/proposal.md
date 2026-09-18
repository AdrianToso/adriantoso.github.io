## Why

El portafolio necesita señales de identidad y rastreo más claras para los buscadores. Los certificados deben enlazar al emisor cuando su comprobante es público; un HTTP 403 del comprobador automático no basta para descartarlo.

## What Changes

- Precisar título y descripción con el perfil .NET, Angular e integración de IA ya documentado.
- Añadir microdatos ProfilePage/Person sobre contenido visible y un sitemap canónico anunciado por robots.txt.
- Verificar en navegador los seis certificados Udemy del CV ampliado y usar el original si muestra titular y curso sin iniciar sesión. Incorporar el registro oficial y el PDF original de SCRUMstudy aportados el 18/09/2026. Mantener Drive para los cinco NEORIS y como respaldo documentado.
- Renovar la presentación general del portafolio: portada, navegación, experiencia en dos columnas, proyectos, tecnologías, formación y CV; conservar todo el contenido profesional.
- Mejorar la jerarquía de las tarjetas, distinguir verificación de credencial y diploma, y ofrecer controles de al menos 44 px.
- Añadir robots.txt y sitemap.xml a SITE_FILES, sin dependencias ni recursos remotos.

## Capabilities

### New Capabilities

- `descubrimiento-profesional`: metadatos coherentes, perfil estructurado y rastreo del sitio.
- `presentacion-profesional`: jerarquía visual y lectura adaptable del portafolio completo.
- `certificados-verificables`: preferencia por enlaces públicos del emisor con Drive de respaldo.

### Modified Capabilities

Ninguna spec consolidada existente cambia.

## Impact

index.html, styles.css, scripts/package-site.mjs, dos archivos públicos nuevos y documentación. El CV descargable, las categorías y los doce certificados se conservan.

## Fuentes

CV ampliado enlazado desde el CV original y Adrian_Toso_Cv_Detallado.pdf; códigos contrastados con los comprobantes de Drive. Perfil profesional ya documentado en docs/content-model.md. Google Search Central: guía SEO, ProfilePage y sitemaps, consultados el 17/09/2026.

## Fuera de alcance

Garantizar posiciones o indexación, instalar analítica, modificar cuentas de Search Console, publicar sin autorización, cambiar experiencia o PDF, comprar dominio o crear contenido sin fuentes.

Fuentes de Scrum aportadas por el titular y verificadas el 18/09/2026: https://www.scrumstudy.com/certification/verify?type=SFC&number=1039383 y su PDF original en rackcdn.com. Nombre Adrian Toso, credencial 1039383, emisión 04/07/2024; el registro declara que no vence.
