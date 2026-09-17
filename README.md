# Portafolio de Adrián Toso

Sitio estático en español para `https://adriantoso.github.io/`, construido con HTML y CSS, y mejoras progresivas con JavaScript. No requiere instalar paquetes, compilar ni configurar un backend.

## Vista previa

Abrir `index.html` en el navegador. También se puede servir la carpeta con `python -m http.server 8000 --bind 127.0.0.1` y visitar `http://127.0.0.1:8000`.

## Publicación en GitHub Pages

El sitio se publica con GitHub Actions (`.github/workflows/pages.yml`). Cada push a `main` ejecuta `node scripts/package-site.mjs`, que copia a `_site/` solo los archivos listados en `SITE_FILES` y valida el `index.html` publicado. Comprueba que cada referencia local (`href`, `src`, `srcset`, `poster`) apunte a un archivo publicado y que los enlaces que abren otra pestaña tengan `rel="noopener"`. Después despliega esa carpeta. Así no se publican el harness de IA (`docs/`, `ai-specs/`, `openspec/`, `.claude/`, `.cursor/`) ni los archivos raíz de agentes (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `codex.md`).

Configuración única:

1. En GitHub, abrir **Settings → Pages**.
2. En **Build and deployment → Source**, elegir **GitHub Actions**.
3. Hacer push a `main` (o ejecutar el workflow **Publicar sitio** a mano) y comprobar que termine bien.
4. Abrir `https://adriantoso.github.io/`.

En los pull requests, el workflow solo arma y valida el sitio, sin publicarlo. Si el sitio necesita un archivo nuevo, agregarlo a `SITE_FILES` en `scripts/package-site.mjs`.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Contenido y mantenimiento

- `index.html`: presentación, experiencia, proyectos, tecnologías, formación y contacto.
- `styles.css`: diseño adaptable, estilos de impresión y preferencia de movimiento reducido.
- `favicon.svg`: identidad del sitio.
- `script.js`: filtros de certificados e indicador de sección activa.
- `downloads/Adrian-Toso-CV.pdf`: CV profesional ampliado de tres páginas, sin datos personales sensibles.
- `scripts/package-site.mjs` y `.github/workflows/pages.yml`: armado y publicación del sitio.
- `.nojekyll`: solo aplica a la publicación desde rama. Se conserva por si se vuelve a ese modo.

El contenido profesional se amplió el 16 de septiembre de 2026 a partir de `AdrianToso_CV_Resume.pdf` y del CV ampliado enlazado desde ese documento, contrastado con `Adrian_Toso_Cv_Detallado.pdf`. Se revisaron conversaciones disponibles y la implementación de CQAgent en la rama local `feature/chat-ai`, junto con la declaración del titular sobre su participación. Los documentos originales y las conversaciones no se distribuyen. Las fechas, empresas y formación se conservaron sin añadir métricas o atribuciones no documentadas. El puesto actual se muestra como figura en el CV; actualizarlo cuando cambie.

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

## Desarrollo con IA (Specboot + OpenSpec)

El repo incluye una adaptación del harness [Specboot](https://lidr.co/ia-devs) de LIDR.co, con el flujo de desarrollo guiado por specs de [OpenSpec](https://github.com/Fission-AI/OpenSpec). Claude Code, Cursor, Codex y Gemini comparten las mismas reglas, agentes y skills.

- **Reglas**: `docs/base-standards.md` es la fuente única. `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` y `codex.md` son copias generadas.
- **Contexto del proyecto**: `docs/frontend-standards.md`, `docs/content-model.md`, `docs/documentation-standards.md`, `docs/development_guide.md` y `docs/openspec-tasks-mandatory-steps.md`.
- **Agentes y skills**: `ai-specs/` es la fuente canónica. Las copias para `.claude/` y `.cursor/` se generan con `node ai-specs/scripts/sync-agent-files.mjs`, y `--check` las verifica (el workflow **Verificar harness** lo hace en CI).
- **OpenSpec**: `openspec/config.yaml` define el contexto y las reglas por artefacto. Flujo: worktree opcional (`using-git-worktrees`) → `/enrich-us` → `/opsx:propose` → `/opsx:apply` → `/adversarial-review` → `/opsx:archive` → `/commit`. En Cursor, los comandos se escriben `/opsx-propose`, `/opsx-apply`, etc. Tabla completa en `docs/development_guide.md` §5.
- **Automatización de navegador**: los pasos de verificación usan Playwright MCP u otra herramienta equivalente (instalación en `docs/development_guide.md` §1).
- **Antes de hacer push o merge a `main`**: `gh api 'repos/{owner}/{repo}/pages' --jq .build_type` tiene que devolver `workflow`. Las comillas son necesarias en PowerShell. Si devuelve otra cosa o falla, no hacer push.

Detalle, diferencias con Specboot original y créditos: `ai-specs/specboot-instructions.md`.

## Experiencia ampliada

Las seis experiencias incluyen contexto, un aporte destacado y contribuciones concretas. El CV de tres páginas conserva los mismos aportes, fechas y puestos. NEORIS distingue el desarrollo de SIGMA de la aplicación de ejemplo para actualización tecnológica. Concrete-Quality incluye implementación y evolución del agente Python e integración de IA, sin afirmar su autoría original ni el despliegue productivo de todas sus capacidades. No se agregan métricas ni antigüedad Senior inferida de respuestas anteriores de IA.
