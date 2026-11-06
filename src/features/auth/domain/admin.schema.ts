import { z } from 'zod';

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

export type SessionClaims = { adminId: string; sessionVersion: number };
