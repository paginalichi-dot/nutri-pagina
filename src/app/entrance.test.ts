import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/app/entrance.css', 'utf8').replace(/\s+/g, ' ');

describe('entrance.css (US-40 CA-1)', () => {
  it('las mitades de la modalidad se despliegan enteras desde afuera: de los costados desde 768px y de arriba y abajo en el celular', () => {
    for (const from of ['translateX(-100%)', 'translateX(100%)', 'translateY(-100%)', 'translateY(100%)']) expect(css).toContain(`transform: ${from};`);
    expect(css).toMatch(/@media \(min-width: 768px\) \{ \[data-enter='unfold-left'\] \{ --enter-name: unfold-from-left; \}/);
  });

  it('las entradas usan los tokens de SCROLL.md y sólo animan transform y opacity', () => {
    expect(css).toContain('--ease-out: cubic-bezier(0.22, 1, 0.36, 1);');
    expect(css).toContain('animation: var(--enter-name) var(--enter-duration, var(--dur-slow)) var(--ease-out) var(--enter-delay, 0ms) both;');
    expect(css).not.toMatch(/[{;] (width|height|top|left|margin|filter):/);
  });

  it('con «reducir movimiento» no hay animación de entrada', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{ \[data-enter\] \{ animation:/);
    expect(css.indexOf('[data-enter] {')).toBeGreaterThan(css.indexOf('@media (prefers-reduced-motion: no-preference)'));
  });
});
