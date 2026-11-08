# Ajustes de la agenda (`settings`)

Ítems: US-11 (duración de los turnos) y US-12 (obras sociales).

## Qué hace

- **Duración**: una sola para todos los turnos, de 15 a 120 minutos, de a 5 (`agenda_settings`, fila única con
  `CHECK`). Mientras no se define, la agenda no ofrece horarios (`NO_SLOT_DURATION`). Cambiarla no toca los turnos ya
  reservados: guardan su inicio y su fin. El seed de desarrollo y de tests carga 45 minutos de ejemplo.
- **Obras sociales**: una lista para todas las ubicaciones. Se agregan, se renombran, se desactivan y se reactivan;
  no se borran. «Particular» no se carga: los formularios la ofrecen siempre (la base rechaza ese nombre). Una
  desactivada deja de ofrecerse, pero los turnos que ya la tienen la siguen mostrando. La lista de activas se cachea
  (tag `health-insurances`) para la home.

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

Lecturas (`settings-queries.ts`): `getSettingsOverview` (panel) y `getActiveHealthInsurances` (cacheada).

## Pantallas

- `/admin/ajustes`: tarjeta «Duración de los turnos» (píldora Verde Lima «Guardar duración») y tarjeta «Obras
  sociales» (alta, renombre y desactivación con píldoras Gris Nube).

## Errores

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Duración fuera de 15–120 o no entera | `VALIDATION` | La duración va de 15 a 120 minutos. | `settings.schema.test.ts`, `settings-changes.test.ts` |
| Duración que no es múltiplo de 5 | `VALIDATION` | Usá múltiplos de 5 minutos. | `settings.schema.test.ts` |
| Obra social vacía, larga o «Particular» | `VALIDATION` | El del campo | `settings.schema.test.ts`, `settings-changes.test.ts` |
| Obra social repetida (sin importar mayúsculas) | `DUPLICATE` | Ya existe un registro con esos datos. | `settings-repository.behavior.ts` |
| Dos cambios a la vez | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. | `settings-repository.behavior.ts` |
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `settings-changes.test.ts` |
