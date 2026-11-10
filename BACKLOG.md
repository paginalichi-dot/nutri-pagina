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

Origen: descubrimiento con el dev (2026-11-08), sobre los wireframes `login.png`, `hero-animado.png`,
`cuenta-1.png`, `cuenta-2.png` y `cambio-de-lugar-flecha(-mobile).png`. Plan único del sprint:
[`docs/plans/sprint-3-cuenta-pacientes.md`](docs/plans/sprint-3-cuenta-pacientes.md); decisión de arquitectura:
[ADR 0006](docs/adr/0006-cuentas-de-pacientes-con-email-y-contrasena.md).

Decisiones del dev:

- **Ingreso**: sólo email y contraseña (sin Google), por el mismo `/login` que Lisandro.
- **Alta**: registro libre con consentimiento y política de privacidad; el email se verifica con un link y sin
  verificar no se entra.
- **Mi espacio**: próximos turnos y anteriores (los de su email) y sus datos, contraseña, email y baja. Nunca
  historia clínica. «Pacientes» del panel sigue en «Próximamente».
- **Olvidé mi contraseña**: link de 1 h y un solo uso.
- **Diseño**: login según `login.png` (sin Google, textos de Lisandro), luz verde que respira, ícono de cuenta en el
  hero, líneas a mano que se dibujan al terminar la intro y la flecha para bajar junto a la frase de apertura
  (desktop). Los ajustes finos que pidió el dev durante el sprint están en `DESIGN.md` y en los criterios.
- T-7 y US-20 suben del Sprint 4 porque el registro es una acción pública con datos personales.

Implementación: como en el Sprint 2, el sprint entero de una y la revisión al final, en un solo commit.

### T-7 · Límite de intentos en las acciones públicas

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | — |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como Lisandro quiero que nadie pueda probar emails o contraseñas sin freno, de forma que las cuentas y la casilla de Resend estén a salvo.

**Criterios de aceptación**

- [x] **CA-1** · La tabla `rate_limit` guarda claves hasheadas (nunca una IP ni un email en claro), con incremento atómico y vencimiento · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · El schema de cada acción pública valida el honeypot y `guardPublicAction` corta con `RATE_LIMITED` al pasar el límite por IP o por email (el login, por IP y con el bloqueo de 5 intentos de cada cuenta) · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · Dos pedidos simultáneos cuentan dos (integración) · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-4** · Lo usan el login, el registro, el reenvío de la activación, «olvidé mi contraseña» y los botones de los links · Estimación: 20 min · Completado: 2026-11-09 02:23

### US-20 · Política de privacidad

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | S           |
| Depende de   | — |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero saber qué datos míos se guardan y para qué, de forma que pueda aceptar el registro sabiendo a qué me comprometo (Ley 25.326).

**Criterios de aceptación**

- [x] **CA-1** · `/privacidad` explica finalidad, datos, plazo, derechos (acceso, rectificación y supresión) y contacto · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Lo que falta (responsable, contacto y plazo de guarda) aparece como `[Completar: …]` visible · Estimación: 10 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · El registro la enlaza junto al consentimiento · Estimación: 10 min · Completado: 2026-11-09 02:23

### T-8 · Modelo de pacientes y rol en la sesión

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | — |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como dev quiero cuentas de pacientes separadas de la del admin y un rol en la sesión, de forma que un paciente nunca entre al panel.

**Criterios de aceptación**

- [x] **CA-1** · Migración `patient_account`: email único en minúscula, tokens con hash único, un solo token activo por propósito y borrado en cascada · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · El JWT lleva el rol; uno sin rol sigue siendo de admin, así las sesiones abiertas no se caen · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · Una cookie de paciente en `/admin` ve «Acceso denegado» y `requireAdmin` la rechaza · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-4** · `requirePatient` exige rol, cuenta, `session_version` y email verificado · Estimación: 20 min · Completado: 2026-11-09 02:23

### US-28 · El paciente se registra y activa su cuenta

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | L           |
| Depende de   | T-7, T-8, US-20 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero crear mi cuenta con mi email, de forma que pueda ver mis turnos sin pedírselos a Lisandro.

**Criterios de aceptación**

- [x] **CA-1** · Registro con nombre, email, teléfono, contraseña (8 a 128) y consentimiento obligatorio · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · La respuesta es la misma exista o no el email; a una cuenta ya verificada le llega «Ya tenés una cuenta» · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · El link de activación vence a las 24 h, sirve una vez y sólo actúa con el botón (abrirlo no cambia nada) · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-4** · Registrarse de nuevo sobre una cuenta sin verificar pisa sus datos y anula el link anterior · Estimación: 20 min · Completado: 2026-11-09 02:23

### US-29 · El paciente entra por `/login`

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | US-28 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero entrar con mi email y mi contraseña por la misma página que Lisandro, de forma que llegue directo a mi espacio.

