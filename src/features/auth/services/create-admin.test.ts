import { describe, expect, it, vi } from 'vitest';
import { verifyPassword } from '@/lib/auth/password';
import type { AdminRepository } from '../repository/admin.repository';
import { createAdmin } from './create-admin';

const PASSWORD = 'una-clave-larga';

function fakeRepository(): { upsertAdmin: ReturnType<typeof vi.fn<AdminRepository['upsertAdmin']>> } {
  return { upsertAdmin: vi.fn<AdminRepository['upsertAdmin']>(async () => undefined) };
}

describe('createAdmin', () => {
  it('guarda el email normalizado y sólo el hash de la contraseña', async () => {
    const repository = fakeRepository();
    await expect(createAdmin(repository, { ADMIN_EMAIL: ' Admin@Ejemplo.TEST ', ADMIN_PASSWORD: PASSWORD })).resolves.toBe('admin@ejemplo.test');
    const [{ email, passwordHash }] = repository.upsertAdmin.mock.calls[0] ?? [{ email: '', passwordHash: '' }];
    expect(email).toBe('admin@ejemplo.test');
    expect(passwordHash).not.toContain(PASSWORD);
    await expect(verifyPassword(PASSWORD, passwordHash)).resolves.toBe(true);
  });

  it.each([
    { env: { ADMIN_PASSWORD: PASSWORD }, message: 'Ingresá un email válido.' },
    { env: { ADMIN_EMAIL: 'no-es-email', ADMIN_PASSWORD: PASSWORD }, message: 'Ingresá un email válido.' },
    { env: { ADMIN_EMAIL: 'admin@ejemplo.test' }, message: 'La contraseña tiene que tener al menos 8 caracteres.' },
    { env: { ADMIN_EMAIL: 'admin@ejemplo.test', ADMIN_PASSWORD: 'corta' }, message: 'La contraseña tiene que tener al menos 8 caracteres.' },
    { env: { ADMIN_EMAIL: 'admin@ejemplo.test', ADMIN_PASSWORD: 'x'.repeat(129) }, message: 'La contraseña es demasiado larga.' },
  ])('con datos inválidos falla con «$message» y no toca la base', async ({ env, message }) => {
    const repository = fakeRepository();
    await expect(createAdmin(repository, env)).rejects.toThrow(message);
    expect(repository.upsertAdmin).not.toHaveBeenCalled();
  });
});
