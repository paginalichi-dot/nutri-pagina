# US-40 · La reserva según los wireframes del dev

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md) (Sprint 4)
- **Nivel de tests**: 2 · Lógica acotada (con `verify` y E2E por cierre de sprint)
- **Estado del plan**: Aprobado (2026-11-09)

## Contexto

El Sprint 4 está hecho y en verde, pero sin commitear, en `feat/sprint-4-reserva-online`. El dev trajo 10 wireframes
(`docs/wireframes/paso-previo-reserva.png`, `flujo-presencial-*`, `flujo-virtual-*`) que rediseñan `/reservar`:

- una pantalla previa para elegir la modalidad, que entra con animación;
- pasos con «Continuar» y «Atrás»;
- una tarjeta lateral «Tu turno»;
- el calendario de a un mes;
- los horarios ocupados, tachados;
- un final nuevo.

Va en la misma rama, como ítem nuevo **US-40**. Nivel de tests 2: toca la UI y la lógica de horarios, no el modelo
de datos. Al cerrar, `npm run verify` y los E2E, porque es cierre de sprint.

## Decisiones del dev (2026-11-09)

| Tema | Decisión |
|---|---|
| Tipografía | Se mantiene **Manrope**, sin serifa. Títulos en 500 con la palabra clave en 700 («Reservá tu **turno**», «¿Cómo querés tu **consulta**?»). |
| Etiqueta «CONSULTA DE NUTRICIÓN» | No va. |
| Modalidad | Pantalla previa: Presencial (mitad Verde Bosque) y Virtual (mitad Papel), cada una con una tarjeta de ícono Verde Lima, título grande, bajada, chips **tal cual el wireframe** y la píldora Verde Lima «Elegir presencial / virtual» con disco de flecha. **Sin el disco «o» del medio.** Sin el botón «?». |
| Animación | Presencial entra desde la izquierda y Virtual desde la derecha (cada elemento de su mitad, escalonado). La píldora del título baja desde arriba. Con «reducir movimiento», todo quieto. **Se repite en cada recarga y en cada navegación.** |
| Regla de SCROLL.md | Cambia para todo el sitio: las animaciones de entrada se repiten en cada recarga y en cada navegación. **También la intro de la home** (hoy no se repite al volver a la home). |
| Mobile (modalidad) | Las mitades se apilan: Presencial arriba y Virtual abajo, cada una entrando desde su lado. |
| Virtual | **3 pasos: Día → Horario → Confirmar.** No se habla de ubicación: por detrás se usa la ubicación online activa. En la tarjeta «Tu turno» va «Modalidad: Por videollamada» en lugar de «Lugar». |
| Presencial | 4 pasos, y en Ubicación sólo se ofrecen las ubicaciones presenciales. |
| Elegir | Se marca la opción (borde y disco Verde Lima). «Continuar» queda gris hasta que hay una elegida. «Atrás» vuelve al paso anterior. |
| Horarios | Grilla completa del día en 3 columnas: rectángulos Gris Nube con reloj. Los ocupados o bloqueados van tachados y no se pueden tocar. |
| Confirmar | Filas Lugar, Día y Horario con disco de ícono y etiqueta en mayúsculas. Debajo, el selector «Obra social (opcional)», con «Particular» primero. Botón «Confirmar turno» Verde Bosque con disco Verde Lima. |
| Final | «**¡Solicitud enviada!**», la fecha y hora, el lugar y «Lisandro la confirma y te avisamos por email». Botones «Ver mis turnos» (Verde Bosque) y «Reservar otro turno» (link; sólo si todavía tiene lugar para otro). |
| Mobile (pasos) | La tarjeta «Tu turno» va **arriba y compacta**: la modalidad, «Cambiar», lo elegido en una línea y la barra de progreso. |
| Reprogramar | Usa el mismo flujo: modalidad, pasos y tarjeta, con el título «Reprogramá tu **turno**». La tarjeta muestra el turno de antes. |
| Typos | Calendario «L M X J V S D»; «jueves 12 de noviembre» en minúsculas. |

## Cómo se arma (reusando lo que hay)

- **URL como estado** (sin JS sigue andando): `?modalidad=presencial|virtual&ubicacion=&dia=&hora=&mes=AAAA-MM`. El
  paso sale de lo que ya está elegido, y «Cambiar» vuelve a `/reservar` sin parámetros.
  - Cada paso es un `<form method="get">` con los parámetros ya elegidos como campos ocultos, un grupo de radios con
    forma de tarjeta o horario y el botón «Continuar» (`type=submit`).
  - El radio va `required` y el estilo deshabilitado de «Continuar» sale de `group-has-[:checked]`, así que no hace
    falta estado de cliente.
  - «Atrás» es un link al paso anterior. Al volver, la opción ya elegida queda marcada (`defaultChecked`).
