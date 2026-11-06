/# Backlog

> Estado vigente de todo el trabajo del proyecto. **Si no está acá, no se programa.**
>
> Cómo se usa: [`docs/workflow.md`](docs/workflow.md).

## Índice

- [Convenciones](#convenciones)
- [Sprint 0 · Base técnica](#sprint-0--base-técnica)
- [Sprint 1 · Sitio de presentación](#sprint-1--sitio-de-presentación)
- [Sprint 2 · Turnos](#sprint-2--turnos)

## Convenciones

### Tipos de ítem

| ID      | Qué es                                                                                   | Ejemplo                          |
| ------- | ---------------------------------------------------------------------------------------- | -------------------------------- |
| `US-N`  | **Historia de usuario**: algo que un paciente o [Nombre] ven y usan                      | Reservar un turno                |
| `T-N`   | **Habilitador técnico**: no aporta nada visible, pero hace falta para construir lo demás | Login del panel                  |
| `BUG-N` | **Defecto**: algo que funciona mal                                                       | Un turno duplicado               |

### Estados

| Estado        | Significa                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| `Pendiente`   | Cargado, todavía no empezó                                                                                |
| `En progreso` | Alguien lo tomó: tiene dueño y fecha de inicio                                                            |
| `En revisión` | Terminado, verificado e integrado en `develop` con el OK del dev (merge squash local, sin PR); espera la revisión final del dev |
| `Hecho`       | El dev lo aprobó y los cambios ya están en `develop` (o en `main`, en el caso del arranque)               |

### Cuándo se puede tomar un ítem

Cuando cumple la Definition of Ready ([`docs/definition-of-done.md`](docs/definition-of-done.md)):

- Tiene historia y criterios de aceptación medibles, cada uno con su estimación.
- Sus dependencias están en `Hecho`.
- Tiene un plan aprobado en `docs/plans/<ID>-<slug>.md`.

### Cómo se registran los criterios de aceptación (CA)

- Cada CA ocupa **una sola línea**, separada de la siguiente por una línea en blanco.
- `[ ]` = pendiente; `[x]` = cumplido y verificado.
- **Completado**: fecha y hora de cierre en hora de Argentina (`AAAA-MM-DD HH:MM`). Mientras está pendiente dice
  `—`.
- **Horas reales**: el total del ítem, que el dev carga al cerrarlo.

### Cómo se estima

- La implementación la hace el agente y lleva minutos. **El cuello de botella es el dev**: leer el plan,
  inspeccionar el código, verificar, correr los tests y aprobar.
- La **estimación** de un CA es el tiempo total hasta cerrarlo:
  - la implementación del agente;
  - las esperas de comandos (instalar dependencias, CI, Stryker);
  - la revisión del dev.
- La lectura del plan del ítem se suma al primer CA.
- Formato: `20 min`, `1 h`, `1 h 30 min`.

### Plantilla de ítem

```markdown
### <ID> · <título>

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | S / M / L |
| Depende de   | —         |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como <rol> quiero <qué>, de forma que <para qué>.
(En un BUG, en lugar de la historia: **Actual** y **Esperado**.)

**Criterios de aceptación**

- [ ] **CA-1** · <criterio medible> · Estimación: 20 min · Completado: —

- [ ] **CA-2** · <criterio medible> · Estimación: 10 min · Completado: —

**Preguntas abiertas**

- <dudas que el dev no puede responder sin el cliente>
```

`Merge` es el hash del commit del ítem en `develop`, y se carga al pasarlo a `Hecho`. No se abren PR: cada ítem se
integra con merge squash local, con el OK del dev (ver [`docs/git.md`](docs/git.md#flujo)).

------------------------------------------------------------------------------------------------------------------------

## Sprint 0 · Base técnica

### T-1 · Base del repo copiada de gestor-empanaderia

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En progreso |
| Dueño        | Tomás       |
| Inicio       | 2026-11-06  |
| Tamaño       | M           |
| Depende de   | —           |
| Plan         | —           |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como dev quiero el flujo, las reglas y los gates de gestor-empanaderia en este repo, de forma que
los agentes trabajen igual desde el primer commit.

**Criterios de aceptación**

- [ ] **CA-1** · `AGENTS.md`, `CLAUDE.md`, `docs/` y las skills propias están adaptados al proyecto · Estimación: 30 min · Completado: —

- [ ] **CA-2** · `npm run lint`, `npm run typecheck` y `npm run test:coverage` pasan en verde · Estimación: 30 min · Completado: —

- [ ] **CA-3** · `docker compose up -d --wait db-test` y `npm run test:int` pasan (migraciones vacías) · Estimación: 20 min · Completado: —

- [ ] **CA-4** · Primer commit en `main`, rama `develop` creada y CI en verde · Estimación: 20 min · Completado: —

### T-2 · Tokens de `DESIGN.md` en Tailwind y shadcn/ui

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | S         |
| Depende de   | T-1       |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como dev quiero la paleta, la tipografía (Manrope) y los radios de `DESIGN.md` como tokens, de forma
que ningún componente use colores hardcodeados.

**Criterios de aceptación**

- [ ] **CA-1** · Tokens de `DESIGN.md` en `globals.css` y shadcn/ui inicializado con ellos · Estimación: 30 min · Completado: —

- [ ] **CA-2** · Un test verifica el contraste AA de los pares de color que usa la UI · Estimación: 20 min · Completado: —

### T-3 · Login del panel con Supabase Auth

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | M         |
| Depende de   | T-1       |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como [Nombre] quiero entrar a un panel privado, de forma que sólo yo administre los turnos.

**Criterios de aceptación**

- [ ] **CA-1** · `/admin` sin sesión redirige al login; con sesión, entra · Estimación: 40 min · Completado: —

- [ ] **CA-2** · Toda action del panel verifica la sesión en el servidor (test de contrato sin sesión → `UNAUTHENTICATED`) · Estimación: 30 min · Completado: —

**Preguntas abiertas**

- ¿Login con email y contraseña, o con link mágico por email?

## Sprint 1 · Sitio de presentación

Ítems a definir con [Nombre]: home, sobre mí, servicios, sucursales con mapa, preguntas frecuentes y contacto por
WhatsApp. Se cargan como `US-N` después del descubrimiento (`docs/workflow.md` §0).

### US-1 · Hero de la home con la frase de [Nombre]

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | M         |
| Depende de   | T-2       |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente que entra a la web quiero ver a [Nombre] y leer su frase sobre la alimentación, de
forma que entienda de entrada cómo trabaja.

Origen: `docs/requerimientos/specs.md` (pedido de la foto-cabecera y la frase). La forma y la ubicación las define
el "Hero enmarcado" de `DESIGN.md`. El pedido define solo el texto que se tiene que leer.

Fuera de alcance: la píldora "Reservá tu primera consulta" y el selector de sucursal del hero. Se agregan con las
US de reserva y de sucursales.

**Criterios de aceptación**

- [ ] **CA-1** · Hero enmarcado según `DESIGN.md` (borde Papel 35px/16px, radio 88px/40px, fondo Verde Bosque) con la foto recortada de [Nombre] al centro, servida con `next/image` y `alt` descriptivo (placeholder visible `[Completar: foto hero]` mientras no esté) · Estimación: 45 min · Completado: —

- [ ] **CA-2** · La frase se lee completa y textual, sin que la foto la tape, en 375px y en desktop: «La alimentación nos atraviesa durante toda nuestra vida» y «Y aprender a transformarla en un buen hábito es la base de tu salud» · Estimación: 30 min · Completado: —

- [ ] **CA-3** · La frase cumple contraste AA sobre el fondo del hero y es el `h1` de la página · Estimación: 10 min · Completado: —

- [ ] **CA-4** · Debajo del hero va la línea de presentación "Licenciado en Nutrición · MN [Completar: matrícula]" · Estimación: 10 min · Completado: —

- [ ] **CA-5** · Garabatos del hero en SVG con `aria-hidden`; si se animan, respetan `prefers-reduced-motion` · Estimación: 20 min · Completado: —

**Preguntas abiertas**

- Foto recortada de [Nombre] para el hero (sin fondo, de la cintura para arriba, ropa lisa que no sea verde).
- Nombre profesional y matrícula para la línea de presentación.

**Preguntas abiertas del sprint**

- Nombre profesional, matrícula, slogan, servicios (con o sin aranceles), sucursales y horarios, obras sociales.

## Sprint 2 · Turnos

Ítems a definir: disponibilidad por sucursal, reserva online, cancelación con link, panel de agenda y emails.

**Preguntas abiertas**

- ¿Los turnos se confirman solos o los confirma [Nombre]?
- ¿Cuánto dura cada tipo de consulta? ¿Con cuántas horas de anticipación se puede reservar o cancelar?
- ¿Qué proveedor de email se usa?
