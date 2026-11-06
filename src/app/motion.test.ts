import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/app/motion.css', 'utf8');
const keyframes = css.slice(css.indexOf('@keyframes reveal'), css.indexOf('@media'));
const properties = [...keyframes.matchAll(/^\s*([a-z-]+):/gm)].map((match) => match[1]);

describe('motion.css', () => {
  it('la aparición sólo anima opacity y transform: no mueve el layout', () => {
    expect(new Set(properties)).toEqual(new Set(['opacity', 'transform']));
  });

  it('el desplazamiento es corto: como mucho 24px', () => {
    const offsets = [...keyframes.matchAll(/translateY\((\d+)px\)/g)].map((match) => Number(match[1]));
    expect(offsets.length).toBeGreaterThan(0);
    expect(Math.max(...offsets)).toBeLessThanOrEqual(24);
  });

  it('el scroll suave y la aparición sólo existen sin "reducir movimiento" y con soporte del navegador', () => {
    const motion = css.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(motion).toBeGreaterThan(-1);
    expect(css.indexOf('scroll-behavior: smooth')).toBeGreaterThan(motion);
    expect(css.indexOf('@supports (animation-timeline: view())')).toBeGreaterThan(motion);
    expect(css.indexOf('[data-reveal]')).toBeGreaterThan(css.indexOf('@supports (animation-timeline: view())'));
  });
});
