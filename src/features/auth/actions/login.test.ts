import fc from 'fast-check';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '@/lib/auth/password';
import { verifySession } from '@/lib/auth/session-token';
import { errorMessage } from '@/lib/errors';
import { cookieJar } from '@/test/cookie-jar';
import { adminRepository } from '../repository/admin.repository';
import { TEST_ADMIN } from '../testing/test-admin';
import { login } from './login';

vi.mock('next/navigation', async () => (await import('../testing/module-mocks')).navigationMock);
vi.mock('../repository/admin.repository', async () => (await import('../testing/module-mocks')).fakeRepositoryModule());

let hash = '';

function form(fields: Record<string, string> = {}): FormData {
  const data = new FormData();
  Object.entries({ email: TEST_ADMIN.email, password: TEST_ADMIN.password, website: '', ...fields }).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe('login (contrato)', () => {
  beforeAll(async () => {
    hash = await hashPassword(TEST_ADMIN.password);
  });

  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    await adminRepository.upsertAdmin({ email: TEST_ADMIN.email, passwordHash: hash });
  });

  it('con email y contraseña correctos deja una sesión válida y lleva a /admin', async () => {
    await expect(login(null, form({ email: '  ADMIN@ejemplo.test ' }))).rejects.toThrow('NEXT_REDIRECT:/admin');
    const token = cookieJar.get('session')?.value ?? '';
    await expect(verifySession(token)).resolves.toMatchObject({ sessionVersion: 1 });
    expect(cookieJar.optionsOf('session')).toMatchObject({ httpOnly: true, secure: true, sameSite: 'lax' });
  });

  it.each([
    ['la contraseña es incorrecta', { password: 'otra-clave' }],
    ['el email no existe', { email: 'nadie@ejemplo.test' }],
  ])('si %s da INVALID_CREDENTIALS y no deja sesión', async (_caso, fields) => {
    await expect(login(null, form(fields))).resolves.toEqual({ success: false, code: 'INVALID_CREDENTIALS', error: 'El email o la contraseña no son correctos.' });
    expect(cookieJar.get('session')).toBeUndefined();
  });

  it.each([
    ['un email inválido', form({ email: 'no-es-email' })],
    ['el honeypot completo', form({ website: 'http://spam.test' })],
    ['un formulario sin campos', new FormData()],
  ])('con %s da VALIDATION', async (_caso, data) => {
    await expect(login(null, data)).resolves.toEqual({ success: false, code: 'VALIDATION', error: 'Revisá los datos ingresados.' });
  });

  it('el quinto intento fallido seguido da RATE_LIMITED y bloquea aunque después la contraseña sea correcta', async () => {
    for (let attempt = 1; attempt < 5; attempt += 1) await login(null, form({ password: 'mala' }));
    await expect(login(null, form({ password: 'mala' }))).resolves.toMatchObject({ code: 'RATE_LIMITED' });
    await expect(login(null, form())).resolves.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('si la base falla da UNEXPECTED y no loguea datos personales', async () => {
    vi.spyOn(adminRepository, 'findCredentialsByEmail').mockRejectedValue(new Error(`falló con ${TEST_ADMIN.email}`));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await expect(login(null, form())).resolves.toMatchObject({ code: 'UNEXPECTED' });
    expect(JSON.stringify(log.mock.calls)).not.toContain(TEST_ADMIN.email);
  });

  it('fuzz: nunca devuelve un error fuera del catálogo ni la contraseña', async () => {
    await fc.assert(
      fc.asyncProperty(fc.record({ email: fc.string(), password: fc.string({ minLength: 6 }), website: fc.string() }), async (fields) => {
        const result = await login(null, form(fields)).catch((error: unknown) => ({ redirected: String(error) }));
        if ('redirected' in result) return;
        expect(result.success).toBe(false);
        if (!result.success && result.code) expect(errorMessage(result.code)).toBe(result.error);
        expect(JSON.stringify(result)).not.toContain(fields.password);
      }),
      { numRuns: 100 }
    );
  });
});
