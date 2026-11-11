# US-48 · «Sobre mí» con la foto de Lisandro, según el wireframe

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-48--sobre-mí-con-la-foto-de-lisandro-según-el-wireframe)
- **Nivel de tests**: 2 · Lógica acotada (un componente; sin datos ni reglas de negocio)
- **Estado del plan**: Aprobado (2026-11-10)

## Objetivo

«Sobre mí» toma la disposición de `docs/wireframes/seccion-sobre-mi.png` con la foto real
(`public/foto-sobre-mi.jpg`). Primero se hizo a sangre en toda la mitad izquierda; el dev la vio «muy invasiva» y
quedó en el marco en arco del wireframe, con el contorno Verde Lima (2026-11-10).

## Descubrimiento (respuestas del dev, 2026-11-10)

- **Texto:** el del cliente, sin cambios. El wireframe trae otros párrafos («Me recibí…», «Creo en una nutrición
  realista…»): no se usan. «Soy Lisandro López, Licenciado en Nutrición por la Universidad Favaloro.» pasa a ser el
  título grande y los cuatro párrafos van en dos columnas debajo.
- **Foto:** primero, rectángulo a sangre en la mitad izquierda. En la revisión el dev la volvió al marco en arco del
  wireframe (5/12), con el contorno Verde Lima detrás y el disco en la esquina.
- **Celular:** la foto sigue oculta debajo de 768px (como hoy).
- **Extras del wireframe que van:** el disco Verde Lima «Lic. en Nutrición» sobre la foto y la fila de tres ítems
  (Universidad Favaloro · Atención personalizada · Seguimiento continuo). **No van:** la píldora «Reservá tu turno»
  (la única píldora Verde Lima de la home sigue siendo el botón flotante).
- Sin datos personales, errores, fechas ni concurrencia.

## Decisiones de diseño (dentro de `DESIGN.md`)

- **Etiqueta «SOBRE MÍ»:** en el wireframe va en Verde Lima sobre Hueso, que `DESIGN.md` prohíbe (1.4:1). Va en
  Verde Bosque, 13px/700, mayúsculas y +1px de tracking (como las etiquetas de la reserva). Sigue siendo el `h2`.
- **Título:** el párrafo display de hoy (500, con «Licenciado en Nutrición» y «Universidad Favaloro» en 700). El
  subrayado Verde Lima a mano pasa de «mí» a «Universidad Favaloro», como en el wireframe.
- **Flecha Zanahoria** que bajaba hacia la foto: sale (el wireframe no la tiene y la foto ya está al lado).
- **Disco «Lic. en Nutrición»:** Verde Lima, 112px, texto Verde Bosque 15px/600 centrado, abajo a la derecha de la
  foto y montado sobre el borde entre foto y texto. `aria-hidden` no: es texto real (credencial).
- **Fila de tres ítems:** disco Verde Lima de 48px con ícono Lucide Verde Bosque (`GraduationCap`, `UserRound`,
  `CalendarCheck`) y el texto 15px/600; desde 768px en fila con separadores verticales Línea Salvia, en el celular
  apilados. Es una lista (`ul`).
- **Layout desktop:** la sección pasa a dos mitades (`md:grid-cols-2`, sin padding lateral en la mitad de la foto);
  el texto, a la derecha, centrado en alto, con padding 40–64px. La foto llena la mitad con `fill` + `sizes='50vw'`
  (`next/image` la optimiza; el JPG pesa 2 MB). Las líneas siguen por debajo de 75 caracteres.
- **Movimiento:** igual que hoy. La foto conserva `data-about-frame`, así que se revela de abajo hacia arriba; el
  título, la entrada y el subrayado no cambian. La pausa y la profundidad no cambian.
- `short` (notebooks bajas): se mantiene; la foto no suma alto porque llena la mitad.

## Cambios

| Capa | Archivos | Cambio |
|---|---|---|
| ui | `src/components/home/about.tsx` | Dos mitades, etiqueta `h2`, título con el subrayado en «Universidad Favaloro», sin `ArchFrame` ni `HandArrow`. |
| ui | `src/components/home/about-photo.tsx` (nuevo) | La foto a sangre con su `alt` y el disco «Lic. en Nutrición». |
| ui | `src/components/home/about-highlights.tsx` (nuevo) | La fila de tres ítems. |
| ui | `src/components/home/about-strokes.tsx` | Sale `HandArrow`. |
| tests | `about.test.tsx` | Etiqueta `h2`, los 5 párrafos, la foto con `alt` y oculta en mobile, el disco, los tres ítems. |
| tests | `tests/home.spec.ts` | Sin cambios esperados (h2 «Sobre mí», 75 caracteres, 1280×600); se corren. |
| docs | `DESIGN.md`, `BACKLOG.md` | «Sobre mí» vigente; US-2 cierra la pregunta de la foto. |

## Tests

| Tipo | Qué prueba |
|---|---|
| Componente | `h2` «Sobre mí»; 5 párrafos textuales; imagen con `alt` dentro de un contenedor `hidden md:block`; «Lic. en Nutrición»; los tres ítems; trazos `aria-hidden`. |
| E2E | `home.spec.ts`, `motion.spec.ts`, `depth.spec.ts` en mobile y desktop (sin cambios). |

## Riesgos

- En pantallas anchas y bajas la foto recorta mucho alto: `object-position` cerca de la cara (≈ 60% 30%); se ajusta en
  la revisión del dev.
- En 1280×600 «Sobre mí» debe seguir entrando en la pantalla (E2E): la fila de ítems suma alto; con `short` se achica.