**Criterios de aceptación**

- [x] **CA-1** · El admin va a `/admin` y el paciente a `/mi-espacio`; `/login` con sesión redirige según el rol · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Sin activar, con la contraseña correcta, ve «Activá tu cuenta con el link que te mandamos.» y «Reenviar el email» · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · El bloqueo por 5 intentos fallidos también vale para pacientes · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-4** · Los tiempos de respuesta no delatan si el email tiene cuenta · Estimación: 20 min · Completado: 2026-11-09 02:23

### US-30 · El paciente recupera su contraseña

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | US-29 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero restablecer mi contraseña si me la olvido, de forma que no pierda mi cuenta.

**Criterios de aceptación**

- [x] **CA-1** · «¿Olvidaste tu contraseña?» manda un link de 1 h y un solo uso; la respuesta es siempre la misma · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Restablecer cierra las otras sesiones y limpia el bloqueo por intentos · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · Un link vencido, usado o reemplazado dice «El link no es válido o ya venció.» · Estimación: 20 min · Completado: 2026-11-09 02:23

### US-31 · Mi espacio: mis turnos

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | US-29 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero ver mis próximos turnos y los anteriores, de forma que sepa cuándo y dónde me atiendo.

**Criterios de aceptación**

- [x] **CA-1** · Próximos turnos (del más cercano) y anteriores (del más reciente), sólo los de su email · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Fecha y hora en hora argentina, con ubicación y estado · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · Sin turnos dice «Todavía no tenés turnos.»; sin sesión lleva a `/login` · Estimación: 15 min · Completado: 2026-11-09 02:23

### US-32 · Mi espacio: mis datos, mi contraseña y la baja

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | US-29 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero corregir mis datos, cambiar mi contraseña o borrar mi cuenta, de forma que mis datos estén al día o dejen de estar.

**Criterios de aceptación**

- [x] **CA-1** · Edita nombre y teléfono; si cambiaron en otra pestaña da `STALE_VERSION` · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Cambiar la contraseña pide la actual y cierra las otras sesiones · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · «Eliminar mi cuenta» pide la contraseña y una confirmación; borra la cuenta y deja los turnos en la agenda · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-4** · «Cerrar sesión» · Estimación: 10 min · Completado: 2026-11-09 02:23

### US-33 · Mi espacio: cambiar el email

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | US-32 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero cambiar mi email, de forma que los avisos me lleguen a la casilla que uso.

**Criterios de aceptación**

- [x] **CA-1** · Pide la contraseña y manda un link al email nuevo; hasta tocarlo sigue el anterior · Estimación: 30 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · El link vence a las 24 h y sirve una vez; un email ocupado dice «Ese email ya lo usa otra cuenta.» · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · Al confirmar se cierran las otras sesiones · Estimación: 10 min · Completado: 2026-11-09 02:23

### US-34 · Login con el diseño nuevo

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | US-29 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero un login claro y con la marca de Lisandro, como `docs/wireframes/login.png`, de forma que confíe en dónde dejo mis datos.

**Criterios de aceptación**

- [x] **CA-1** · Desde 1024px, panel Verde Bosque con «Tu salud, en foco.», la bajada y los íconos Turnos e Historial; en el celular, la tarjeta con el logo arriba · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · La tarjeta tiene una luz Verde Lima detrás que se prende y se apaga cada 1 s (entre 60 % y 85 % de opacidad); queda quieta con «reducir movimiento» · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · Botón para mostrar la contraseña y links a «¿Olvidaste tu contraseña?» y «Registrate» · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-4** · Revisado con `impeccable` (`critique` y `polish`) en 375px y en desktop, con teclado · Estimación: 20 min · Completado: 2026-11-09 02:23

### US-35 · Ícono de cuenta en el hero

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | M           |
| Depende de   | US-29 |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero entrar a mi cuenta desde la home, como `docs/wireframes/cuenta-1.png` y `cuenta-2.png`, de forma que no tenga que conocer la dirección del login.

**Criterios de aceptación**

- [x] **CA-1** · Botón redondo arriba a la derecha del hero, con tres chispas y un brillo de vidrio cada 1 s, que abre la tarjeta «Mi espacio» con «Iniciar sesión» y «Registrate» · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Con sesión de paciente dice «Hola, Nombre», con «Ir a mi espacio» y «Cerrar sesión»; con la del admin, «Hola, Lisandro» e «Ir al panel» · Estimación: 20 min · Completado: 2026-11-09 02:23

- [x] **CA-3** · Se abre con clic, toque o teclado; Escape y un clic afuera la cierran · Estimación: 15 min · Completado: 2026-11-09 02:23

