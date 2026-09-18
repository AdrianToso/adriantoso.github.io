## ADDED Requirements

### Requirement: Acceso público al comprobante preferido
Cada tarjeta SHALL enlazar al comprobante original del emisor cuando se verifica en navegador sin iniciar sesión; si no es posible, SHALL utilizar el PDF público de Drive del CV ampliado.

#### Scenario: Original Udemy disponible
- **WHEN** el visitante abre cualquiera de los seis certificados Udemy
- **THEN** accede a la página del emisor con certificado de Adrian Toso y el curso correspondiente sin iniciar sesión; el enlace de Copilot usa el código validado del diploma.

#### Scenario: Comprobante de respaldo
- **WHEN** el visitante abre un certificado NEORIS sin enlace público original aportado
- **THEN** accede al PDF público correspondiente en Drive; se mantienen doce tarjetas únicas y las categorías existentes.

#### Scenario: Enlaces accesibles
- **WHEN** se navega por teclado o se consultan los nombres accesibles de los enlaces
- **THEN** cada enlace permite abrir el comprobante y anuncia el emisor o Drive y la apertura de otra pestaña, con noopener noreferrer y flecha decorativa oculta.

#### Scenario: Registro oficial y diploma Scrum
- **WHEN** el visitante consulta la tarjeta Scrum Fundamentals Certified
- **THEN** ve la credencial 1039383, la emisión 4 de julio de 2024 y Sin vencimiento, con Verificar credencial al registro público SCRUMstudy y Ver diploma PDF al original aportado, sin iniciar sesión.

### Requirement: Acciones claras y diseño adaptable
Las tarjetas SHALL distinguir el destino de sus enlaces y mantener las acciones accesibles con y sin JavaScript.

#### Scenario: Lectura y controles táctiles
- **WHEN** el visitante explora certificados a 320, 360, 390, 768, 1024, 1440 o 1920 px, o al equivalente de zoom 200%
- **THEN** no hay desbordes ni solapamientos, las tarjetas alinean sus acciones al fondo y cada filtro y enlace nuevo mide al menos 44 px de alto.

#### Scenario: Teclado y mejora progresiva
- **WHEN** el visitante usa Tab, Enter y Espacio o navega sin JavaScript
- **THEN** puede acceder a los enlaces nativos de las doce tarjetas, los controles tienen foco visible y los filtros se ocultan solo cuando no hay JavaScript.
