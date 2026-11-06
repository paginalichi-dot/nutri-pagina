import { describe, expect, it } from 'vitest';
import { cookieJar } from '@/test/cookie-jar';
import { clearSessionCookie, readSessionToken, writeSessionCookie } from './session-cookie';
import { SESSION_COOKIE_OPTIONS } from './session-token';

describe('session-cookie', () => {
  it('sin cookie no hay token', async () => {
    await expect(readSessionToken()).resolves.toBeUndefined();
  });

  it('escribe el token en la cookie "session" con sus opciones de seguridad', async () => {
    await writeSessionCookie('token-firmado');
    await expect(readSessionToken()).resolves.toBe('token-firmado');
    expect(cookieJar.optionsOf('session')).toEqual(SESSION_COOKIE_OPTIONS);
  });

  it('borra la cookie al cerrar la sesión', async () => {
    await writeSessionCookie('token-firmado');
    await clearSessionCookie();
    await expect(readSessionToken()).resolves.toBeUndefined();
  });
});
