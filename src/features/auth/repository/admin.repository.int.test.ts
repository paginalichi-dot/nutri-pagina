import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { adminRepository } from './admin.repository';

const EMAIL = 'admin@ejemplo.test';

async function createAdmin(): Promise<{ id: string; version: number }> {
  await adminRepository.upsertAdmin({ email: EMAIL, passwordHash: 'scrypt$sal$clave' });
  return db.adminUser.findUniqueOrThrow({ where: { email: EMAIL }, select: { id: true, version: true } });
}

describe('adminRepository (integración)', () => {
  beforeEach(async () => {
    await db.adminUser.deleteMany();
  });

  it('upsertAdmin crea el admin con los valores por defecto y findCredentialsByEmail lo devuelve', async () => {
    const { id } = await createAdmin();
    await expect(adminRepository.findCredentialsByEmail(EMAIL)).resolves.toEqual({
      id,
      passwordHash: 'scrypt$sal$clave',
      sessionVersion: 1,
      failedAttempts: 0,
      lockedUntil: null,
      version: 1,
    });
  });

  it('upsertAdmin sobre un admin existente cambia el hash y reinicia el bloqueo', async () => {
    const { id, version } = await createAdmin();
    await adminRepository.saveLoginState({ id, version, failedAttempts: 5, lockedUntil: new Date('2030-01-01T00:00:00Z') });
    await adminRepository.upsertAdmin({ email: EMAIL, passwordHash: 'scrypt$otra$clave' });
    await expect(adminRepository.findCredentialsByEmail(EMAIL)).resolves.toMatchObject({ passwordHash: 'scrypt$otra$clave', failedAttempts: 0, lockedUntil: null, version: 3 });
  });

  it('un email inexistente da null', async () => {
    await expect(adminRepository.findCredentialsByEmail('nadie@ejemplo.test')).resolves.toBeNull();
  });

  it('findSessionVersion devuelve sólo la versión de sesión, nunca el hash', async () => {
    const { id } = await createAdmin();
    await expect(adminRepository.findSessionVersion(id)).resolves.toBe(1);
    await expect(adminRepository.findSessionVersion('00000000-0000-4000-8000-000000000000')).resolves.toBeNull();
  });

  it('saveLoginState guarda el intento y suma una versión; con una versión vieja da STALE_VERSION', async () => {
    const { id, version } = await createAdmin();
    const lockedUntil = new Date('2026-11-06T20:15:00Z');
    await adminRepository.saveLoginState({ id, version, failedAttempts: 5, lockedUntil });
    await expect(adminRepository.findCredentialsByEmail(EMAIL)).resolves.toMatchObject({ failedAttempts: 5, lockedUntil, version: 2 });
    await expect(adminRepository.saveLoginState({ id, version, failedAttempts: 0, lockedUntil: null })).rejects.toMatchObject({ code: 'STALE_VERSION' });
  });

  it.each([
    ['un email con mayúsculas', { email: 'Admin@Ejemplo.test', passwordHash: 'h' }],
    ['intentos fallidos negativos', { email: EMAIL, passwordHash: 'h', failedAttempts: -1 }],
    ['una versión de sesión menor a 1', { email: EMAIL, passwordHash: 'h', sessionVersion: 0 }],
  ])('la base rechaza %s', async (_caso, data) => {
    await expect(db.adminUser.create({ data })).rejects.toThrow();
  });

  it('la base rechaza dos admins con el mismo email', async () => {
    await createAdmin();
    await expect(db.adminUser.create({ data: { email: EMAIL, passwordHash: 'h' } })).rejects.toThrow();
  });
});
