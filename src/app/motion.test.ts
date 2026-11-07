import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/app/motion.css', 'utf8');

describe('motion.css', () => {
  it('sólo oculta lo marcado con data-intro, y sólo mientras la intro no arrancó', () => {
    const rules = [...css.matchAll(/([^{}]+)\{([^}]*)\}/g)].map((match) => ({ selector: match[1]?.trim(), body: match[2]?.trim() }));
    expect(rules).toEqual([{ selector: '.motion-pending [data-intro]', body: 'opacity: 0;' }]);
  });
});
