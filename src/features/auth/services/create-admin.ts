import { hashPassword } from '@/lib/auth/password';
import { AdminSetupSchema } from '../domain/admin.schema';
import type { AdminRepository } from '../repository/admin.repository';

type Env = Readonly<Record<string, string | undefined>>;

export async function createAdmin(repository: Pick<AdminRepository, 'upsertAdmin'>, env: Env): Promise<string> {
  const parsed = AdminSetupSchema.safeParse({ email: env.ADMIN_EMAIL ?? '', password: env.ADMIN_PASSWORD ?? '' });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
  const { email, password } = parsed.data;
  await repository.upsertAdmin({ email, passwordHash: await hashPassword(password) });
  return email;
}
