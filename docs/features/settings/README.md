# Ajustes de la agenda (`settings`)

Ítems: US-11 (duración de los turnos), US-12 (obras sociales) y US-44 (ajustes en pestañas).

## Qué hace

- **Duración**: una sola para todos los turnos, en minutos: cualquier entero mayor que 0 (US-44, decisión del dev;
  `agenda_settings`, fila única con `CHECK "slot_minutes" > 0`). Mientras no se define, la agenda no ofrece horarios (`NO_SLOT_DURATION`). Cambiarla no toca los turnos ya
  reservados: guardan su inicio y su fin. El seed de desarrollo y de tests carga 45 minutos de ejemplo.
- **Obras sociales**: una lista para todas las ubicaciones. Se agregan, se renombran, se desactivan y se reactivan;
  no se borran. «Particular» no se carga: los formularios la ofrecen siempre (la base rechaza ese nombre). Una
  desactivada deja de ofrecerse, pero los turnos que ya la tienen la siguen mostrando. La lista de activas se cachea
  (tag `health-insurances`) para la home. Cada una muestra cuántos turnos no cancelados la tienen
  (`appointmentsByHealthInsurance`, un `groupBy`).

## Quién lo usa

| Acción | Paciente (sin cuenta) | Admin |
|---|---|---|
| Ver las obras sociales activas en la home | Sí | Sí |
| Cambiar la duración y la lista de obras sociales | No | Sí |

## Server Actions (`settings-changes.ts`)

| Action | Entrada | Salida | Pública |
|---|---|---|---|
| `saveSlotMinutes` | `slotMinutes`, `version` (0 la primera vez) | `ActionResult` | No |
| `createHealthInsurance` | `name` | `ActionResult` | No |
| `renameHealthInsurance` | `id`, `version`, `name` | `ActionResult` | No |
| `setHealthInsuranceActive` | `id`, `version`, `active` | `ActionResult` | No |

Lecturas (`settings-queries.ts`): `getSettingsOverview` (panel, con la cantidad de turnos de cada obra social) y
`getActiveHealthInsurances` (cacheada).

## Pantallas

- `/admin/ajustes` (US-44, `docs/wireframes/nuevo-ajustes1.png` y `nuevo-ajustes2.png`): «Ajustes», «Configurá cómo
  funciona tu agenda.» y dos pestañas en la URL (`?pestana=duracion` | `?pestana=obras-sociales`):
  - **Duración de los turnos**: 30, 45, 60 y 90 minutos (la elegida en Verde Lima, `aria-pressed`), un campo de texto
    numérico («Minutos, por ejemplo 50») y «Guardar cambios».
  - **Obras sociales**: «+ Nueva obra social» abre el alta arriba de la lista; cada fila trae el nombre, el chip
    «N turnos», un interruptor (`role="switch"`) que la ofrece o no al tocarlo y un lápiz para renombrarla en la
    misma fila. La desactivada se ve gris.

## Errores

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Duración vacía, decimal, 0, negativa o con letras | `VALIDATION` | Ingresá los minutos como un número entero mayor que 0. | `settings.schema.test.ts`, `settings-changes.test.ts` |
| Obra social vacía, larga o «Particular» | `VALIDATION` | El del campo | `settings.schema.test.ts`, `settings-changes.test.ts` |
| Obra social repetida (sin importar mayúsculas) | `DUPLICATE` | Ya existe un registro con esos datos. | `settings-repository.behavior.ts` |
| Dos cambios a la vez | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. | `settings-repository.behavior.ts` |
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `settings-changes.test.ts` |
