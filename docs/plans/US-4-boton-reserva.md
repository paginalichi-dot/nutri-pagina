# US-4 · Botón flotante "Reservá tu turno"

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-4--botón-flotante-reservá-tu-turno)
- **Nivel de tests**: 2 · Lógica acotada (componentes y una página nueva, sin datos)
- **Estado del plan**: Aprobado (2026-11-06, el dev delegó el Sprint 1 completo: "seguí de corrido")

## Objetivo

En la home, una píldora Verde Lima "Reservá tu turno" queda fija abajo al centro durante todo el scroll y lleva a
`/reservar`, que por ahora dice que la reserva online está por llegar.

## Descubrimiento

- **Destino**: `/reservar` con "Próximamente" (decisión del dev). Con el Sprint 2, esa página pasa a ser el flujo de
  reserva y el botón no cambia.
- **Forma**: la "Píldora Verde Lima con flecha" de `DESIGN.md` (64px de alto en mobile, 88px en desktop, disco blanco
  con flecha, halo de píldora). Es la única píldora Verde Lima de la home: reemplaza a la píldora del hero y al botón
  "RESERVAR TURNO" del nav.
- **No tapar contenido**: la home deja abajo un espacio Hueso más alto que el botón, y el botón respeta el área
  segura de iOS (`env(safe-area-inset-bottom)`).
- **Teclado**: es el primer elemento enfocable de la home. El foco suma un halo blanco y un anillo Verde Bosque, así
  se ve tanto sobre Verde Bosque como sobre Hueso.
- **`/reservar`**: título "Reservá tu **turno**", la línea "La reserva online está por llegar." y "Volver al inicio".
  No muestra el botón flotante (sólo lo pinta la home). Es pública: el proxy sólo intercepta `/admin/**`.
- **Reuso**: "Acceso denegado" y "Próximamente" son la misma tarjeta; sale `NoticePage` con título y mensaje.

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| ui | `src/components/home/floating-booking-button.tsx` | El botón flotante. |
| ui | `src/components/notice-page.tsx`, `access-denied.tsx` | Tarjeta de aviso compartida. |
| ui | `src/app/reservar/page.tsx` | "Próximamente". |
| ui | `src/app/page.tsx`, `src/components/home/hero.tsx`, `about.tsx` | El botón en la home y el espacio de abajo. |
| docs | `DESIGN.md` | Componente "Botón flotante de reserva". |

## Errores

No aplica.

## Tests

| Tipo | Qué prueba |
|---|---|
| Componente | El botón lleva a `/reservar` con su texto y el disco decorativo; `NoticePage` muestra título, mensaje y un solo link. |
| Unit (proxy) | `/reservar` pasa sin tocar nada. |
| E2E (desktop y 375px) | El botón se ve abajo al centro al cargar y al final de la página; lo último de la home queda por encima; mide al menos 44px; es el primer foco con Tab; lleva a `/reservar`, que dice "Próximamente" y no tiene el botón. |

## Riesgos

- Un botón fijo puede tapar contenido de secciones futuras: el espacio de abajo vive en la home y se revisa cuando
  se sume el footer.
