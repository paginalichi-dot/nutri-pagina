# Backlog

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
| `US-N`  | **Historia de usuario**: algo que un paciente o Lisandro ven y usan                      | Reservar un turno                |
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

- [x] **CA-1** · `AGENTS.md`, `CLAUDE.md`, `docs/` y las skills propias están adaptados al proyecto · Estimación: 30 min · Completado: 2026-11-06 19:28

- [x] **CA-2** · `npm run lint`, `npm run typecheck` y `npm run test:coverage` pasan en verde · Estimación: 30 min · Completado: 2026-11-06 19:28

- [x] **CA-3** · `docker compose up -d --wait db-test` y `npm run test:int` pasan (migraciones vacías) · Estimación: 20 min · Completado: 2026-11-06 19:28

- [ ] **CA-4** · Primer commit en `main`, rama `develop` creada y CI en verde · Estimación: 20 min · Completado: —

### T-2 · Tokens de `DESIGN.md` en Tailwind y shadcn/ui

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | S         |
| Depende de   | T-1       |
| Plan         | [`docs/plans/T-2-tokens-design.md`](docs/plans/T-2-tokens-design.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como dev quiero la paleta, la tipografía (Manrope) y los radios de `DESIGN.md` como tokens, de forma
que ningún componente use colores hardcodeados.

**Criterios de aceptación**

- [x] **CA-1** · Tokens de `DESIGN.md` en `src/app/tokens.css` (importado por `globals.css`) y shadcn/ui inicializado con ellos · Estimación: 30 min · Completado: 2026-11-06 20:26

- [x] **CA-2** · Un test verifica el contraste AA de los pares de color que usa la UI · Estimación: 20 min · Completado: 2026-11-06 20:26

- [x] **CA-3** · ESLint rechaza colores hex escritos en `src/**/*.{ts,tsx}` · Estimación: 15 min · Completado: 2026-11-06 20:26

### T-3 · Login del panel con JWT propio

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | L         |
| Depende de   | T-1       |
| Plan         | [`docs/plans/T-3-login-panel.md`](docs/plans/T-3-login-panel.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como Lisandro quiero entrar a un panel privado, de forma que sólo yo administre los turnos.

Decisiones del dev (2026-11-06): se entra con email y contraseña, sin registro público, con un login propio con
JWT en lugar de Supabase Auth, para probar todo con Docker ([ADR 0004](docs/adr/0004-login-propio-con-jwt.md)).
La sesión queda iniciada para siempre, hasta "Cerrar sesión". Por ahora hay una sola cuenta admin, de prueba; el
alta del admin de producción queda para el ítem de despliegue. Quien escriba `/admin` sin la sesión del admin ve
"Acceso denegado": el login vive sólo en `/admin/login` y ningún link lleva ahí.

**Criterios de aceptación**

- [x] **CA-1** · `/admin/login` con email y contraseña correctos entra a `/admin`; con sesión, `/admin/login` lleva a `/admin`; "Cerrar sesión" vuelve a `/admin/login` · Estimación: 1 h · Completado: 2026-11-06 21:33

- [x] **CA-2** · Toda action del panel verifica la sesión en el servidor (test de contrato: sin cookie o token adulterado → `UNAUTHENTICATED`, sesión cerrada → `SESSION_EXPIRED`) · Estimación: 40 min · Completado: 2026-11-06 21:16
- [x] **CA-3** · Un email o una contraseña incorrectos muestran `INVALID_CREDENTIALS`, con el mismo tiempo de respuesta exista o no el email · Estimación: 30 min · Completado: 2026-11-06 21:16

- [x] **CA-4** · 5 intentos fallidos seguidos bloquean el login 15 minutos (`RATE_LIMITED`), y el bloqueo se guarda en la base · Estimación: 30 min · Completado: 2026-11-06 21:16

- [x] **CA-5** · La contraseña se guarda con `scrypt` y ni ella ni su hash salen nunca del servidor · Estimación: 20 min · Completado: 2026-11-06 21:16

- [x] **CA-6** · `npm run db:seed` crea una cuenta admin de prueba con datos ficticios (y se niega con `APP_ENV=production`), y el login se prueba completo con Docker: integración y E2E con esa cuenta · Estimación: 40 min · Completado: 2026-11-06 21:33

- [x] **CA-7** · La sesión no vence: la cookie dura 400 días y se renueva en cada visita al panel; sólo se cierra con "Cerrar sesión" o cuando cambia la `session_version` (US-5) · Estimación: 30 min · Completado: 2026-11-06 21:16

- [x] **CA-8** · `/admin` y cualquier `/admin/**` sin sesión de admin muestran "Acceso denegado" (la URL no cambia, `noindex`) con un botón "Volver al inicio", sin link al login · Estimación: 40 min · Completado: 2026-11-06 21:33

### US-5 · El admin cambia su email y su contraseña

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | M         |
| Depende de   | T-3       |
| Plan         | [`docs/plans/US-5-cuenta-admin.md`](docs/plans/US-5-cuenta-admin.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como admin quiero cambiar mi email y mi contraseña desde el panel, de forma que la cuenta de prueba
pase a ser mía sin tocar la base a mano.

**Criterios de aceptación**

- [x] **CA-1** · En `/admin/cuenta` el admin cambia su email, confirmando con su contraseña actual, y desde ese momento entra con el email nuevo · Estimación: 40 min · Completado: 2026-11-06 21:58

- [x] **CA-2** · En `/admin/cuenta` el admin cambia su contraseña: actual, nueva (8 a 128 caracteres) y repetición; desde ese momento entra con la nueva · Estimación: 40 min · Completado: 2026-11-06 21:58

- [x] **CA-3** · Contraseña actual incorrecta → `WRONG_PASSWORD` sin cambiar nada; repetición distinta o email inválido → `VALIDATION` con el mensaje del campo · Estimación: 20 min · Completado: 2026-11-06 21:58

- [x] **CA-4** · Cualquiera de los dos cambios cierra las demás sesiones abiertas; la sesión desde la que se hizo el cambio sigue activa · Estimación: 30 min · Completado: 2026-11-06 21:58

## Sprint 1 · Sitio de presentación

Origen: primer pedido del cliente en `docs/requerimientos/specs.md` (2026-11-06). Decisiones del dev en el
descubrimiento:

- El nombre se escribe **Lisandro López**, con tilde.
- La foto del hero es `public/foto-cabecera.png`, ya recortada y sin fondo.
- El hero lleva el nombre en gigante detrás de la foto; la frase del cliente va más chica, en las
  esquinas que pidió (arriba a la izquierda y abajo a la derecha).
- El scroll suave y la aparición de secciones se hacen con CSS y APIs nativas del navegador, sin librerías.
- Hasta que exista la reserva online (Sprint 2), el botón "Reservá tu turno" lleva a una página "Próximamente".

Quedan por definir con Lisandro, más adelante: servicios, sucursales con mapa, preguntas frecuentes, footer y
contacto por WhatsApp. Se cargan como `US-N` después del descubrimiento (`docs/workflow.md` §0).

### US-1 · Hero de la home con el nombre y la frase de Lisandro

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

**Historia**: Como paciente que entra a la web quiero ver a Lisandro y leer su frase sobre la alimentación, de
forma que entienda de entrada cómo trabaja.

El pedido define la foto al centro y grande, y la frase partida en dos. El dev decidió que el protagonista sea el
nombre en gigante detrás de la foto, como en el "Hero enmarcado" de `DESIGN.md`, y que la frase se reacomode
alrededor, más chica, para no competir con el nombre, en las esquinas que pidió el cliente (arriba a la izquierda
y abajo a la derecha). La disposición se valida con un boceto en el plan, y `DESIGN.md` se actualiza con ella.

Fuera de alcance: la píldora "Reservá tu primera consulta" del hero, que la reemplaza el botón flotante (US-4), y
el selector de sucursal, que llega con la US de sucursales.

**Criterios de aceptación**

- [ ] **CA-1** · Hero enmarcado según `DESIGN.md` (borde Papel 35px/16px, radio 88px/40px, fondo Verde Bosque) con `public/foto-cabecera.png` al centro y grande, servida con `next/image` (`priority`) y `alt` descriptivo · Estimación: 45 min · Completado: —

- [ ] **CA-2** · Detrás de la foto va «LISANDRO LÓPEZ» en gigante y en blanco, como `h1` de la página; la foto puede tapar la parte de abajo de las letras, pero el nombre se lee completo en 375px y en desktop · Estimación: 30 min · Completado: —

- [ ] **CA-3** · En desktop, «La alimentación nos atraviesa durante toda nuestra vida» va arriba a la izquierda y «Y aprender a transformarla en un buen hábito es la base de tu salud» abajo a la derecha, en tamaño lead, sin tapar el nombre ni la cara · Estimación: 30 min · Completado: —

- [ ] **CA-4** · En 375px las dos partes de la frase se leen completas y en ese orden, sin que la foto ni el nombre las tapen; el nombre y la frase cumplen contraste AA sobre el fondo · Estimación: 20 min · Completado: —

- [ ] **CA-5** · Debajo del hero va la línea de presentación «Lisandro López · Licenciado en Nutrición · MN [Completar: matrícula]», y el `<title>` de la página es «Lisandro López · Nutrición» · Estimación: 10 min · Completado: —

- [ ] **CA-6** · Garabatos del hero en SVG con `aria-hidden`; si se animan, respetan `prefers-reduced-motion` · Estimación: 20 min · Completado: —

**Preguntas abiertas**

- Matrícula (MN/MP) para la línea de presentación.

### US-2 · Sección "Sobre mí"

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | S         |
| Depende de   | T-2       |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente que baja por la home quiero leer quién es Lisandro y cómo trabaja, de forma que
confíe en él antes de pedir un turno.

El texto es el del pedido, textual, con una sola corrección: «López» con tilde.

**Criterios de aceptación**

- [ ] **CA-1** · Debajo del hero hay una banda Hueso con borde curvo (`DESIGN.md`, "Sobre mí") con los cinco párrafos del pedido, textuales, desde «Soy Lisandro López, Licenciado en Nutrición por la Universidad Favaloro.» hasta «…con atención, dedicación y profesionalismo.» · Estimación: 30 min · Completado: —

- [ ] **CA-2** · La sección tiene un `h2` con la firma tipográfica de `DESIGN.md` (peso 500, palabras clave en 700 con subrayado Verde Lima); el texto del título lo confirma el dev · Estimación: 15 min · Completado: —

- [ ] **CA-3** · Una foto de Lisandro acompaña el texto, servida con `next/image` y `alt` descriptivo (placeholder visible `[Completar: foto Sobre mí]` mientras no esté) · Estimación: 20 min · Completado: —

- [ ] **CA-4** · En desktop las líneas del texto no pasan de 75 caracteres; en 375px se lee sin scroll horizontal · Estimación: 10 min · Completado: —

**Preguntas abiertas**

- Título de la sección. Propuesta: «Sobre mí».
- ¿Hay una segunda foto, más cercana o en contexto, o se reutiliza la del hero?

### US-3 · Scroll suave y secciones que aparecen al bajar

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | S         |
| Depende de   | US-2      |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente que recorre la home quiero que el desplazamiento sea suave y que las secciones
aparezcan con un efecto sutil, de forma que la web sea agradable de mirar.

**Criterios de aceptación**

- [ ] **CA-1** · Los saltos a anclas internas se desplazan con suavidad, con CSS nativo y sin dependencias nuevas en `package.json` · Estimación: 10 min · Completado: —

- [ ] **CA-2** · Cada sección de la home, salvo el hero, aparece al entrar en pantalla con un fundido y un desplazamiento corto (≤ 24px, ≤ 600 ms) · Estimación: 30 min · Completado: —

- [ ] **CA-3** · Con `prefers-reduced-motion: reduce` no hay desplazamiento animado ni aparición: el contenido se ve directo · Estimación: 15 min · Completado: —

- [ ] **CA-4** · Sin JavaScript o en un navegador sin soporte, todo el contenido queda visible: la animación nunca deja texto oculto · Estimación: 15 min · Completado: —

- [ ] **CA-5** · Las animaciones sólo usan `opacity` y `transform`, y el CLS de la home queda por debajo de 0.1 · Estimación: 10 min · Completado: —

### US-4 · Botón flotante "Reservá tu turno"

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | S         |
| Depende de   | T-2       |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente quiero tener siempre a mano un botón para reservar, de forma que pueda pedir un turno
en cualquier momento mientras recorro la home.

Hasta que exista la reserva online (Sprint 2), el botón lleva a `/reservar`, que muestra "Próximamente". Cuando
llegue la reserva, esa página pasa a ser el flujo de reserva y el botón no cambia.

**Criterios de aceptación**

- [ ] **CA-1** · En la home, una píldora Verde Lima «Reservá tu turno» con disco de flecha queda fija abajo al centro, visible desde que carga y durante todo el scroll, en 375px y en desktop · Estimación: 30 min · Completado: —

- [ ] **CA-2** · El botón nunca tapa contenido: al llegar al final de la página, lo último queda visible por encima del botón (incluido el área segura de iOS) · Estimación: 15 min · Completado: —

- [ ] **CA-3** · Es un link a `/reservar`, se alcanza con teclado, tiene foco visible en Verde Bosque y un área táctil de al menos 44×44px · Estimación: 10 min · Completado: —

- [ ] **CA-4** · `/reservar` muestra una página «Próximamente» con un título, una línea que avisa que la reserva online está por llegar y un link para volver al inicio; está registrada en `src/proxy.ts` como pública y no muestra el botón flotante · Estimación: 30 min · Completado: —

- [ ] **CA-5** · `DESIGN.md` suma el componente «Botón flotante de reserva» y aclara que reemplaza a la píldora del hero y al botón «RESERVAR TURNO» del nav, para que haya una sola píldora Verde Lima por pantalla · Estimación: 15 min · Completado: —

**Preguntas abiertas del sprint**

- Matrícula, slogan, servicios (con o sin aranceles), sucursales y horarios, obras sociales.
- WhatsApp, email e Instagram de contacto.
- Ciudad donde atiende.

## Sprint 2 · Turnos

Ítems a definir: disponibilidad por sucursal, reserva online, cancelación con link, panel de agenda y emails.

**Preguntas abiertas**

- ¿Los turnos se confirman solos o los confirma Lisandro?
- ¿Cuánto dura cada tipo de consulta? ¿Con cuántas horas de anticipación se puede reservar o cancelar?
- ¿Qué proveedor de email se usa?
- ¿Los pacientes van a poder tener cuenta e iniciar sesión? Si es así, ¿qué acciones lo requieren? Hoy `AGENTS.md` dice que
  reservan sin crear cuenta; si cambia, va con un ADR.
