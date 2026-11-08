import { beforeEach, describe, expect, it } from 'vitest';
import { databaseErrorCode } from '@/lib/db-errors';
import { db } from '@/lib/db';
import { adminRepository } from './admin.repository';

const EMAIL = 'admin@ejemplo.test';

async function createAdmin(email = EMAIL): Promise<{ id: string; version: number }> {
  await adminRepository.upsertAdmin({ email, passwordHash: 'scrypt$sal$clave' });
  return db.adminUser.findUniqueOrThrow({ where: { email }, select: { id: true, version: true } });
}

describe('adminRepository: credenciales (integración)', () => {
  beforeEach(async () => {
    await db.adminUser.deleteMany();
  });

  it('findCredentialsById devuelve las credenciales, o null si no existe', async () => {
    const { id } = await createAdmin();
    await expect(adminRepository.findCredentialsById(id)).resolves.toMatchObject({ id, sessionVersion: 1, version: 1 });
    await expect(adminRepository.findCredentialsById('00000000-0000-4000-8000-000000000000')).resolves.toBeNull();
  });

  it('updateCredentials cambia el email y suma una versión de sesión', async () => {
    const { id, version } = await createAdmin();
    await adminRepository.updateCredentials({ id, version, email: 'nuevo@ejemplo.test' });
    await expect(adminRepository.findCredentialsByEmail(EMAIL)).resolves.toBeNull();
    await expect(adminRepository.findCredentialsByEmail('nuevo@ejemplo.test')).resolves.toMatchObject({ passwordHash: 'scrypt$sal$clave', sessionVersion: 2, version: 2 });
  });

  it('updateCredentials cambia la contraseña sin tocar el email', async () => {
    const { id, version } = await createAdmin();
    await adminRepository.updateCredentials({ id, version, passwordHash: 'scrypt$otra$clave' });
    await expect(adminRepository.findCredentialsByEmail(EMAIL)).resolves.toMatchObject({ passwordHash: 'scrypt$otra$clave', sessionVersion: 2 });
  });

  it('con una versión vieja da STALE_VERSION y no cambia nada', async () => {
    const { id, version } = await createAdmin();
    await adminRepository.updateCredentials({ id, version, passwordHash: 'scrypt$otra$clave' });
    await expect(adminRepository.updateCredentials({ id, version, email: 'tarde@ejemplo.test' })).rejects.toMatchObject({ code: 'STALE_VERSION' });
    await expect(adminRepository.findCredentialsByEmail(EMAIL)).resolves.toMatchObject({ sessionVersion: 2 });
  });

  it('un email que ya usa otra cuenta choca contra la base como DUPLICATE', async () => {
    await createAdmin('otro@ejemplo.test');
    const { id, version } = await createAdmin();
    const error = await adminRepository.updateCredentials({ id, version, email: 'otro@ejemplo.test' }).catch((caught: unknown) => caught);
    expect(databaseErrorCode(error)).toBe('DUPLICATE');
  });
});
