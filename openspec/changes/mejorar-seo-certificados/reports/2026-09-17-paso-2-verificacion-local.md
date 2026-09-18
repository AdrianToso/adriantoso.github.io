# Paso 2: verificación local

- Fecha: 2026-09-17
- Cambio: mejorar-seo-certificados
- Agente y modelo: Codex / GPT-6
- Herramienta de navegador: CUA, navegador integrado sin sesión en los emisores

## Comandos ejecutados
- Navegador CUA sobre http://127.0.0.1:8770/ (paquete _site): comprobaciones DOM, capturas y navegación.
- Invoke-WebRequest sobre robots.txt, sitemap.xml y PDF: HTTP 200 con tipos text/plain, text/xml y application/pdf.

## Escenarios verificados
| Escenario (spec) | Cómo se comprobó | Resultado |
|---|---|---|
| Metadatos y perfil | Título, canonical, description, ProfilePage/mainEntity/Person y propiedades inspeccionados en DOM | PASA |
| Rastreo canónico | XML parseado, robots y sitemap servidos por HTTP; una URL HTTPS canónica | PASA |
| Original Udemy disponible | Seis páginas con imagen cargada, titular y curso sin sesión; reporte de certificados | PASA |
| Comprobante de respaldo | Seis PDF Drive abiertos con titular y curso sin sesión | PASA |
| Diseño adaptable | Medición de scrollWidth y capturas de portada y certificados | PASA |

## Anchos y modos revisados
- 1920 / 1440 / 1024 / 768 / 390 / 360 / 320 px y 720 px como equivalente al zoom 200% desde 1440: sin desbordamiento horizontal.
- Capturas visuales a 320 y 1920: texto legible, nombre sin alteraciones tipográficas, tarjetas y controles sin solapamientos.
- Filtros mediante Enter: Todos 12, Desarrollo 2, Arquitectura 3, IA 2, Seguridad y calidad 3, Agilidad 2. Contador y aria-pressed coherentes.

## Consola
- Sin errores ni advertencias del sitio local.

## Qué quedó sin comprobar
- Indexación real y validación de Google en producción: cambios locales, aún no publicados.

## Problemas y resolución
- El navegador integrado bloqueó la apertura directa de robots.txt como documento → se comprobó su respuesta HTTP 200, contenido y XML del sitemap desde el servidor local.
- Un span en el h1 heredaba el acento tipográfico existente → se usó data con itemprop=name y valor coincidente con el nombre visible; se verificó que conserva la fuente del h1.

## Resultado
- Estado: PASA
- Bloqueos: ninguno para el cambio local.
