import { decodeJwt, SignJWT } from 'jose';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SESSION_COOKIE_OPTIONS, signSession, verifySession } from './session-token';

const SECRET = 'secreto-de-prueba-con-mas-de-32-caracteres';
const SESSION = { subjectId: '7d3f8a3e-2f4b-4c1d-9a7e-1b2c3d4e5f60', sessionVersion: 3, role: 'admin' } as const;
const sign = (claims: object): Promise<string> => new SignJWT({ ...claims }).setProtectedHeader({ alg: 'HS256' }).setSubject(SESSION.subjectId).sign(new TextEncoder().encode(SECRET));

describe('session-token', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', SECRET);
  });

  it('un token firmado se verifica y devuelve la cuenta, su rol y su versión de sesión', async () => {
    await expect(verifySession(await signSession(SESSION))).resolves.toEqual(SESSION);
    const patient = { ...SESSION, role: 'patient' } as const;
    await expect(verifySession(await signSession(patient))).resolves.toEqual(patient);
  });

  it('T-8 CA-2: un token sin rol es del admin (las sesiones de antes siguen andando); un rol desconocido se rechaza', async () => {
    await expect(verifySession(await sign({ sv: 3 }))).resolves.toEqual(SESSION);
    await expect(verifySession(await sign({ sv: 3, r: 'root' }))).resolves.toBeNull();
  });

  it('el token no vence: no lleva exp', async () => {
    const payload = decodeJwt(await signSession(SESSION));
    expect(payload.exp).toBeUndefined();
    expect(payload).toMatchObject({ sub: SESSION.subjectId, sv: 3, r: 'admin' });
  });

  it('rechaza un token adulterado', async () => {
    const token = await signSession(SESSION);
    await expect(verifySession(`${token.slice(0, -2)}xx`)).resolves.toBeNull();
  });

  it('rechaza un token firmado con otra clave', async () => {
    const token = await signSession(SESSION);
    vi.stubEnv('JWT_SECRET', 'otra-clave-distinta-con-mas-de-32-caracteres');
    await expect(verifySession(token)).resolves.toBeNull();
  });

  it('rechaza un token bien firmado pero sin los datos de la sesión', async () => {
    const token = await new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).sign(new TextEncoder().encode(SECRET));
    await expect(verifySession(token)).resolves.toBeNull();
  });

  it('rechaza basura', async () => {
    await expect(verifySession('no-es-un-jwt')).resolves.toBeNull();
  });

  it.each([undefined, 'corta'])('falla en voz alta si JWT_SECRET es %s', async (secret) => {
    vi.stubEnv('JWT_SECRET', secret);
    await expect(signSession(SESSION)).rejects.toThrow('JWT_SECRET falta o tiene menos de 32 caracteres.');
    await expect(verifySession('x')).rejects.toThrow('JWT_SECRET');
  });

  it('la cookie es httpOnly, Secure, SameSite=Lax y dura 400 días', () => {
    expect(SESSION_COOKIE_OPTIONS).toEqual({ httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 34_560_000 });
  });
});
