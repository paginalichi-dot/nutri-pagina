import { hashPassword } from '@/lib/auth/password';
import type { AdminRepository } from '../repository/admin.repository';
import { E2E_ACCOUNT_ADMIN, TEST_ADMIN } from './test-admin';

export async function seedTestAdmin(repository: AdminRepository, appEnv: string | undefined): Promise<string> {
  if (appEnv === 'production') throw new Error('El seed sólo carga datos ficticios: no corre con APP_ENV=production.');
  const accounts = appEnv === 'test' ? [TEST_ADMIN, E2E_ACCOUNT_ADMIN] : [TEST_ADMIN];
  for (const { email, password } of accounts) await repository.upsertAdmin({ email, passwordHash: await hashPassword(password) });
  return TEST_ADMIN.email;
}
