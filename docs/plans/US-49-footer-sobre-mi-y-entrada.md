# US-49 · Footer, «Sobre mí» corto y entrada al ingresar

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-49--footer-sobre-mí-corto-y-entrada-al-ingresar)
- **Nivel de tests**: 1 · Texto o estilo (más tests de componente de lo que cambia)
- **Estado del plan**: Aprobado (2026-11-16)

## Objetivo

Cuatro cambios chicos pedidos por el dev el 2026-11-16 (captura del footer y de «Sobre mí» en el chat):

1. Un footer al final de la home, debajo de «Dónde atiendo».
2. Al iniciar sesión, el panel y Mi espacio entran como la reserva (suave, desde la izquierda).
3. «Sobre mí» en un solo párrafo.
4. Vuelve el título grande «Sobre **mí**» con el subrayado Verde Lima y la flecha Zanahoria.

## Descubrimiento

- **Footer**: fondo Hueso, centrado: el ícono LLN (`src/app/icon.png`, el mismo de `BrandLogo`), «¿Empezamos?»
  (Manrope 500, 28/38.4px: el dev ya eligió Manrope antes que la serifa de los wireframes), la píldora Verde Lima
  «Reservá tu turno» con disco de flecha hacia `/reservar`, los contactos **con su texto al costado** (WhatsApp,
  Instagram y email, cada uno con su ícono en un disco con borde) y «© {año} Lisandro López · Nutrición», con el año automático (sin
  «kinesiología»: no es kinesiólogo). Contactos de **ejemplo** en una sola constante, para que el dev los reemplace
  (pedido explícito del dev; se anota en «Preguntas abiertas»).
- **Botón flotante**: se oculta (fundido y baja) cuando entra el footer, así hay una sola píldora Verde Lima por
  pantalla. Con CSS Scroll-Driven Animations (`timeline-scope` + `view-timeline`, SCROLL.md §4) dentro de
  `@supports`; donde no hay soporte (Firefox) el flotante se queda y el footer deja espacio abajo para que no lo tape.
  Reemplaza al espaciador `espacio-boton-flotante`.
- **Entrada al ingresar** (decisión del dev: «lo que abre al entrar»): `data-enter` de `src/app/entrance.css`, igual
  que la reserva. Mi espacio: la barra baja desde arriba; el saludo, la columna de turnos y «Mi cuenta» entran desde
  la izquierda, escalonados (80, 160 y 240 ms); se repite en cada llegada. Panel: la barra lateral y el contenido
  entran desde la izquierda (0 y 120 ms), en el layout, así que sólo al llegar al panel (no al pasar de una sección a
  otra). Quietos con «reducir movimiento».
- **«Sobre mí»**: el `h2` vuelve a ser el título «Sobre **mí**» (500 + 700, 28/38.4px) con `HandUnderline` bajo «mí»
  y `HandArrow` (Zanahoria, desde 1024px, como en US-2). El título «Soy Lisandro López…» se queda, sin subrayado. Un
  párrafo, propuesta:
  > Entiendo la nutrición como una herramienta para cuidar tu salud y tu calidad de vida. Te acompaño con una
  > atención cercana y personalizada, un plan adaptado a tu estilo de vida y un seguimiento continuo, para construir
  > juntos hábitos saludables que duren en el tiempo.
- Sin datos, sin errores nuevos, sin fechas ni datos personales.

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| ui (`DESIGN.md`) | `src/components/home/site-footer.tsx` (nuevo) | Footer con ícono, título, píldora, contactos y copyright |
| ui | `src/app/page.tsx` | Footer en lugar del espaciador |
| ui | `src/components/home/floating-booking-button.tsx`, `src/app/motion.css` | Se oculta al ver el footer (scroll-driven, `@supports`) |
| ui | `src/components/home/about.tsx`, `about-strokes.tsx` | Título grande con subrayado y flecha; un párrafo |
| ui | `src/app/mi-espacio/page.tsx`, `src/app/admin/(panel)/layout.tsx` | `data-enter` escalonado |

## Tests

| Tipo | Qué prueba |
|---|---|
| componente | Footer: ícono, «¿Empezamos?», link a `/reservar`, los tres contactos con texto y `href`, sin «kinesiología» |
| componente | «Sobre mí»: `h2` «Sobre mí» con el subrayado, un solo párrafo de cuerpo, trazos `aria-hidden` |
| componente | Mi espacio y el panel llevan `data-enter` con su retardo |
| E2E (existentes) | Home, reserva, login y panel siguen verdes en 375px y desktop |

## Riesgos

- `transform` de la animación sobre un ancestro de algo `fixed`: la barra móvil del panel es `fixed`, así que el
  `data-enter` va en la propia `nav` y en el contenido, nunca en un envoltorio común.
- Navegadores sin scroll-driven animations: el flotante no se oculta; el footer deja aire abajo.