- [x] **CA-4** · La home sigue prerenderizada (PPR) y el ícono no mueve nada al cargar · Estimación: 15 min · Completado: 2026-11-09 02:23

### US-36 · Líneas a mano en el hero

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | S           |
| Depende de   | — |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como visitante quiero un hero con más vida, como `docs/wireframes/hero-animado.png`, de forma que la presentación se sienta dibujada a mano.

**Criterios de aceptación**

- [x] **CA-1** · Trazos Verde Lima finos: en desktop, tres curvas alrededor de Lisandro, un subrayado bajo la frase de apertura y un corchete recto que se vuelve subrayado junto a la de cierre; en el celular, las tres curvas (más chicas) y un subrayado bajo cada frase · Estimación: 40 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Se dibujan al terminar la intro; con «reducir movimiento» ya están dibujados · Estimación: 20 min · Completado: 2026-11-09 02:23

### US-37 · La flecha para bajar en su nuevo lugar

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-08  |
| Tamaño       | S           |
| Depende de   | — |
| Plan         | [sprint-3](docs/plans/sprint-3-cuenta-pacientes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como visitante quiero ver la flecha para bajar cerca del texto, como `docs/wireframes/cambio-de-lugar-flecha.png` y su versión mobile, de forma que no se pierda en la esquina.

**Criterios de aceptación**

- [x] **CA-1** · Desktop: a la derecha de la frase de apertura, a la altura de su última línea, entre el texto y la foto · Estimación: 15 min · Completado: 2026-11-09 02:23

- [x] **CA-2** · Celular: a la izquierda, a la altura de «la base de tu salud», sin pisar el botón flotante · Estimación: 15 min · Completado: 2026-11-09 02:23

### US-38 · Iteración de diseño: Mi espacio, ingreso verde y «¡Ya casi está!»

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-09  |
| Tamaño       | M           |
| Depende de   | US-31, US-34 |
| Plan         | iteración pedida por el dev en el chat (2026-11-09), con 4 wireframes |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como paciente quiero un Mi espacio y un ingreso como los wireframes `bandeja-usuario.png`,
`componente-login-verde.png`, `planilla-creacion-cuenta.png` y `cuenta-creada.png`, de forma que la cuenta se sienta
parte de la marca.

Decisiones del dev (2026-11-09): sin Google; «Cancelar» oculto hasta el Sprint 4; «Recordatorios» dice «por email»;
«Ver todos» lleva a `/mi-espacio/turnos`; pie «Lic. Lisandro López · Nutrición»; «foco.» relleno; todas las pantallas
de ingreso en verde; «¡Ya casi está!» también tras «olvidé mi contraseña».

**Criterios de aceptación**

- [x] **CA-1** · Mi espacio como `bandeja-usuario.png`: barra con logo, «Cerrar sesión» e inicial; tarjeta Verde Bosque con hasta 2 próximos turnos y «Ver todos»; «Recordatorios»; «Mi cuenta» con pestañas que se usan con el teclado · Estimación: 1 h · Completado: 2026-11-09 12:34

- [x] **CA-2** · `/mi-espacio/turnos` muestra los próximos y los anteriores · Estimación: 15 min · Completado: 2026-11-09 12:34

- [x] **CA-3** · Login, registro, recuperar y los links de email en la tarjeta Verde Bosque con la luz; «foco.» relleno; el aviso de «Reenviar el email» va debajo del botón · Estimación: 45 min · Completado: 2026-11-09 12:34

- [x] **CA-4** · Tras registrarse o pedir «olvidé», la página muestra «¡Ya casi está!» con el foco en el título · Estimación: 30 min · Completado: 2026-11-09 12:34

- [x] **CA-5** · Anda en 375px y desktop, sin scroll horizontal, con teclado; revisado con `impeccable` · Estimación: 20 min · Completado: 2026-11-09 12:34

## Sprint 4 · El paciente reserva online

Origen: descubrimiento con el dev (2026-11-09). Plan único del sprint:
[`docs/plans/sprint-4-reserva-online.md`](docs/plans/sprint-4-reserva-online.md); decisión de arquitectura: ADR 0007
(la reserva online pide cuenta). T-7 y US-20 subieron al Sprint 3 y US-23 (confirmar) se adelantó al Sprint 2.

Decisiones del dev: reservar pide cuenta; hasta 2 turnos por venir por paciente; las solicitudes sin confirmar se
cancelan solas 12 h antes (cron en el Sprint 5); el paciente cancela o reprograma desde Mi espacio hasta 24 h antes y
reprogramar vuelve a pendiente; Lisandro recibe un email por cada solicitud, cancelación y reprogramación, y ve un
contador de solicitudes; la reserva no pide datos extra.

### US-21 · El paciente reserva su turno online

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-09 |
| Tamaño       | L         |
| Depende de   | US-29, US-15 |
| Plan         | [sprint-4](docs/plans/sprint-4-reserva-online.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente quiero reservar un turno desde la web, de forma que no tenga que escribirle a Lisandro para conseguir un horario.

**Criterios de aceptación**

- [x] **CA-1** · «Reservá tu turno» sin sesión lleva a `/login?volver=/reservar` y, al entrar, vuelve a la reserva; `volver` sólo acepta rutas internas · Estimación: 30 min · Completado: 2026-11-09 20:05

- [x] **CA-2** · Pasos Ubicación → Día → Horario → Confirmar (obra social opcional), en la URL, mobile first y con teclado · Estimación: 1 h 30 min · Completado: 2026-11-09 20:05

- [x] **CA-3** · Sólo ofrece horarios libres desde 12 h y hasta 60 días; el turno nace pendiente y `ONLINE`; dos reservas simultáneas al mismo horario dan una sola (`SLOT_TAKEN`) · Estimación: 40 min · Completado: 2026-11-09 20:05

- [x] **CA-4** · Con 2 turnos por venir (contando los que cargó Lisandro) da `BOOKING_LIMIT`, también con dos pedidos a la vez · Estimación: 30 min · Completado: 2026-11-09 20:05

- [x] **CA-5** · Termina en «¡Solicitud enviada!» y el turno se ve pendiente en Mi espacio · Estimación: 20 min · Completado: 2026-11-09 20:05

### US-22 · Emails de la reserva

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-09 |
| Tamaño       | M         |
| Depende de   | US-21 |
| Plan         | [sprint-4](docs/plans/sprint-4-reserva-online.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente y como Lisandro quiero un email por cada movimiento del turno, de forma que nadie se entere tarde.

**Criterios de aceptación**

- [x] **CA-1** · Al paciente: «Recibimos tu solicitud» y «Recibimos tu cambio», con «Gestionar mi turno» hacia Mi espacio · Estimación: 30 min · Completado: 2026-11-09 20:05

- [x] **CA-2** · A Lisandro (email de su cuenta): nueva solicitud, cancelación y reprogramación del paciente, con el link al turno en el panel · Estimación: 30 min · Completado: 2026-11-09 20:05

- [x] **CA-3** · Los emails salen después de responder (`after()`); si fallan, el turno queda igual · Estimación: 15 min · Completado: 2026-11-09 20:05

### US-24 · El paciente cancela desde Mi espacio

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-09 |
| Tamaño       | S         |
| Depende de   | US-21 |
| Plan         | [sprint-4](docs/plans/sprint-4-reserva-online.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente quiero cancelar mi turno sin escribirle a Lisandro, de forma que el horario le quede libre a otro.

**Criterios de aceptación**

- [x] **CA-1** · «Cancelar» pide confirmación y funciona hasta 24 h antes; después da `CHANGE_TOO_LATE` y ofrece WhatsApp · Estimación: 30 min · Completado: 2026-11-09 20:05

- [x] **CA-2** · Sólo sus turnos (por email); el de otro da `NOT_FOUND`; libera el horario · Estimación: 20 min · Completado: 2026-11-09 20:05

### US-25 · El paciente reprograma desde Mi espacio

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-09 |
| Tamaño       | M         |
| Depende de   | US-21 |
| Plan         | [sprint-4](docs/plans/sprint-4-reserva-online.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como paciente quiero cambiar el horario de mi turno, de forma que no tenga que cancelar y reservar de nuevo.

**Criterios de aceptación**

- [x] **CA-1** · Elige otro horario público libre (cualquier ubicación) hasta 24 h antes; el turno vuelve a pendiente · Estimación: 40 min · Completado: 2026-11-09 20:05

- [x] **CA-2** · `/mi-espacio/turnos/[id]` muestra el turno (destino de «Gestionar mi turno») con sus acciones · Estimación: 30 min · Completado: 2026-11-09 20:05

### US-39 · Lisandro ve las solicitudes por confirmar

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-09 |
| Tamaño       | S         |
| Depende de   | US-21 |
| Plan         | [sprint-4](docs/plans/sprint-4-reserva-online.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como Lisandro quiero saber cuántas solicitudes tengo sin confirmar, de forma que ningún paciente quede esperando.

**Criterios de aceptación**

- [x] **CA-1** · Contador en «Agenda» (menú lateral y barra de abajo) y, si hay alguna, una tarjeta en el tablero · Estimación: 30 min · Completado: 2026-11-09 20:05

- [x] **CA-2** · `/admin/solicitudes` lista las solicitudes por venir con «Confirmar», «Reprogramar» y «Cancelar» (al confirmarla sale de la lista) · Estimación: 40 min · Completado: 2026-11-09 20:05

### T-10 · Las solicitudes sin confirmar vencen 12 h antes

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-09 |
| Tamaño       | S         |
| Depende de   | US-21 |
| Plan         | [sprint-4](docs/plans/sprint-4-reserva-online.md) |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como Lisandro quiero que una solicitud que no confirmé se cancele sola antes del turno, de forma que el paciente sepa a tiempo que no va.

**Criterios de aceptación**

- [x] **CA-1** · Servicio que cancela los pendientes que empiezan en 12 h o menos y le manda «Tu turno se canceló» a cada paciente; correrlo dos veces no duplica nada · Estimación: 30 min · Completado: 2026-11-09 20:05

- [x] **CA-2** · `/api/cron/expire-pending` protegido con `CRON_SECRET` (sin él, 401); el cron de Vercel lo programa el Sprint 5 · Estimación: 20 min · Completado: 2026-11-09 20:05

### US-40 · La reserva según los wireframes del dev (modalidad, pasos y «Tu turno»)

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | En revisión |
| Dueño        | Claude    |
| Inicio       | 2026-11-09 |
| Tamaño       | L         |
| Depende de   | US-21, US-25 |
| Plan         | [US-40](docs/plans/US-40-reserva-wireframes.md) |
| Merge        | —         |
| Horas reales | —         |

Origen: wireframes del dev del 2026-11-09 (`docs/wireframes/paso-previo-reserva.png`, `flujo-presencial-*.png` y
`flujo-virtual-*.png`), con las correcciones que pidió en el chat.

**Historia**: Como paciente quiero elegir primero si mi consulta es presencial o virtual y ver mi turno armándose al
costado, de forma que reservar sea claro y rápido.

**Criterios de aceptación**

- [x] **CA-1** · Pantalla previa a pantalla completa, sin barra ni pregunta y con «Cerrar sesión» arriba a la derecha: Presencial (Verde Bosque) y Virtual (Papel), cada mitad entera es el link de su modalidad (con hover y foco) y se despliega entera desde su lado (en mobile, desde arriba y abajo), en cada llegada; quietas con «reducir movimiento». Al elegir, la barra baja y el resto entra desde la izquierda; cada paso nuevo entra desde la izquierda; al terminar, el último paso queda con tilde (iteración del dev, 2026-11-10) · Estimación: 1 h 30 min · Completado: 2026-11-10 02:05

- [x] **CA-2** · Presencial: Ubicación (sólo presenciales) → Día → Horario → Confirmar; virtual: Día → Horario → Confirmar, con la ubicación online por detrás · Estimación: 1 h · Completado: 2026-11-10 02:05

- [x] **CA-3** · Cada paso marca la opción y avanza con «Continuar» (gris hasta elegir); «Atrás» vuelve; todo en la URL y sin JS · Estimación: 1 h · Completado: 2026-11-10 02:05

- [x] **CA-4** · Tarjeta «Tu turno» (Lugar o Modalidad, Día, Horario, «Paso X de N», «Cambiar» y el aviso de las 24 h); en mobile, arriba y compacta · Estimación: 1 h · Completado: 2026-11-10 02:05

- [x] **CA-5** · Calendario de a un mes con flechas (L M X J V S D) y horarios en 3 columnas con los ocupados tachados · Estimación: 1 h · Completado: 2026-11-10 02:05

- [x] **CA-6** · Confirmar con filas de ícono y obra social; final «¡Solicitud enviada!» con «Ver mis turnos» y «Reservar otro turno»; reprogramar usa el mismo flujo · Estimación: 1 h · Completado: 2026-11-10 02:05

- [x] **CA-7** · La intro de la home también se repite al volver navegando (SCROLL.md cambia la regla) · Estimación: 30 min · Completado: 2026-11-10 02:05

### BUG-1 · Las frases del hero no se leen en pantallas de 1024px de ancho y mucho alto

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Hecho     |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | S         |
| Depende de   | —         |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

Encontrado en la revisión de diseño del Sprint 3 (2026-11-09). No se tocó porque cambia lo que se ve: lo decide el
dev. **Cerrado por el dev (2026-11-09): ya está resuelto.**

**Actual**: el ancho de cada frase (`--phrase-w` en `src/components/home/hero.tsx`) sale de restar el ancho de la
foto, que crece con el alto de la pantalla. A 1024×900 las frases quedan de unos 5px, ilegibles. En un iPad Pro
vertical (1024×1366) el ancho da negativo. A 1024 de ancho, además, el ícono de cuenta tapa la «Z» de LÓPEZ.

**Esperado**: las frases se leen en cualquier pantalla desde 1024px. Por ejemplo:

- un mínimo para el tamaño de letra y para el ancho;
- o pasar a la disposición en columna cuando no entran.

**Criterios de aceptación**

- [ ] **CA-1** · A 1024×900 y 1024×1366 las dos frases se leen (16px o más) y nada las tapa · Estimación: 30 min · Completado: —

- [ ] **CA-2** · El ícono de cuenta no pisa el nombre a 1024 de ancho · Estimación: 15 min · Completado: —

### Iteración del panel (wireframes del dev, 2026-11-10)

El dev pidió rehacer Ubicaciones, Pacientes y Ajustes según sus wireframes (`apartado-de-ubicacion.png`,
`nueva-ubicacion1/2/3.png`, `lista-pacientes.png`, `nuevo-ajustes1/2.png`), adaptados a `DESIGN.md` (Manrope y
controles del panel con radio 12px). Plan:
[`docs/plans/panel-iteracion-ubicaciones-pacientes-ajustes.md`](docs/plans/panel-iteracion-ubicaciones-pacientes-ajustes.md).

Decisiones del dev (2026-11-10): sin «Exportar» por ahora; las ubicaciones no se borran (el botón rojo desactiva);
en la ficha cada cambio de horario se guarda al instante; sin el % de asistencia; sin atajos de horarios; el link
de la videollamada sigue obligatorio; Pacientes incluye a quien tiene turnos cargados a mano sin cuenta; sin «Nuevo
paciente»; Ajustes sólo con «Duración de los turnos» y «Obras sociales» (la anticipación queda en 60 días); la
duración acepta cualquier entero positivo de minutos.

### US-41 · Ubicaciones según el wireframe: lista y ficha

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-10  |
| Tamaño       | M           |
| Depende de   | US-9, US-10 |
| Plan         | [panel-iteracion](docs/plans/panel-iteracion-ubicaciones-pacientes-ajustes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como Lisandro quiero ver mis ubicaciones en una lista con la ficha de la elegida al lado, de forma que
revise y cambie sus horarios sin saltar de pantalla.

**Criterios de aceptación**

- [x] **CA-1** · En desktop, lista a la izquierda (miniatura con pin, nombre, dirección o «Videollamada», chip Presencial/Online y «Desactivada» si corresponde) y ficha de la elegida a la derecha, con la elegida en la URL; en mobile, lista y después ficha con «Volver» · Estimación: 1 h 30 min · Completado: 2026-11-10 15:31

- [x] **CA-2** · La ficha muestra nombre, chip, «⋯» con «Editar datos», el mapa con «Abrir en Google Maps» (presencial) o el link (online) · Estimación: 45 min · Completado: 2026-11-10 15:31

- [x] **CA-3** · Horarios: una fila por franja de lunes a domingo («sin atención» en los días vacíos), lápiz para editar la franja y tacho para borrarla, y «+ Agregar horario»; cada cambio se guarda al instante y una franja que se pisa da `HOURS_OVERLAP` · Estimación: 1 h 15 min · Completado: 2026-11-10 15:31

- [x] **CA-4** · Abajo, «turnos este mes» (no cancelados de esa ubicación, mes argentino) y «bloqueos» (los de este mes que pisan sus horarios); sin % de asistencia · Estimación: 1 h · Completado: 2026-11-10 15:31

- [x] **CA-5** · «Desactivar ubicación» (Pimentón) y «Reactivar ubicación»; con turnos por venir da `HAS_ACTIVE_APPOINTMENTS`; sin «Guardar cambios» ni «Exportar» · Estimación: 30 min · Completado: 2026-11-10 15:31

### US-42 · Nueva ubicación en un solo paso

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-10  |
| Tamaño       | M           |
| Depende de   | US-41       |
| Plan         | [panel-iteracion](docs/plans/panel-iteracion-ubicaciones-pacientes-ajustes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como Lisandro quiero cargar una ubicación con sus datos, sus horarios y su visibilidad en una sola
pantalla, de forma que quede lista para reservar de una vez.

**Criterios de aceptación**

- [x] **CA-1** · Cuatro tarjetas numeradas: 1 Tipo de atención (Presencial / Online), 2 Datos (los de hoy, con el link obligatorio en la online), 3 Horarios (un interruptor por día y varias franjas por día) y 4 Visibilidad; título «Nuevo consultorio» o «Nuevo espacio online» · Estimación: 1 h 30 min · Completado: 2026-11-10 15:31

- [x] **CA-2** · Tarjeta «Vista del paciente» al costado (abajo en mobile), que se actualiza mientras se escribe: Visible/Oculta, nombre, dirección o «Por videollamada», la semana y las horas por semana · Estimación: 1 h · Completado: 2026-11-10 15:31

- [x] **CA-3** · «Guardar» crea la ubicación con sus franjas en una sola transacción: si una franja se pisa (`HOURS_OVERLAP`) o el nombre se repite (`DUPLICATE`) no se guarda nada; al guardar, lleva a la ficha · Estimación: 1 h · Completado: 2026-11-10 15:31

- [x] **CA-4** · «Editar datos» (desde «⋯») usa las tarjetas 1 y 2 con «Guardar cambios»; los horarios se editan en la ficha · Estimación: 30 min · Completado: 2026-11-10 15:31

### US-43 · Lista de pacientes y ficha del paciente

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-10  |
| Tamaño       | L           |
| Depende de   | US-26, T-8  |
| Plan         | [panel-iteracion](docs/plans/panel-iteracion-ubicaciones-pacientes-ajustes.md) |
| Merge        | —           |
| Horas reales | —           |

**Historia**: Como Lisandro quiero ver a todos mis pacientes con su último y su próximo turno, de forma que sepa a
quién seguir y a quién escribirle.

**Criterios de aceptación**

- [x] **CA-1** · La lista junta las cuentas y a quien tiene turnos sin cuenta, agrupados por email (o por teléfono si no tiene email); «N pacientes registrados» arriba · Estimación: 1 h 30 min · Completado: 2026-11-10 15:31

- [x] **CA-2** · Columnas Paciente (iniciales, nombre y email), Teléfono, Último turno (el último que ya pasó y no se canceló), Próximo turno (el próximo pendiente o confirmado) y Estado; en mobile, una tarjeta por paciente · Estimación: 1 h · Completado: 2026-11-10 15:31

- [x] **CA-3** · Estado: Nuevo (primer turno o cuenta de este mes), Inactivo (sin turnos en 6 meses y ninguno por venir), Activo (el resto) · Estimación: 30 min · Completado: 2026-11-10 15:31

- [x] **CA-4** · Buscador por nombre, email o teléfono, filtros Todos / Activos / Nuevos este mes / Sin turno próximo y páginas de a 20, sin datos personales en la URL · Estimación: 1 h · Completado: 2026-11-10 15:31

- [x] **CA-5** · «Ver» abre la ficha (datos y turnos por venir y anteriores, cada uno con link al turno); «⋯» trae WhatsApp y «Nuevo turno»; sin «Nuevo paciente» ni «Exportar» · Estimación: 1 h 15 min · Completado: 2026-11-10 15:31

### US-44 · Ajustes en pestañas

| Campo        | Valor        |
| ------------ | ------------ |
| Estado       | En progreso  |
| Dueño        | Claude       |
| Inicio       | 2026-11-10   |
| Tamaño       | M            |
| Depende de   | US-11, US-12 |
| Plan         | [panel-iteracion](docs/plans/panel-iteracion-ubicaciones-pacientes-ajustes.md) |
| Merge        | —            |
| Horas reales | —            |

**Historia**: Como Lisandro quiero los ajustes separados en pestañas, de forma que encuentre rápido la duración y
las obras sociales.

**Criterios de aceptación**

- [x] **CA-1** · «Ajustes» con «Configurá cómo funciona tu agenda» y dos pestañas, «Duración de los turnos» y «Obras sociales», con la pestaña en la URL · Estimación: 30 min · Completado: 2026-11-10 15:31

- [x] **CA-2** · Duración: 30, 45, 60 y 90 minutos más un campo de texto de enteros positivos (placeholder en minutos) y «Guardar cambios»; cualquier entero mayor que 0 vale (la base deja de exigir 15 a 120 de a 5) · Estimación: 1 h · Completado: 2026-11-10 15:31

- [x] **CA-3** · Obras sociales: «Nueva obra social», y por fila el nombre, el chip «N turnos» (no cancelados), un interruptor activa/desactivada y el lápiz para renombrar; cada cambio se guarda al tocarlo y la desactivada se ve gris · Estimación: 1 h 15 min · Completado: 2026-11-10 15:31

### US-45 · Ir a una fecha desde la agenda

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-10  |
| Tamaño       | S           |
| Depende de   | US-26       |
| Plan         | [panel-iteracion](docs/plans/panel-iteracion-ubicaciones-pacientes-ajustes.md#us-45--ir-a-una-fecha-desde-la-agenda) |
| Merge        | —           |
| Horas reales | —           |

Pedido del dev (2026-11-10), como retoque final del panel: un calendario junto al título de la agenda.

**Historia**: Como Lisandro quiero elegir una fecha en un calendario desde la agenda, de forma que llegue a ese día
sin apretar las flechas muchas veces.

**Criterios de aceptación**

- [x] **CA-1** · Junto al título de la agenda, un botón con calendario abre el selector de fecha del navegador; al elegir una fecha, la agenda va directo a ese día en «Día» y a la semana que lo contiene en «Semana» · Estimación: 30 min · Completado: 2026-11-10 16:05

- [x] **CA-2** · Se usa con teclado (Enter va a la fecha escrita) y una fecha incompleta o anterior al año 2000 no navega · Estimación: 15 min · Completado: 2026-11-10 16:05

### US-46 · El login se despliega como la elección de modalidad

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-10  |
| Tamaño       | XS          |
| Depende de   | US-34, US-40 |
| Plan         | pedido del dev en el chat (2026-11-10) |
| Merge        | —           |
| Horas reales | —           |

Pedido del dev (2026-11-10): el mismo efecto de la elección de modalidad (US-40) en `/login`.

**Historia**: Como paciente o Lisandro quiero que el login entre con el mismo despliegue que la reserva, de forma que
el sitio se sienta uno solo.

**Criterios de aceptación**

- [x] **CA-1** · Al entrar a `/login`, las dos mitades entran enteras (fondo y contenido) desde afuera de la pantalla hasta juntarse en el centro: el panel verde desde la izquierda y la del formulario desde la derecha (debajo de 1024px sólo está la del formulario, que sube desde abajo en el celular); se repite en cada llegada y queda quieto con «reducir movimiento» · Estimación: 20 min · Completado: 2026-11-10 21:35

### US-47 · Hero potenciado: los trazos a mano del wireframe

| Campo        | Valor       |
| ------------ | ----------- |
| Estado       | En revisión |
| Dueño        | Claude      |
| Inicio       | 2026-11-10  |
| Tamaño       | S           |
| Depende de   | US-36       |
| Plan         | [US-47](docs/plans/US-47-hero-potenciado.md) |
| Merge        | —           |
| Horas reales | —           |

Pedido del dev (2026-11-10): replicar los trazos de `docs/wireframes/hero-potenciado.png`, menos las tres líneas
sobre la «L» de LISANDRO y la estrella de cuatro puntas.

**Historia**: Como visitante quiero un hero con trazos a mano más ricos, de forma que la presentación tenga más vida
sin tapar el contenido.

**Criterios de aceptación**

- [x] **CA-1** · Alrededor de Lisandro: dos curvas a su izquierda (a la altura del cuello y del hombro), una curva larga a la derecha que baja desde el cuello hasta el hombro, una ramita de tres hojas a la derecha de la cabeza y, abajo, dos rayitas a la izquierda y una curva con una rayita a la derecha del botón flotante · Estimación: 40 min · Completado: 2026-11-10 21:53

- [x] **CA-2** · Dos chispas arriba a la izquierda de «La alimentación…», el subrayado bajo «nuestra vida» y un subrayado bajo «la base de tu salud» en lugar del corchete; sin las líneas sobre la «L» ni la estrella · Estimación: 20 min · Completado: 2026-11-10 21:53

- [x] **CA-3** · Se ven en desktop y en el celular, se dibujan al final de la intro y quedan dibujados con «reducir movimiento» · Estimación: 15 min · Completado: 2026-11-10 21:53

## Sprint 5 · Despliegue

Previstos: despliegue (Vercel + Supabase + admin de producción), emails por Gmail (T-9) y recordatorio por email
24 h antes (cron), más el cron que vence las solicitudes (T-10).

### T-9 · Emails por Gmail (SMTP) en lugar de Resend

| Campo        | Valor     |
| ------------ | --------- |
| Estado       | Pendiente |
| Dueño        | —         |
| Inicio       | —         |
| Tamaño       | S         |
| Depende de   | —         |
| Plan         | —         |
| Merge        | —         |
| Horas reales | —         |

**Historia**: Como Lisandro quiero que los emails salgan de una cuenta de Gmail, de forma que les lleguen a todos los
pacientes sin pagar un dominio.

Decisión del dev (2026-11-09): no se compra un dominio. Sin dominio verificado, Resend sólo entrega a la casilla dueña
de la cuenta y cae en spam. Hasta este ítem sigue Resend con la cuenta de prueba.

**Criterios de aceptación**

- [ ] **CA-1** · `src/lib/email/send-email.ts` manda por SMTP de Gmail (`nodemailer`) con `GMAIL_USER` y `GMAIL_APP_PASSWORD` (contraseña de aplicación, sólo en el servidor); sale `RESEND_API_KEY` y `EMAIL_FROM` queda para el nombre visible · Estimación: 40 min · Completado: —

- [ ] **CA-2** · Sin credenciales o si Gmail falla, el envío devuelve `false` y sólo se loguea el motivo; la outbox de los E2E (`EMAIL_OUTBOX_DIR`) sigue igual · Estimación: 20 min · Completado: —

- [ ] **CA-3** · `.env.example`, docs y un ADR que reemplaza a Resend (gratis, llega a todos, unos 500 emails por día, cuenta dedicada y nunca la personal) · Estimación: 20 min · Completado: —

**Preguntas abiertas**

- La cuenta de Gmail dedicada a la web, con la verificación en dos pasos y una contraseña de aplicación (la crean
  el dev y Lisandro).

**Preguntas abiertas de los sprints 2 a 5**

- Ubicaciones reales, horarios, duración de la consulta, obras sociales y link de videollamada (los carga Lisandro).
- Revisión de la política de privacidad y cuánto tiempo se guardan los datos de los pacientes (Ley 25.326).
