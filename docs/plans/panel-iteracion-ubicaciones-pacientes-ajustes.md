# US-41 a US-44 · Iteración del panel: ubicaciones, pacientes y ajustes

- **Ítems**: [`BACKLOG.md`](../../BACKLOG.md#iteración-del-panel-wireframes-del-dev-2026-11-10) (US-41, US-42, US-43, US-44)
- **Nivel de tests**: 3 · Profundo (migración que cambia un `CHECK`, lecturas nuevas que cruzan `agenda`, `location` y
  `patient`, y una transacción que crea la ubicación con sus franjas)
- **Estado del plan**: Aprobado (2026-11-10)

## Objetivo

Ubicaciones, Pacientes y Ajustes del panel quedan como los wireframes del dev del 2026-11-10, adaptados a
`DESIGN.md`: Manrope (los títulos en serifa e itálica del wireframe pasan a 500 con la palabra clave en 700) y los
controles del panel con radio 12px (`rounded-control`). Los chips de estado siguen en píldora.

## Descubrimiento

Respuestas del dev (2026-11-10):

| Tema | Decisión |
|---|---|
| Forma de los controles | Radio 12px, como dice `DESIGN.md`. |
| «Exportar» | No por ahora (en ninguna pantalla). |
| «Eliminar ubicación» | No se borra: el botón rojo pasa a «Desactivar ubicación» (y «Reactivar ubicación»). |
| Horarios en la ficha | Cada cambio (lápiz, tacho, «Agregar horario») se guarda al instante; sin «Guardar cambios». |
| Números de la ficha | «Turnos este mes» y los bloqueos de este mes que pisan sus horarios; sin % de asistencia. |
| Link de la online | Sigue obligatorio (va en el email del turno). |
| Atajos de horarios | No van. |
| Franjas por día al crear | Varias («+ Franja»). |
| Quién es paciente | Las cuentas y quien tiene turnos sin cuenta, agrupados por email (o por teléfono si no tiene). |
| Estados | Nuevo: primer turno o cuenta de este mes. Inactivo: sin turnos en 6 meses y ninguno por venir. Activo: el resto. |
| «Nuevo paciente» | No va. |
| «Ver» | Ficha del paciente con datos y turnos; «⋯» trae WhatsApp y «Nuevo turno». |
| Ajustes | Sólo «Duración de los turnos» y «Obras sociales»; la anticipación queda en 60 días fijos. |
| «N turnos» de una obra social | Todos los turnos no cancelados con esa obra social. |
| Guardado en obras sociales | Al tocar cada control; sin «Guardar cambios». La desactivada se ve gris. |
| Duración | Opciones 30, 45, 60 y 90 y un campo de texto de enteros positivos; cualquier entero mayor que 0. |

Decisiones del agente (de forma, no de negocio):

- **Ubicaciones**: la elegida va en la URL (`/admin/ubicaciones/[id]`), que muestra la lista y la ficha juntas desde
  1024px; `/admin/ubicaciones` sin elegida muestra la lista y, en desktop, la primera ficha. En mobile `[id]` muestra
  sólo la ficha con «Volver a ubicaciones».
- **Miniatura**: un cuadrado Gris Nube con el pin (Lucide `MapPin`, o `Video` en la online). Hoy se guarda el mapa
  embebido, no una imagen, y cuatro mapas vivos cargan lento. El mapa real va sólo en la ficha.
- **Pacientes sin datos personales en la URL**: la lista llega entera al componente cliente, que busca, filtra y
  pagina en el navegador (la página y el filtro no van en la URL). La ficha usa un id opaco: el de la cuenta o, si
  no tiene, el de uno de sus turnos. `shortcut`: la lista entera viaja al navegador; sirve hasta unos miles de
  pacientes, y si crece se pagina en el servidor con la búsqueda por POST.
- **Visibilidad** al crear = `active` de la ubicación (una oculta no se ofrece ni aparece en la home).
- **Pestañas de Ajustes** como links (`?pestana=duracion` / `?pestana=obras-sociales`): andan sin JS y con «atrás».

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| domain | `settings/domain/settings.schema.ts` | `slotMinutes`: entero > 0 (sin máximo ni múltiplo de 5). Mensaje: «Ingresá los minutos como un número entero mayor que 0.». `HealthInsuranceUsage` (fila + `appointments`). |
| domain | `location/domain/hours.schema.ts` | `WeeklyHoursUpdateSchema` (`id`, `version`, `start`, `end`) y `NewLocationInputSchema`: la ubicación + `active` + lista de franjas (`weekday`, `start`, `end`), con el mismo control de fin > inicio. |
| domain | `location/domain/location-stats.schema.ts` (nuevo) | `{ appointmentsThisMonth, blocksThisMonth }`. |
| domain | `patient/domain/patient-directory.schema.ts` (nuevo) | `DirectoryEntry` (`id`, `name`, `email \| null`, `phone`, `hasAccount`, `lastVisit`, `nextVisit`, `status: 'NEW' \| 'ACTIVE' \| 'INACTIVE'`) y `PatientFile` (entrada + turnos). |
| schema / migración | `prisma/migrations/<fecha>_slot_minutes_positivo/migration.sql` | Cambia el `CHECK` `agenda_settings_slot_minutes_range` a `"slot_minutes" > 0`. Sin cambios de modelo. |
| repository | `location/repository/location.repository.ts` (+ `location-writes.ts` si pasa las 100 líneas) | `createWithHours(data, hours)` en una transacción (`EXCLUDE` → `HOURS_OVERLAP`, nombre → `DUPLICATE`, todo o nada); `updateHours(ref, range)` con versión; `countAppointmentsBetween(locationId, from, to)`. Fake al día. |
| repository | `agenda` (lectura existente de bloqueos) | Bloqueos de un rango, para contar los que pisan las franjas. |
| repository | `patient/repository/patient-directory.repository.ts` (nuevo) | Lee cuentas y turnos (sólo los campos que la lista usa) con la API de Prisma. |
| repository | `settings/repository/settings.repository.ts` | `appointmentsByHealthInsurance()`: `groupBy` de turnos no cancelados. |
| service | `location/services/location.service.ts` | `createWithHours`, `updateHours`, `stats(id, now)` (mes argentino; bloqueos que se cruzan con alguna franja de la ubicación). |
| service | `patient/services/patient-directory.service.ts` (nuevo) | Agrupa por email (en minúsculas) o teléfono, toma nombre y teléfono de la cuenta o del último turno, calcula último y próximo turno y el estado. Función pura `patientStatus`. |
| service | `settings/services/settings.service.ts` | Lista de obras sociales con su cantidad de turnos. |
| actions | `location/actions/*` | `createLocation` (reemplaza el alta de `saveLocation`) y `updateHours`; `requireAdmin` y `strictObject`. |
| actions | `patient/actions/patient-directory-queries.ts` (nuevo) | `getPatientDirectory()` y `getPatientFile(id)` con `guardAdminPage`. |
| ui | `location/ui/components/*` | `LocationsLayout` (lista + ficha), `LocationListItem`, `LocationDetail`, `HoursTable` (fila con lápiz que abre la edición en la misma fila), `LocationStats`, `LocationMenu` («⋯»), `NewLocationForm` (4 tarjetas numeradas), `DaySwitchRow`, `PatientPreviewCard`. |
| ui | `patient/ui/admin/*` (nuevo) | `PatientDirectory` (cliente: buscador, filtros, tabla, tarjetas mobile y paginado), `PatientRow`, `PatientStatusChip`, `PatientFileView`. |
| ui | `settings/ui/components/*` | `SettingsTabs`, `SlotMinutesForm` (opciones + texto), `HealthInsuranceList` (fila con chip, interruptor `role="switch"` y lápiz). |
| páginas | `src/app/admin/(panel)/ubicaciones/**`, `pacientes/page.tsx`, `pacientes/[id]/page.tsx`, `ajustes/page.tsx` | Nuevas vistas; `ubicaciones/[id]/editar` para «Editar datos». `/admin/**` ya está cubierto en `proxy.ts`. |
| docs | `DESIGN.md`, `docs/features/location|settings|patient/README.md`, `docs/initial_prompt.md` | Componentes nuevos y excepción: «Desactivar ubicación» en Pimentón sobre Papel (5.1:1). |

## Pantallas (adaptación de los wireframes)

- **Ubicaciones**: título «Tus **ubicaciones**», bajada y «+ Nueva ubicación» (Verde Lima). Lista en una tarjeta Papel
  radio 16px; la elegida con fondo Verde Lima al 10% y barra Verde Lima a la izquierda. Ficha en otra tarjeta Papel:
  nombre 24px/700 + chip, «⋯», mapa (iframe, radio 16px) y «Abrir en Google Maps» subrayado, «HORARIOS DE ATENCIÓN»
  (12px, mayúsculas, +1px), filas separadas con Línea Salvia, una caja Gris Nube con los dos números (28px/700 y
  bajada) y abajo a la derecha «Desactivar ubicación» en Pimentón.
- **Nueva ubicación**: «← Volver a ubicaciones», «Nuevo **consultorio**» / «Nuevo **espacio online**», «Configurá los
  datos y los horarios en un solo paso.». Tarjetas Papel radio 30px con disco Verde Bosque numerado; las de tipo,
  Gris Nube y, la elegida, Verde Lima al 20% con borde Verde Lima y tilde. Interruptores Verde Bosque con perilla
  Verde Lima. «Vista del paciente» en Verde Bosque (`theme-forest`) con luz Verde Lima, `sticky` desde 1024px. Abajo,
  la píldora del panel Verde Lima «Guardar consultorio» / «Guardar ubicación online» con disco de tilde y «Cancelar».
- **Pacientes**: «Pacientes», «N pacientes registrados», buscador (input del panel con lupa) y los cuatro filtros
  (activo Verde Bosque); tabla en tarjeta Papel; iniciales en disco Verde Lima o Verde Bosque alternados; punto Verde
  Lima delante del próximo turno; chips Activo (`bg-confirmed`), Nuevo (Verde Lima al 25%) e Inactivo (Gris Nube);
  «Mostrando 1–20 de N» y el paginado con flechas.
- **Ajustes**: «Ajustes» + «Configurá cómo funciona tu agenda», pestañas (activa Verde Bosque, inactivas Gris Nube).
  Duración: cuatro opciones Gris Nube (elegida Verde Lima), un separador, el campo «Ej.: 50 minutos», «Los turnos ya
  reservados conservan su duración.» y «Guardar cambios». Obras sociales: «+ Nueva obra social», «"Particular" siempre
  aparece como opción.» y las filas.

## Errores

| Acción inválida | `code` | Mensaje |
|---|---|---|
| Duración vacía, decimal, 0 o negativa | `VALIDATION` | Ingresá los minutos como un número entero mayor que 0. |
| Franja nueva o editada que se pisa (también al crear la ubicación) | `HOURS_OVERLAP` | Ese horario se pisa con otra franja de alguna ubicación. Elegí otro. |
| Fin de franja igual o anterior al inicio | `VALIDATION` | La hora de fin tiene que ser posterior a la de inicio. |
| Nombre repetido o segunda online al crear | `DUPLICATE` | Ya existe un registro con esos datos. |
| Desactivar con turnos por venir | `HAS_ACTIVE_APPOINTMENTS` | Tiene turnos por venir: cancelalos o reprogramalos primero. |
| Franja, ubicación u obra social editada por otro | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. |
| Ficha de un paciente que no existe | `NOT_FOUND` | (página 404 del panel) |
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. |

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit | `patientStatus` (bordes: primer turno el 1.º del mes en hora argentina, justo 6 meses, con turno por venir); agrupado por email sin importar mayúsculas y por teléfono sin email; nombre de la cuenta antes que el del turno; «último» ignora cancelados y futuros. |
| Unit | `stats`: mes argentino (turno el 31 a las 23:30 de Argentina, que en UTC ya es el mes siguiente) y bloqueo que cruza la medianoche; uno que no toca ninguna franja no cuenta. |
| Contrato + fuzz | `createLocation` (todo o nada con una franja que se pisa), `updateHours`, `saveSlotMinutes` (1, 7 y 600 valen; 0, -5, 4.5 y texto no) y que ninguna devuelve un error fuera del catálogo. |
| Integración | `createWithHours` con `EXCLUDE` real (no queda la ubicación si falla una franja), `updateHours` con versión, el `CHECK` nuevo (0 lo rechaza la base), el `groupBy` de obras sociales y la lectura del directorio. |
| Componente | Lista + ficha, la edición de una franja en su fila, la vista del paciente que cambia al escribir, el buscador y los filtros (sin tocar la URL), las pestañas y el interruptor con teclado. |
| E2E | Crear una ubicación con dos franjas el mismo día y verla en la ficha; editar y borrar una franja; ver a un paciente del seed (con cuenta y sin cuenta) y abrir su ficha; cambiar la duración a 50 y desactivar una obra social. En 375px y desktop. |

## Riesgos

- **Duraciones raras (1 o 7 minutos)**: la reserva ofrecería muchísimos horarios por día. Lo decidió el dev; se avisa
  en la pantalla («Los turnos ya reservados conservan su duración.») y se prueba que la grilla no se rompe.
- **Mismo paciente con dos emails**: queda como dos pacientes. Es la regla de agrupado que se aprobó.
- **Lista entera en el navegador**: ver el `shortcut` de arriba.
- **E2E que hoy miran las pantallas viejas** (`panel-settings.spec.ts`, ubicaciones): se reescriben con las nuevas.

## US-45 · Ir a una fecha desde la agenda

Agregado por el dev el 2026-11-10 («retoque final»), aprobado en el chat. Nivel de tests: 2 (componente nuevo, sin
reglas nuevas).

- **UI** (`agenda/ui/components/date-jump.tsx`, en `AgendaToolbar` junto al título): un cuadrado de 44px con
  `CalendarDays` (como las flechas) que contiene un `<input type="date" name="dia">` invisible encima; al tocarlo abre
  el selector del navegador (`showPicker`). Va dentro de un form GET a `/admin` con `vista` oculto, así que la URL y el
  «atrás» siguen funcionando. Al elegir una fecha completa (año 2000 o posterior) se envía solo; con teclado, Enter.
- **Sin cambios de servidor**: `/admin?dia=&vista=` ya valida el día y, en «Semana», muestra la semana que lo
  contiene (`startOfWeek`).
- **Tests**: componente (el form apunta a `/admin` con la vista actual, una fecha completa envía y una incompleta o
  del año 2 no) y E2E (elegir una fecha en Día y en Semana).

