# Sprint 2 · Iteración del panel (US-23, US-26, US-27)

- **Ítems**: [`BACKLOG.md`](../../BACKLOG.md#sprint-2--lisandro-maneja-su-agenda): US-23, US-26 y US-27
- **Nivel de tests**: 3 · Profundo
- **Estado del plan**: Aprobado (2026-11-08)

## Contexto

El dev revisó el Sprint 2 (integrado en `develop`, commit `9a016a5`) y pide iterar:

1. El panel tiene que verse **exactamente** como `docs/wireframes/panel-administrador.png`, con una corrección:
   Lisandro es **nutricionista** (el wireframe dice «fisioterapeuta»).
2. ~~Quitar los bloqueos~~ → **descartado por el dev**: los horarios son semanales y el bloqueo es la única forma de
   cerrar una fecha puntual. Los bloqueos se quedan; el wireframe ya los muestra («Bloquear horario» y el bloque
   rayado «Bloqueado»).
3. El login no puede vivir en `/admin/login`: todos entran por **`/login`**, y la cuenta decide a dónde va.

Cerrar el Sprint 1 (merge a `main`, tag) queda **fuera**: se hace junto con el Sprint 2 cuando el dev lo apruebe.

### Decisiones del dev (descubrimiento, 2026-11-08)

| Tema | Decisión |
|---|---|
| Bloqueos | Se quedan como están. |
| «Pacientes» en el menú | Link a una página «Próximamente» (`/admin/pacientes`). |
| Botones del panel | Como el wireframe: rectángulos redondeados (12px), no píldoras. Cambia la regla dura **sólo para el panel**. |
| Login con datos que no son del admin | `INVALID_CREDENTIALS`, como hoy. Cuando existan cuentas de pacientes (Sprint 5), entran por el mismo `/login` y van a la home. |
| Paciente nuevo | Su teléfono **y** su email (si tiene) no aparecen en ningún turno no cancelado anterior al lunes de esta semana. Se cuenta una vez por paciente. |
| Confirmar | Se crea ahora (adelanta US-23 del Sprint 3): pendiente → confirmado, con email al paciente. |
| Vista semana | Se mantiene: toggle Día/Semana en la cabecera de la tarjeta de la agenda. |
| Texto del bloque del turno | «Nombre · Obra social» (o «Particular») y abajo «08:00 – 08:45 · Sede Centro». |

### Supuestos míos (el dev los aprueba con el plan)

- Las 4 tarjetas de métricas miran **hoy** (hora argentina), sin importar el día que se esté viendo.
  - *Turnos hoy*: turnos no cancelados de hoy; abajo «+2 que ayer» / «−1 que ayer» / «Igual que ayer».
  - *Esta semana*: no cancelados de lunes a domingo; abajo «+12 % vs. semana anterior», «Igual que la semana
    anterior» o «Sin turnos la semana anterior».
  - *Pacientes nuevos*: según la regla de arriba; abajo «Esta semana».
  - *Horas libres hoy*: «disponibles» = horario de hoy de las ubicaciones activas, cortado en turnos de la duración,
    menos los bloqueos; «libres» = eso menos los turnos activos. Todo el día, no sólo lo que queda. Sin duración
    definida: «—» y «Definí la duración en Ajustes».
- La línea de horas del día **no muestra los cancelados** (se pisarían con el turno que ocupó su lugar); se siguen
  viendo en la vista semana y en el detalle. Rango: de 08:00 a 18:00, estirado si un turno o bloqueo cae afuera.
- «Confirmar» sólo para un pendiente que no empezó; si no → `INVALID_TRANSITION`. Si el próximo turno ya está
  confirmado, el botón principal es «Ver turno».
- El «⋯» del próximo turno es un link al detalle (que ya tiene reprogramar y cancelar), no un menú desplegable.
- Saludo según la hora argentina: «Buen día» (5–12), «Buenas tardes» (12–20), «Buenas noches». Bajada en voseo:
  «Acá tenés un resumen de tus turnos y de tu semana.»
- Logo de la sidebar: el ícono de la app (`src/app/icon.png`, LLN) en un disco; debajo del nombre, «NUTRICIONISTA».
- Las flechas del calendario mensual llevan al día 1 del mes anterior/siguiente (`?dia=AAAA-MM-01`), sin un
  parámetro nuevo.
- Título del login: «Ingresá a tu **cuenta**» (ya no es sólo «el panel»).

## Backlog

- **US-23 · Lisandro confirma un turno pendiente**: pasa del Sprint 3 al Sprint 2.
- **US-26 · Panel según el wireframe del dev** (depende de US-23).
- **US-27 · Un solo login en `/login`**.
- T-3: nota de que el login se mudó a `/login` (US-27). Sprint 3: se saca US-23 de los previstos.
- Plan en `docs/plans/sprint-2-iteracion-panel.md` (copia de este), referenciado por los tres ítems.
- **Nivel de tests: 3** en los tres (turnos, sesión/`proxy`, cruza capas) → `npm run verify` + E2E.
- Una sola rama `feat/sprint-2-iteracion-panel` desde `develop` (como el Sprint 2), un commit squash al final con el
  OK del dev sobre la lista simple. Sin push sin OK.

## Cambios

### US-23 · Confirmar (domain → service → action → ui)

- Service: `confirm(ref, now)` en un archivo nuevo `src/features/agenda/services/appointment-confirm.ts`
  (`appointment-commands.ts` ya tiene 81 líneas). Reusa `canTransition`, `repository.updateStatus(ref, status)`
  (con versión), `AppError('INVALID_TRANSITION')` y el aviso `NoticeKind 'confirmed'` (mismo email que el turno
  manual, mandado después de guardar; si falla, queda confirmado y avisa «No pudimos mandar el email»).
- Action: `confirmAppointment` en `src/features/agenda/actions/appointment-changes.ts` (73 líneas), con el patrón de
  `markAttendance`: `requireAdmin`, `RecordRefSchema`, `revalidatePath('/admin','layout')`, `ActionResult`.
- UI: botón «Confirmar» (`ActionButton`, `src/components/form/action-button.tsx`) en `AppointmentActions` para
  pendientes y en la tarjeta «Próximo turno».

| Acción inválida | `code` | Mensaje |
|---|---|---|
| Sin sesión | `UNAUTHENTICATED` | el del catálogo |
| No está pendiente o ya empezó | `INVALID_TRANSITION` | el del catálogo |
| Otro cambio lo tocó antes | `STALE_VERSION` | el del catálogo |
| Id inválido | `VALIDATION` | el del catálogo |

### US-26 · Panel según el wireframe

**Datos (sin cambios de schema ni migración):**
- Repositorio (`agenda.repository.ts` + `agenda-reads.ts` + fake en `testing/` + `agenda-repository.behavior.ts`):
  - `findNextActive(now)`: primer turno pendiente o confirmado con `startsAt >= now` (el detalle con dirección se
    arma con la lectura de detalle que ya existe, `getAppointment`).
  - `listPriorContacts({ before, phones, emails })`: teléfono y email de turnos no cancelados anteriores a `before`
    que coinciden.
  - Schedules de las ubicaciones activas, si no hay ya un método que los traiga todos (hoy está `findSchedule` por
    ubicación).
- Service: `summary(now)` en un archivo nuevo (`services/agenda-summary.ts`) con funciones puras testeables:
  `countNewPatients`, `freeHours` (reusa `availableSlots` de `services/availability.ts` con `now` = inicio del día,
  una vez con los bloqueos como ocupado y otra con bloqueos + turnos), y las diferencias hoy/ayer y semana/semana.
  Usa `listAppointments` (14 días: semana anterior + actual) y los helpers de `src/lib/argentina-time.ts`
  (`todayInArgentina`, `startOfWeek`, `addDays`, `argentinaInstant`) y `src/lib/format-date-time.ts`
  (`argentinaDay`, `argentinaMonth`).
- Action: `getAgendaSummary()` en `actions/agenda-queries.ts` (37 líneas). El calendario mensual reusa
  `getAgenda(inicioDelMes, díasDelMes)` y marca los días con turnos no cancelados.

**UI (`DESIGN.md` actualizado primero):**
- Token nuevo `--radius-control: 12px` → `rounded-control` en `src/app/tokens.css`. `PRIMARY_BUTTON` y
  `SECONDARY_BUTTON` (`src/components/form/form-parts.tsx`, sólo los usan el panel y el login) pasan a
  `rounded-control`; también las flechas, «Hoy», el toggle y los horarios del panel. Los chips de estado siguen en
  píldora (no son botones). El sitio público no cambia.
- Sidebar (`src/components/panel/panel-nav.tsx`, `panel-sections.ts`): logo + «Lisandro López» + «NUTRICIONISTA»;
  links Agenda, **Pacientes** (Lucide `Users`), Ubicaciones, Ajustes, Mi cuenta; el activo con fondo
  `bg-background/10` y la barrita Verde Lima al borde; separador y «Cerrar sesión» al pie. En mobile, la barra inferior
  con 5 ítems.
- `/admin/pacientes`: `PanelPage` «Pacientes» con una tarjeta «Próximamente».
- `src/app/admin/(panel)/page.tsx` se arma con componentes nuevos de `src/features/agenda/ui/components/`, cada uno
  < 100 líneas:
  - `AgendaHeader`: `h1` «Agenda» (el texto exacto que mira el E2E), saludo y bajada; «+ Nuevo turno» (Verde Lima,
    `Plus`) y «Bloquear horario» (Gris Nube, `Lock`).
  - `SummaryCards`: 4 tarjetas Papel radio 16px, disco `bg-primary/25` con ícono (`CalendarDays`, `BarChart3`,
    `Users`, `Clock`), número 28px/600 y bajada en Gris Piedra. 2×2 en mobile, 4 en fila desde `lg`.
  - `DayTimeline`: tarjeta con «Hoy, 8 de noviembre de 2026» (o el día largo), flechas, «Hoy» y toggle Día/Semana
    (desde 768px); columna de horas y líneas Línea Salvia; cada turno posicionado por minuto, con fondo según estado
    (`bg-confirmed`, pendiente `bg-muted` + borde) y barra izquierda; link al detalle. Bloqueo: Gris Nube rayado con
    «Bloqueado» y su horario. Vista semana: la `AgendaWeek` actual, con el bloque de turno nuevo.
  - `NextAppointmentCard`: avatar, nombre, obra social, `Clock` horario (con el día si no es hoy), `MapPin`
    ubicación + dirección (online: «Por videollamada»), «Confirmar»/«Ver turno» y «WhatsApp» (`WhatsappLink`
    existente, `MessageCircle`); «⋯» al detalle. Vacío: «No tenés turnos por venir.»
  - `MonthCalendar`: «Noviembre 2026» + flechas; grilla L–D desde el lunes, días de otros meses atenuados, punto
    Verde Lima en días con turnos, el elegido en disco Verde Bosque (`aria-current="date"`); cada día es un link.
  - `PanelPage` suma `wide` (`max-w-7xl`) para esta vista; grilla `lg:grid-cols-[minmax(0,1fr)_320px]`.
- Se borra el aviso «N turnos pendientes de confirmar» (lo reemplaza la tarjeta del próximo turno y los colores).

### US-27 · Login único en `/login`

- Mover `src/app/admin/login/page.tsx` → `src/app/login/page.tsx` (mismo `LoginForm`, `noindex`); con sesión de
  admin → `redirect('/admin')`. Login correcto → `/admin` (hoy sólo existe esa cuenta).
- `src/proxy.ts`: se borra `ADMIN_LOGIN` y su excepción. `/admin/login` pasa a ser una ruta más de `/admin/**`
  (sin sesión, «Acceso denegado»). `/login` ya es pública (el proxy sólo mira `/admin`).
- `require-admin.ts` (`SESSION_EXPIRED`) y `logout.ts` redirigen a `/login`.
- «Acceso denegado» sigue sin link al login.

### Docs

`DESIGN.md` (panel según el wireframe, `rounded-control`, login en `/login`), `AGENTS.md` (regla de diseño: píldoras
en el sitio público, 12px en el panel), `docs/features/agenda/README.md` (confirmar, métricas y sus reglas),
`docs/features/auth/README.md`, `docs/architecture.md` (rutas y fila del proxy), `docs/initial_prompt.md`,
`BACKLOG.md`. Sin ADR (no hay decisión de arquitectura nueva).

## Tests (nivel 3)

| Tipo | Qué prueba |
|---|---|
| Unit + fuzz | `countNewPatients` (por teléfono o email, una vez por paciente, ignora cancelados, sólo antes del lunes); `freeHours` (bloqueos restan disponibles, turnos restan libres, sin duración); textos de diferencias; posición/rango de la línea de horas (incluye turno de 22:00 argentinas = día siguiente en UTC); grilla del mes (empieza lunes, meses que arrancan domingo); saludo por hora argentina |
| Service | `confirm`: pendiente → confirmado + email «confirmado»; confirmado/empezado → `INVALID_TRANSITION`; versión vieja → `STALE_VERSION`; email que falla → queda confirmado y avisa |
| Contrato + fuzz | `confirmAppointment` sin sesión / id inválido / ok; se suma al fuzz de las acciones de agenda |
| Repositorio (fake + Prisma, `test:int`) | `findNextActive`, `listPriorContacts` en la suite de comportamiento compartida |
| Componentes | `PanelNav` (5 links, Pacientes, activo), `SummaryCards`, `DayTimeline` (posiciones, bloqueo rayado, sin cancelados, vacío), `NextAppointmentCard` (pendiente/confirmado/vacío), `MonthCalendar` (puntos, `aria-current`, links) |
| Login | `proxy.test.ts` (`/login` pasa; `/admin/login` sin sesión → acceso denegado); `require-admin.test.ts` y logout → `/login` |
| E2E (375px y desktop) | `tests/pages/panel.ts` entra por `/login`; `admin.spec.ts` (login, logout vuelve a `/login`, `/admin/login` sin sesión → acceso denegado); `panel-agenda.spec.ts` (métricas, próximo turno, confirmar un pendiente sembrado, calendario, Pacientes «Próximamente», bloqueo sigue andando) |

Tests que hoy rompen y se actualizan: `panel-nav.test.tsx` y `panel-sections.test.ts` (4 → 5 secciones),
`agenda-views.test.tsx` (texto del bloque), `appointment-detail.test.tsx` (mock con `confirmAppointment`),
`tests/pages/panel.ts` (título del login), `tests/admin.spec.ts`, `tests/panel-agenda.spec.ts`.

## Verificación

1. `npm run lint && npm run typecheck`, `npm run test:coverage`.
2. `docker compose up -d --wait db-test` y `npm run test:int`.
3. `npm run verify` (cobertura ≥ 90/85, mutación ≥ 70, build).
4. `npm run test:e2e` (Chromium, 375px y desktop).
5. `impeccable` `critique` y `polish` del panel en 375px y desktop, comparando con el wireframe (cierra también los
   CA de `impeccable` pendientes de T-4 y US-13).
6. El dev mira en su navegador: `/login` → `/admin`, el panel contra el wireframe, «Confirmar», «Cerrar sesión» →
   `/login`. (Yo no levanto `npm run dev`.)

## Riesgos

- Archivos al borde de 100 líneas (`appointment-commands.ts` 81, `form-parts.tsx` 79): lo nuevo va en archivos
  nuevos.
- El E2E `signIn` mira el `h1` «Agenda»: el saludo va fuera del `h1`.
- Pendientes no existen todavía en el Sprint 2 (los turnos manuales nacen confirmados): el seed de tests siembra uno
  para probar «Confirmar»; en desarrollo, el dev no lo va a ver hasta el Sprint 3 salvo con el seed.
- El working tree tiene `docs/wireframes/ejemplo-presentacion.png` borrado y wireframes nuevos sin trackear: al
  commitear, le pregunto al dev qué entra.
