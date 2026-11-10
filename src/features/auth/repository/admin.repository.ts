import { db } from '@/lib/db';
import { AppError } from '@/lib/errors';
import { type AdminCredentialsRow, AdminCredentialsRowSchema, type CredentialsChange, type LoginState } from '../domain/admin.schema';

export type AdminRepository = {
  findCredentialsByEmail(email: string): Promise<AdminCredentialsRow | null>;
  findCredentialsById(id: string): Promise<AdminCredentialsRow | null>;
  findSessionVersion(id: string): Promise<number | null>;
  findEmail(): Promise<string | null>;
  saveLoginState(state: LoginState): Promise<void>;
  updateCredentials(change: CredentialsChange): Promise<void>;
  upsertAdmin(admin: { email: string; passwordHash: string }): Promise<void>;
};

const CREDENTIALS = { id: true, passwordHash: true, sessionVersion: true, failedAttempts: true, lockedUntil: true, version: true } as const;

async function findCredentials(where: { email: string } | { id: string }): Promise<AdminCredentialsRow | null> {
  const row = await db.adminUser.findUnique({ where, select: CREDENTIALS });
  return row ? AdminCredentialsRowSchema.parse(row) : null;
}

async function updateVersioned(id: string, version: number, data: object): Promise<void> {
  const { count } = await db.adminUser.updateMany({ where: { id, version }, data: { ...data, version: { increment: 1 } } });
  if (count === 0) throw new AppError('STALE_VERSION');
}

export const adminRepository: AdminRepository = {
  findCredentialsByEmail: (email) => findCredentials({ email }),

  findCredentialsById: (id) => findCredentials({ id }),

  async findSessionVersion(id) {
    const row = await db.adminUser.findUnique({ where: { id }, select: { sessionVersion: true } });
    return row?.sessionVersion ?? null;
  },

  async findEmail() {
    return (await db.adminUser.findFirst({ select: { email: true }, orderBy: { createdAt: 'asc' } }))?.email ?? null;
  },

  saveLoginState: ({ id, version, failedAttempts, lockedUntil }) => updateVersioned(id, version, { failedAttempts, lockedUntil }),

  updateCredentials: ({ id, version, email, passwordHash }) => updateVersioned(id, version, { email, passwordHash, sessionVersion: { increment: 1 } }),

  async upsertAdmin({ email, passwordHash }) {
    await db.adminUser.upsert({
      where: { email },
      create: { email, passwordHash },
      update: { passwordHash, failedAttempts: 0, lockedUntil: null, version: { increment: 1 } },
    });
  },
};
