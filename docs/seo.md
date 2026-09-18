# Posicionamiento del portafolio

## Implementado

- Título: Adrián Toso | Desarrollador Fullstack .NET y Angular.
- Descripción y Open Graph coherentes con experiencia, modernización e integración de IA.
- Idioma español y URL canónica HTTPS de la portada.
- Microdatos ProfilePage/Person en el HTML, con nombre, puesto, descripción, URL y perfil GitHub. No requieren scripts.
- robots.txt abierto al rastreo y sitemap.xml con la única página canónica, ambos incluidos en SITE_FILES.
- Contenido semántico y accesible sin JavaScript; sin dependencias ni recursos externos de seguimiento.

## Después de publicar

1. Comprobar que la portada, robots.txt y sitemap.xml respondan con los archivos publicados.
2. Registrar la propiedad de prefijo de URL `https://adriantoso.github.io/` en Google Search Console con la cuenta del titular. Hace falta verificar propiedad: el token o archivo debe provenir de Google, no inventarse. Si se elige un archivo HTML, incorporarlo explícitamente a SITE_FILES antes de publicarlo; si se elige una etiqueta meta, agregar solo el token recibido.
3. Enviar `https://adriantoso.github.io/sitemap.xml`, inspeccionar la portada y solicitar indexación cuando esté lista. Estos pasos aún no se ejecutaron.
4. Seguir consultas, impresiones y clics de Search Console para decidir futuras mejoras de contenido con datos. No hace falta agregar analítica al sitio para consultar esas estadísticas.
5. Mantener el enlace al portafolio en los perfiles profesionales del titular. Cualquier caso de proyecto nuevo debe explicar problema, aporte y resultado comprobable; publicar métricas únicamente con evidencia.

## Límites y mantenimiento

Google decide si indexa y cómo muestra los resultados. Ningún archivo o marcado garantiza posiciones ni resultados enriquecidos. Al ser una página, no se agregan las anclas de las secciones como URLs independientes. El sitemap omite lastmod para no comunicar una fecha artificial; si se añade, debe reflejar un cambio real del contenido.

No bloquear el PDF ni agregar noindex sin un pedido del titular. El PDF público ya excluye datos personales sensibles. No agregar meta keywords ni contenido oculto para posicionar.

## Referencias oficiales consultadas el 17/09/2026

- [Guía de SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).
- [Datos estructurados ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page).
- [Creación de sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
