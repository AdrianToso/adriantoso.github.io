## Context

Sitio estático con título, canonical y Open Graph básicos. Doce certificados apuntan a Drive por un falso negativo del verificador HTTP. El 17/09/2026 se comprobaron los seis originales Udemy en navegador sin sesión: imagen cargada, titular Adrian Toso y curso correcto.

## Goals / Non-Goals

Mejorar señales de identidad y rastreo, y preferir el emisor verificable. Optimizar el diseño completo conservando el verde, las fuentes del sistema y el contenido profesional. No cambiar experiencia, CV ni dependencias. No garantizar ranking ni realizar gestiones de cuentas externas.

## Decisions

- Usar título profesional .NET y Angular, descripción breve con modernización e IA; mantener canonical y Open Graph coherentes.
- Microdatos ProfilePage en body y Person en main, con name y jobTitle sobre texto visible, description en la presentación, sameAs en el enlace profesional de GitHub y URL canónica mediante link. Evita scripts inline y funciona sin JavaScript. No sumar habilidades o datos personales nuevos.
- robots.txt permite rastreo y anuncia sitemap.xml. Sitemap con una sola URL canónica, sin fragmentos ni fechas inventadas. Ambos se publican con la lista explícita SITE_FILES.
- Seis enlaces Udemy, cinco diplomas NEORIS en Drive y una tarjeta Scrum con registro SCRUMstudy como acción principal y PDF original como secundaria. Conservar la carpeta de respaldos. No implementar detección remota.
- Pie de acciones común en cada tarjeta, con enlaces que identifican el destino: Ver en Udemy, Ver diploma PDF y Verificar credencial. Scrum muestra número y Sin vencimiento según el registro.
- Versionar la URL de styles.css para evitar la caché observada en la vista previa; sin nuevos archivos ni dependencias.
- Tarjetas con fondo --white, borde y radio de 12 px, pie separado y foco visible. Filtros y enlaces tienen min-height:44px. Mantener grilla de tres columnas, dos a 1100 px y una a 620 px; gana el bloque posterior Recursos descargables y certificados. No sumar media queries ni animaciones.
- Mantener títulos históricos del curso de acuerdo con el diploma: el nombre comercial actual del curso puede haber cambiado (microservicios .NET 9 en la página, .NET 8 en el comprobante).

## Risks / Trade-offs

- Disponibilidad del proveedor variable → fecha y evidencia de verificación; Drive de respaldo documentado.
- Indexación no garantizada → documentar Search Console como paso posterior a la publicación y explicar que metadatos no aseguran posiciones.
- Dos acciones en Scrum pueden elevar su fila → pie alineado al fondo y acciones en columna; comprobar 320–1920 px, zoom equivalente 200%, teclado, sin JS e impresión. Mantener anulación de transiciones con movimiento reducido.

## Migration Plan

Publicar mediante flujo existente cuando el titular lo solicite. Revertir el cambio devuelve metadatos y enlaces anteriores. No hay migraciones de datos.

## Open Questions

Ningún dato esencial pendiente. La verificación de propiedad en Search Console requiere acceso del titular y queda fuera del cambio.

## Presentación general

- Portada con título más amplio, espacios equilibrados y diagrama recto con profundidad sutil. Botones con radio común y navegación con indicador de sección activa.
- Experiencias en tarjetas blancas: fechas y empresa en una columna lateral de 210–250 px, aportes en el área principal con tipografía de 15 px. En 620 px o menos se apilan en orden de lectura. No ocultar contribuciones.
- Proyectos con esquinas y padding coherentes, tecnologías en seis tarjetas y formación académica con superficie propia. CV como banda destacada con descarga visible.
- Navegación, enlaces de CV y controles de proyectos con objetivos táctiles de 44 px. Foco claro sobre fondos oscuros. Mantener navegación visible sin depender de un menú JavaScript.
- Editar las reglas base y los breakpoints existentes; el segundo bloque gana para navegación y hero-actions. Restablecer sombras, márgenes y fondos en las reglas print existentes. Movimiento reducido conserva la anulación global.
- No agregar recursos, librerías, animaciones ni funcionalidades nuevas. HTML solo cambia la versión de CSS. El contenido, los atributos SEO, las anclas y los destinos permanecen iguales.
