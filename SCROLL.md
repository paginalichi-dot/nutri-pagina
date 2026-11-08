# Guía de diseño y motion

> **Instrucción para cualquier asistente o desarrollador:** este documento es de cumplimiento obligatorio.
> Antes de crear o modificar cualquier componente, sección, animación o estilo, leé estas reglas y respetalas.
> Si un pedido entra en conflicto con esta guía, señalá el conflicto antes de implementarlo.

---

## 1. Principios generales

- **Estética:** cinematográfica, minimalista y profesional. Ningún efecto debe sentirse exagerado ni decorativo sin propósito.
- **Fluidez:** nada de saltos, cortes bruscos ni parpadeos. Todo cambio visual tiene una transición.
- **Intención:** cada animación comunica algo (jerarquía, continuidad, foco). Si no aporta, se elimina.
- **Performance primero:** animar solo `transform` y `opacity`. Evitar animar `width`, `height`, `top`, `left`, `margin` o `filter` en elementos grandes.
- **Accesibilidad y mobile:** respetar siempre `prefers-reduced-motion` y garantizar una experiencia completa en dispositivos móviles.

---

## 2. Tokens de motion

Usar siempre estas variables (o sus equivalentes en el sistema del proyecto). No inventar curvas ni duraciones nuevas sin justificación.

```css
:root {
  /* Curvas de aceleración naturales */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* entradas, aparición de elementos */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* cambios de estado o de escena */
  --ease-in:     cubic-bezier(0.55, 0, 1, 0.45);   /* salidas */

  /* Duraciones */
  --dur-fast:   200ms;  /* hovers, micro-interacciones */
  --dur-base:   500ms;  /* entradas de elementos */
  --dur-slow:   900ms;  /* transiciones de escena */
  --dur-intro: 1600ms;  /* animación de entrada (máximo) */
}
```

- No usar `linear` ni `ease` por defecto en animaciones visibles, salvo las vinculadas al scroll (ahí el ritmo lo marca el usuario).
- Al escalonar elementos (stagger), separarlos 60–120 ms como máximo.

---

## 3. Animaciones de entrada y carga

- **No usar** pantallas de carga convencionales, spinners ni barras de progreso como experiencia principal.
- Preferir una revelación cinematográfica del contenido real: fades, leves desplazamientos o escalas, máscaras que se abren, textos que aparecen por líneas.
- **Coordinar con la carga:** la animación arranca solo cuando el contenido está listo (fuentes cargadas con `document.fonts.ready`, imágenes o video principales decodificados). Nunca mostrar una pantalla vacía ni elementos a medio cargar.
  - Agregar un timeout de seguridad (~2,5 s): si algo tarda, el contenido se muestra igual.
- **No repetir innecesariamente:** las animaciones de entrada se ejecutan una vez por sesión y no se reproducen en la navegación interna (cambio de ruta, volver atrás).
  - Guardar ese estado en el estado global de la app o en `sessionStorage` (envuelto en `try/catch`).

---

## 4. Efectos vinculados al scroll

### Reglas generales

- Todo efecto de scroll debe estar **vinculado al progreso real del scroll** (scrubbing). Nada se anima por su cuenta sin interacción del usuario.
- **Nunca** secuestrar ni bloquear el scroll nativo (no scroll-jacking).
- Preferir **CSS Scroll-Driven Animations** (`animation-timeline: view()` / `scroll()`) dentro de `@supports (animation-timeline: view())`.
- **Alternativa en JS** para navegadores sin soporte: `IntersectionObserver` + `requestAnimationFrame`, con listeners de scroll `{ passive: true }`.
- `will-change` solo en los elementos que se están animando, nunca en todo el documento.

### Patrón de referencia: transición de profundidad entre secciones

Cuando se busque un scroll inmersivo, las secciones se comportan como capas en el espacio:

- La **sección actual se aleja hacia el fondo**: reduce progresivamente su escala y su protagonismo.
- La **siguiente emerge desde abajo** y entra en escena por encima de la anterior.
- Sensación de profundidad sutil y elegante, sin efectos exagerados.

| Sección saliente | Inicio | Fin |
|---|---|---|
| `scale` | `1` | `0.88 – 0.92` |
| `opacity` | `1` | `0.35 – 0.5` |
| `border-radius` (opcional) | `0` | `16 – 24px` |

- Estructura: contenedores con `position: sticky; top: 0; height: 100svh;` apilados con `z-index` creciente.
- La sección entrante pasa de `translateY(100%)` (o el flujo natural) a `0`, con una sombra superior suave que sugiere que está "por encima".

---

## 5. Mobile y responsive

- Diseñar y probar primero en mobile, también en iOS Safari y Chrome Android.
- Usar `svh` o `dvh` en lugar de `vh` para evitar saltos por la barra del navegador.
- Reducir la intensidad de los efectos en pantallas chicas (menos escala, menos desplazamiento).
- Si un contenido es más alto que la pantalla, no fijarlo con `sticky`: dejarlo scrollear normal.
- Áreas táctiles de al menos 44 × 44 px; no depender de `hover` para mostrar información.

---

## 6. `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Con movimiento reducido: el contenido se ve de inmediato, sin intro animada, sin escala ni parallax. Como mucho, cambios de opacidad.
- La experiencia debe quedar completa y usable, no "rota" sin las animaciones.

---

## 7. Checklist antes de dar por terminado un cambio

- [ ] ¿Se respetan los tokens de motion (curvas y duraciones)?
- [ ] ¿Solo se animan `transform` y `opacity`?
- [ ] ¿Las animaciones de entrada esperan al contenido y no se repiten en navegación interna?
- [ ] ¿Los efectos de scroll están vinculados al progreso real, sin saltos ni bloqueos?
- [ ] ¿Funciona y se ve bien en mobile?
- [ ] ¿Se respeta `prefers-reduced-motion`?
- [ ] ¿Sin errores en consola ni caídas de FPS perceptibles?