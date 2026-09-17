## Context

Las seis experiencias se muestran como resúmenes mínimos. La ampliación debe conservar trazabilidad profesional y una lectura accesible en la web y en PDF.

## Goals / Non-Goals

**Goals:** describir contexto, contribución y valor de cada puesto; ampliar el PDF sin reducir artificialmente la tipografía; mantener coherencia entre formatos.

**Non-Goals:** rediseño completo, nuevos proyectos públicos, publicación o cambios de infraestructura.

## Decisions

- Mantener las seis filas, fechas y puestos. Cada fila tendrá un aporte destacado, un párrafo de contexto y una lista visible de responsabilidades y resultados. Todo estará accesible sin interacción adicional ni JavaScript.
- Usar listas semánticas con el estilo actual y los tokens existentes. No agregar controles ni animaciones. Mantener las media queries existentes; las reglas nuevas solo estilizan el contenido, sin cambiar la grilla.
- PDF de aproximadamente tres páginas con texto seleccionable, enlaces profesionales y bloques de experiencia que no se corten entre páginas. La cantidad final se verifica y se refleja en la web.
- El contenido de NEORIS identifica explícitamente la aplicación .NET 8 como ejemplo de actualización tecnológica. El contexto de IA describe implementación y evolución de un agente existente, sin reclamar su autoría original.
- Consultar la rama feature/chat-ai de los repositorios locales indicados por el titular en modo de solo lectura. No cambiar ramas, ejecutar servicios ni exponer detalles internos. Incorporar solo capacidades comprobadas y el aporte declarado por el titular.
- La generación del PDF y las comprobaciones usan herramientas del entorno; no agregan dependencias al sitio.

## Risks / Trade-offs

- Mayor longitud de la web: listas breves y encabezados de valor permiten escanear cada experiencia.
- Atribución excesiva: contrastar CV, CV ampliado, declaración del titular y código; no transformar propuestas en logros.
- Información sensible: excluir datos personales, referencias y detalles internos del sistema de IA.
- Maquetación: revisar 320, 360, 390, 768, 1024, 1440 y 1920 px y ancho equivalente a zoom 200%; imprimir sin ocultar los nuevos detalles y revisar cada página del PDF.

## Migration Plan

Mantener la ruta del PDF. Preparar cambios locales y vista previa. La publicación queda fuera de este pedido.
