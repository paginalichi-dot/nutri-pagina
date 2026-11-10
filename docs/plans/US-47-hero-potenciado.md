# US-47 · Hero potenciado: los trazos a mano del wireframe

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-47--hero-potenciado-los-trazos-a-mano-del-wireframe)
- **Nivel de tests**: 1 · Texto o estilo (sólo SVG decorativos; sin lógica)
- **Estado del plan**: Aprobado (2026-11-10, pedido explícito del dev en el chat)

## Objetivo

Los trazos Verde Lima del hero quedan como `docs/wireframes/hero-potenciado.png`, salvo las tres líneas sobre la «L»
de LISANDRO y la estrella de cuatro puntas (pedido del dev).

## Descubrimiento

- Sin reglas de negocio ni datos. Se mantienen la tipografía, la foto, la frase, el ícono de cuenta (ya trae sus
  chispas) y la flecha para bajar, que el wireframe no muestra pero no se pidió sacar.
- Mismo trazo que hoy: 2.5px, `currentColor` Verde Lima, sin relleno, `aria-hidden`, `vector-effect:
  non-scaling-stroke`. La intro los revela igual (`[data-hero-strokes]` con `clip-path`).

## Cambios

| Capa | Archivos | Cambio |
|---|---|---|
| ui | `src/components/home/hero-strokes.tsx` | `HeroBodyStrokes` (sobre la foto, viewBox 750×1000 del retrato): dos curvas a la izquierda, la curva larga de la derecha, la ramita de tres hojas y los trazos de abajo junto al botón. `OpeningStrokes`: dos chispas arriba a la izquierda y el subrayado (más largo en desktop). `ClosingStrokes`: un subrayado a la derecha en lugar del corchete. |
| tests | `hero.test.tsx` | La cantidad de SVG de trazos y que no queda el corchete. |
| docs | `DESIGN.md` | «Líneas a mano» del hero. |

## Riesgos

- Las coordenadas salen del wireframe: si en una pantalla la ramita o las curvas tocan la cara, se ajustan en la
  revisión del dev.