- **Servicio**:
  - `availability.ts` suma `slotGrid`, que devuelve todos los inicios del día dentro de la ventana pública como
    `{ startsAt, free }`. `availableSlots` pasa a usarla, filtrando los libres, para no duplicar lógica.
  - `getPublicSlots` devuelve la grilla.
  - `assertSlotAvailable` no cambia: un horario tachado igual da `SLOT_TAKEN` si alguien lo fuerza.
- **Virtual**: `resolveSelection` (`ui/booking/booking-selection.ts`) toma la primera ubicación activa de tipo
  `ONLINE` de `getPublicLocations()`. Si no hay ninguna, la mitad Virtual dice «Por ahora no hay turnos virtuales» y
  no tiene botón.
- **Calendario**: `DayChoice` muestra un mes por vez (`mes`, por defecto el del primer día libre). Las flechas
  `‹ ›` son links a meses dentro de la ventana de 60 días. El mes va en una caja Gris Nube radio 25px; los días
  libres son discos Papel de 48px y los demás, el número apagado. Se reusan `monthGrid` y `monthTitle` de
  `month-calendar.tsx`.
- **Componentes nuevos** en `src/features/agenda/ui/booking/`, cada uno de 100 líneas como máximo:
  - `modality-choice.tsx`: las dos mitades;
  - `modality-motion.css`: los keyframes, con los tokens de motion de SCROLL.md;
  - `booking-summary-card.tsx`: la tarjeta «Tu turno»;
  - `step-form.tsx`: el form con «Continuar» y «Atrás»;
  - `slot-grid.tsx`: los horarios con ocupados.
- **Componentes que se ajustan**: `booking-flow.tsx`, `booking-steps.tsx` (completado: disco Verde Lima con tilde;
  actual: halo Verde Lima), `booking-choices.tsx`, `day-choice.tsx`, `request-form.tsx` (botón Verde Bosque y final
  nuevo) y `booking-summary.tsx` (filas con ícono).
- **Páginas**: `src/app/reservar/page.tsx` y `src/app/mi-espacio/turnos/[id]/reprogramar/page.tsx` arman el layout
  de dos columnas, con la tarjeta arriba en mobile. El fondo lleva una luz Verde Lima suave arriba a la derecha.
- **Intro de la home que se repite**: en `hero-motion.tsx`, al montar en `/` sin ancla y sin «reducir movimiento», si
  no viene del script de `<head>`, `claimIntro` marca `data-intro-state='playing'` en el layout effect, antes de
  pintar, y la intro corre igual.
  - `MOTION_GATE_SCRIPT` sigue cubriendo la primera carga.
  - Se invierte el test E2E «al volver a la home… no se repite».
  - Se revisa que la ruta oculta de Next (Activity) vuelva a montar el efecto al volver.
- **Docs**:
  - `DESIGN.md`: reescribe «Componentes — reserva de turnos» y la Intro de marca.
  - `SCROLL.md` §3: la regla nueva.
  - `BACKLOG.md`: US-40 con criterios.
  - `docs/plans/US-40-reserva-wireframes.md`, `docs/features/agenda/README.md` y `docs/initial_prompt.md`.

## Tests

- **Unit**:
  - `slotGrid`: libres y ocupados, ventana pública y cruce de medianoche;
  - `resolveSelection`: la virtual elige la online sola y la presencial filtra por tipo;
  - meses del calendario.
- **Componente**:
  - pasos y estados;
  - `StepForm` («Continuar» deshabilitado sin elección);
  - horario tachado no elegible;
  - tarjeta «Tu turno» (Pendiente, lo elegido y «Paso X de N»; virtual sin «Lugar»);
  - modalidad sin online.
- **E2E**:
  - reescribir `tests/pages/booking.ts` y `tests/online-booking.spec.ts` para los dos flujos (presencial 4 pasos,
    virtual 3), con «Continuar» y «Atrás», el final «¡Solicitud enviada!», reprogramar y el tope;
  - la modalidad con teclado en 375px;
  - la intro de la home se repite al volver navegando;
  - capturas temporales en 375px y 1280px sin desborde, como en el cierre anterior.
- Cierre: `npm run verify` y `npm run test:e2e` completos; `impeccable` sólo con arreglos invisibles.

## Riesgos

- Dos píldoras Verde Lima en la pantalla de modalidad (una por mitad): rompe «una sola por pantalla», pero es el
  wireframe del dev. Queda anotado como excepción en DESIGN.md.
- La intro de la home en cada navegación suma unos 3,5 s cada vez que se vuelve a la home: es lo que pidió el dev.
- La virtual usa la primera ubicación online activa: si algún día hay dos, se ofrecen sólo los horarios de esa.

## Al terminar

Lista simple de todo lo que entra (Sprint 4 + US-40) para que el dev apruebe un solo commit en la rama. Push sólo
con su OK.
