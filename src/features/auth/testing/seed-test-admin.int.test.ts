import { beforeEach, describe, expect, it } from 'vitest';
import { verifyPassword } from '@/lib/auth/password';
import { db } from '@/lib/db';
import { adminRepository } from '../repository/admin.repository';
import { seedTestAdmin } from './seed-test-admin';
import { E2E_ACCOUNT_ADMIN, TEST_ADMIN } from './test-admin';

describe('seedTestAdmin (integración)', () => {
  beforeEach(async () => {
    await db.adminUser.deleteMany();
  });

  it('en desarrollo crea sólo la cuenta admin de prueba, con la contraseña hasheada, y repetirlo no la duplica', async () => {
    await seedTestAdmin(adminRepository, undefined);
    await seedTestAdmin(adminRepository, 'development');
    const admins = await db.adminUser.findMany({ select: { email: true, passwordHash: true } });
    expect(admins).toHaveLength(1);
    expect(admins[0]?.email).toBe(TEST_ADMIN.email);
    await expect(verifyPassword(TEST_ADMIN.password, admins[0]?.passwordHash ?? '')).resolves.toBe(true);
  });

  it('con APP_ENV=test suma la cuenta que usa el E2E de "Mi cuenta"', async () => {
    await seedTestAdmin(adminRepository, 'test');
    const emails = (await db.adminUser.findMany({ select: { email: true }, orderBy: { email: 'asc' } })).map(({ email }) => email);
    expect(emails).toEqual([TEST_ADMIN.email, E2E_ACCOUNT_ADMIN.email]);
  });

  it('se niega a correr con APP_ENV=production', async () => {
    await expect(seedTestAdmin(adminRepository, 'production')).rejects.toThrow('no corre con APP_ENV=production');
    await expect(db.adminUser.count()).resolves.toBe(0);
  });
});
