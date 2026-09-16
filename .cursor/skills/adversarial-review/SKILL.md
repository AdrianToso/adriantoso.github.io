---
name: adversarial-review
description: Usar cuando el usuario pide una revisión adversarial, red team, abogado del diablo o una verificación independiente antes de archivar un cambio de OpenSpec.
author: LIDR.co (adaptada para adriantoso.github.io)
version: 1.0.0
---

# Skill adversarial-review

Actuá como **revisor adversarial independiente**: suponé que hay huecos, fallas o comportamientos inseguros hasta que puedas descartarlos con evidencia.

Esta skill se usa en la **ventana de verificación** del desarrollo guiado por specs (después de implementar y **antes** de archivar), cuando la persona usa **otro agente u otra sesión** que la que implementó el cambio.

**No** indiques qué agente, modelo o IDE usar: eso lo decide la persona.

## Entradas

- Contexto opcional del usuario:
  - Nombre del cambio de OpenSpec o identificador de ticket.
  - Sección o ancla del sitio (por ejemplo, `#certificados`).
  - **Pull request**: URL o `owner/repo#número`.
- Si falta, inferilo de la sesión (cambio activo, rama o carpeta de `openspec/changes/`).

Resolvé el alcance en este orden: cambio o ticket explícito, PR si lo hay, trabajo activo.

## Mentalidad

- **Intentá romper el sitio**, no solo confirmar el camino feliz.
- **Buscá supuestos incorrectos**: contenido, fechas, conteos, orden, estados de ARIA y comportamiento sin JS.
- **Seguí los riesgos entre partes**: HTML, CSS y JS que andan por separado pero fallan juntos (un filtro sin su categoría, un ancla sin su enlace, un archivo nuevo que no se publica).
- **El diff no es todo el contexto**: faltan verificaciones, casos negativos o hay desvíos de la spec.
- **Calibrá la profundidad** según el riesgo: datos personales, enlaces externos, veracidad del contenido y publicación merecen más rigor.

## Flujo

### Paso 1: la especificación primero

1. Identificá la carpeta del cambio en `openspec/changes/<cambio>/` y leé la propuesta, el diseño, las specs, los escenarios y `tasks.md`.
2. Extraé los **criterios de aceptación y lo que queda fuera de alcance**. Listá qué tiene que cumplirse para considerarlo terminado.
3. Anotá lo que esté **subespecificado** (criterios ambiguos, falta el comportamiento sin JS, móvil o teclado, o falta la fuente de los datos).

### Paso 2: la implementación

1. Si hay **PR**, es la superficie principal: leé la descripción y todo el diff, y relacioná cada archivo con las secciones de la spec y las tareas.
2. Si no hay PR: `git diff` contra la base de la rama del cambio.
3. Leé los reportes de `openspec/changes/<cambio>/reports/`.

### Paso 3: pasada adversarial (refutar, no aprobar por inercia)

Para cada criterio o escenario:

1. Explicá cómo podría fallar aunque el autor crea que funciona: anchos de 320 y 360 px, zoom del 200%, texto largo, JS deshabilitado, teclado, lector de pantalla, impresión, movimiento reducido, filtro sin tarjetas, contador desactualizado o enlace que pide inicio de sesión.
2. Revisá los casos negativos y de abuso: datos sensibles en el HTML o en los metadatos del PDF, `target="_blank"` sin `rel`, `innerHTML` con datos o recursos externos nuevos.
3. Revisá las **verificaciones**: ¿los reportes **prueban** el criterio o solo el camino feliz?
4. Revisá la **publicación**: ¿`scripts/package-site.mjs` incluye los archivos nuevos y excluye el harness?
5. Registrá las **diferencias entre spec y código** como hallazgos de primer nivel.

### Paso 4: severidad y recomendaciones

- **Bloqueante**: comportamiento incorrecto, problema de privacidad o seguridad, contenido falso o violación de la spec. Impide archivar.
- **Mayor**: bug probable o hueco importante. Hay que corregir el código o la spec antes de archivar.
- **Menor**: claridad, mantenibilidad o riesgo bajo. Puede quedar para después.
- **Pregunta o supuesto**: necesita confirmación del titular o del autor.

Para cada hallazgo, indicá si el arreglo va en el **código**, en la **verificación**, en los **artefactos de OpenSpec** o en la **documentación**.

### Paso 5: veredicto

- **APROBADO (adversarial)**: sin bloqueantes ni mayores.
- **APROBADO CON HUECOS**: solo menores, registrados.
- **RECHAZADO**: al menos un bloqueante o mayor sin resolver.

## Formato de salida

Usá esta estructura en el chat. Si el usuario pide guardarla, dejala además en `openspec/changes/<cambio>/reports/AAAA-MM-DD-revision-adversarial.md`.

```markdown
## Revisión adversarial

**Alcance**: <cambio / ticket / PR>
**Fuentes**: <rutas de specs + PR o diff>

### Alineación con specs y tareas
- ...

### Hallazgos

| Severidad | Área | Hallazgo | Evidencia | Arreglo sugerido (código / spec / verificación / docs) |
|---|---|---|---|---|
| Bloqueante / Mayor / Menor | | | | |

### Veredicto
APROBADO | APROBADO CON HUECOS | RECHAZADO

### Próximos pasos (antes de archivar)
- ...
```

## Límites

- **No** elogies la implementación para "equilibrar" la crítica, salvo que una fortaleza **mitigue un riesgo documentado**.
- **No** omitas los artefactos de OpenSpec si existen en el repo.
- Si no podés acceder al PR o al diff, decilo y listá exactamente qué necesitás para continuar.

## Cierre

Terminá siempre con el veredicto e indicá si es **recomendable archivar** en el estado actual.
