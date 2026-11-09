import { z } from 'zod';
import type { SessionToken } from '@/lib/auth/session-token';

export const AdminCredentialsRowSchema = z.object({
  id: z.uuid(),
  passwordHash: z.string().min(1),
  sessionVersion: z.int().positive(),
  failedAttempts: z.int().nonnegative(),
  lockedUntil: z.date().nullable(),
  version: z.int().positive(),
});

export type AdminCredentialsRow = z.infer<typeof AdminCredentialsRowSchema>;

export type LoginState = Pick<AdminCredentialsRow, 'id' | 'version' | 'failedAttempts' | 'lockedUntil'>;

export type LoginCredentials = AdminCredentialsRow & { verified: boolean };

export type PatientLoginSource = {
  findLoginAccount(email: string): Promise<LoginCredentials | null>;
  saveLoginState(state: LoginState): Promise<void>;
};

export type SessionClaims = { adminId: string; sessionVersion: number };

export const adminSession = ({ adminId, sessionVersion }: SessionClaims): SessionToken => ({ subjectId: adminId, sessionVersion, role: 'admin' });

export type CredentialsChange = Pick<AdminCredentialsRow, 'id' | 'version'> & { email?: string; passwordHash?: string };
