import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import { type AdminCredentialsRow, AdminCredentialsRowSchema } from '../domain/admin.schema';
import type { AdminRepository } from '../repository/admin.repository';

export type FakeAdmin = AdminCredentialsRow & { email: string };

export type FakeAdminRepository = AdminRepository & { admins: Map<string, FakeAdmin> };

export function createFakeAdminRepository(seed: FakeAdmin[] = []): FakeAdminRepository {
  const admins = new Map(seed.map((admin) => [admin.email, { ...admin }]));
  const byId = (id: string): FakeAdmin | undefined => [...admins.values()].find((admin) => admin.id === id);

  return {
    admins,
    async findCredentialsByEmail(email) {
      const admin = admins.get(email);
      return admin ? AdminCredentialsRowSchema.parse(admin) : null;
    },
    async findSessionVersion(id) {
      return byId(id)?.sessionVersion ?? null;
    },
    async saveLoginState({ id, version, failedAttempts, lockedUntil }) {
      const admin = byId(id);
      if (!admin || admin.version !== version) throw new AppError('STALE_VERSION');
      Object.assign(admin, { failedAttempts, lockedUntil, version: version + 1 });
    },
    async upsertAdmin({ email, passwordHash }) {
      const existing = admins.get(email);
      if (existing) Object.assign(existing, { passwordHash, failedAttempts: 0, lockedUntil: null, version: existing.version + 1 });
      else admins.set(email, { id: randomUUID(), email, passwordHash, sessionVersion: 1, failedAttempts: 0, lockedUntil: null, version: 1 });
    },
  };
}
