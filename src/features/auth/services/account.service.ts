import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { AppError } from '@/lib/errors';
import type { ChangeEmailInput, ChangePasswordInput } from '../domain/account.schema';
import type { AdminCredentialsRow, CredentialsChange, SessionClaims } from '../domain/admin.schema';
import { type AdminRepository, adminRepository } from '../repository/admin.repository';

export type AccountService = {
  changeEmail(adminId: string, input: ChangeEmailInput): Promise<SessionClaims>;
  changePassword(adminId: string, input: ChangePasswordInput): Promise<SessionClaims>;
};

type Repository = Pick<AdminRepository, 'findCredentialsById' | 'updateCredentials'>;
type Changes = Omit<CredentialsChange, 'id' | 'version'>;

async function verifiedAdmin(repository: Repository, adminId: string, currentPassword: string): Promise<AdminCredentialsRow> {
  const admin = await repository.findCredentialsById(adminId);
  if (!admin) throw new AppError('UNAUTHENTICATED');
  if (!(await verifyPassword(currentPassword, admin.passwordHash))) throw new AppError('WRONG_PASSWORD');
  return admin;
}

async function applyChange(repository: Repository, admin: AdminCredentialsRow, changes: Changes): Promise<SessionClaims> {
  await repository.updateCredentials({ id: admin.id, version: admin.version, ...changes });
  return { adminId: admin.id, sessionVersion: admin.sessionVersion + 1 };
}

export function createAccountService(repository: Repository): AccountService {
  return {
    async changeEmail(adminId, { email, currentPassword }) {
      const admin = await verifiedAdmin(repository, adminId, currentPassword);
      return applyChange(repository, admin, { email });
    },
    async changePassword(adminId, { currentPassword, newPassword }) {
      const admin = await verifiedAdmin(repository, adminId, currentPassword);
      return applyChange(repository, admin, { passwordHash: await hashPassword(newPassword) });
    },
  };
}

export const accountService = createAccountService(adminRepository);
