import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/test/contrast';

describe('contrastRatio', () => {
  it('da 21:1 entre negro y blanco', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
  });

  it('da 1:1 para un color sobre sí mismo', () => {
    expect(contrastRatio('#1f3d2b', '#1f3d2b')).toBe(1);
  });

  it('no depende del orden de los colores', () => {
    expect(contrastRatio('#ffffff', '#1f3d2b')).toBe(contrastRatio('#1f3d2b', '#ffffff'));
  });

  it('coincide con el valor de DESIGN.md para Verde Bosque sobre Papel (11.9:1)', () => {
    expect(contrastRatio('#1f3d2b', '#ffffff')).toBeCloseTo(11.9, 1);
  });
});
