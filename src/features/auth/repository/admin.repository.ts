import { db } from '@/lib/db';
import { AppError } from '@/lib/errors';
import { type AdminCredentialsRow, AdminCredentialsRowSchema, type LoginState } from '../domain/admin.schema';

export type AdminRepository = {
  findCredentialsByEmail(email: string): Promise<AdminCredentialsRow | null>;
  findSessionVersion(id: string): Promise<number | null>;
  saveLoginState(state: LoginState): Promise<void>;
  upsertAdmin(admin: { email: string; passwordHash: string }): Promise<void>;
};

const CREDENTIALS = { id: true, passwordHash: true, sessionVersion: true, failedAttempts: true, lockedUntil: true, version: true } as const;

export const adminRepository: AdminRepository = {
  async findCredentialsByEmail(email) {
    const row = await db.adminUser.findUnique({ where: { email }, select: CREDENTIALS });
    return row ? AdminCredentialsRowSchema.parse(row) : null;
  },

  async findSessionVersion(id) {
    const row = await db.adminUser.findUnique({ where: { id }, select: { sessionVersion: true } });
    return row?.sessionVersion ?? null;
  },

  async saveLoginState({ id, version, failedAttempts, lockedUntil }) {
    const { count } = await db.adminUser.updateMany({
      where: { id, version },
      data: { failedAttempts, lockedUntil, version: { increment: 1 } },
    });
    if (count === 0) throw new AppError('STALE_VERSION');
  },

  async upsertAdmin({ email, passwordHash }) {
    await db.adminUser.upsert({
      where: { email },
      create: { email, passwordHash },
      update: { passwordHash, failedAttempts: 0, lockedUntil: null, version: { increment: 1 } },
    });
  },
};
