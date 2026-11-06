import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('se queda con la última clase cuando dos chocan', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('descarta los valores vacíos', () => {
    expect(cn('font-sans', false, null, undefined, '')).toBe('font-sans');
  });

  it('no confunde los colores de DESIGN.md con tamaños de texto', () => {
    expect(cn('text-lg', 'text-price')).toBe('text-lg text-price');
  });
});
