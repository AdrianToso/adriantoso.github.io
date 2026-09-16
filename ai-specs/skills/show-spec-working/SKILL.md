---
name: show-spec-working
description: Usar cuando el usuario dice "mostrame X", "demostrá X", "haceme un recorrido por X", "cómo funciona X" (o "show me X", "demo X") o pide una demostración en vivo de una spec, un cambio o una sección del sitio.
author: LIDR.co (adaptada para adriantoso.github.io)
version: 1.0.0
---

# Skill show-spec-working

Demostrá una spec funcionando en el navegador.

Si el usuario no da contexto explícito, usá el cambio o la spec en la que se está trabajando en la sesión.

Terminá siempre informando el resultado en el chat.

## Frases que la activan (prioridad alta)

Tratalas como órdenes de ejecución, no como pedidos de análisis:

- `mostrame X`, `show me X`
- `demostrá X`, `demo X`
- `haceme un recorrido por X`, `walk me through X`
- `mostrá X funcionando`, `show X working`
- `cómo funciona X`, `how X works`
- `probá que X funciona`, `prove X works`

Cuando aparezcan, ejecutá directamente el flujo de demostración. No te quedes en un resumen.

## Entradas

- Contexto opcional: nombre del cambio de OpenSpec, identificador de ticket (`[A-Z]+-[0-9]+`), sección o ancla (`#certificados`) o comportamiento ("filtros").
- Si falta, inferilo del trabajo activo.

## Flujo

### Paso 1: resolver el alcance

1. Identificá la spec o el cambio en `openspec/changes/<cambio>/` o `openspec/specs/`.
2. Listá los escenarios concretos que vas a demostrar, tomados de los criterios de aceptación.

### Paso 1.1: no quedarse en el informe

- Nunca termines después de solo analizar los requisitos.
- Si algo bloquea la ejecución, informalo y pedí exactamente lo que falta para seguir.

### Paso 2: demostración en el navegador

1. Levantá el servidor local si no está corriendo: `python -m http.server 8000 --bind 127.0.0.1`. Para mostrar exactamente lo que se publica, usá `node scripts/package-site.mjs` y serví `_site/`.
2. Abrí el sitio con la automatización de navegador disponible y andá a la sección.
3. Demostrá el comportamiento de a una interacción por vez. Por ejemplo, para los certificados:
   - Abrir `#certificados` y ver todas las tarjetas (tantas como indica el texto inicial de `.certificate-count` en `index.html`).
   - Aplicar cada filtro y comprobar la cantidad y el contador.
   - Navegar los filtros con el teclado.
   - Abrir un comprobante (se abre en otra pestaña).
4. Después de cada acción significativa, verificá que lo visible coincida con la spec.
5. Cuando corresponda, mostrá también el ancho de 390 px y el comportamiento sin JavaScript.
6. Terminá en un estado estable y dejá el navegador abierto, salvo que el usuario pida cerrarlo.

## Requisitos de la automatización de navegador

Antes de usar una herramienta MCP de navegador:

1. Leé el descriptor de la herramienta.
2. Seguí las instrucciones del servidor sobre bloqueo y actualización de capturas.
3. No reintentes a ciegas: si algo bloquea, informalo con la mejor acción siguiente.

Este sitio no tiene API ni datos persistentes: no hace falta restaurar estado.

## Cierre

Mandá siempre un mensaje final con:

1. La spec o el cambio demostrado.
2. Los recorridos ejecutados.
3. El resultado por escenario (bien o mal, con una nota breve).
4. El cierre: "Demostración completa. Podés seguir revisando en la ventana abierta del navegador o pedirme que la cierre."

## Formato de salida

```markdown
Demostración completa de: <spec / cambio>

Recorrido en el navegador:
- <paso / resultado>

Resultado por escenario:
- <escenario>: bien | mal (<nota>)

Siguiente:
- Podés seguir en la ventana abierta del navegador o pedirme que la cierre.
```
