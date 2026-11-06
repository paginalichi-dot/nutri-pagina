import { hashPassword } from '@/lib/auth/password';
import type { AdminRepository } from '../repository/admin.repository';
import { TEST_ADMIN } from './test-admin';

export async function seedTestAdmin(repository: AdminRepository, appEnv: string | undefined): Promise<string> {
  if (appEnv === 'production') throw new Error('El seed sólo carga datos ficticios: no corre con APP_ENV=production.');
  await repository.upsertAdmin({ email: TEST_ADMIN.email, passwordHash: await hashPassword(TEST_ADMIN.password) });
  return TEST_ADMIN.email;
}
