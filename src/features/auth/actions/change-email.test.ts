import fc from 'fast-check';
import { revalidatePath } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError, errorMessage } from '@/lib/errors';
import { cookieJar } from '@/test/cookie-jar';
import { adminRepository } from '../repository/admin.repository';
import { formData, signedInAdmin } from '../testing/account-actions.fixture';
import { TEST_ADMIN } from '../testing/test-admin';
import { changeEmail } from './change-email';
import { requireAdmin } from './require-admin';

vi.mock('next/navigation', async () => (await import('../testing/module-mocks')).navigationMock);
vi.mock('../repository/admin.repository', async () => (await import('../testing/module-mocks')).fakeRepositoryModule());

const form = (fields: Record<string, string> = {}): FormData => formData({ email: 'nuevo@ejemplo.test', currentPassword: TEST_ADMIN.password, ...fields });

describe('changeEmail (contrato)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('sin sesión da UNAUTHENTICATED', async () => {
    await expect(changeEmail(null, form())).resolves.toMatchObject({ success: false, code: 'UNAUTHENTICATED' });
  });

  it('con la contraseña actual cambia el email, renueva esta sesión y cierra las demás', async () => {
    const { token: previous } = await signedInAdmin();
    await expect(changeEmail(null, form())).resolves.toEqual({ success: true, message: 'Listo. Desde ahora entrás con nuevo@ejemplo.test.' });
    await expect(adminRepository.findCredentialsByEmail('nuevo@ejemplo.test')).resolves.toMatchObject({ sessionVersion: 2 });
    await expect(requireAdmin()).resolves.toMatchObject({ sessionVersion: 2 });
    cookieJar.set('session', previous);
    await expect(requireAdmin()).rejects.toMatchObject({ code: 'SESSION_EXPIRED' });
    expect(revalidatePath).toHaveBeenCalledWith('/admin', 'layout');
  });

  it.each([
    { caso: 'la contraseña actual es incorrecta', data: form({ currentPassword: 'mala' }), code: 'WRONG_PASSWORD', error: 'La contraseña actual no es correcta.' },
    { caso: 'el email es inválido', data: form({ email: 'no-es-email' }), code: 'VALIDATION', error: 'Ingresá un email válido.' },
    { caso: 'falta la contraseña actual', data: form({ currentPassword: '' }), code: 'VALIDATION', error: 'Ingresá tu contraseña actual.' },
  ])('si $caso da $code', async ({ data, code, error }) => {
    await signedInAdmin();
    await expect(changeEmail(null, data)).resolves.toEqual({ success: false, code, error });
    await expect(adminRepository.findCredentialsByEmail(TEST_ADMIN.email)).resolves.not.toBeNull();
  });

  it('si el email ya lo usa otra cuenta da DUPLICATE', async () => {
    await adminRepository.upsertAdmin({ email: 'otro@ejemplo.test', passwordHash: 'scrypt$x$y' });
    await signedInAdmin();
    await expect(changeEmail(null, form({ email: 'otro@ejemplo.test' }))).resolves.toEqual({ success: false, code: 'DUPLICATE', error: 'Ya existe un registro con esos datos.' });
  });

  it('si otro cambio se guardó antes da STALE_VERSION', async () => {
    await signedInAdmin();
    vi.spyOn(adminRepository, 'updateCredentials').mockRejectedValue(new AppError('STALE_VERSION'));
    await expect(changeEmail(null, form())).resolves.toMatchObject({ success: false, code: 'STALE_VERSION' });
  });

  it('fuzz: nunca devuelve un error fuera del catálogo ni la contraseña', async () => {
    await signedInAdmin();
    vi.spyOn(adminRepository, 'updateCredentials').mockResolvedValue();
    await fc.assert(
      fc.asyncProperty(fc.record({ email: fc.string(), currentPassword: fc.string({ minLength: 6 }) }), async (fields) => {
        const result = await changeEmail(null, formData(fields));
        if (!result.success && result.code) expect(() => errorMessage(result.code ?? 'UNEXPECTED')).not.toThrow();
        expect(JSON.stringify(result)).not.toContain(fields.currentPassword);
      }),
      { numRuns: 100 }
    );
  });
});
