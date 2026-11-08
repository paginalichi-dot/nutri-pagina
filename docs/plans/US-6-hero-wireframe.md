# US-6 · Hero y Sobre mí según el wireframe del dev

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-6--hero-y-sobre-mí-según-el-wireframe-del-dev)
- **Nivel de tests**: 2 · Lógica acotada (componentes, sin datos)
- **Estado del plan**: Aprobado (2026-11-06, en el plan "Home premium" que el dev aprobó)
- **Referencia**: [`docs/wireframes/ejemplo-presentacion.png`](../wireframes/ejemplo-presentacion.png)

## Objetivo

Que el hero se vea como el wireframe del dev y que "Sobre mí" deje de ser texto plano, dentro de `DESIGN.md`. El
movimiento es US-3: acá queda el estado final, quieto.

## Descubrimiento (respuestas del dev, 2026-11-06)

- Fuera por ahora: "Ver planes", la cinta de temas y la matrícula. La píldora dice sólo «Licenciado en Nutrición».
- Frase textual del cliente (con «Y»), con corte de línea natural, a media altura izquierda y derecha.
- Nombre en Manrope 800, sin tracking negativo: «LISANDRO» macizo y «LÓPEZ» en contorno Verde Lima.
- Foto más grande que en el wireframe; la cabeza "se atreve a tapar un poco más" el nombre (≈ 40% de la altura de
  las letras centrales).
- Botón flotante con ícono de calendario y disco Verde Bosque con flecha Verde Lima, como el wireframe.
- La píldora arriba del `h1` choca con la regla de impeccable contra las etiquetas sobre títulos: gana el wireframe
  del dev.

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| ui | `src/components/home/hero.tsx` (+ `hero-name.tsx`, `hero-phrase.tsx`) | Píldora, nombre, foto más grande, frase a media altura. Se borra `hero-scribbles.tsx`. |
| ui | `src/components/home/floating-booking-button.tsx` | Ícono, disco oscuro, halo Verde Lima. Vuelve `lucide-react`. |
| ui | `src/components/home/about.tsx` (+ `about-strokes.tsx`) | Título con subrayado a mano, párrafo display, marco en arco, dos columnas. |
| ui | `src/app/globals.css` | Selección de texto, barra de scroll y caret con la paleta (craft floor de impeccable). |
| docs | `DESIGN.md` | Hero, botón y "Sobre mí" vigentes. |

## Tests

| Tipo | Qué prueba |
|---|---|
| Componente | Píldora sin matrícula; `h1` «Lisandro López»; las dos partes de la frase textuales; foto con `alt`; botón con su ícono decorativo; "Sobre mí" con los cinco párrafos y el placeholder. |
| E2E | Hero visible con la frase sin tapar; la foto se superpone a la base del nombre; "Sobre mí" con líneas ≤ 75 caracteres; sin scroll horizontal en 375px. |

## Riesgos

- Texto en contorno: en tamaños chicos se lee peor; en 375px el contorno se engrosa para mantener la lectura.
