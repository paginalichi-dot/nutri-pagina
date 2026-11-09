import { hashPassword } from '@/lib/auth/password';
import { sha256 } from '@/lib/auth/token-hash';
import { AppError } from '@/lib/errors';
import { issueLink, type PatientDeps, patientDeps } from './patient-deps';
import { patientEmail } from './patient-emails';
import type { Outgoing } from './registration.service';

export type PasswordResetService = {
  requestReset(email: string): Promise<Outgoing>;
  resetPassword(token: string, password: string): Promise<void>;
};

export function createPasswordResetService(deps: PatientDeps): PasswordResetService {
  return {
    async requestReset(email) {
      const patient = await deps.patients.findByEmail(email);
      if (!patient) return null;
      const url = await issueLink(deps, { patientId: patient.id, purpose: 'RESET_PASSWORD' });
      return patientEmail('reset', { to: patient.email, name: patient.name, url });
    },
    async resetPassword(token, password) {
      const passwordHash = await hashPassword(password);
      const effect = { passwordHash, verifyEmail: true };
      const done = await deps.tokens.redeem({ tokenHash: sha256(token), purpose: 'RESET_PASSWORD', now: deps.now(), effect });
      if (!done) throw new AppError('INVALID_TOKEN');
    },
  };
}

export const passwordResetService = (): PasswordResetService => createPasswordResetService(patientDeps());
