import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EMAIL_COLORS } from './email-colors';

const tokens = readFileSync('src/app/tokens.css', 'utf8');

function tokenAsRgb(name: string): string {
  const hex = new RegExp(`--${name}: #([0-9a-f]{6});`).exec(tokens)?.[1] ?? '';
  const [red, green, blue] = [0, 2, 4].map((start) => parseInt(hex.slice(start, start + 2), 16));
  return `rgb(${red}, ${green}, ${blue})`;
}

describe('EMAIL_COLORS', () => {
  it.each(Object.entries(EMAIL_COLORS))('--%s coincide con src/app/tokens.css', (name, value) => {
    expect(value).toBe(tokenAsRgb(name));
  });
});
