import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isCronAuthorized } from './cron-secret';

const SECRET = 'secreto-del-cron-de-prueba';

describe('isCronAuthorized', () => {
  it('T-10 CA-2: sólo pasa el header «Bearer <CRON_SECRET>» exacto', () => {
    expect(isCronAuthorized(`Bearer ${SECRET}`, SECRET)).toBe(true);
    expect(isCronAuthorized(SECRET, SECRET)).toBe(false);
    expect(isCronAuthorized(`Bearer ${SECRET}x`, SECRET)).toBe(false);
    expect(isCronAuthorized(null, SECRET)).toBe(false);
  });

  it('sin secreto configurado nunca pasa, ni con «Bearer » vacío', () => {
    expect(isCronAuthorized('Bearer ', '')).toBe(false);
    expect(isCronAuthorized('Bearer undefined', undefined)).toBe(false);
  });

  it('ningún header inventado pasa', () => {
    fc.assert(
      fc.property(fc.string(), (header) => {
        expect(isCronAuthorized(header, SECRET)).toBe(header === `Bearer ${SECRET}`);
      })
    );
  });
});
