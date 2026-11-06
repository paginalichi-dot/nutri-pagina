# T-2 · Tokens de `DESIGN.md` en Tailwind y shadcn/ui

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#t-2--tokens-de-designmd-en-tailwind-y-shadcnui)
- **Nivel de tests**: 2 · Lógica acotada (suma un test de contraste y una regla de lint)
- **Estado del plan**: Aprobado (2026-11-06)

## Objetivo

Que la paleta, la tipografía (Manrope), los radios y las sombras de `DESIGN.md` existan como tokens, para que
ningún componente use colores sueltos. Para el paciente todavía no cambia nada visible, salvo la fuente y el color
del texto de la home placeholder.

## Descubrimiento

- **Actores, datos, errores, concurrencia, fechas, datos personales**: no aplica. Es sólo estilo.
- **Tema**: sólo claro (`DESIGN.md`). Se borra el bloque `prefers-color-scheme: dark` que dejó `create-next-app`.
- **Fuente**: Manrope 400, 500, 600 y 700 con `next/font/google`, expuesta como `--font-manrope`.
- **shadcn/ui**: se inicializa como pide el CA-1 (`components.json` + `src/lib/utils.ts` con `cn`). Su `init`
  reescribe `globals.css` con sus tokens por defecto; se reemplazan por los de `DESIGN.md`. No se agrega ningún
  componente todavía: cada US suma los que use.
- **"Cero hex hardcodeados"**: `AGENTS.md` dice que lo hace cumplir el lint, pero hoy ninguna regla lo controla. Se
  agrega una regla de ESLint que rechaza literales con hex (`#a3e635`, `bg-[#fff]`) en `src/**/*.{ts,tsx}`. Los hex
  sólo viven en el archivo de tokens.
- **Tope de 100 líneas en `.css`**: los tokens no entran junto con el resto de `globals.css`, así que van a un
  archivo propio que `globals.css` importa.

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| domain · schema · repository · service · actions | — | No aplica. |
| ui (`DESIGN.md`) | `src/app/tokens.css` (nuevo) | `:root` con los tokens de color de `DESIGN.md` (los de shadcn más `--price`, `--scribble`, `--footer-text`, `--confirmed` y el Fundido Bosque) y `@theme inline` que los expone a Tailwind: colores, `--font-sans`, radios (`pill`, `card` 30px, `benefit` 29px, `input` 25px, `hero` 88px, `hero-mobile` 40px, `testimonial` 8px, `panel` 16px) y sombras (`halo`, `glow`, `toggle`, `modal`). |
| ui | `src/app/globals.css` | Importa Tailwind, `tokens.css` y lo que agregue shadcn; `body` con fondo Papel, texto Verde Bosque y Manrope. Sin modo oscuro. |
| ui | `src/app/layout.tsx` | Carga Manrope con `next/font/google` y aplica su variable en `<html>`. |
| ui | `components.json`, `src/lib/utils.ts` | Los genera `npx shadcn@latest init`. Las dependencias que sume (`clsx`, `tailwind-merge`, etc.) quedan en `package.json`. |
| lint | `eslint/hard-rules.mjs` | Regla que prohíbe hex en literales y template strings de `src/**/*.{ts,tsx}`. |
| docs | `AGENTS.md`, `docs/architecture.md` | Dónde viven los tokens y qué regla controla los hex. |

## Errores

No aplica: no hay acciones.

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit (`src/app/tokens.test.ts`) | Lee `tokens.css`, calcula el contraste WCAG y verifica AA (≥ 4.5:1) en cada par de texto de `DESIGN.md`: Verde Bosque sobre Papel, Hueso, Gris Nube y Verde Lima; Verde Lima sobre Verde Bosque; Pimentón sobre Papel, Hueso y Gris Nube; Gris Piedra sobre Papel y Hueso; Niebla sobre Verde Bosque. El anillo de foco (`--ring`) contra Papel, ≥ 3:1. |
| Unit (`src/test/contrast.ts`) | El cálculo de contraste da 21:1 para negro sobre blanco y 1:1 para un color sobre sí mismo. |
| Lint | Un archivo de prueba con `#fff` en un `className` hace fallar ESLint, y sin el hex pasa (se prueba a mano una vez, no queda en el repo). |
| E2E | `tests/home.spec.ts` sigue en verde (lo corre el dev). |

## Riesgos

- `shadcn init` pisa `globals.css` y puede sumar dependencias de más: se revisa el diff de `package.json` y se
  dejan sólo las que use `cn` y el tema.
- La regla de hex puede dar falsos positivos (un `#` de ancla como `#sobre-mi`): el patrón exige 3, 4, 6 u 8
  dígitos hexadecimales y nada más en el token, y el test manual cubre ambos casos.
