# Ubicaciones y horarios (`location`)

Ítems: US-9 (ubicaciones), US-10 (horarios), US-19 (sección «Sucursales» de la home). Decisión: [ADR 0005](../../adr/0005-agenda-choque-global-y-horarios-en-hora-argentina.md).

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
  Cambiar o borrar franjas no toca los turnos ya reservados.
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
| `saveLocation` (`save-location.ts`) | `kind`, `name` y, según el tipo, `address`, `directions`, `mapUrl` o `videoUrl`; `id` + `version` si edita | crea → `redirect` a la ficha; edita → `ActionResult` | No |
| `setLocationActive` (`location-changes.ts`) | `id`, `version`, `active` | `ActionResult` | No |
| `addHours` (`location-changes.ts`) | `locationId`, `weekday` (1–7), `start`, `end` (`hh:mm`) | `ActionResult` | No |
| `deleteHours` (`location-changes.ts`) | `id`, `version` | `ActionResult` | No |

Lecturas (`location-queries.ts`): `getLocations`, `getLocation` (panel, con `guardAdminPage`) y `getPublicLocations`
(home, cacheada).

## Pantallas

- `/admin/ubicaciones`: lista con estado y resumen de horarios; «Nueva ubicación».
- `/admin/ubicaciones/nueva` y `/admin/ubicaciones/[id]`: datos (selector Presencial/Online en píldoras), horarios por
  día con «Agregar franja» y «Borrar», y «Desactivar»/«Reactivar».
- Home: sección `#sucursales` («Tarjeta de sucursal» de `DESIGN.md`), después de «Sobre mí», con profundidad (US-8).

## Errores

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Nombre vacío o largo, dirección faltante, mapa que no es de Google, link sin `https://` | `VALIDATION` | El del campo (p. ej. «Ingresá la dirección.») | `location.schema.test.ts`, `save-location.test.ts` |
| Nombre repetido (sin importar mayúsculas) o segunda ubicación online | `DUPLICATE` | Ya existe un registro con esos datos. | `location-repository.behavior.ts`, `save-location.test.ts` |
| Franja que se pisa con otra de cualquier ubicación | `HOURS_OVERLAP` | Ese horario se pisa con otra franja de alguna ubicación. Elegí otro. | `location-repository.behavior.ts`, `location-changes.test.ts` |
| Fin de franja igual o anterior al inicio | `VALIDATION` | La hora de fin tiene que ser posterior a la de inicio. | `hours.schema.test.ts` |
| Desactivar con turnos por venir | `HAS_ACTIVE_APPOINTMENTS` | Tiene turnos por venir: cancelalos o reprogramalos primero. | `location.service.test.ts`, `location-changes.test.ts` |
| Dos ediciones a la vez | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. | `location-repository.behavior.ts` |
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `save-location.test.ts`, `location-changes.test.ts` |
