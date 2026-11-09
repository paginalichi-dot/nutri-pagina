import { describe, expect, it, vi } from 'vitest';
import { cookieJar } from '@/test/cookie-jar';
import { clearSessionCookie, readSessionToken, startSession, writeSessionCookie } from './session-cookie';
import { SESSION_COOKIE_OPTIONS, verifySession } from './session-token';

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

  it('startSession firma la sesión y la guarda en la cookie', async () => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    const session = { subjectId: '7d3f8a3e-2f4b-4c1d-9a7e-1b2c3d4e5f60', sessionVersion: 3, role: 'admin' } as const;
    await startSession(session);
    await expect(verifySession((await readSessionToken()) ?? '')).resolves.toEqual(session);
  });
});
