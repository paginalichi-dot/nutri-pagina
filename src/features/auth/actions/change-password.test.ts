import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifyPassword } from '@/lib/auth/password';
import { cookieJar } from '@/test/cookie-jar';
import { adminRepository } from '../repository/admin.repository';
import { formData, signedInAdmin } from '../testing/account-actions.fixture';
import { TEST_ADMIN } from '../testing/test-admin';
import { changePassword } from './change-password';
import { requireAdmin } from './require-admin';

vi.mock('next/navigation', async () => (await import('../testing/module-mocks')).navigationMock);
vi.mock('../repository/admin.repository', async () => (await import('../testing/module-mocks')).fakeRepositoryModule());

const form = (fields: Record<string, string> = {}): FormData =>
  formData({ currentPassword: TEST_ADMIN.password, newPassword: 'clave-nueva-123', confirmPassword: 'clave-nueva-123', ...fields });

async function storedHash(): Promise<string> {
  return (await adminRepository.findCredentialsByEmail(TEST_ADMIN.email))?.passwordHash ?? '';
}

describe('changePassword (contrato)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('sin sesión da UNAUTHENTICATED', async () => {
    await expect(changePassword(null, form())).resolves.toMatchObject({ success: false, code: 'UNAUTHENTICATED' });
  });

  it('con la contraseña actual guarda la nueva, renueva esta sesión y cierra las demás', async () => {
    const { token: previous } = await signedInAdmin();
    await expect(changePassword(null, form())).resolves.toEqual({ success: true, message: 'Listo. Desde ahora entrás con la contraseña nueva.' });
    await expect(verifyPassword('clave-nueva-123', await storedHash())).resolves.toBe(true);
    await expect(requireAdmin()).resolves.toMatchObject({ sessionVersion: 2 });
    cookieJar.set('session', previous);
    await expect(requireAdmin()).rejects.toMatchObject({ code: 'SESSION_EXPIRED' });
  });

  it.each([
    { caso: 'la contraseña actual es incorrecta', data: form({ currentPassword: 'mala' }), code: 'WRONG_PASSWORD', error: 'La contraseña actual no es correcta.' },
    { caso: 'la repetición no coincide', data: form({ confirmPassword: 'otra-clave-123' }), code: 'VALIDATION', error: 'Las contraseñas no coinciden.' },
    { caso: 'la nueva es corta', data: form({ newPassword: 'corta', confirmPassword: 'corta' }), code: 'VALIDATION', error: 'La contraseña nueva tiene que tener al menos 8 caracteres.' },
  ])('si $caso da $code y la contraseña vieja sigue andando', async ({ data, code, error }) => {
    await signedInAdmin();
    await expect(changePassword(null, data)).resolves.toEqual({ success: false, code, error });
    await expect(verifyPassword(TEST_ADMIN.password, await storedHash())).resolves.toBe(true);
  });

  it('la respuesta nunca trae la contraseña ni el hash', async () => {
    await signedInAdmin();
    const result = JSON.stringify(await changePassword(null, form()));
    expect(result).not.toContain('clave-nueva-123');
    expect(result).not.toContain('scrypt$');
  });
});
