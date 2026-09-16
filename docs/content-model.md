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
  <div class="experience-description"><p>Descripción breve.</p><div class="tags"><span>Tecnología</span>…</div></div>
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
  <a class="certificate-link" href="https://drive.google.com/file/d/…/view" target="_blank" rel="noopener noreferrer">Ver certificado <span class="sr-only">de Título en Google Drive (abre otra pestaña)</span><span aria-hidden="true">↗</span></a>
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
- Los enlaces apuntan a PDF individuales en Google Drive, accesibles sin iniciar sesión. Las páginas de Udemy devuelven HTTP 403 a los comprobadores automáticos: no las uses como enlace principal.
- No dupliques certificados. El diploma de metodología aparecía dos veces en la carpeta de origen y se muestra una sola vez.
- El orden de las tarjetas es editorial, no cronológico.

## 7. CV y contacto

- `downloads/Adrian-Toso-CV.pdf`: versión profesional regenerada de dos páginas, sin datos sensibles.
  - Si cambia la cantidad de páginas, actualizá la leyenda "CV en PDF · 2 páginas" del inicio, el texto "un PDF de dos páginas" de la sección del CV (`cv-title`), este documento y `README.md`.
  - Si cambia el nombre del archivo, actualizá también `SITE_FILES` en `scripts/package-site.mjs` y los dos enlaces de `index.html`.
- Contacto: el correo profesional publicado y el perfil de GitHub. No agregues teléfono, dirección ni formularios.

## 8. Fuentes

- Contenido profesional: adaptado de `AdrianToso_CV_Resume.pdf`, provisto por el titular. Ese archivo no se distribuye.
- Proyectos: sus repositorios públicos, consultados el 16 de septiembre de 2026.
- Certificados: la carpeta pública de Google Drive enlazada desde el CV ampliado.

Cuando cambie una fuente, dejá registrada la fecha de consulta en el `README.md`.
