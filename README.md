# Portafolio de Adrián Toso

Sitio estático en español para `https://adriantoso.github.io/`, construido con HTML y CSS. No requiere instalar paquetes, compilar ni configurar un backend.

## Vista previa

Abrir `index.html` en el navegador. También se puede servir la carpeta con `python -m http.server 8000 --bind 127.0.0.1` y visitar `http://127.0.0.1:8000`.

## Publicación en GitHub Pages

1. Subir `index.html`, `styles.css`, `favicon.svg`, `.nojekyll`, `.gitignore` y este README a la rama `main` de `AdrianToso/adriantoso.github.io`.
2. En GitHub, abrir **Settings → Pages**.
3. Elegir **Deploy from a branch**, rama **main** y carpeta **/ (root)**. Guardar.
4. Esperar a que termine la publicación y abrir `https://adriantoso.github.io/`.

Estos archivos quedan preparados localmente. Crear el sitio no implica que ya se hayan subido ni que Pages esté activado.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Contenido y mantenimiento

- `index.html`: presentación, experiencia, proyectos, tecnologías, formación y contacto.
- `styles.css`: diseño adaptable, estilos de impresión y preferencia de movimiento reducido.
- `favicon.svg`: identidad del sitio.
- `.nojekyll`: permite publicar los archivos estáticos directamente.

El contenido profesional se adaptó de `AdrianToso_CV_Resume.pdf`, proporcionado por su titular. Las fechas, empresas y formación se conservaron sin añadir métricas o atribuciones no documentadas. El puesto actual se muestra como figura en el CV; actualizarlo cuando cambie.

Los proyectos se complementaron con sus repositorios públicos consultados el 16 de septiembre de 2026:

- ProductCatalog: https://github.com/AdrianToso/ProductCatalog
- TicketManager: https://github.com/AdrianToso/ADR_T.TicketManager

Las ilustraciones son esquemas de las tecnologías, no capturas ni demos operativas. Los enlaces de los proyectos llevan a su código fuente.

El único correo publicado es el contacto profesional del titular. El PDF original no se distribuye: contiene datos personales y contactos de referencias. No añadirlo al repositorio sin preparar antes una versión para publicación.

## Accesibilidad y privacidad

HTML semántico, navegación por teclado, enlace para saltar al contenido, foco visible, enlaces externos identificados y secciones enlazables. El contenido funciona sin JavaScript. No se usan cookies, analítica, formularios ni fuentes remotas. El correo abre la aplicación de email del visitante; no envía mensajes automáticamente.
