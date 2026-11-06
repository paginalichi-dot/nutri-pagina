import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signSession } from '@/lib/auth/session-token';
import { createFakeAdminRepository } from '../testing/admin-repository.fake';
import { createSessionService } from './session.service';

const ADMIN_ID = '7d3f8a3e-2f4b-4c1d-9a7e-1b2c3d4e5f60';
const repository = createFakeAdminRepository([
  { id: ADMIN_ID, email: 'admin@ejemplo.test', passwordHash: 'scrypt$x$y', sessionVersion: 2, failedAttempts: 0, lockedUntil: null, version: 1 },
]);
const service = createSessionService(repository);

describe('sessionService.authenticate', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('sin token da UNAUTHENTICATED', async () => {
    await expect(service.authenticate(undefined)).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('con un token adulterado da UNAUTHENTICATED', async () => {
    const token = await signSession({ adminId: ADMIN_ID, sessionVersion: 2 });
    await expect(service.authenticate(`${token}x`)).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('si el admin ya no existe da UNAUTHENTICATED', async () => {
    const token = await signSession({ adminId: '00000000-0000-4000-8000-000000000000', sessionVersion: 2 });
    await expect(service.authenticate(token)).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('si la versión de sesión cambió (sesión cerrada) da SESSION_EXPIRED', async () => {
    const token = await signSession({ adminId: ADMIN_ID, sessionVersion: 1 });
    await expect(service.authenticate(token)).rejects.toMatchObject({ code: 'SESSION_EXPIRED' });
  });

  it('con un token vigente devuelve el admin', async () => {
    const token = await signSession({ adminId: ADMIN_ID, sessionVersion: 2 });
    await expect(service.authenticate(token)).resolves.toEqual({ adminId: ADMIN_ID, sessionVersion: 2 });
  });
});
