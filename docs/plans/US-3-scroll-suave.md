# US-3 · Scroll suave y secciones que aparecen al bajar (rehecha)

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-3--scroll-suave-y-secciones-que-aparecen-al-bajar)
- **Nivel de tests**: 2 · Lógica acotada (sólo presentación; sin datos)
- **Estado del plan**: Aprobado (2026-11-06, plan "Home premium" aprobado por el dev)

## Por qué se rehízo

La primera versión (un fundido de 24px en CSS por sección) fue rechazada: "no tiene nada de premium". Se rehace con
Lenis + GSAP y la dirección "Hilo que atraviesa", elegida por el dev, con su pedido de entrada: cada parte del hero
aparece desde su lado (la frase izquierda de derecha a izquierda, la derecha de izquierda a derecha, el nombre desde
arriba y la foto desde el fondo).

## Decisiones

- Lenis sólo en la home y sin "reducir movimiento"; en touch, scroll nativo.
- Un gate en `<head>` oculta `[data-intro]` hasta que la intro arranca, con un tope de 2.5 s: nunca queda contenido
  oculto si GSAP falla.
- La foto y el nombre tienen intro y escena de scroll sobre elementos distintos (wrapper vs. `img`, letras vs. `h1`)
  para que no se pisen.
- Los componentes de movimiento quedan fuera de la cobertura unitaria (sólo corren en un navegador real) y los
  cubre `tests/motion.spec.ts`. Los demás E2E corren con `reducedMotion: 'reduce'` para ser deterministas.

## Archivos

`src/components/motion/{gsap,motion-gate,smooth-scroll,hero-motion,about-motion}.ts(x)`, `src/app/{layout,page}.tsx`,
`src/app/motion.css`, `vitest.config.mts`, `playwright.config.ts`, `DESIGN.md` (Movimiento).

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit | El gate sólo oculta con movimiento permitido y se libera solo; `motion.css` sólo oculta `[data-intro]` bajo `.motion-pending`. |
| E2E (`motion.spec.ts`) | Cada parte entra desde su lado y termina en su lugar en menos de 1.8 s; Lenis activo y la foto crece al scrollear; el trazo de "Sobre mí" se anima; con "reducir movimiento" todo quieto; sin JS todo visible; CLS < 0.1. |
