# Portafolio de Adrián Toso

Sitio estático en español para `https://adriantoso.github.io/`, construido con HTML y CSS, y mejoras progresivas con JavaScript. No requiere instalar paquetes, compilar ni configurar un backend.

## Vista previa

Abrir `index.html` en el navegador. También se puede servir la carpeta con `python -m http.server 8000 --bind 127.0.0.1` y visitar `http://127.0.0.1:8000`.

## Publicación en GitHub Pages

1. Subir `index.html`, `styles.css`, `favicon.svg`, `script.js`, la carpeta `downloads/`, `.nojekyll`, `.gitignore` y este README a la rama `main` de `AdrianToso/adriantoso.github.io`.
2. En GitHub, abrir **Settings → Pages**.
3. Elegir **Deploy from a branch**, rama **main** y carpeta **/ (root)**. Guardar.
4. Esperar a que termine la publicación y abrir `https://adriantoso.github.io/`.

El sitio está publicado en GitHub Pages. Los cambios subidos a `main` se publican automáticamente; comprobar que el despliegue finalice correctamente.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Contenido y mantenimiento

- `index.html`: presentación, experiencia, proyectos, tecnologías, formación y contacto.
- `styles.css`: diseño adaptable, estilos de impresión y preferencia de movimiento reducido.
- `favicon.svg`: identidad del sitio.
- `script.js`: filtros de certificados e indicador de sección activa.
- `downloads/Adrian-Toso-CV.pdf`: CV profesional de dos páginas, sin datos personales sensibles.
- `.nojekyll`: permite publicar los archivos estáticos directamente.

El contenido profesional se adaptó de `AdrianToso_CV_Resume.pdf`, proporcionado por su titular. Las fechas, empresas y formación se conservaron sin añadir métricas o atribuciones no documentadas. El puesto actual se muestra como figura en el CV; actualizarlo cuando cambie.

Los proyectos se complementaron con sus repositorios públicos consultados el 16 de septiembre de 2026:

- ProductCatalog: https://github.com/AdrianToso/ProductCatalog
- TicketManager: https://github.com/AdrianToso/ADR_T.TicketManager

Las ilustraciones son esquemas de las tecnologías, no capturas ni demos operativas. Los enlaces de los proyectos llevan a su código fuente.

El único correo publicado es el contacto profesional del titular. El PDF original no se distribuye: contiene datos personales y contactos de referencias. Se ofrece una versión profesional regenerada, sin DNI, domicilio, fecha de nacimiento, teléfono ni datos de referencias. No sustituirla por el original sin revisar su contenido.

## Accesibilidad y privacidad

HTML semántico, navegación por teclado, enlace para saltar al contenido, foco visible, enlaces externos identificados y secciones enlazables. El contenido funciona sin JavaScript. No se usan cookies, analítica, formularios ni fuentes remotas. El correo abre la aplicación de email del visitante; no envía mensajes automáticamente.


## Certificados y enlaces

Se incluyen 12 certificados distintos de la carpeta pública enlazada desde el CV ampliado. Se revisaron el titular, título y fecha en los comprobantes. El diploma de metodología aparecía duplicado y se muestra una sola vez.

Se usan enlaces individuales a los PDF en Google Drive, accesibles sin iniciar sesión al verificarlos. Las páginas de Udemy devolvieron HTTP 403 al comprobador automático, por eso no se publicaron como enlaces principales. No confundir la fecha de emisión con el año de la edición del curso (por ejemplo, OWASP Top 10 2021).

Los filtros solo se muestran cuando JavaScript se inicializa. Sin JavaScript se ven todos los certificados; los enlaces, la descarga del CV y los detalles de proyectos siguen funcionando. La preferencia de movimiento reducido se respeta.
