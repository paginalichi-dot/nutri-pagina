# Sprint 4 · El paciente reserva online

- **Ítems**: [`BACKLOG.md`](../../BACKLOG.md#sprint-4--el-paciente-reserva-online): US-21, US-22, US-24, US-25,
  US-39 y T-10.
- **Nivel de tests**: 3 · Profundo (toca turnos: doble reserva concurrente, zona horaria con cruce de medianoche y
  cancelación).
- **Estado del plan**: Aprobado (2026-11-09)
- **Decisión**: ADR 0007 «La reserva online pide cuenta» (nuevo).

## Objetivo

Un paciente con cuenta reserva un turno desde la web. La reserva nace pendiente y Lisandro la confirma desde el panel,
donde ve cuántas solicitudes tiene. El paciente cancela o reprograma desde Mi espacio hasta 24 h antes. Lisandro se
entera de todo por email.

## Decisiones del dev (2026-11-09)

| Tema | Decisión |
|---|---|
| Cuenta | **Obligatoria para reservar.** Cambia `AGENTS.md` («reservan sin crear cuenta») y va el ADR 0007. Sin sesión, «Reservá tu turno» lleva al login y después vuelve a la reserva. |
| Límite | Hasta **2 turnos por venir** (pendientes o confirmados) por paciente. Cuentan también los que cargó Lisandro con su email. |
| Pendientes | Ocupan el horario. Si Lisandro no confirma, **se cancelan solas 12 h antes del turno**, con el email «Tu turno se canceló». La lógica y el endpoint quedan listos en este sprint; el cron que los dispara llega con el despliegue (Sprint 5). |
| Datos | Los de la cuenta (nombre, email y teléfono) más la obra social, que se elige en cada reserva (opcional, «Particular»). Nada más. |
| Gestión | Desde Mi espacio. Los emails traen «Gestionar mi turno», que abre el turno en Mi espacio (con inicio de sesión si hace falta). Sin token aparte. |
| Reprogramar | Sin tope, mientras falten más de 24 h. Cada cambio vuelve el turno a pendiente. |
| Avisos | Email a Lisandro por cada solicitud, cancelación y reprogramación del paciente. En el panel, un contador de solicitudes por confirmar en el menú y en el tablero. |
| Rechazo | Si Lisandro cancela una solicitud, el paciente recibe el mismo «Tu turno se canceló». |
| Fuera del sprint | Los wireframes `lista-pacientes.png` y `apartado-de-ubicacion.png` quedan en el backlog para otro sprint. |
| Diseño | No hay wireframe: lo armo yo con `DESIGN.md`. Si al dev no le gusta, trae uno y se itera. |

### Respuestas de la segunda ronda (2026-11-09)

| Tema | Decisión |
|---|---|
| 12 h y 12 h | Se deja así: se reserva desde 12 h y las solicitudes vencen 12 h antes. Una reserva hecha cerca del límite puede vencer apenas corra el cron si Lisandro no la confirma. |
| WhatsApp de Lisandro | Variable de entorno `LISANDRO_WHATSAPP`. Vacía: «Escribile a Lisandro» va como texto, sin link. |
| Sprint 3 | Se arranca con el Sprint 3 «En revisión» (ya está en `develop`). |
| BUG-1 | Ya está resuelto en el código: se actualiza el backlog. |
| Turnos que cargó Lisandro | El paciente también los cancela y reprograma desde Mi espacio, con las mismas reglas, si tienen su email. |
| Link de videollamada | Sólo cuando el turno está confirmado (Mi espacio y email de confirmación). |
| El paciente cancela | Le llega «Tu turno se canceló» (el email que ya existe) y a Lisandro, su aviso. |
| Límite de intentos | 10 por hora por cuenta en reservar, cancelar y reprogramar (la tabla de T-7). |

Además: reprogramar ofrece sólo los horarios públicos (desde 12 h y hasta 60 días, cualquier ubicación activa); el
flujo no tiene «Tipo de consulta» (no hay tipos); los avisos van al email de la cuenta del admin; y `?volver=` sólo
acepta rutas internas del sitio (sin redirect abierto).

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| domain | `agenda/domain/booking.schema.ts` | `OnlineBookingInputSchema` (`locationId`, `startsAt`, `healthInsuranceId` opcional) y `PatientChangeSchema` (`id`, `version`; `locationId` y `startsAt` al reprogramar). |
| errores | `src/lib/errors/codes.ts` | `BOOKING_LIMIT` y `CHANGE_TOO_LATE` (ver la tabla). |
| schema | — | **Sin migración**: alcanza con `appointment` (`source ONLINE`, `status PENDING`, `patient_email`). |
| repository | `agenda.repository.ts`, `agenda-reads.ts` | `countUpcomingByEmail(email, now)` (dentro de la transacción), `listExpiringPending(until)` y la búsqueda de un turno por id y email del paciente. |
| service | `agenda/services/online-booking.ts` (nuevo), `patient-changes.ts` (nuevo), `expire-pending.ts` (nuevo) | Reservar: dentro de la transacción `Serializable` de siempre se verifica el horario público, el límite de 2 y se crea el pendiente. Cancelar y reprogramar: sólo si el turno es suyo, está activo y faltan más de 24 h; reprogramar lo vuelve a pendiente. Vencer: cancela los pendientes que empiezan en 12 h o menos y avisa. Emails con `appointmentEmail` y nuevos tipos. |
| emails | `appointment-notices.ts` y uno nuevo para Lisandro | Al paciente: «Recibimos tu solicitud» y «Recibimos tu cambio», con «Gestionar mi turno». A Lisandro: «Nueva solicitud de turno», «{Nombre} canceló su turno» y «{Nombre} pidió cambiar su turno», con el link al turno en el panel. Los de confirmar y cancelar ya existen. Salen con `after()`. |
| actions | `agenda/actions/online-booking.ts`, `my-appointment-changes.ts`, `app/api/cron/expire-pending/route.ts` | Reservar, cancelar y reprogramar detrás de `requirePatient`. El endpoint del cron se protege con `CRON_SECRET` (`Authorization: Bearer`), no es público y está en `.env.example`. Lecturas: ubicaciones activas, obras sociales y horarios públicos de un día. |
| auth | `login.ts`, `proxy.ts` | `/reservar` exige rol paciente: sin sesión va a `/login?volver=/reservar`. El login vuelve a `volver` si es una ruta interna. |
| ui reserva | `app/reservar/page.tsx`, `agenda/ui/booking/*` | Pasos con píldoras numeradas (`DESIGN.md`, «reserva de turnos»): Ubicación (tarjetas) → Día (calendario Papel, días con horario) → Horario (píldoras Gris Nube; la elegida en Verde Lima) → Confirmar (resumen, obra social y «Solicitar turno»). Termina en «¡Solicitud enviada!» con el aviso de que Lisandro la confirma. Los pasos van en la URL (`?ubicacion=&dia=`), así funcionan sin JS y con «atrás». Si ya tiene 2 turnos, se le dice antes de empezar. |
| ui Mi espacio | `upcoming-card.tsx`, `/mi-espacio/turnos/[id]` (nuevo), `/mi-espacio/turnos/[id]/reprogramar` (nuevo) | Cada turno muestra «Cancelar» (vuelve el link oculto en US-38) y «Reprogramar» cuando faltan más de 24 h; si falta menos, «Escribile a Lisandro» por WhatsApp. El detalle de un turno es el destino de «Gestionar mi turno». Cancelar pide confirmación. |
| ui panel | `panel-nav.tsx`, tablero, `/admin/solicitudes` (nuevo) | Contador de solicitudes en «Agenda» (barra lateral y barra de abajo) y una tarjeta en el tablero. La página nueva lista las solicitudes por venir con «Confirmar» y «Cancelar» (los de siempre). |

## Errores nuevos

| Acción inválida | `code` | Mensaje |
|---|---|---|
| Reservar con 2 turnos por venir | `BOOKING_LIMIT` | Ya tenés dos turnos por venir. Cancelá o reprogramá uno para reservar otro. |
| Cancelar o reprogramar con menos de 24 h | `CHANGE_TOO_LATE` | Faltan menos de 24 h para tu turno. Escribile a Lisandro para cambiarlo. |
| Más de 10 reservas, cancelaciones o cambios en 1 h | `RATE_LIMITED` | Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo. |

Se reusan:

- `SLOT_TAKEN` y `SLOT_TOO_SOON` (horario ocupado, a menos de 12 h o a más de 60 días);
- `INVALID_TRANSITION` (turno cancelado o que ya empezó);
- `NOT_FOUND` (turno que no es suyo; no se revela que existe);
- `STALE_VERSION`, `UNAUTHENTICATED`, `VALIDATION` y `NO_SLOT_DURATION`.

## Tests (nivel 3)

| Tipo | Qué prueba |
|---|---|
| Unit (service con fakes) | Reserva pendiente y `ONLINE`; límite de 2, contando los turnos cargados por Lisandro; 12 h y 60 días; cancelar y reprogramar hasta 24 h; el turno de otro da `NOT_FOUND`; reprogramar vuelve a pendiente; los vencidos se cancelan y los confirmados no; qué emails salen en cada caso. |
| Contrato (actions) | La tabla de errores, sin sesión, rol admin, `volver` sólo interno y el endpoint del cron sin secreto o con uno incorrecto (401). |
| Fuzz | Schemas de reserva y de cambio; `volver` con URLs externas, `//`, `\` y esquemas. |
| Integración | Dos reservas simultáneas al mismo horario dan una sola; dos del mismo paciente a la vez no pasan el límite de 2; vencer pendientes dos veces seguidas no duplica nada. |
| Zona horaria | Un turno a las 00:30 hora argentina se ofrece, se guarda y se muestra el día correcto; las 12 h y las 24 h se cuentan en UTC. |
| Componente | Pasos de la reserva, contador del panel y botones de Mi espacio según las 24 h. |
| E2E | Paciente sin sesión → login → reserva → «¡Solicitud enviada!» → la ve en Mi espacio como pendiente → el admin la ve en Solicitudes y la confirma → el paciente la ve confirmada; cancelar desde Mi espacio; reprogramar vuelve a pendiente; el tercer turno da el aviso del límite; en 375px y con teclado. |

## Docs

- ADR 0007.
- `AGENTS.md`: reglas de turnos, acciones públicas (sale «crear una reserva» y «gestionar un turno con token») y datos
  personales.
- `DESIGN.md`: flujo de reserva, botones de Mi espacio y contador del panel.
- `docs/features/agenda/README.md` y `docs/features/patient/README.md`.
- `.env.example` (`CRON_SECRET`), `docs/initial_prompt.md` y `BACKLOG.md`.
- Sprint 5: el cron de Vercel que llama a `/api/cron/expire-pending`, por ejemplo cada 15 minutos.

## Riesgos

- **Sin cron hasta el Sprint 5:** las solicitudes a menos de 12 h que Lisandro no confirmó siguen ocupando el horario.
  Él las ve en Solicitudes y puede cancelarlas a mano.
- **Emails sólo a tu casilla hasta el Sprint 5** (Resend de prueba): en las pruebas manuales, el paciente y el admin
  tienen que ser tu email; los E2E usan la outbox.
- **Cuenta obligatoria:** frena a quien reserva por primera vez. Es la decisión del dev, queda en el ADR.
- **El turno se vincula por email:** si el paciente cambia su email, deja de ver los turnos anteriores. Eso ya está
  avisado en «Tu email».
