# US-2 · Sección "Sobre mí"

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-2--sección-sobre-mí)
- **Nivel de tests**: 2 · Lógica acotada (componente nuevo, sin datos)
- **Estado del plan**: Aprobado (2026-11-06, el dev delegó el Sprint 1 completo: "seguí de corrido")

## Objetivo

Debajo del hero, una banda Hueso con el texto del cliente sobre quién es Lisandro y cómo trabaja.

## Descubrimiento

- **Contenido**: los cinco párrafos del pedido, textuales, con "López" con tilde. El primero ("Soy Lisandro López…")
  va en tamaño lead; el resto, en texto de cuerpo.
- **Título**: «Sobre **mí**», la propuesta del backlog, con la firma de `DESIGN.md` (500 y la palabra clave en 700
  con subrayado Verde Lima).
- **Foto**: placeholder visible `[Completar: foto Sobre mí]` (decisión del dev, 2026-11-06), en una tarjeta Gris Nube
  4:5 con radio 30px. Cuando llegue la foto, se reemplaza por `next/image`.
- **Lectura**: el texto tiene un ancho máximo para que ninguna línea pase de 75 caracteres; en 375px no hay scroll
  horizontal.
- **Ancla**: la sección lleva `id="sobre-mi"` para el futuro link del nav.

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| ui | `src/components/home/about.tsx` | Banda Hueso con borde curvo arriba, foto (placeholder) y texto. |
| ui | `src/app/page.tsx` | La home suma la sección. |

## Errores

No aplica.

## Tests

| Tipo | Qué prueba |
|---|---|
| Componente (`about.tsx`) | `h2` "Sobre mí"; los cinco párrafos textuales y en orden; placeholder visible; `id="sobre-mi"`. |
| E2E (`home.spec.ts`) | La sección se ve al bajar; 75 caracteres no entran en una línea del texto; en 375px no hay scroll horizontal. |

## Riesgos

- El placeholder queda a la vista en `develop`: es intencional (`AGENTS.md`, "Contenido") y figura en "Preguntas
  abiertas".
