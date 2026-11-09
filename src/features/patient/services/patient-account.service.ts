import type { ChangePasswordInput } from '@/features/auth/domain/account.schema';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { sha256 } from '@/lib/auth/token-hash';
import { AppError } from '@/lib/errors';
import type { EmailChangeInput, PatientClaims, PatientProfile, PatientRow, ProfileInput } from '../domain/patient.schema';
import { issueLink, type PatientDeps, patientDeps } from './patient-deps';
import { patientEmail } from './patient-emails';
import type { Outgoing } from './registration.service';

export type PatientAccountService = {
  profile(patientId: string): Promise<PatientProfile>;
  updateProfile(patientId: string, input: ProfileInput): Promise<void>;
  changePassword(patientId: string, input: Pick<ChangePasswordInput, 'currentPassword' | 'newPassword'>): Promise<PatientClaims>;
  requestEmailChange(patientId: string, input: EmailChangeInput): Promise<Outgoing>;
  confirmEmailChange(token: string): Promise<void>;
  deleteAccount(patientId: string, currentPassword: string): Promise<void>;
};

async function current(deps: PatientDeps, patientId: string): Promise<PatientRow> {
  const patient = await deps.patients.findById(patientId);
  if (!patient) throw new AppError('UNAUTHENTICATED');
  return patient;
}

async function withPassword(deps: PatientDeps, patientId: string, password: string): Promise<PatientRow> {
  const patient = await current(deps, patientId);
  if (!(await verifyPassword(password, patient.passwordHash))) throw new AppError('WRONG_PASSWORD');
  return patient;
}

async function requestEmailChange(deps: PatientDeps, patientId: string, { email, currentPassword }: EmailChangeInput): Promise<Outgoing> {
  const patient = await withPassword(deps, patientId, currentPassword);
  if (email === patient.email) throw new AppError('VALIDATION');
  const [taken, isAdmin] = await Promise.all([deps.patients.findByEmail(email), deps.isAdminEmail(email)]);
  if (taken || isAdmin) throw new AppError('EMAIL_IN_USE');
  const url = await issueLink(deps, { patientId, purpose: 'CHANGE_EMAIL', newEmail: email });
  return patientEmail('change-email', { to: email, name: patient.name, url });
}

export function createPatientAccountService(deps: PatientDeps): PatientAccountService {
  return {
    async profile(patientId) {
      const { id, name, email, phone, version } = await current(deps, patientId);
      return { id, name, email, phone, version };
    },
    updateProfile: (patientId, { name, phone, version }) => deps.patients.update({ id: patientId, version, name, phone }),
    async changePassword(patientId, { currentPassword, newPassword }) {
      const patient = await withPassword(deps, patientId, currentPassword);
      await deps.patients.update({ id: patient.id, version: patient.version, passwordHash: await hashPassword(newPassword), endSessions: true });
      return { patientId, sessionVersion: patient.sessionVersion + 1 };
    },
    requestEmailChange: (patientId, input) => requestEmailChange(deps, patientId, input),
    async confirmEmailChange(token) {
      const done = await deps.tokens.redeem({ tokenHash: sha256(token), purpose: 'CHANGE_EMAIL', now: deps.now(), effect: { useNewEmail: true } });
      if (!done) throw new AppError('INVALID_TOKEN');
    },
    async deleteAccount(patientId, currentPassword) {
      const patient = await withPassword(deps, patientId, currentPassword);
      await deps.patients.remove({ id: patient.id, version: patient.version });
    },
  };
}

export const patientAccountService = (): PatientAccountService => createPatientAccountService(patientDeps());
