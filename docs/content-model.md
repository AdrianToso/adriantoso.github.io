---
description: Modelo de contenido del portafolio (secciones, anclas, estructura de tarjetas y categorías) y reglas editoriales. Reemplaza al modelo de datos y a la especificación de API, que no aplican a un sitio estático.
alwaysApply: false
---

# Modelo de contenido

Todo el contenido vive en `index.html`. Este documento describe su estructura para cambiarla sin romper la navegación, los filtros ni la accesibilidad.

## 1. Secciones

| Orden | Ancla | `h2` (`id`) | Etiqueta | Contenido | En la navegación |
|---|---|---|---|---|---|
| — | `#inicio` | `hero-title` (es `h1`) | DESARROLLADOR FULLSTACK .NET | Presentación, acciones (proyectos, CV) y diagrama de capas | Marca |
| — | — | — | MI ENFOQUE | Franja con tres ejes de trabajo | No |
| 01 | `#experiencia` | `experience-title` | TRAYECTORIA | Línea de tiempo laboral | Sí |
| 02 | `#proyectos` | `projects-title` | CÓDIGO EN PRÁCTICA | Tarjetas de repositorios públicos | Sí |
| 03 | `#tecnologias` | `tech-title` | HERRAMIENTAS Y CRITERIO | Seis grupos de tecnologías | Sí |
| 04 | `#formacion` | `education-title` | APRENDIZAJE CONTINUO | Título, cursos e idioma | Sí |
| 05 | `#certificados` | `certificates-title` | CERTIFICADOS | Filtros y tarjetas de certificados | Sí |
| — | — | `cv-title` | MI PERFIL, A MANO | Descarga y apertura del CV | No |
| 06 | `#contacto` | `contact-title` | SIGUIENTE CONVERSACIÓN | Correo y GitHub | Sí ("Hablemos") |

Reglas:

- Las anclas están en español, sin tildes, y son parte de URL que pueden estar compartidas. No las renombres sin un motivo explícito.
- Si agregás una sección con ancla, sumá su enlace a `nav` (el script de sección activa lo detecta solo), mantené la numeración de las etiquetas y revisá `scroll-padding-top` en `styles.css`.

## 2. Experiencia (`.experience-row`)

```html
<article class="experience-row">
  <div class="experience-date"><span>Mmm. AAAA — Mmm. AAAA</span><!-- opcional: <span class="current-label">ACTUAL</span> --></div>
  <div class="experience-company"><h3>Empresa</h3><p>Puesto</p><span class="sector">Sector (opcional)</span></div>
  <div class="experience-description"><p class="experience-impact">Aporte destacado.</p><p>Contexto de negocio.</p><ul class="experience-contributions"><li>Contribución y valor respaldados por la fuente.</li></ul><div class="tags"><span>Tecnología</span>…</div></div>
</article>
```

- Orden cronológico inverso. Solo el puesto actual lleva "Actualidad" y `current-label`.
- Meses abreviados con punto (`Ene.`, `Sep.`, `Dic.`) y rango separado por raya (`—`).
- Fechas, empresas y puestos salen del CV del titular. No agregues métricas ni logros sin documentar.

## 3. Proyectos (`.project-card`)

- Estructura: `project-visual` decorativo (`aria-hidden`), `project-category`, `h3`, descripción, `tags`, `details.project-details` ("Qué podés encontrar") y `project-link` al repositorio.
- Solo repositorios públicos de `github.com/AdrianToso`. La descripción tiene que coincidir con el contenido real del repositorio.
- Las ilustraciones son esquemas de tecnologías, no capturas ni demos. No las presentes como si lo fueran.
- Proyectos actuales: `ProductCatalog` y `ADR_T.TicketManager`.

## 4. Tecnologías (`.tech-group`)

Seis grupos fijos: Backend · Frontend y escritorio · Datos y persistencia · Arquitectura e integración · Desarrollo y operaciones · Pruebas y calidad. Cada uno tiene un símbolo decorativo, un `h3` y una lista separada por `·`. La grilla usa tres columnas en escritorio y dos desde 850 px hacia abajo (también en mobile), así que conviene mantener una cantidad de grupos múltiplo de seis.

## 5. Formación

- `.degree`: título académico con etiqueta `FORMACIÓN ACADÉMICA / años`.
- `.courses`: lista con `<strong>` (curso) y `<span>` (proveedor o detalle).
- `.language-note`: nivel de inglés declarado por el titular.

## 6. Certificados (`.certificate-card`)

```html
<article class="certificate-card" data-category="desarrollo">
  <div class="certificate-meta"><span class="issuer-icon issuer-udemy" aria-hidden="true">U</span><span>Udemy</span><time datetime="2025-05-25">25 may. 2025</time></div>
  <h3>Título</h3><p>Subtítulo o detalle</p>
  <div class="certificate-actions"><a class="certificate-link" href="https://drive.google.com/file/d/…/view" target="_blank" rel="noopener noreferrer">Ver diploma PDF <span class="sr-only">de Título en Google Drive (abre otra pestaña)</span><span aria-hidden="true">↗</span></a></div>
</article>
```

