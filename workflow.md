# Filosofía de trabajo

Cómo se encara cualquier proyecto, con agentes de IA o a mano. Es la base: cada proyecto la baja a sus propias
reglas, herramientas y comandos.

```
Requerimiento → Backlog → Descubrimiento → Plan aprobado → Rama → Tests primero → Gates → Docs → Integración
```

## Principios

1. **Si no está registrado, no se hace.** Todo trabajo nace como un ítem del backlog, con historia y criterios de
   aceptación medibles.
2. **Se pregunta, no se inventa.** Las reglas de negocio no se asumen: lo que no está escrito se le pregunta a quien
   decide.
3. **Primero el plan, después el código.** Cada tarea tiene un plan escrito que alguien aprueba antes de empezar.
4. **El cambio más chico que resuelva el problema.** Se arregla la causa, en un solo lugar.
5. **Evidencia antes de decir "listo".** Nada está terminado sin tests en verde y una verificación concreta.
6. **La documentación es parte del cambio.** Si el código y la doc se contradicen, el trabajo no está terminado.
7. **El humano decide.** El agente propone y ejecuta; la persona aprueba los puntos clave.

## Roles

- **Cliente**: pide. Sus pedidos se guardan textuales, sin editar.
- **Dev**: interpreta, decide y aprueba. Es el único que habla con el cliente.
- **Agente**: descubre, planifica, implementa y verifica, siempre dentro de las reglas del repo.

## El ciclo

### 1. Entrada
El pedido del cliente se guarda tal cual. Se interpreta, se hacen las preguntas necesarias y se convierte en
ítems del backlog (historias, habilitadores técnicos o bugs), cada uno con su estimación.

### 2. Descubrimiento
Antes de planificar se recorre una lista fija de preguntas: quién hace la acción, qué datos entran y salen, cuál
es el camino feliz, qué puede salir mal, qué pasa si dos personas editan lo mismo, cómo se ve cada estado de la
pantalla y cómo se mide que está terminado. Lo que no se puede responder queda como pregunta abierta.

### 3. Plan
Un documento corto por tarea: objetivo, respuestas del descubrimiento, cambios previstos, errores posibles, tests
y **nivel de verificación**. Se espera la aprobación antes de escribir código.

### 4. Implementación
Una rama por ítem, de vida corta. Se trabaja con TDD: test que falla, código mínimo, refactor. Se construye de
adentro hacia afuera: contratos y reglas primero, interfaz al final.

### 5. Gates
Las reglas importantes no dependen de la memoria: las hacen cumplir el lint, los hooks y el CI. La profundidad de
la verificación es proporcional al riesgo del cambio:

| Nivel | Cuándo | Verificación |
|---|---|---|
| Liviano | Textos, estilos, docs | Lint, tipos y tests relacionados |
| Medio | Lógica acotada, bug de causa conocida | Lo anterior + suite y cobertura |
| Profundo | Datos, seguridad, cambios que cruzan capas | Todo: integración, mutación, build y E2E |

Ante la duda, el nivel de arriba. Nunca se saltean los gates: si uno falla, se arregla la causa.

### 6. Cierre
Se recorre la Definition of Done, se actualizan la documentación y el backlog, y se le muestra al dev un resumen
**en lenguaje simple** de lo que entra. Con su OK se integra (un commit por ítem) y el ítem queda en revisión
hasta que lo aprueba.

## Calidad de código

- Código chico y legible: archivos y funciones cortos, una responsabilidad por pieza.
- El código se explica solo; los comentarios sólo para el *por qué*.
- Arquitectura en capas con dependencias en una sola dirección.
- Tipado estricto, entradas validadas en los bordes y errores con mensajes claros para el usuario.
- Las reglas que la base de datos puede garantizar, las garantiza la base de datos.
- Seguridad del lado del servidor, siempre.

## Documentación

- Vive en el repo, junto al código, y se actualiza en el mismo cambio.
- Un archivo canónico de reglas para agentes y humanos; si algo lo contradice, gana él.
- Un documento de contexto completo para que un agente nuevo arranque sin adivinar, mantenido al día.
- Las decisiones de arquitectura se registran (ADR) con su por qué.
- Cada feature documenta su comportamiento vigente y sus errores.

## Trabajo con agentes

- Las partes repetibles del flujo se convierten en skills (arrancar tarea, cerrar tarea, delegar).
- Se delega cada pieza al modelo más barato que pueda hacerla, y todo resultado delegado se verifica.
- El agente se detiene y espera aprobación en los puntos clave: plan, commit e integración.
