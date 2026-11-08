# Backlog

> Estado vigente de todo el trabajo del proyecto. **Si no está acá, no se programa.**
>
> Cómo se usa: [`docs/workflow.md`](docs/workflow.md).

## Índice

- [Convenciones](#convenciones)
- [Sprint 0 · Base técnica](#sprint-0--base-técnica)
- [Sprint 1 · Sitio de presentación](#sprint-1--sitio-de-presentación)
- [Sprint 2 · Lisandro maneja su agenda](#sprint-2--lisandro-maneja-su-agenda)
- [Sprint 3 · Cuenta de pacientes](#sprint-3--cuenta-de-pacientes)
- [Sprint 4 · El paciente reserva online](#sprint-4--el-paciente-reserva-online)
- [Sprint 5 · Despliegue](#sprint-5--despliegue)

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
| Merge        | c0586db |
| Horas reales | ≈ 1 h 40 min (estimadas) |

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
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | S         |
| Depende de   | T-1       |
| Plan         | [`docs/plans/T-2-tokens-design.md`](docs/plans/T-2-tokens-design.md) |
| Merge        | 8f12c49 |
| Horas reales | ≈ 1 h 5 min (estimadas) |

**Historia**: Como dev quiero la paleta, la tipografía (Manrope) y los radios de `DESIGN.md` como tokens, de forma
que ningún componente use colores hardcodeados.

**Criterios de aceptación**

- [x] **CA-1** · Tokens de `DESIGN.md` en `src/app/tokens.css` (importado por `globals.css`) y shadcn/ui inicializado con ellos · Estimación: 30 min · Completado: 2026-11-06 20:26

- [x] **CA-2** · Un test verifica el contraste AA de los pares de color que usa la UI · Estimación: 20 min · Completado: 2026-11-06 20:26

- [x] **CA-3** · ESLint rechaza colores hex escritos en `src/**/*.{ts,tsx}` · Estimación: 15 min · Completado: 2026-11-06 20:26

### T-3 · Login del panel con JWT propio

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | L         |
| Depende de   | T-1       |
| Plan         | [`docs/plans/T-3-login-panel.md`](docs/plans/T-3-login-panel.md) |
| Merge        | 592746c |
| Horas reales | ≈ 4 h 50 min (estimadas) |

**Historia**: Como Lisandro quiero entrar a un panel privado, de forma que sólo yo administre los turnos.

Decisiones del dev (2026-11-06): se entra con email y contraseña, sin registro público, con un login propio con
JWT en lugar de Supabase Auth, para probar todo con Docker ([ADR 0004](docs/adr/0004-login-propio-con-jwt.md)).
La sesión queda iniciada para siempre, hasta "Cerrar sesión". Por ahora hay una sola cuenta admin, de prueba; el
alta del admin de producción queda para el ítem de despliegue. Quien escriba `/admin` sin la sesión del admin ve
"Acceso denegado": el login vive sólo en `/admin/login` y ningún link lleva ahí. **Cambio (2026-11-08, US-27)**: el
login se mudó a `/login`, el mismo para todos.

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
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | M         |
| Depende de   | T-3       |
| Plan         | [`docs/plans/US-5-cuenta-admin.md`](docs/plans/US-5-cuenta-admin.md) |
| Merge        | b92f084 |
| Horas reales | ≈ 2 h 10 min (estimadas) |

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
- Hasta que exista la reserva online (Sprint 4), el botón "Reservá tu turno" lleva a una página "Próximamente".

Quedan por definir con Lisandro, más adelante: servicios, sucursales con mapa, preguntas frecuentes, footer y
contacto por WhatsApp. Se cargan como `US-N` después del descubrimiento (`docs/workflow.md` §0).

### US-1 · Hero de la home con el nombre y la frase de Lisandro

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | M         |
| Depende de   | T-2       |
| Plan         | [`docs/plans/US-1-hero.md`](docs/plans/US-1-hero.md) |
| Merge        | a617593 |
| Horas reales | ≈ 2 h 35 min (estimadas) |

**Historia**: Como paciente que entra a la web quiero ver a Lisandro y leer su frase sobre la alimentación, de
forma que entienda de entrada cómo trabaja.

El pedido define la foto al centro y grande, y la frase partida en dos. El dev decidió que el protagonista sea el
nombre en gigante detrás de la foto, como en el "Hero enmarcado" de `DESIGN.md`, y que la frase se reacomode
alrededor, más chica, para no competir con el nombre, en las esquinas que pidió el cliente (arriba a la izquierda
y abajo a la derecha). La disposición se valida con un boceto en el plan, y `DESIGN.md` se actualiza con ella.

Fuera de alcance: la píldora "Reservá tu primera consulta" del hero, que la reemplaza el botón flotante (US-4), y
el selector de sucursal, que llega con la US de sucursales.

**Criterios de aceptación**

- [x] **CA-1** · Hero enmarcado según `DESIGN.md` (borde Papel 35px/16px, radio 88px/40px, fondo Verde Bosque) con `public/foto-cabecera.png` al centro y grande, servida con `next/image` (`priority`) y `alt` descriptivo · Estimación: 45 min · Completado: 2026-11-06 22:25

- [x] **CA-2** · Detrás de la foto va «LISANDRO LÓPEZ» en gigante y en blanco, como `h1` de la página; la foto puede tapar la parte de abajo de las letras, pero el nombre se lee completo en 375px y en desktop · Estimación: 30 min · Completado: 2026-11-06 22:25

- [x] **CA-3** · En desktop, «La alimentación nos atraviesa durante toda nuestra vida» va arriba a la izquierda y «Y aprender a transformarla en un buen hábito es la base de tu salud» abajo a la derecha, en tamaño lead, sin tapar el nombre ni la cara · Estimación: 30 min · Completado: 2026-11-06 22:25

- [x] **CA-4** · En 375px las dos partes de la frase se leen completas y en ese orden, sin que la foto ni el nombre las tapen; el nombre y la frase cumplen contraste AA sobre el fondo · Estimación: 20 min · Completado: 2026-11-06 22:25

- [x] **CA-5** · Debajo del hero va la línea de presentación «Lisandro López · Licenciado en Nutrición» (sin matrícula hasta que llegue: decisión del dev), y el `<title>` de la página es «Lisandro López · Nutrición» · Estimación: 10 min · Completado: 2026-11-06 22:25

- [x] **CA-6** · Garabatos del hero en SVG con `aria-hidden`; si se animan, respetan `prefers-reduced-motion` · Estimación: 20 min · Completado: 2026-11-06 22:25

**Preguntas abiertas**

- Matrícula (MN/MP) para la línea de presentación.

### US-2 · Sección "Sobre mí"

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | S         |
| Depende de   | T-2       |
| Plan         | [`docs/plans/US-2-sobre-mi.md`](docs/plans/US-2-sobre-mi.md) |
| Merge        | 18a348b |
| Horas reales | ≈ 1 h 15 min (estimadas) |

**Historia**: Como paciente que baja por la home quiero leer quién es Lisandro y cómo trabaja, de forma que
confíe en él antes de pedir un turno.

El texto es el del pedido, textual, con una sola corrección: «López» con tilde.

**Criterios de aceptación**

- [x] **CA-1** · Debajo del hero hay una banda Hueso con borde curvo (`DESIGN.md`, "Sobre mí") con los cinco párrafos del pedido, textuales, desde «Soy Lisandro López, Licenciado en Nutrición por la Universidad Favaloro.» hasta «…con atención, dedicación y profesionalismo.» · Estimación: 30 min · Completado: 2026-11-06 22:30

- [x] **CA-2** · La sección tiene un `h2` con la firma tipográfica de `DESIGN.md` (peso 500, palabras clave en 700 con subrayado Verde Lima); el texto del título lo confirma el dev · Estimación: 15 min · Completado: 2026-11-06 22:30

- [x] **CA-3** · Una foto de Lisandro acompaña el texto, servida con `next/image` y `alt` descriptivo (placeholder visible `[Completar: foto Sobre mí]` mientras no esté) · Estimación: 20 min · Completado: 2026-11-06 22:30

- [x] **CA-4** · En desktop las líneas del texto no pasan de 75 caracteres; en 375px se lee sin scroll horizontal · Estimación: 10 min · Completado: 2026-11-06 22:30

**Preguntas abiertas**

- Título de la sección: se usó la propuesta «Sobre mí»; se cambia si Lisandro prefiere otro.
- Falta la foto de Lisandro para esta sección (hoy, placeholder visible por decisión del dev).

### US-3 · Scroll suave y secciones que aparecen al bajar

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | L         |
| Depende de   | US-6      |
| Plan         | [`docs/plans/US-3-scroll-suave.md`](docs/plans/US-3-scroll-suave.md) |
| Merge        | abc2d32 |
| Horas reales | ≈ 4 h (estimadas) |

**Historia**: Como paciente que recorre la home quiero que el desplazamiento sea suave y que las cosas se desplieguen
con efecto, de forma que la web sea agradable de mirar.

**Rechazo del dev (2026-11-06)**: la primera versión (CSS nativo: un fundido de 24px por sección) "no tiene nada de
premium: todo baja lo más normal". Se rehace con Lenis + GSAP y la dirección "Hilo que atraviesa", elegida por el dev.
Los CA anteriores quedan reemplazados por estos.

**Criterios de aceptación**

- [x] **CA-1** · En desktop el scroll tiene inercia (Lenis), sin romper el teclado, las anclas ni el scroll táctil nativo del celular · Estimación: 40 min · Completado: 2026-11-07 01:39

- [x] **CA-2** · El hero entra coreografiado en menos de 1.8 s: la foto crece, las letras del nombre suben y al final la cabeza tapa la base del nombre · Estimación: 1 h · Completado: 2026-11-07 01:39

- [x] **CA-3** · Al bajar, el hero tiene una escena atada al scroll: la foto sigue creciendo, el nombre sube más rápido y el marco se achica levemente · Estimación: 45 min · Completado: 2026-11-07 01:39

- [x] **CA-4** · En "Sobre mí", el título y el párrafo principal se descubren con máscara, y el subrayado Verde Lima y la flecha Zanahoria se dibujan con el scroll · Estimación: 45 min · Completado: 2026-11-07 01:39

- [x] **CA-5** · Con "reducir movimiento", sin JavaScript o si GSAP falla, todo el contenido queda visible y quieto · Estimación: 30 min · Completado: 2026-11-07 01:39

- [x] **CA-6** · El CLS de la home queda por debajo de 0.1 y las capturas de la intro y del scroll no muestran saltos · Estimación: 20 min · Completado: 2026-11-07 01:39

### US-4 · Botón flotante "Reservá tu turno"

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | S         |
| Depende de   | T-2       |
| Plan         | [`docs/plans/US-4-boton-reserva.md`](docs/plans/US-4-boton-reserva.md) |
| Merge        | 296fe57 |
| Horas reales | ≈ 1 h 40 min (estimadas) |

**Historia**: Como paciente quiero tener siempre a mano un botón para reservar, de forma que pueda pedir un turno
en cualquier momento mientras recorro la home.

Hasta que exista la reserva online (Sprint 4), el botón lleva a `/reservar`, que muestra "Próximamente". Cuando
llegue la reserva, esa página pasa a ser el flujo de reserva y el botón no cambia.

**Criterios de aceptación**

- [x] **CA-1** · En la home, una píldora Verde Lima «Reservá tu turno» con disco de flecha queda fija abajo al centro, visible desde que carga y durante todo el scroll, en 375px y en desktop · Estimación: 30 min · Completado: 2026-11-06 22:38

- [x] **CA-2** · El botón nunca tapa contenido: al llegar al final de la página, lo último queda visible por encima del botón (incluido el área segura de iOS) · Estimación: 15 min · Completado: 2026-11-06 22:38

- [x] **CA-3** · Es un link a `/reservar`, se alcanza con teclado, tiene foco visible en Verde Bosque y un área táctil de al menos 44×44px · Estimación: 10 min · Completado: 2026-11-06 22:38

- [x] **CA-4** · `/reservar` muestra una página «Próximamente» con un título, una línea que avisa que la reserva online está por llegar y un link para volver al inicio; está registrada en `src/proxy.ts` como pública y no muestra el botón flotante · Estimación: 30 min · Completado: 2026-11-06 22:38

- [x] **CA-5** · `DESIGN.md` suma el componente «Botón flotante de reserva» y aclara que reemplaza a la píldora del hero y al botón «RESERVAR TURNO» del nav, para que haya una sola píldora Verde Lima por pantalla · Estimación: 15 min · Completado: 2026-11-06 22:38

### US-6 · Hero y Sobre mí según el wireframe del dev

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-06 |
| Tamaño       | M         |
| Depende de   | US-1, US-2, US-4 |
| Plan         | [`docs/plans/US-6-hero-wireframe.md`](docs/plans/US-6-hero-wireframe.md) |
| Merge        | c17456b |
| Horas reales | ≈ 2 h 55 min (estimadas) |

**Historia**: Como paciente que entra a la web quiero un hero y un "Sobre mí" con presencia, de forma que la web se
sienta profesional y propia de Lisandro.

Origen: `docs/wireframes/ejemplo-presentacion.png` (wireframe del dev, 2026-11-06). Fuera por ahora: "Ver planes", la
cinta de temas y la matrícula.

**Criterios de aceptación**

- [x] ~~**CA-1** · Arriba del hero, una píldora «Licenciado en Nutrición» con un punto Verde Lima, sin matrícula~~ · Descartado por el dev (2026-11-07): sin píldora

- [x] **CA-2** · El `h1` «LISANDRO LÓPEZ» en Manrope 800 sin tracking negativo: «LISANDRO» blanco macizo y «LÓPEZ» en contorno Verde Lima; una línea en desktop, dos en 375px · Estimación: 30 min · Completado: 2026-11-07 01:26

- [x] **CA-3** · La foto ocupa cerca del 80% del alto del hero en desktop y su cabeza tapa cerca del 40% de abajo de las letras centrales del nombre · Estimación: 30 min · Completado: 2026-11-07 01:26

- [x] **CA-4** · La frase textual del cliente va a los costados de la foto y llena el espacio libre entre el borde y la foto (pedido del dev), con corte de línea natural, sin tocar la foto y legible en 375px · Estimación: 20 min · Completado: 2026-11-07 01:26 · Ajuste del dev (2026-11-07): letra cerca de 20% más chica, grande pero sin llenar todo el costado

- [x] **CA-5** · El botón flotante lleva un ícono de calendario, un disco Verde Bosque con flecha Verde Lima y un halo Verde Lima suave · Estimación: 20 min · Completado: 2026-11-07 01:26

- [x] **CA-6** · "Sobre mí" tiene el título con subrayado a mano Verde Lima, el primer párrafo en tamaño display, el placeholder en un marco en arco y el resto del texto en dos columnas en desktop · Estimación: 45 min · Completado: 2026-11-07 01:26

- [x] **CA-7** · Revisado con `impeccable` (detector, `critique` y `polish`) a 1440, 1280 y 375px · Estimación: 30 min · Completado: 2026-11-07 01:39 (detector limpio; critique en una sola pasada propia con capturas por cuadro, sin las dos revisiones independientes)

### US-7 · Intro de marca con máscara de revelado

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-07 |
| Tamaño       | M         |
| Depende de   | US-3, US-6 |
| Plan         | [`docs/plans/US-7-intro-de-marca.md`](docs/plans/US-7-intro-de-marca.md) |
| Merge        | d45aabc |
| Horas reales | ≈ 3 h 20 min (estimadas) |

**Historia**: Como paciente que entra a la web quiero una presentación breve de Lisandro antes de ver la home, de forma
que la web se sienta cuidada y propia desde el primer segundo.

Origen: pedido del dev (2026-11-07). La entrada del hero cambia de dirección respecto de US-3: las frases entran desde
los bordes y la foto crece desde el centro.

**Criterios de aceptación**

- [x] **CA-1** · Al entrar o recargar la home, una caja Verde Bosque chica al centro de una pantalla Papel muestra «Lic. Lisandro López», que entra subiendo desde una máscara; no hay spinner ni pantalla vacía · Estimación: 40 min · Completado: 2026-11-07 03:32

- [x] **CA-2** · El nombre se mantiene unos instantes, espera a que estén la fuente y la foto del hero (con tope) y sale con un fundido suave · Estimación: 30 min · Completado: 2026-11-07 03:32

- [x] **CA-3** · La caja se expande en ancho y alto como máscara de revelado y termina exactamente en el marco del hero; al terminar no queda ninguna capa encima y el scroll se libera · Estimación: 1 h · Completado: 2026-11-07 03:32

- [x] **CA-4** · Durante la expansión, «La alimentación…» entra desde la izquierda, «Y aprender…» desde la derecha, el nombre desde arriba y la foto desde el centro, y cada parte termina en su lugar · Estimación: 30 min · Completado: 2026-11-07 03:32

- [x] **CA-5** · La intro no se repite al volver a la home desde otra página del sitio; siempre empieza arriba de la home · Estimación: 20 min · Completado: 2026-11-07 03:32

- [x] **CA-6** · Con "reducir movimiento", sin JavaScript o si el JS tarda más de 2.5 s, no hay intro y la home se ve entera · Estimación: 20 min · Completado: 2026-11-07 03:32

### US-8 · Scroll con profundidad entre secciones

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho |
| Dueño        | Claude    |
| Inicio       | 2026-11-07 |
| Tamaño       | M         |
| Depende de   | US-3      |
| Plan         | [`docs/plans/US-8-scroll-profundidad.md`](docs/plans/US-8-scroll-profundidad.md) |
| Merge        | a26a1f1 |
| Horas reales | ≈ 2 h 5 min (estimadas) |

**Historia**: Como paciente que recorre la home quiero que las secciones se sucedan como capas, de forma que el
recorrido se sienta inmersivo y no un scroll plano.

Origen: pedido del dev (2026-11-07).

**Criterios de aceptación**

- [x] **CA-1** · Al bajar, la sección actual queda en su lugar y se aleja hacia el fondo: se achica y pierde opacidad de forma progresiva, atada al scroll · Estimación: 45 min · Completado: 2026-11-07 03:40

- [x] **CA-2** · La sección siguiente sube desde abajo, por encima, y termina tapando a la anterior, sin saltos ni cortes · Estimación: 30 min · Completado: 2026-11-07 03:40

- [x] **CA-3** · Funciona en 375px y en desktop; las secciones más altas que la pantalla se ven enteras antes de que las tape la siguiente · Estimación: 30 min · Completado: 2026-11-07 03:40

- [x] **CA-4** · Con "reducir movimiento" no hay fijado ni escala: el scroll es normal · Estimación: 10 min · Completado: 2026-11-07 03:40

- [x] **CA-5** · El CLS de la home sigue por debajo de 0.1 y sólo se animan `transform` y `opacity` · Estimación: 10 min · Completado: 2026-11-07 03:40

**Preguntas abiertas del sprint**

- Matrícula, slogan, servicios (con o sin aranceles), sucursales y horarios, obras sociales.
- WhatsApp, email e Instagram de contacto.
- Ciudad donde atiende.

## Sprint 2 · Lisandro maneja su agenda

Origen: descubrimiento con el dev (2026-11-07). Los turnos se parten en dos sprints, por actor: en este, Lisandro
arma y maneja su agenda desde el panel; en el Sprint 4, el paciente reserva online.

Decisiones del dev:

- **Ubicaciones**: sucursales físicas y una «Online» (sin dirección, con un link fijo de videollamada). Las carga
  Lisandro en el panel. Con turnos no se borran: se desactivan.
- **Horarios**: semanales por ubicación, con una o más franjas por día. Las franjas de dos ubicaciones nunca se
  pisan: Lisandro es una sola persona.
- **Duración**: una sola para todos los turnos, editable en el panel; la grilla de horarios sale de ella. No hay
  tipos de consulta.
- **Obras sociales**: una lista que carga Lisandro, igual para todas las ubicaciones, más «Particular».
- **Bloqueos**: globales; no se puede bloquear una franja que ya tiene turnos.
- **Turnos**: dos turnos activos nunca se pisan, en ninguna ubicación (lo garantiza la base). La reserva online nace
  `PENDIENTE` y la confirma Lisandro; el turno que carga él a mano nace `CONFIRMADO`. Anticipación mínima de 12 h,
  horizonte de 60 días y un solo turno activo por email.
- **Avisos**: emails con Resend, enviados desde local (sin dominio, sólo llegan a la casilla dueña de la cuenta).
  Cuando Lisandro cancela o reprograma, además, un botón de WhatsApp (`wa.me`) con el mensaje armado.

Sprints 1 y 2 cerrados el 2026-11-08: merge a `main` con los tags `sprint-1` y `sprint-2`. Las horas reales son
estimadas (suma de las estimaciones de cada criterio). Quedan abiertos T-1 CA-4 (el CI de GitHub todavía no corrió
nunca) y T-5 CA-5 (el email de prueba con la clave real de Resend), que dependen del dev.

Implementación: el dev pidió programar el sprint entero y revisarlo al final (2026-11-07), así que los ítems no
tienen plan propio en `docs/plans/`: el plan es este encabezado más el
[ADR 0005](docs/adr/0005-agenda-choque-global-y-horarios-en-hora-argentina.md). Integrado en `develop` con el OK del dev
(2026-11-07), en un solo commit para todo el sprint. Pendiente en US-9 y US-19: la revisión con `impeccable`
(`critique` y `polish`); la del panel (T-4, US-13) se hizo con US-26.

### T-4 · Layout del panel

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | S |
| Depende de   | T-3 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 2 h 15 min (estimadas) |

**Historia**: Como Lisandro quiero un menú fijo en el panel, de forma que pase de una sección a otra con un toque, en la compu y en el celular.

**Criterios de aceptación**

- [x] **CA-1** · Desde 768px, toda página del panel (salvo `/admin/login` y «Acceso denegado») muestra una sidebar Verde Bosque con Agenda, Ubicaciones, Ajustes y Mi cuenta (ícono Lucide + texto en Niebla), y el contenido sobre Hueso · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · El link de la sección actual va en blanco, con un indicador Verde Lima y `aria-current="page"` · Estimación: 15 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Debajo de 768px, el menú es una barra inferior fija con ícono y texto, áreas táctiles de al menos 44×44px y el área segura de iOS; el contenido nunca queda tapado por la barra · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · «Cerrar sesión» queda al pie de la sidebar en desktop y dentro de «Mi cuenta» en mobile · Estimación: 15 min · Completado: 2026-11-07 18:30

- [x] **CA-5** · El menú se recorre con teclado y el foco se ve sobre el fondo Verde Bosque (anillo Verde Lima, 7.9:1) · Estimación: 15 min · Completado: 2026-11-07 18:30

- [x] **CA-6** · Los links salen de una sola lista (`panel-sections.ts`); Revisado con `impeccable` (`critique` y `polish`) en 375px y en desktop · Estimación: 20 min · Completado: 2026-11-08 13:30 (con el rediseño de US-26)

### T-5 · Envío de emails con Resend

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | S |
| Depende de   | T-1 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 2 h 25 min (estimadas) |

**Historia**: Como dev quiero un único punto para mandar emails, de forma que los avisos de turnos salgan por Resend y los tests nunca manden un email real.

Sin dominio propio hasta el despliegue (Sprint 5): Resend sólo entrega a la casilla dueña de la cuenta.

**Criterios de aceptación**

- [x] **CA-1** · `emailSenderFromEnv` manda por la API de Resend con `RESEND_API_KEY` y `EMAIL_FROM` (nuevas en `.env.example`, sólo servidor), sin SDK · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · Unit y contrato usan un buzón falso; ningún test llama a Resend · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Si Resend falla o falta la clave, devuelve `false` sin lanzar y loguea sólo el motivo, nunca el destinatario ni el contenido · Estimación: 20 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Plantilla con la marca en HTML y texto plano (título, párrafos, detalles y botón), con los colores de `tokens.css` verificados por test · Estimación: 40 min · Completado: 2026-11-07 18:30

- [ ] **CA-5** · Con la clave real en `.env.local`, un email de prueba llega a la casilla del dev · Estimación: 15 min · Completado: —

**Preguntas abiertas**

- Cuenta de Resend y su clave: las crea el dev.

### US-9 · Lisandro carga sus ubicaciones

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | T-4 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 3 h 30 min (estimadas) |

**Historia**: Como Lisandro quiero cargar los lugares donde atiendo (mis consultorios y la atención online), de forma que los pacientes sepan dónde y cómo es cada consulta.

**Criterios de aceptación**

- [x] **CA-1** · En `/admin/ubicaciones` ve la lista con tipo, estado y horarios; vacía, invita a cargar la primera · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · Crea y edita una presencial: nombre (hasta 60, único sin importar mayúsculas), dirección (hasta 120), indicaciones (opcional, hasta 200) y mapa (opcional: el código «Insertar un mapa» de Google Maps; se guarda sólo la URL de embed) · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-3** · Crea y edita la ubicación online: nombre y link de videollamada (`https://`); puede haber una sola · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Desactivar y reactivar: una desactivada no se ofrece ni aparece en la home; con turnos por venir da `HAS_ACTIVE_APPOINTMENTS` · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-5** · Nombre repetido → `DUPLICATE`; dos ediciones a la vez → `STALE_VERSION`; datos inválidos → `VALIDATION` con el mensaje del campo · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-6** · Revisado con `impeccable` (`critique` y `polish`) en 375px y en desktop · Estimación: 20 min · Completado: 2026-11-08 23:36

**Preguntas abiertas**

- Ubicaciones reales (nombres, direcciones, indicaciones y mapas) y link de la videollamada: los carga Lisandro.

### US-10 · Lisandro carga los horarios semanales de cada ubicación

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-9 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 2 h 35 min (estimadas) |

**Historia**: Como Lisandro quiero cargar qué días y en qué horarios atiendo en cada ubicación, de forma que sólo se ofrezcan turnos cuando realmente estoy.

**Criterios de aceptación**

- [x] **CA-1** · En la ficha de la ubicación ve sus horarios por día de la semana y agrega franjas desde–hasta (`hh:mm`, hora argentina), varias por día · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-2** · Dos franjas nunca se pisan, ni en la misma ubicación ni en otra (lo garantiza la base) → `HOURS_OVERLAP`; las contiguas sí · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-3** · Borra una franja; cambiar o borrar franjas no toca los turnos ya reservados · Estimación: 20 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · El fin tiene que ser posterior al inicio, el mismo día → `VALIDATION` · Estimación: 15 min · Completado: 2026-11-07 18:30

**Preguntas abiertas**

- Horarios reales de cada ubicación: los carga Lisandro.

### US-11 · Lisandro define la duración de los turnos

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | S |
| Depende de   | T-4 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 1 h 15 min (estimadas) |

**Historia**: Como Lisandro quiero definir cuánto dura un turno, de forma que la agenda ofrezca horarios a la medida de mis consultas.

Supuesto a confirmar con Lisandro: el rango de 15 a 120 minutos.

**Criterios de aceptación**

- [x] **CA-1** · En `/admin/ajustes` cambia la duración, de 15 a 120 minutos y de a 5 (lo garantiza la base) · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · Sin duración definida la agenda no ofrece horarios (`NO_SLOT_DURATION`); el seed de desarrollo y de tests carga 45 minutos de ejemplo · Estimación: 20 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Cambiarla no toca los turnos ya reservados · Estimación: 10 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Fuera de rango → `VALIDATION`; dos cambios a la vez → `STALE_VERSION` · Estimación: 15 min · Completado: 2026-11-07 18:30

**Preguntas abiertas**

- Duración real de la consulta.

### US-12 · Lisandro carga las obras sociales que acepta

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | S |
| Depende de   | T-4 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 1 h 25 min (estimadas) |

**Historia**: Como Lisandro quiero cargar las obras sociales con las que trabajo, de forma que sepa con qué viene cada paciente.

**Criterios de aceptación**

- [x] **CA-1** · En `/admin/ajustes` agrega (hasta 60, única sin importar mayúsculas), renombra, desactiva y reactiva obras sociales · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-2** · «Particular» no se carga: los formularios la ofrecen siempre y la base rechaza ese nombre · Estimación: 10 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Una desactivada deja de ofrecerse, pero los turnos que ya la tienen la siguen mostrando · Estimación: 15 min · Completado: 2026-11-07 18:30

**Preguntas abiertas**

- Lista real de obras sociales.

### T-6 · Modelo de turnos con anti-choque global

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-9, US-12 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 3 h 10 min (estimadas) |

**Historia**: Como dev quiero la tabla de turnos con sus reglas garantizadas por la base, de forma que nunca existan dos turnos que se pisen aunque se carguen a la vez.

**Criterios de aceptación**

- [x] **CA-1** · Tablas `appointment` y `time_block` (ADR 0005): ubicación, inicio y fin (`timestamptz`), estado, origen, paciente, obra social y `version` · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-2** · Un `EXCLUDE` impide dos turnos no cancelados que se pisen, en cualquier ubicación; de tres reservas simultáneas del mismo horario se guarda una · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-3** · Las transiciones de estado válidas viven en el dominio (`canTransition`); el resto → `INVALID_TRANSITION` · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Repositorio con fake en memoria y la misma suite de comportamiento contra Prisma · Estimación: 40 min · Completado: 2026-11-07 18:30

### US-13 · Agenda del panel

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | T-4, T-6 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 3 h 35 min (estimadas) |

**Historia**: Como Lisandro quiero ver mis turnos por día y por semana, de forma que sepa a quién atiendo, dónde y cuándo.

**Criterios de aceptación**

- [x] **CA-1** · `/admin` muestra la agenda del día (hoy en hora argentina), con flechas, «Hoy» y los turnos agrupados por ubicación · Estimación: 45 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · Vista semana (lunes a domingo) con un toggle Día/Semana en píldoras desde 768px; en mobile, vista día · Estimación: 45 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Cada turno muestra hora, paciente y el color de su estado (`DESIGN.md`); los pendientes se cuentan arriba · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Tocar un turno abre su detalle: día y hora, estado, ubicación, paciente, teléfono, email, obra social y origen · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-5** · Un turno de las 22:00 argentinas se lista en su día aunque en UTC sea el siguiente (test de medianoche) · Estimación: 20 min · Completado: 2026-11-07 18:30

- [x] **CA-6** · Un día sin turnos lo dice; los bloqueos se ven en la agenda · Estimación: 15 min · Completado: 2026-11-07 18:30

- [x] **CA-7** · Revisado con `impeccable` (`critique` y `polish`) en 375px y en desktop · Estimación: 20 min · Completado: 2026-11-08 13:30 (con el rediseño de US-26)

### US-14 · Lisandro bloquea franjas

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-13 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 3 h 5 min (estimadas) |

**Historia**: Como Lisandro quiero cerrar días u horarios puntuales (vacaciones, un trámite), de forma que nadie reserve cuando no voy a estar.

Cambio sobre `DESIGN.md`: el bloqueo es una página y no un modal, para que se use igual con teclado y en el celular.

**Criterios de aceptación**

- [x] **CA-1** · En `/admin/bloqueos` (desde «Bloquear horario» de la agenda) carga desde y hasta (hora argentina) y un motivo opcional sólo para él · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-2** · Ve los bloqueos por venir y los borra · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Con turnos activos en el rango no se guarda → `BLOCK_HAS_APPOINTMENTS` · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · El fin tiene que ser posterior al inicio → `VALIDATION` · Estimación: 15 min · Completado: 2026-11-07 18:30

- [x] **CA-5** · Un bloqueo vale para todas las ubicaciones y puede abarcar varios días · Estimación: 10 min · Completado: 2026-11-07 18:30

- [x] **CA-6** · Un turno y un bloqueo simultáneos sobre el mismo horario no conviven (transacción `Serializable`, test de integración) · Estimación: 40 min · Completado: 2026-11-07 18:30

### US-15 · Disponibilidad

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-10, US-11, US-14 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 3 h 10 min (estimadas) |

**Historia**: Como Lisandro (y como paciente en el Sprint 4) quiero ver sólo horarios realmente libres, de forma que no se elija uno imposible.

**Criterios de aceptación**

- [x] **CA-1** · Los horarios salen de las franjas del día, cortadas en pasos de la duración desde su inicio; un turno que no entra entero no se ofrece · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-2** · Se descuentan los turnos activos de cualquier ubicación y los bloqueos · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · El paciente no ve horarios a menos de 12 h; el panel sí, salvo los que ya pasaron; nadie más allá de 60 días · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Se calcula en hora argentina y viaja en UTC: tests de cruce de medianoche y de día sin franjas · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-5** · Una ubicación desactivada o inexistente no ofrece horarios; la lectura pública llega con la reserva (Sprint 4) · Estimación: 20 min · Completado: 2026-11-07 18:30

### US-16 · Lisandro carga un turno a mano

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-12, US-15, T-5 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 4 h 10 min (estimadas) |

**Historia**: Como Lisandro quiero cargar un turno para un paciente que me escribió o me llamó, de forma que mi agenda tenga todo en un solo lugar.

**Criterios de aceptación**

- [x] **CA-1** · Desde «Nuevo turno»: ubicación y día → horario libre (sin el límite de 12 h) → nombre (hasta 80), teléfono con código de área, email opcional y obra social (o Particular) · Estimación: 1 h 30 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · El turno nace confirmado y aparece en la agenda · Estimación: 10 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Si el email ya tiene un turno por venir, avisa la fecha pero guarda igual · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Con email, el paciente recibe «Tu turno está confirmado» con día, hora, lugar (o link de videollamada) y el `.ics` · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-5** · Al guardar ofrece «Avisar por WhatsApp» (`wa.me` con el mensaje armado) y «Ver el turno» · Estimación: 30 min · Completado: 2026-11-07 18:30

- [x] **CA-6** · Horario ocupado → `SLOT_TAKEN`; si el email falla, el turno queda guardado y se avisa «No pudimos mandar el email» · Estimación: 30 min · Completado: 2026-11-07 18:30

**Preguntas abiertas**

- Texto de los emails y del WhatsApp: lo revisa Lisandro.

### US-17 · Lisandro cancela un turno y marca asistencia

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-13, T-5 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 2 h 20 min (estimadas) |

**Historia**: Como Lisandro quiero cancelar un turno y registrar si el paciente vino, de forma que el horario se libere y mi agenda refleje lo que pasó.

**Criterios de aceptación**

- [x] **CA-1** · Desde el detalle, «Cancelar turno» (con confirmación) cancela un pendiente o confirmado que no empezó y libera el horario · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · Con email, el paciente recibe «Tu turno se canceló»; siempre se ofrece «Avisar por WhatsApp» · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Un confirmado que ya empezó se marca «Asistió» o «Ausente»; antes de su hora → `INVALID_TRANSITION` · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Cancelar dos veces o un turno empezado → `INVALID_TRANSITION`; versión vieja → `STALE_VERSION` · Estimación: 20 min · Completado: 2026-11-07 18:30

### US-18 · Lisandro reprograma un turno

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-17, US-15 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 2 h 40 min (estimadas) |

**Historia**: Como Lisandro quiero mover un turno a otro horario, de forma que no tenga que cancelarlo y cargarlo de nuevo.

**Criterios de aceptación**

- [x] **CA-1** · Desde el detalle, «Reprogramar» elige ubicación, día y horario libre y mueve el turno; conserva paciente y estado · Estimación: 1 h · Completado: 2026-11-07 18:30

- [x] **CA-2** · El horario viejo se libera y el nuevo se ocupa en una sola transacción; si el nuevo se ocupó → `SLOT_TAKEN` y el turno queda donde estaba · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Con email, el paciente recibe «Tu turno cambió de horario» (antes y ahora, con el `.ics` nuevo); siempre se ofrece el WhatsApp · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · Sólo pendientes o confirmados que no empezaron; si no → `INVALID_TRANSITION` · Estimación: 20 min · Completado: 2026-11-07 18:30

### US-19 · Sección «Sucursales» en la home

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-07  |
| Tamaño       | M |
| Depende de   | US-10, US-12 |
| Plan         | —           |
| Merge        | 9a016a5 |
| Horas reales | ≈ 5 h (estimadas) |

**Historia**: Como paciente quiero ver dónde atiende Lisandro, qué días y en qué horarios, de forma que elija la ubicación que me queda cómoda.

Fuera por ahora: «Reservar acá» (la reserva llega en el Sprint 4 y el botón flotante es la única píldora Verde Lima de la home). El botón flotante pasa a ser lo primero del `<main>` para que siga siendo el primer foco con Tab.

**Criterios de aceptación**

- [x] **CA-1** · Después de «Sobre mí», «Dónde atiendo» muestra una tarjeta Gris Nube por ubicación activa: nombre, dirección, indicaciones, mapa y horarios por día · Estimación: 1 h 30 min · Completado: 2026-11-07 18:30

- [x] **CA-2** · La online va sin mapa ni dirección («Atención online, por videollamada.») y nunca muestra el link · Estimación: 20 min · Completado: 2026-11-07 18:30

- [x] **CA-3** · Las obras sociales activas van como chips, una sola vez, con Particular primero · Estimación: 20 min · Completado: 2026-11-07 18:30

- [x] **CA-4** · El mapa carga diferido, con `title` accesible; la home queda estática y se refresca con cada cambio del panel · Estimación: 20 min · Completado: 2026-11-07 18:30

- [x] **CA-5** · Se suma a la profundidad del scroll (US-8) y respeta «reducir movimiento» · Estimación: 40 min · Completado: 2026-11-07 18:30

- [x] **CA-6** · Sin ubicaciones activas, la sección no se muestra · Estimación: 10 min · Completado: 2026-11-07 18:30

- [x] **CA-7** · Revisado con `impeccable` (`critique` y `polish`) en 375px y en desktop · Estimación: 20 min · Completado: 2026-11-08 23:36

- [x] **CA-8** · Cada sección ocupa al menos una pantalla y nunca se ven tres capas a la vez: la sección tapada del todo se oculta (bug encontrado por el dev en la revisión, 2026-11-07) · Estimación: 30 min · Completado: 2026-11-07 21:10

- [x] **CA-9** · «Sobre mí», ya vista entera, queda quieta 1,25 pantallas de scroll antes de que suba «Dónde atiendo» (pedido del dev, 2026-11-07) · Estimación: 30 min · Completado: 2026-11-07 21:40

- [x] **CA-10** · Una flecha a mano abajo a la derecha de cada sección con algo debajo (blanca sobre Verde Bosque, Zanahoria sobre Hueso) avisa que se puede bajar sin tapar el botón de reserva (pedido del dev, 2026-11-07) · Estimación: 20 min · Completado: 2026-11-07 21:40

### Iteración del Sprint 2 (revisión del dev, 2026-11-08)

El dev revisó el sprint y pidió tres cambios: el panel exactamente como `docs/wireframes/panel-administrador.png`
(Lisandro es nutricionista, no fisioterapeuta), quitar los bloqueos (descartado por el mismo dev: con horarios
semanales, el bloqueo es la única forma de cerrar una fecha puntual) y un solo login en `/login`. Plan:
[`docs/plans/sprint-2-iteracion-panel.md`](docs/plans/sprint-2-iteracion-panel.md).

### US-23 · Lisandro confirma un turno pendiente

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | S |
| Depende de   | T-6, T-5 |
| Plan         | [`docs/plans/sprint-2-iteracion-panel.md`](docs/plans/sprint-2-iteracion-panel.md) |
| Merge        | 4c497bf |
| Horas reales | ≈ 1 h 20 min (estimadas) |

**Historia**: Como Lisandro quiero confirmar un turno pendiente, de forma que el paciente sepa que lo espero.

Se adelanta del Sprint 4 porque el wireframe del panel tiene «Confirmar» en el próximo turno (decisión del dev,
2026-11-08). Hasta que llegue la reserva online, los únicos pendientes son los del seed de tests.

**Criterios de aceptación**

- [x] **CA-1** · Desde el detalle del turno y desde «Próximo turno», «Confirmar» pasa un pendiente que no empezó a confirmado · Estimación: 40 min · Completado: 2026-11-08 13:11

- [x] **CA-2** · Con email, el paciente recibe «Tu turno está confirmado» con el `.ics`; si el email falla, el turno queda confirmado y se avisa · Estimación: 20 min · Completado: 2026-11-08 13:11

- [x] **CA-3** · Un turno que no está pendiente o que ya empezó → `INVALID_TRANSITION`; versión vieja → `STALE_VERSION`; sin sesión → `UNAUTHENTICATED` · Estimación: 20 min · Completado: 2026-11-08 13:11

### US-26 · Panel según el wireframe del dev

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | L |
| Depende de   | T-4, US-13, US-23 |
| Plan         | [`docs/plans/sprint-2-iteracion-panel.md`](docs/plans/sprint-2-iteracion-panel.md) |
| Merge        | 4c497bf |
| Horas reales | ≈ 8 h 10 min (estimadas) |

**Historia**: Como Lisandro quiero abrir el panel y ver de un vistazo mi día, mi semana y mi próximo turno, de forma
que organice mi trabajo sin buscar nada.

Origen: `docs/wireframes/panel-administrador.png` (wireframe del dev, 2026-11-08). Decisiones del dev: «Pacientes»
lleva a «Próximamente»; los botones del panel son rectángulos redondeados como en el wireframe (la píldora queda para
el sitio público); se mantiene la vista semana.

**Criterios de aceptación**

- [x] **CA-1** · La sidebar muestra el logo, «Lisandro López», «NUTRICIONISTA» y Agenda, Pacientes, Ubicaciones, Ajustes y Mi cuenta, con «Cerrar sesión» al pie; «Pacientes» lleva a una página «Próximamente» · Estimación: 40 min · Completado: 2026-11-08 13:11

- [x] **CA-2** · La cabecera tiene «Agenda», el saludo según la hora argentina, la bajada, «Nuevo turno» y «Bloquear horario» · Estimación: 20 min · Completado: 2026-11-08 13:11

- [x] **CA-3** · Cuatro tarjetas: turnos hoy (contra ayer), turnos de la semana (contra la anterior, en %), pacientes nuevos de la semana (por teléfono o email) y horas libres hoy de las disponibles · Estimación: 1 h 30 min · Completado: 2026-11-08 13:11

- [x] **CA-4** · La vista día es una línea de horas con cada turno en su lugar («Nombre · Obra social» y «horario · ubicación»), los bloqueos rayados y sin los cancelados; se mantiene el toggle Día/Semana · Estimación: 1 h 30 min · Completado: 2026-11-08 13:11

- [x] **CA-5** · «Próximo turno» muestra paciente, obra social, horario y lugar, con «Confirmar» (pendiente) o «Ver turno» (confirmado) y «WhatsApp» · Estimación: 45 min · Completado: 2026-11-08 13:11

- [x] **CA-6** · Un calendario del mes marca con un punto los días con turnos y lleva a cada día · Estimación: 45 min · Completado: 2026-11-08 13:11

- [x] **CA-7** · Los botones, las flechas y el toggle del panel son rectángulos de 12px; el sitio público no cambia · Estimación: 20 min · Completado: 2026-11-08 13:11

- [x] **CA-8** · En 375px se apila (métricas 2×2, agenda, próximo turno, calendario) sin scroll horizontal; revisado con `impeccable` (`critique` y `polish`) en 375px y en desktop · Estimación: 40 min · Completado: 2026-11-08 13:30 (critique con dos evaluaciones aisladas sobre capturas de Playwright, sin overlay en vivo porque no se levanta servidor de desarrollo; en mobile el orden quedó próximo turno, agenda y calendario)

- [x] **CA-9** · Cambiar Día/Semana sólo cambia la grilla: la tarjeta de la agenda, el próximo turno y el calendario quedan en su lugar; la semana muestra los días en filas partidas en franjas de 4 h, con un cuadradito por turno y la franja bloqueada rayada (pedido del dev en la revisión, 2026-11-08) · Estimación: 1 h · Completado: 2026-11-08 17:35

- [x] **CA-10** · «Bloquear horario» lleva un marco gris oscuro para no perderse sobre el fondo (pedido del dev en la revisión, 2026-11-08) · Estimación: 10 min · Completado: 2026-11-08 17:35
- [x] **CA-11** · Con el mouse encima, todo lo que se toca en el panel (botones, flechas, «Hoy», Día/Semana, horarios, menú lateral, días del calendario, ubicaciones y turnos) se funde en degradé hacia un tono más oscuro de su propio color, en 200 ms (más claro sobre Verde Bosque), para avisar que se está por elegir (pedido del dev, 2026-11-08) · Estimación: 30 min · Completado: 2026-11-08 22:45

### US-27 · Un solo login en `/login`

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | Hecho |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | S |
| Depende de   | T-3 |
| Plan         | [`docs/plans/sprint-2-iteracion-panel.md`](docs/plans/sprint-2-iteracion-panel.md) |
| Merge        | 4c497bf |
| Horas reales | ≈ 55 min (estimadas) |

**Historia**: Como Lisandro quiero entrar por `/login`, de forma que no tenga que recordar una dirección escondida.

Decisión del dev (2026-11-08): todos entran por el mismo `/login` y la cuenta decide a dónde van. Hoy sólo existe la
del admin; cualquier otro email o contraseña da `INVALID_CREDENTIALS`. Las cuentas de pacientes (Sprint 3) entrarán
por la misma página e irán a la home. Todavía no hay links al login: se entra escribiendo la dirección.

**Criterios de aceptación**

- [x] **CA-1** · `/login` con los datos del admin entra a `/admin`; con sesión, `/login` lleva a `/admin`; «Cerrar sesión» y una sesión cerrada desde otro lado vuelven a `/login` · Estimación: 30 min · Completado: 2026-11-08 13:11

- [x] **CA-2** · `/admin/login` ya no existe: sin sesión muestra «Acceso denegado», como cualquier `/admin/**` · Estimación: 15 min · Completado: 2026-11-08 13:11

- [x] **CA-3** · `/login` no se indexa (`noindex`) y «Acceso denegado» sigue sin link al login · Estimación: 10 min · Completado: 2026-11-08 13:11

Orden de los sprints 3 a 5 decidido por el dev (2026-11-08): primero el login de pacientes, después la reserva
online y al final el despliegue.

## Sprint 3 · Cuenta de pacientes

A definir ítem por ítem cuando el dev confirme el Sprint 2. Previsto: login de pacientes con link mágico por email,
en el mismo `/login` (US-27), con un ADR (hoy se reserva sin cuenta).

## Sprint 4 · El paciente reserva online

Previstos: T-7 protección de acciones públicas (rate limiting + honeypot), US-20 política de privacidad, US-21
reserva online (nace pendiente), US-22 emails de la reserva («Recibimos tu solicitud» y aviso a Lisandro), US-24 el
paciente cancela con el link, US-25 el paciente reprograma con el link (vuelve a pendiente). US-23 (Lisandro
confirma un pendiente) se adelantó al Sprint 2.

## Sprint 5 · Despliegue

Previstos: despliegue (Vercel + Supabase + dominio verificado en Resend + admin de producción) y recordatorio por
email 24 h antes (cron).

**Preguntas abiertas de los sprints 2 a 5**

- Ubicaciones reales, horarios, duración de la consulta, obras sociales y link de videollamada (los carga Lisandro).
- Con la cuenta de pacientes antes que la reserva: ¿reservar va a pedir cuenta o se sigue pudiendo sin cuenta, como hoy?
- Revisión de la política de privacidad y cuánto tiempo se guardan los datos de los pacientes (Ley 25.326).
