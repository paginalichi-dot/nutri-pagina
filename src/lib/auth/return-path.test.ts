import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { loginPathFor, safeReturnPath } from './return-path';

describe('safeReturnPath', () => {
  it.each(['/reservar', '/mi-espacio/turnos/7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10', '/reservar?ubicacion=x&dia=2026-11-10'])('acepta la ruta interna %s', (path) => {
    expect(safeReturnPath(path)).toBe(path);
  });

  it.each(['', 'reservar', '//evil.test', '/\\evil.test', '/\t/evil.test', 'https://evil.test', 'javascript:alert(1)', '/ruta con espacio', null, undefined, 42])(
    'rechaza %o',
    (value) => {
      expect(safeReturnPath(value)).toBeNull();
    }
  );

  it('nunca devuelve algo que el navegador lea como otro sitio', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const path = safeReturnPath(value);
        if (path === null) return;
        expect(new URL(path, 'https://sitio.test').origin).toBe('https://sitio.test');
      })
    );
  });
});

describe('loginPathFor', () => {
  it('manda al login con la ruta para volver', () => {
    expect(loginPathFor('/reservar', '?dia=2026-11-10')).toBe('/login?volver=%2Freservar%3Fdia%3D2026-11-10');
  });
});
