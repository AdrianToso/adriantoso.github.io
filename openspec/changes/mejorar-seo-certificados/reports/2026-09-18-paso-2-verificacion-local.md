# Paso 2: registro Scrum y diseño

- Fecha: 2026-09-18
- Cambio: mejorar-seo-certificados
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: CUA

## Comandos ejecutados
- Navegador: registro SCRUMstudy sin sesión; nombre Adrian Toso, ID 1039383, Valid From Jul 04, 2024, Valid Till Never Expires.
- urllib y pypdf sobre PDF original aportado: HTTP 200, application/pdf, 584755 bytes, una página; titular, fecha e identificador coinciden. Render con Poppler e inspección visual completa del diploma.
- URL del registro: https://www.scrumstudy.com/certification/verify?type=SFC&number=1039383
- URL del PDF: https://c46e136a583f7e334124-ac22991740ab4ff17e21daf2ed577041.ssl.cf1.rackcdn.com/Certificate/ScrumFundamentalsCertified-AdrianToso-1039383.pdf

## Escenarios verificados
| Escenario | Cómo se comprobó | Resultado |
|---|---|---|
| Registro oficial y diploma Scrum | Registro en navegador y PDF original leído y renderizado; destinos HTML exactos | PASA |
| Lectura y controles táctiles | Medidas DOM por ancho, sin overflow de documento ni tarjetas | PASA |
| Filtrado Agilidad | Dos tarjetas y contador correcto; Scrum conserva ambas acciones | PASA |

## Anchos y modos revisados
- 1920, 1440: tres columnas; 1024, 768, 720: dos; 390, 360, 320: una.
- 720 px equivale a 200% sobre 1440. Sin desbordes.
- En todos los anchos: filtros de 44 px, enlaces de 52 px o más. Revisión visual móvil con tarjeta Scrum, emisor, fecha, ID, vigencia y acciones separadas.

## Consola
- Sin errores ni advertencias del sitio.

## Qué quedó sin comprobar
- Nueva publicación remota: pendiente de solicitud.

## Problemas y resolución
- Caché del CSS anterior en la vista previa → URL de styles.css versionada; estilos calculados confirman radio 12px y padding de enlace 10px.
- Lector web de búsquedas no pudo abrir las fuentes → comprobación con navegador y cliente HTTP, sin modificar permisos ni saltar restricciones.

## Resultado
- Estado: PASA
- Bloqueos: ninguno para la edición local.
