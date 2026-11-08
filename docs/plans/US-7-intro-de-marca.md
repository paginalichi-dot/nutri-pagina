# US-7 · Intro de marca con máscara de revelado

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-7--intro-de-marca-con-máscara-de-revelado)
- **Nivel de tests**: 2 · Lógica acotada (sólo presentación; sin datos)
- **Estado del plan**: Aprobado (2026-11-07, plan "Intro de marca + scroll con profundidad" aprobado por el dev)

## Pedido

Al entrar o recargar la home, una caja chica al centro muestra «Lic. Lisandro López». El nombre se va y la caja se
expande hasta ocupar la pantalla, como máscara que deja ver la página. Mientras tanto, el hero entra: «La
alimentación…» desde la izquierda, «Y aprender…» desde la derecha, el nombre desde arriba y la foto desde el centro.
Cinematográfica y minimalista, sin spinner, sin repetirse en la navegación interna y respetando "reducir movimiento".

## Decisiones

- **La caja se convierte en el hero.** Fondo Papel y caja Verde Bosque. La máscara (`clip-path: inset()` sobre
  `<main>`) termina en el rectángulo y el radio del marco del hero, que es Verde Bosque con borde Papel: no hay corte
  ni capa que desaparezca.
- **Primer pintado sin JS.** El script del `<head>` marca `motion-pending` sólo en `/`, sin ancla y con
  `no-preference`. El CSS ya muestra la caja, el nombre que sube (`@keyframes`) y la página bloqueada. El JS toma el
  control al montar con `data-intro-state='playing'`.
- **Coordinación con la carga.** La salida espera a que pase el mínimo de marca (1.6 s desde que empezó la navegación)
  y a que estén la fuente y la foto (`document.fonts.ready`, `img.decode()`), con un tope de 2.5 s.
- **Sin repetición.** Sólo corre si al montar está el gate (carga real del documento) o el estado `playing` (doble
  montaje de StrictMode en dev). Al volver desde otra página con un link no hay gate, así que no hay intro.
- **Siempre arriba.** `history.scrollRestoration = 'manual'` mientras haya gate, y `scrollTo(0, 0)` al tomar el
  control.
- **Lenis espera.** Se monta recién con `data-intro-state='done'`. Hasta entonces la página tiene `overflow: hidden`
  y `scrollbar-gutter: stable`, para que la barra no corra el layout al liberarse.
- **Failsafe.** Si el JS no llega en 2.5 s, el gate se libera y la home se ve sin intro. Si llega después, no la
  arranca: nunca tapa contenido ya visible.

## Archivos

`src/components/motion/{motion-gate,intro-preloader,intro-timeline,hero-motion,smooth-scroll}.ts(x)`,
`src/app/{page.tsx,motion.css}`, `tests/{intro,motion}.spec.ts`, `tests/support/motion.ts`, `DESIGN.md`.

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit | El gate actúa sólo en `/`, sin ancla y con movimiento permitido, pone `scrollRestoration` y se libera solo; `motion.css` bloquea el scroll, recorta `main` y muestra el preloader sólo mientras corre la intro. |
| E2E (`intro.spec.ts`) | La caja muestra «Lic. Lisandro López» y `main` está recortado; después el preloader se oculta y el recorte se va. Cada parte del hero entra desde su lado y termina en su lugar. Al volver desde `/reservar` no hay intro. Con "reducir movimiento" o sin JS, no hay preloader ni máscara. |
