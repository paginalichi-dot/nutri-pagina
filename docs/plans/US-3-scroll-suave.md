# US-3 · Scroll suave y secciones que aparecen al bajar

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-3--scroll-suave-y-secciones-que-aparecen-al-bajar)
- **Nivel de tests**: 2 · Lógica acotada (sólo CSS)
- **Estado del plan**: Aprobado (2026-11-06, el dev delegó el Sprint 1 completo: "seguí de corrido")

## Objetivo

Que bajar por la home sea agradable: los saltos internos se desplazan con suavidad y cada sección, salvo el hero,
aparece con un fundido y un desplazamiento corto al entrar en pantalla.

## Descubrimiento

- **Sin librerías y sin JavaScript** (decisión del dev): `scroll-behavior: smooth` y animaciones atadas al scroll
  (`animation-timeline: view()`), detrás de `@supports`. El contenido arranca visible: si el navegador no las
  soporta (hoy, Firefox) o no hay JavaScript, se ve directo.
- **Duración**: una animación atada al scroll no dura milisegundos, avanza con el scroll. El CA-2 se ajustó a eso:
  termina cuando la sección entró 240px en pantalla. Así no hay que esperar a que una animación termine para leer.
- **Movimiento reducido**: todo vive dentro de `@media (prefers-reduced-motion: no-preference)`; con "reducir
  movimiento", ni scroll animado ni aparición.
- **Qué se anima**: el contenido marcado con `data-reveal` (hoy, el de "Sobre mí"). La banda Hueso queda quieta.
  Sólo `opacity` y `transform`: no mueve el layout.

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| ui | `src/app/motion.css`, `src/app/globals.css` | Scroll suave, `@keyframes reveal` y la regla de `[data-reveal]`. |
| ui | `src/components/home/about.tsx` | El contenido de "Sobre mí" lleva `data-reveal`. |
| docs | `DESIGN.md` | Cómo se usa `data-reveal` en secciones nuevas. |

## Errores

No aplica.

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit (`motion.test.ts`) | La animación sólo toca `opacity` y `transform`, mueve como mucho 24px y todo está dentro de `prefers-reduced-motion: no-preference` y `@supports`. |
| E2E (`motion.spec.ts`) | Sin preferencia: scroll suave y "Sobre mí" con la animación atada al scroll; con "reducir movimiento": nada; sin JavaScript: al bajar, el texto de "Sobre mí" termina con opacidad 1. |

## Riesgos

- Firefox todavía no soporta `animation-timeline`: ahí no hay aparición, sólo el contenido quieto. Es el resultado
  esperado del `@supports`.
