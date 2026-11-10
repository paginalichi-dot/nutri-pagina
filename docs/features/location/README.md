# Ubicaciones y horarios (`location`)

Ítems: US-9 (ubicaciones), US-10 (horarios), US-19 (sección «Sucursales» de la home), US-41 (lista y ficha) y US-42
(nueva ubicación en un solo paso). Decisión: [ADR 0005](../../adr/0005-agenda-choque-global-y-horarios-en-hora-argentina.md).

## Qué hace

- Lisandro carga sus **ubicaciones**: presenciales (nombre, dirección, indicaciones opcionales y mapa opcional) y una
  sola **online** (nombre y link fijo de videollamada, que va en el email del turno).
- El mapa se carga pegando el código «Insertar un mapa» de Google Maps (o su link): se guarda sólo la URL
  `https://www.google.com/maps/embed?…`. La base rechaza cualquier otra.
- Una presencial puede pasar a online y al revés: los campos del otro tipo quedan vacíos (lo garantiza un `CHECK`).
- Las ubicaciones no se borran: se **desactivan**. Una desactivada no ofrece horarios ni aparece en la home; sus
  turnos y su historial quedan. Con turnos pendientes o confirmados por venir no se puede desactivar.
- **Horarios**: franjas semanales por ubicación (día + desde/hasta en hora argentina), varias por día. Dos franjas
  nunca se pisan, ni en la misma ubicación ni en otra (`EXCLUDE` en `weekly_hours`). Las contiguas (9–13 y 13–17) sí.
  Cambiar o borrar franjas no toca los turnos ya reservados. Una franja se edita (desde y hasta) con su versión.
- **Alta en un solo paso** (US-42): la ubicación, su visibilidad (`active`) y sus franjas (varias por día) se crean
  en una transacción: si una franja se pisa o el nombre se repite, no se guarda nada.
- **Números de la ficha** (US-41): los turnos no cancelados de esa ubicación en el mes argentino y los bloqueos del
  mes que pisan alguna de sus franjas (los bloqueos son globales; se cuentan sólo los que la afectan).
- La home muestra las ubicaciones activas en «Dónde atiendo» (US-19) con su mapa, dirección, indicaciones, horarios y
  las obras sociales; el link de videollamada nunca sale ahí. Se cachea (`'use cache'`, tag `locations`) y cada
  cambio del panel lo refresca con `updateTag`.

## Quién lo usa

| Acción | Paciente (sin cuenta) | Admin |
|---|---|---|
| Ver ubicaciones activas y horarios en la home | Sí | Sí |
| Crear, editar, desactivar ubicaciones y cargar franjas | No | Sí |

## Server Actions

| Action | Entrada | Salida | Pública |
|---|---|---|---|
| `createLocation` (`create-location.ts`) | los campos de `saveLocation` sin `id`, `active` (`true` si se ofrece) y franjas repetidas `weekday` + `start` + `end` (hasta 28) | `redirect` a la ficha o `ActionResult` | No |
| `saveLocation` (`save-location.ts`) | `id`, `version`, `kind`, `name` y, según el tipo, `address`, `directions`, `mapUrl` o `videoUrl` | `ActionResult` | No |
| `setLocationActive` (`location-changes.ts`) | `id`, `version`, `active` | `ActionResult` | No |
| `addHours` (`location-changes.ts`) | `locationId`, `weekday` (1–7), `start`, `end` (`hh:mm`) | `ActionResult` | No |
| `updateHours` (`location-changes.ts`) | `id`, `version`, `start`, `end` (`hh:mm`) | `ActionResult` | No |
| `deleteHours` (`location-changes.ts`) | `id`, `version` | `ActionResult` | No |

Lecturas (`location-queries.ts`): `getLocations`, `getLocation`, `getLocationStats` (panel, con `guardAdminPage`) y
`getPublicLocations` (home, cacheada).

## Pantallas

- `/admin/ubicaciones` y `/admin/ubicaciones/[id]` (US-41, `docs/wireframes/apartado-de-ubicacion.png`): lista a la
  izquierda y ficha de la elegida a la derecha desde 1024px (sin elegida, la primera). En mobile, `/admin/ubicaciones`
  es sólo la lista y `[id]` sólo la ficha, con «Volver a ubicaciones». La ficha: nombre, chip, «⋯» → «Editar datos»,
  mapa con «Abrir en Google Maps» (o el link de la online), horarios por día con lápiz, tacho y «+ Agregar horario»
  (todo se guarda al instante), los dos números del mes y «Desactivar ubicación» (pide confirmación) o «Reactivar».
- `/admin/ubicaciones/nueva` (US-42, `docs/wireframes/nueva-ubicacion1/2/3.png`): cuatro pasos (tipo, datos, horarios
  con un interruptor por día y «+ Franja», visibilidad) y la tarjeta «Vista del paciente» que se actualiza al escribir.
- `/admin/ubicaciones/[id]/editar`: los pasos 1 y 2 con «Guardar cambios».
- Home: sección `#sucursales` («Tarjeta de sucursal» de `DESIGN.md`), después de «Sobre mí», con profundidad (US-8).

## Errores

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Nombre vacío o largo, dirección faltante, mapa que no es de Google, link sin `https://` | `VALIDATION` | El del campo (p. ej. «Ingresá la dirección.») | `location.schema.test.ts`, `save-location.test.ts` |
| Nombre repetido (sin importar mayúsculas) o segunda ubicación online | `DUPLICATE` | Ya existe un registro con esos datos. | `location-repository.behavior.ts`, `save-location.test.ts` |
| Franja que se pisa con otra de cualquier ubicación | `HOURS_OVERLAP` | Ese horario se pisa con otra franja de alguna ubicación. Elegí otro. | `location-repository.behavior.ts`, `location-changes.test.ts` |
| Fin de franja igual o anterior al inicio | `VALIDATION` | La hora de fin tiene que ser posterior a la de inicio. | `hours.schema.test.ts`, `new-location.schema.test.ts` |
| Alta con franjas que se pisan (entre sí o con otra ubicación) | `HOURS_OVERLAP` | Ese horario se pisa con otra franja de alguna ubicación. Elegí otro. | `location-hours.behavior.ts`, `create-location.test.ts` |
| Alta con más de 28 franjas | `VALIDATION` | Cargá como mucho 28 franjas. | `new-location.schema.test.ts` |
| Desactivar con turnos por venir | `HAS_ACTIVE_APPOINTMENTS` | Tiene turnos por venir: cancelalos o reprogramalos primero. | `location.service.test.ts`, `location-changes.test.ts` |
| Dos ediciones a la vez | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. | `location-repository.behavior.ts` |
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `save-location.test.ts`, `location-changes.test.ts` |
