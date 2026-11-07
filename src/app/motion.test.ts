import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/app/motion.css', 'utf8').replace(/\s+/g, ' ');
const RUNNING = ":root:is(.motion-pending, [data-intro-state='playing'])";

describe('motion.css', () => {
  it('sólo oculta lo marcado con data-intro, y sólo mientras la intro no arrancó', () => {
    expect(css).toContain('.motion-pending [data-intro] { opacity: 0; }');
  });

  it('mientras corre la intro, la página no scrollea y se ve sólo por la caja del centro', () => {
    expect(css).toContain(`${RUNNING} { overflow: hidden; scrollbar-gutter: stable; }`);
    expect(css).toContain(`${RUNNING} [data-reveal-mask] { clip-path: inset(`);
  });

  it('el preloader sólo existe mientras corre la intro', () => {
    expect(css).toContain('[data-preloader] { display: none; }');
    expect(css).toContain(`${RUNNING} [data-preloader] { display: grid; }`);
  });

  it('fuera de la intro no se reserva lugar para la barra de scroll', () => {
    expect(css.match(/scrollbar-gutter/g)).toHaveLength(1);
  });
});
