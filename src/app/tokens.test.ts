import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/test/contrast';

const css = readFileSync('src/app/tokens.css', 'utf8');
const tokens = new Map([...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6});/gi)].map((match) => [match[1], match[2]]));

function token(name: string): string {
  const value = tokens.get(name);
  if (!value) throw new Error(`Falta el token --${name} en tokens.css`);
  return value;
}

const TEXT_PAIRS = [
  ['foreground', 'background'],
  ['foreground', 'muted'],
  ['foreground', 'secondary'],
  ['foreground', 'primary'],
  ['foreground', 'confirmed'],
  ['primary', 'foreground'],
  ['primary-foreground', 'primary'],
  ['secondary-foreground', 'secondary'],
  ['accent-foreground', 'accent'],
  ['card-foreground', 'card'],
  ['popover-foreground', 'popover'],
  ['price', 'background'],
  ['price', 'muted'],
  ['price', 'secondary'],
  ['destructive', 'background'],
  ['muted-foreground', 'background'],
  ['muted-foreground', 'muted'],
  ['footer-text', 'foreground'],
] as const;

describe('tokens de DESIGN.md', () => {
  it.each(TEXT_PAIRS)('--%s sobre --%s cumple AA (≥ 4.5:1)', (text, background) => {
    expect(contrastRatio(token(text), token(background))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(['background', 'muted', 'secondary'])('el anillo de foco se distingue de --%s (≥ 3:1)', (background) => {
    expect(contrastRatio(token('ring'), token(background))).toBeGreaterThanOrEqual(3);
  });

  it('usa los colores de identidad de DESIGN.md', () => {
    expect([token('primary'), token('foreground'), token('muted')]).toEqual(['#a3e635', '#1f3d2b', '#f6f5ef']);
  });
});
