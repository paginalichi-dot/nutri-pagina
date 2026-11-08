# Agenda y turnos (`agenda`)

Ítems: T-5 (emails), T-6 (modelo de turnos), US-13 (agenda), US-14 (bloqueos), US-15 (disponibilidad), US-16 (turno
a mano), US-17 (cancelar y asistencia), US-18 (reprogramar). Decisión: [ADR 0005](../../adr/0005-agenda-choque-global-y-horarios-en-hora-argentina.md).

## Qué hace

- **Turnos** (`appointment`): ubicación, inicio y fin (`timestamptz`), estado, origen (`ONLINE` o `PANEL`) y datos del
  paciente (nombre, teléfono, email opcional, obra social opcional = Particular). Dos turnos no cancelados nunca se
  pisan, en ninguna ubicación (`EXCLUDE`); si chocan ⇒ `SLOT_TAKEN`.
- **Estados**: `PENDING → CONFIRMED → ATTENDED | NO_SHOW`, y `CANCELLED` desde `PENDING` o `CONFIRMED`
  (`canTransition`). En la UI: Pendiente, Confirmado, Asistió, Ausente, Cancelado. La reserva online (Sprint 3) nace
  pendiente; el turno que carga Lisandro nace confirmado.
- **Disponibilidad** (`availableSlots`, función pura): las franjas del día de la ubicación, cortadas en pasos de la
  duración desde el inicio de cada franja (un turno que no entra entero no se ofrece), menos los turnos activos de
  cualquier ubicación y los bloqueos. El panel ofrece desde ahora; el paciente (Sprint 3), desde 12 h. Ambos hasta 60
  días. Todo se calcula en hora argentina y viaja en UTC.
- **Turno a mano**: Lisandro elige ubicación, día y horario libre (sin el límite de 12 h) y carga nombre, teléfono,
  email opcional y obra social. Si el email ya tiene un turno por venir, avisa pero guarda. Con email, el paciente
  recibe «Turno confirmado» con el `.ics`. Siempre se ofrece «Avisar por WhatsApp» (`wa.me` con el mensaje armado).
- **Cancelar** (sólo pendientes o confirmados que no empezaron): libera el horario, manda «Tu turno se canceló» si hay
  email y ofrece el WhatsApp. **Asistió / Ausente**: sólo un confirmado que ya empezó.
- **Reprogramar**: a otro horario libre de cualquier ubicación; conserva estado y paciente; manda «Tu turno cambió de
  horario» (antes y ahora, con el `.ics` nuevo) y ofrece el WhatsApp.
- **Bloqueos**: desde/hasta (hora argentina) y motivo opcional, para todas las ubicaciones. No se puede bloquear un
  rango con turnos activos. Crear un turno, moverlo o bloquear corre en una transacción `Serializable` que se reintenta hasta 5 veces ante un
  conflicto (`40001`).
- **Emails** (T-5, `src/lib/email/`): Resend por su API (`RESEND_API_KEY`, `EMAIL_FROM`). Si el email falla, el turno
  queda guardado y el panel lo avisa. Nunca se loguea el destinatario ni el contenido.

## Quién lo usa

| Acción | Paciente (sin cuenta) | Admin |
|---|---|---|
| Ver la agenda, cargar, cancelar, reprogramar, marcar asistencia, bloquear | No | Sí |
| Recibir los emails del turno | Sí (si dejó email) | — |

## Server Actions

| Action | Entrada | Salida | Pública |
|---|---|---|---|
| `createManualAppointment` | `locationId`, `startsAt` (ISO), `name`, `phone`, `email`, `healthInsuranceId` | `ActionResult<{ whatsappUrl, appointmentId }>` | No |
| `cancelAppointment` | `id`, `version` | ídem | No |
| `rescheduleAppointment` | `id`, `version`, `locationId`, `startsAt` | ídem | No |
| `markAttendance` | `id`, `version`, `attended` | `ActionResult` | No |
| `createBlock` / `deleteBlock` | `start`, `end` (`AAAA-MM-DDThh:mm`), `reason` / `id`, `version` | `ActionResult` | No |

Lecturas (`agenda-queries.ts`): `getAgenda`, `getAppointment`, `getPanelSlots`.

## Pantallas

- `/admin`: agenda del día (columnas por ubicación) o de la semana (desde 768px), con flechas, «Hoy», toggle
  Día/Semana, contador de pendientes, «Nuevo turno» y «Bloquear horario».
- `/admin/turnos/nuevo`, `/admin/turnos/[id]`, `/admin/turnos/[id]/reprogramar`, `/admin/bloqueos`.

## Errores

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Horario fuera de la grilla, de la franja, tomado o bloqueado | `SLOT_TAKEN` | Ese horario ya no está disponible. Elegí otro. | `appointment-commands.test.ts`, `agenda-repository.behavior.ts` |
| Horario que ya pasó | `SLOT_TOO_SOON` | Ese horario ya pasó o está demasiado cerca. Elegí otro. | `appointment-commands.test.ts` |
| Sin duración definida | `NO_SLOT_DURATION` | Todavía no definiste la duración de los turnos. Hacelo en Ajustes. | `agenda.service.test.ts`, `appointment-changes.test.ts` |
| Cancelar o reprogramar uno cancelado o empezado; asistencia antes de la hora | `INVALID_TRANSITION` | Ese cambio no se puede hacer en el estado actual del turno. | `appointment-changes.test.ts` (service y action) |
| Bloquear un rango con turnos | `BLOCK_HAS_APPOINTMENTS` | En ese rango hay turnos. Cancelalos o reprogramalos antes de bloquear. | `agenda.service.test.ts`, `block-changes.test.ts` |
| Datos del paciente o del bloqueo inválidos | `VALIDATION` | El del campo | `booking.schema.test.ts`, `block.schema.test.ts` |
| Dos cambios a la vez o choque bloqueo/turno | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. | `agenda.service.int.test.ts` |
| Turno inexistente | `NOT_FOUND` | El turno ya no existe. | `agenda.service.test.ts` |
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `appointment-changes.test.ts`, `block-changes.test.ts` |