### Categorías

| `data-filter` / `data-category` | Etiqueta del botón | Tarjetas actuales |
|---|---|---|
| `todos` | Todos | 12 (todas) |
| `desarrollo` | Desarrollo | 2 |
| `arquitectura` | Arquitectura | 3 |
| `ia` | IA | 2 |
| `calidad` | Seguridad y calidad | 3 |
| `agilidad` | Agilidad | 2 |

### Emisores

| Clase | Inicial | Emisor |
|---|---|---|
| `issuer-udemy` | U | Udemy |
| `issuer-neoris` | N | NEORIS |
| `issuer-scrumstudy` | S | SCRUMstudy |

Para un emisor nuevo, agregá su clase `issuer-*` en `styles.css`.

### Invariantes

- Todo `data-category` tiene su botón con el mismo `data-filter`, y todo botón (salvo `todos`) tiene al menos una tarjeta.
- El texto inicial de `.certificate-count` ("12 certificados") coincide con la cantidad de tarjetas. Actualizalo al agregar o quitar certificados, y actualizá también el README.
- Antes de publicar un comprobante, revisá el titular, el título y la fecha. No confundas la fecha de emisión con el año de la edición del curso (por ejemplo, OWASP Top 10 2021).
- Priorizar el comprobante original del emisor si se verifica en navegador sin iniciar sesión; usar el PDF público de Drive cuando el original no permita verlo o no esté aportado en las fuentes. El titular pidió expresamente esta preferencia el 17/09/2026. Un 403 automático no basta para descartar el original.
- Verificaciones del 17–18/09/2026: seis originales Udemy, cinco PDF NEORIS de Drive y un registro SCRUMstudy con acceso adicional al diploma original. La carpeta completa conserva respaldos; los nombres accesibles indican el destino real.
- Cada tarjeta agrupa enlaces en `.certificate-actions`. Scrum tiene dos: Verificar credencial al registro oficial y Ver diploma PDF al comprobante original aportado. `.credential-validity` muestra Sin vencimiento según el registro 1039383, verificado el 18/09/2026. No inferir esa condición para otras credenciales.
- No dupliques certificados. El diploma de metodología aparecía dos veces en la carpeta de origen y se muestra una sola vez.
- El orden de las tarjetas es editorial, no cronológico.

## 7. CV y contacto

- `downloads/Adrian-Toso-CV.pdf`: versión profesional ampliada de tres páginas, sin datos sensibles.
  - Si cambia la cantidad de páginas, actualizá la leyenda "CV en PDF · 3 páginas" del inicio, el texto "un PDF de tres páginas" de la sección del CV (`cv-title`), este documento y `README.md`.
  - Si cambia el nombre del archivo, actualizá también:
    - `SITE_FILES` en `scripts/package-site.mjs`.
    - Los tres `href` y los dos atributos `download` de `index.html` (inicio y sección del CV).
    - Las menciones de la ruta en `README.md`, `docs/frontend-standards.md` §2 y `docs/base-standards.md` §0 y §8. Después ejecutá `node ai-specs/scripts/sync-agent-files.mjs`.
- Contacto: el correo profesional publicado y el perfil de GitHub. No agregues teléfono, dirección ni formularios.

## 8. Fuentes

- Contenido profesional: ampliado el 16 de septiembre de 2026 a partir de `AdrianToso_CV_Resume.pdf` y su CV ampliado en Google Docs, contrastado con `Adrian_Toso_Cv_Detallado.pdf`. Esos archivos originales no se distribuyen.
- Concrete-Quality: aporte declarado por el titular, conversaciones de trabajo disponibles y código de CQAgent en la rama local `feature/chat-ai`, revisados el 16 de septiembre de 2026. Se describen implementación e integración, sin afirmar autoría original ni despliegue productivo completo.
- Cada experiencia incluye contexto y contribuciones visibles sin JavaScript. La aplicación .NET 8 de NEORIS se identifica como ejemplo de actualización tecnológica.
- Proyectos: sus repositorios públicos, consultados el 16 de septiembre de 2026.
- Certificados: enlaces de Udemy y carpeta pública de Google Drive del CV ampliado, verificados en navegador el 17/09/2026. Para Scrum se suman el registro SCRUMstudy y el PDF original aportados y verificados el 18/09/2026. Los títulos y fechas históricos conservan los del diploma; una página de curso puede haber cambiado su nombre desde la emisión.

Cuando cambie una fuente, dejá registrada la fecha de consulta en el `README.md`.

## 9. Identidad para buscadores

`body` identifica la página como `ProfilePage` y `main#contenido` contiene la persona principal (`Person`). El nombre, puesto y descripción se toman del texto visible de presentación; `sameAs` identifica el perfil de GitHub del contacto. No se añaden identificadores privados ni habilidades que no estén respaldadas. Ver [guía de posicionamiento](seo.md).
