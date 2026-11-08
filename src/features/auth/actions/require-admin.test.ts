import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { signSession } from '@/lib/auth/session-token';
import { cookieJar } from '@/test/cookie-jar';
import { adminRepository } from '../repository/admin.repository';
import { TEST_ADMIN } from '../testing/test-admin';
import { logout } from './logout';
import { guardAdminPage, hasAdminSession, requireAdmin } from './require-admin';

vi.mock('next/navigation', async () => (await import('../testing/module-mocks')).navigationMock);
vi.mock('../repository/admin.repository', async () => (await import('../testing/module-mocks')).fakeRepositoryModule());

async function adminToken(sessionVersion = 1): Promise<string> {
  const admin = await adminRepository.findCredentialsByEmail(TEST_ADMIN.email);
  return signSession({ adminId: admin?.id ?? '', sessionVersion });
}

describe('sesión del panel (contrato)', () => {
  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    await adminRepository.upsertAdmin({ email: TEST_ADMIN.email, passwordHash: 'scrypt$x$y' });
  });

  it('sin cookie: UNAUTHENTICATED, la página muestra "Acceso denegado" y no hay sesión', async () => {
    await expect(requireAdmin()).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
    await expect(guardAdminPage()).rejects.toThrow('NEXT_FORBIDDEN');
    await expect(hasAdminSession()).resolves.toBe(false);
  });

  it('con un token adulterado: UNAUTHENTICATED y "Acceso denegado"', async () => {
    cookieJar.set('session', `${await adminToken()}x`);
    await expect(requireAdmin()).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
    await expect(guardAdminPage()).rejects.toThrow('NEXT_FORBIDDEN');
  });

  it('con una sesión cerrada desde otro lado: SESSION_EXPIRED y vuelve al login', async () => {
    cookieJar.set('session', await adminToken(2));
    await expect(requireAdmin()).rejects.toMatchObject({ code: 'SESSION_EXPIRED' });
    await expect(guardAdminPage()).rejects.toThrow('NEXT_REDIRECT:/login');
  });

  it('con una sesión vigente entra', async () => {
    cookieJar.set('session', await adminToken());
    await expect(requireAdmin()).resolves.toMatchObject({ sessionVersion: 1 });
    await expect(guardAdminPage()).resolves.toBeUndefined();
    await expect(hasAdminSession()).resolves.toBe(true);
  });

  it('si la base falla, el error no se disfraza de "Acceso denegado"', async () => {
    cookieJar.set('session', await adminToken());
    vi.spyOn(adminRepository, 'findSessionVersion').mockRejectedValue(new Error('base caída'));
    await expect(guardAdminPage()).rejects.toThrow('base caída');
    await expect(hasAdminSession()).rejects.toThrow('base caída');
  });

  it('cerrar sesión borra la cookie y lleva al login', async () => {
    cookieJar.set('session', await adminToken());
    await expect(logout()).rejects.toThrow('NEXT_REDIRECT:/login');
    expect(revalidatePath).toHaveBeenCalledWith('/admin', 'layout');
    expect(cookieJar.get('session')).toBeUndefined();
  });
});
