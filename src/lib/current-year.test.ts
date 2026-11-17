import { afterEach, describe, expect, it, vi } from 'vitest';
import { currentYear } from './current-year';

describe('currentYear', () => {
  afterEach(() => vi.useRealTimers());

  it.each([
    { now: '2027-01-01T02:59:00Z', expected: 2026 },
    { now: '2027-01-01T03:00:00Z', expected: 2027 },
  ])('a las $now UTC, en Buenos Aires es $expected', async ({ now, expected }) => {
    vi.useFakeTimers({ now: new Date(now) });
    await expect(currentYear()).resolves.toBe(expected);
  });
});
