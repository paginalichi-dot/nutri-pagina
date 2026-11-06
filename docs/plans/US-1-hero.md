# US-1 · Hero de la home con el nombre y la frase de Lisandro

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-1--hero-de-la-home-con-el-nombre-y-la-frase-de-lisandro)
- **Nivel de tests**: 2 · Lógica acotada (componentes nuevos, sin datos)
- **Estado del plan**: Aprobado (2026-11-06, el dev delegó el Sprint 1 completo: "seguí de corrido")

## Objetivo

Al entrar a la home se ve a Lisandro recortado sobre Verde Bosque, delante de su nombre en gigante, con la frase del
cliente partida en dos esquinas, y debajo la línea "Lisandro López · Licenciado en Nutrición".

## Descubrimiento

- **Actor**: cualquier visitante. Sin datos, sin acciones, sin errores.
- **Contenido**: la frase es textual del pedido (`docs/requerimientos/specs.md`), con "hábito" con tilde. Los
  cortes de línea son los del pedido. Las palabras "alimentación" y "la base de tu salud" van en Verde Lima 700
  (la firma tipográfica de `DESIGN.md`; Verde Lima sobre Verde Bosque es 7.9:1).
- **Matrícula**: se omite por ahora (decisión del dev, 2026-11-06). La línea queda sin "MN".
- **Foto**: `public/foto-cabecera.png` (1086×1448, sin fondo), con `next/image` y `preload` (Next 16 reemplazó
  `priority`).
- **Disposición** (decisión del dev): nombre en gigante detrás de la foto, como `h1`; frase más chica en las
  esquinas.
  - Desktop: la primera parte arriba a la izquierda y la segunda abajo a la derecha, por encima de todo (`z-20`).
    El nombre va en una línea, justo arriba de la cabeza: la foto tapa sólo la parte de abajo de las letras.
  - 375px: todo en columna, en orden: primera parte, nombre en dos líneas, foto (con Fundido Bosque abajo), segunda
    parte. Nada se superpone a la frase.
- **Garabatos**: una chispa y un rulo en Verde Lima y blanco, en SVG con `aria-hidden`, sin animación (desktop).
- **Fuera de alcance**: la píldora del hero y el selector de sucursal (US-4 y la US de sucursales).

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| ui | `src/components/home/hero.tsx`, `hero-scribbles.tsx` | Hero enmarcado, nombre, foto, frase y garabatos. |
| ui | `src/components/arrow-disc.tsx` | El disco de flecha sale de `access-denied.tsx` para reusarlo (US-4). |
| ui | `src/app/page.tsx`, `src/app/layout.tsx` | La home usa el hero; `<title>` «Lisandro López · Nutrición». |
| docs | `DESIGN.md` | "Hero enmarcado" con la frase en las esquinas y sin píldora ni selector. |

## Errores

No aplica.

## Tests

| Tipo | Qué prueba |
|---|---|
| Componente (`hero.test.tsx`) | `h1` "Lisandro López"; las dos partes de la frase, textuales y en orden; `alt` de la foto; garabatos con `aria-hidden`; línea de presentación. |
| E2E (`home.spec.ts`, desktop y 375px) | La home carga con su `<title>`, el `h1`, la foto cargada y las dos partes de la frase visibles y sin nada encima (el elemento en el centro de cada parte es la propia frase). |

## Riesgos

- En pantallas muy bajas el nombre puede quedar cerca de la primera parte de la frase: la frase va por encima
  (`z-20`), así que nunca queda tapada.
