# US-8 · Scroll con profundidad entre secciones

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-8--scroll-con-profundidad-entre-secciones)
- **Nivel de tests**: 2 · Lógica acotada (sólo presentación; sin datos)
- **Estado del plan**: Aprobado (2026-11-07, plan "Intro de marca + scroll con profundidad" aprobado por el dev)

## Pedido

Que el scroll deje de ser un desplazamiento plano: la sección actual se aleja hacia el fondo, se achica y pierde
protagonismo, mientras la siguiente emerge desde abajo, como capas en el espacio. Atado al progreso real del scroll,
sin saltos ni efectos exagerados, performante, responsive y respetando "reducir movimiento".

## Decisiones

- **`pin` de ScrollTrigger en vez de `position: sticky`.** El hero en mobile y "Sobre mí" son más altos que la
  pantalla. Con `sticky; top: 0`, su parte de abajo quedaría tapada sin verse nunca. `pin` con
  `start: 'bottom bottom'` fija la sección recién cuando se ve entera, y `pinSpacing: false` deja que la siguiente
  suba por encima.
- **Se anima la tarjeta, no el elemento fijado** (regla de GSAP). En el hero es el marco Verde Bosque: escalar la
  sección entera, con su fondo Papel, dejaba una línea en el borde por el antialiasing.
- **Valores:** escala a 0.9 y opacidad a 0.5, con `scrub: 0.6`. La foto ya no baja con el scroll (sólo crece desde
  abajo): en mobile dejaba ver una franja sin el fundido.
- **La siguiente va encima** (`relative z-10`). Su borde curvo deja ver la capa de atrás: ahí está la profundidad.
- **Alcance:** hoy hay dos secciones, así que el efecto va de hero a "Sobre mí". `DESIGN.md` explica cómo sumar cada
  sección nueva.
- **Mobile:** scroll nativo, con `ScrollTrigger.config({ ignoreMobileResize: true })` para que la barra de
  direcciones no recalcule los pins.

## Archivos

`src/components/motion/{depth,gsap,hero-motion}.ts(x)`, `src/components/home/about.tsx`, `tests/motion.spec.ts`,
`DESIGN.md`.

## Tests

| Tipo | Qué prueba |
|---|---|
| E2E (`motion.spec.ts`) | Al bajar 60% de la pantalla, el marco del hero tiene escala y opacidad menores a 1; al llegar a "Sobre mí", el centro de la pantalla es "Sobre mí". Con "reducir movimiento" no hay pin ni escala. El CLS sigue por debajo de 0.1. |
