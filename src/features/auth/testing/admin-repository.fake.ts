import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import { type AdminCredentialsRow, AdminCredentialsRowSchema } from '../domain/admin.schema';
import type { AdminRepository } from '../repository/admin.repository';

export type FakeAdmin = AdminCredentialsRow & { email: string };

export type FakeAdminRepository = AdminRepository & { admins: Map<string, FakeAdmin> };

export function createFakeAdminRepository(seed: FakeAdmin[] = []): FakeAdminRepository {
  const admins = new Map(seed.map((admin) => [admin.email, { ...admin }]));
  const byId = (id: string): FakeAdmin | undefined => [...admins.values()].find((admin) => admin.id === id);
  const credentials = (admin: FakeAdmin | undefined): AdminCredentialsRow | null => (admin ? AdminCredentialsRowSchema.parse(admin) : null);

  function versioned(id: string, version: number): FakeAdmin {
    const admin = byId(id);
    if (!admin || admin.version !== version) throw new AppError('STALE_VERSION');
    admin.version += 1;
    return admin;
  }

  return {
    admins,
    findCredentialsByEmail: async (email) => credentials(admins.get(email)),
    findCredentialsById: async (id) => credentials(byId(id)),
    findSessionVersion: async (id) => byId(id)?.sessionVersion ?? null,
    async saveLoginState({ id, version, failedAttempts, lockedUntil }) {
      Object.assign(versioned(id, version), { failedAttempts, lockedUntil });
    },
    async updateCredentials({ id, version, email, passwordHash }) {
      if (email !== undefined && admins.get(email) && admins.get(email)?.id !== id) throw new AppError('DUPLICATE');
      const admin = versioned(id, version);
      admins.delete(admin.email);
      Object.assign(admin, { email: email ?? admin.email, passwordHash: passwordHash ?? admin.passwordHash, sessionVersion: admin.sessionVersion + 1 });
      admins.set(admin.email, admin);
    },
    async upsertAdmin({ email, passwordHash }) {
      const existing = admins.get(email);
      if (existing) Object.assign(existing, { passwordHash, failedAttempts: 0, lockedUntil: null, version: existing.version + 1 });
      else admins.set(email, { id: randomUUID(), email, passwordHash, sessionVersion: 1, failedAttempts: 0, lockedUntil: null, version: 1 });
    },
  };
}
