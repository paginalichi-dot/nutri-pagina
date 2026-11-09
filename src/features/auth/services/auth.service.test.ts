import { beforeAll, describe, expect, it, vi } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import type { FakeAdmin } from '../testing/admin-repository.fake';
import { ADMIN_ID, type AuthFixture, EMAIL, minutesAfterNow, setupAuthService } from '../testing/auth-service.fixture';
import { LOCK_MINUTES, MAX_FAILED_ATTEMPTS } from './auth.service';

vi.mock('@/lib/auth/password', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth/password')>();
  return { ...actual, verifyPassword: vi.fn(actual.verifyPassword) };
});

let hash = '';
const setup = (overrides: Partial<FakeAdmin> = {}): AuthFixture => setupAuthService(hash, overrides);

beforeAll(async () => {
  hash = await hashPassword('clave-buena');
});

describe('authService.login', () => {
  it('con la contraseña correcta devuelve el admin y su versión de sesión', async () => {
    const { service } = setup();
    await expect(service.login({ email: EMAIL, password: 'clave-buena' })).resolves.toEqual({ subjectId: ADMIN_ID, sessionVersion: 2, role: 'admin' });
  });

  it('con un email inexistente da INVALID_CREDENTIALS después de comparar contra un hash de relleno', async () => {
    const { service } = setup();
    const verify = vi.mocked(verifyPassword);
    verify.mockClear();
    await expect(service.login({ email: 'otro@ejemplo.test', password: 'clave-buena' })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    expect(verify).toHaveBeenCalledOnce();
    expect(verify.mock.calls[0]?.[1]).toMatch(/^scrypt\$/);
  });

  it('una contraseña mala suma un intento fallido', async () => {
    const { service, admin } = setup();
    await expect(service.login({ email: EMAIL, password: 'mala' })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    expect(admin()).toMatchObject({ failedAttempts: 1, lockedUntil: null, version: 2 });
  });

  it(`el intento fallido número ${MAX_FAILED_ATTEMPTS} bloquea el login ${LOCK_MINUTES} minutos`, async () => {
    const { service, admin } = setup({ failedAttempts: MAX_FAILED_ATTEMPTS - 1 });
    await expect(service.login({ email: EMAIL, password: 'mala' })).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    expect(admin()).toMatchObject({ failedAttempts: MAX_FAILED_ATTEMPTS, lockedUntil: minutesAfterNow(LOCK_MINUTES) });
  });

  it('bloqueado da RATE_LIMITED aunque la contraseña sea la correcta, y no toca el contador', async () => {
    const { service, admin } = setup({ failedAttempts: MAX_FAILED_ATTEMPTS, lockedUntil: minutesAfterNow(1) });
    await expect(service.login({ email: EMAIL, password: 'clave-buena' })).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    expect(admin()).toMatchObject({ failedAttempts: MAX_FAILED_ATTEMPTS, version: 1 });
  });

  it('al vencer el bloqueo se puede entrar y el contador vuelve a cero', async () => {
    const { service, admin } = setup({ failedAttempts: MAX_FAILED_ATTEMPTS, lockedUntil: minutesAfterNow(0) });
    await expect(service.login({ email: EMAIL, password: 'clave-buena' })).resolves.toMatchObject({ sessionVersion: 2 });
    expect(admin()).toMatchObject({ failedAttempts: 0, lockedUntil: null });
  });

  it('un fallo después de un bloqueo vencido empieza a contar de nuevo', async () => {
    const { service, admin } = setup({ failedAttempts: MAX_FAILED_ATTEMPTS, lockedUntil: minutesAfterNow(-1) });
    await expect(service.login({ email: EMAIL, password: 'mala' })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    expect(admin()).toMatchObject({ failedAttempts: 1, lockedUntil: null });
  });

  it('un login correcto reinicia los intentos fallidos', async () => {
    const { service, admin } = setup({ failedAttempts: 3 });
    await service.login({ email: EMAIL, password: 'clave-buena' });
    expect(admin()).toMatchObject({ failedAttempts: 0, version: 2 });
  });

  it('un login correcto limpia un bloqueo vencido aunque el contador esté en cero', async () => {
    const { service, admin } = setup({ lockedUntil: minutesAfterNow(-1) });
    await service.login({ email: EMAIL, password: 'clave-buena' });
    expect(admin()).toMatchObject({ lockedUntil: null, version: 2 });
  });
});
