import { beforeAll, describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createFakeAdminRepository, type FakeAdminRepository } from '../testing/admin-repository.fake';
import { createAccountService } from './account.service';

const ADMIN_ID = '7d3f8a3e-2f4b-4c1d-9a7e-1b2c3d4e5f60';
const EMAIL = 'admin@ejemplo.test';
let hash = '';

beforeAll(async () => {
  hash = await hashPassword('actual');
});

function setup(): { repository: FakeAdminRepository; service: ReturnType<typeof createAccountService> } {
  const repository = createFakeAdminRepository([
    { id: ADMIN_ID, email: EMAIL, passwordHash: hash, sessionVersion: 4, failedAttempts: 0, lockedUntil: null, version: 7 },
    { id: '00000000-0000-4000-8000-000000000001', email: 'otro@ejemplo.test', passwordHash: hash, sessionVersion: 1, failedAttempts: 0, lockedUntil: null, version: 1 },
  ]);
  return { repository, service: createAccountService(repository) };
}

describe('accountService.changeEmail', () => {
  it('con la contraseña actual cambia el email y cierra las demás sesiones', async () => {
    const { repository, service } = setup();
    await expect(service.changeEmail(ADMIN_ID, { email: 'nuevo@ejemplo.test', currentPassword: 'actual' })).resolves.toEqual({ adminId: ADMIN_ID, sessionVersion: 5 });
    await expect(repository.findCredentialsByEmail(EMAIL)).resolves.toBeNull();
    await expect(repository.findCredentialsByEmail('nuevo@ejemplo.test')).resolves.toMatchObject({ sessionVersion: 5, version: 8 });
  });

  it('con la contraseña actual incorrecta da WRONG_PASSWORD y no cambia nada', async () => {
    const { repository, service } = setup();
    await expect(service.changeEmail(ADMIN_ID, { email: 'nuevo@ejemplo.test', currentPassword: 'mala' })).rejects.toMatchObject({ code: 'WRONG_PASSWORD' });
    await expect(repository.findCredentialsByEmail(EMAIL)).resolves.toMatchObject({ sessionVersion: 4, version: 7 });
  });

  it('si el email ya lo usa otra cuenta da DUPLICATE', async () => {
    const { service } = setup();
    await expect(service.changeEmail(ADMIN_ID, { email: 'otro@ejemplo.test', currentPassword: 'actual' })).rejects.toMatchObject({ code: 'DUPLICATE' });
  });

  it('si el admin ya no existe da UNAUTHENTICATED', async () => {
    const { service } = setup();
    await expect(service.changeEmail('00000000-0000-4000-8000-00000000000f', { email: 'x@ejemplo.test', currentPassword: 'actual' })).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });
});

describe('accountService.changePassword', () => {
  it('con la contraseña actual guarda la nueva hasheada y cierra las demás sesiones', async () => {
    const { repository, service } = setup();
    await expect(service.changePassword(ADMIN_ID, { currentPassword: 'actual', newPassword: 'nueva-clave', confirmPassword: 'nueva-clave' })).resolves.toEqual({ adminId: ADMIN_ID, sessionVersion: 5 });
    const stored = (await repository.findCredentialsById(ADMIN_ID))?.passwordHash ?? '';
    expect(stored).not.toContain('nueva-clave');
    await expect(verifyPassword('nueva-clave', stored)).resolves.toBe(true);
    await expect(verifyPassword('actual', stored)).resolves.toBe(false);
  });

  it('con la contraseña actual incorrecta da WRONG_PASSWORD y la vieja sigue andando', async () => {
    const { repository, service } = setup();
    await expect(service.changePassword(ADMIN_ID, { currentPassword: 'mala', newPassword: 'nueva-clave', confirmPassword: 'nueva-clave' })).rejects.toMatchObject({ code: 'WRONG_PASSWORD' });
    await expect(repository.findCredentialsById(ADMIN_ID)).resolves.toMatchObject({ passwordHash: hash, sessionVersion: 4 });
  });
});
