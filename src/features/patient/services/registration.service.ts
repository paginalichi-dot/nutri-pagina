import { hashPassword } from '@/lib/auth/password';
import { sha256 } from '@/lib/auth/token-hash';
import type { EmailMessage } from '@/lib/email/send-email';
import { AppError, isAppError } from '@/lib/errors';
import type { PatientRow, RegisterInput } from '../domain/patient.schema';
import { issueLink, type PatientDeps, patientDeps } from './patient-deps';
import { patientEmail } from './patient-emails';

export type Outgoing = EmailMessage | null;

export type RegistrationService = {
  register(input: Omit<RegisterInput, 'consent' | 'website'>): Promise<Outgoing>;
  resendVerification(email: string): Promise<Outgoing>;
  verifyEmail(token: string): Promise<void>;
};

async function verificationEmail(deps: PatientDeps, patient: Pick<PatientRow, 'id' | 'email' | 'name'>): Promise<EmailMessage> {
  const url = await issueLink(deps, { patientId: patient.id, purpose: 'VERIFY_EMAIL' });
  return patientEmail('verify', { to: patient.email, name: patient.name, url });
}

async function alreadyRegistered(deps: PatientDeps, patient: PatientRow): Promise<EmailMessage> {
  const url = await issueLink(deps, { patientId: patient.id, purpose: 'RESET_PASSWORD' });
  return patientEmail('registered', { to: patient.email, name: patient.name, url });
}

async function createPatient(deps: PatientDeps, patient: Parameters<RegistrationService['register']>[0] & { passwordHash: string }): Promise<Outgoing> {
  try {
    const id = await deps.patients.create({ name: patient.name, email: patient.email, phone: patient.phone, passwordHash: patient.passwordHash, consentAt: deps.now() });
    return await verificationEmail(deps, { id, ...patient });
  } catch (error) {
    if (isAppError(error) && error.code === 'DUPLICATE') return null;
    throw error;
  }
}

async function register(deps: PatientDeps, { password, ...input }: Parameters<RegistrationService['register']>[0]): Promise<Outgoing> {
  const passwordHash = await hashPassword(password);
  const [patient, isAdmin] = await Promise.all([deps.patients.findByEmail(input.email), deps.isAdminEmail(input.email)]);
  if (isAdmin) return null;
  if (patient?.emailVerifiedAt) return alreadyRegistered(deps, patient);
  if (!patient) return createPatient(deps, { ...input, password, passwordHash });
  await deps.patients.update({ id: patient.id, version: patient.version, name: input.name, phone: input.phone, passwordHash, consentAt: deps.now() });
  return verificationEmail(deps, { ...patient, name: input.name });
}

export function createRegistrationService(deps: PatientDeps): RegistrationService {
  return {
    register: (input) => register(deps, input),
    async resendVerification(email) {
      const patient = await deps.patients.findByEmail(email);
      return patient && !patient.emailVerifiedAt ? verificationEmail(deps, patient) : null;
    },
    async verifyEmail(token) {
      const done = await deps.tokens.redeem({ tokenHash: sha256(token), purpose: 'VERIFY_EMAIL', now: deps.now(), effect: { verifyEmail: true } });
      if (!done) throw new AppError('INVALID_TOKEN');
    },
  };
}

export const registrationService = (): RegistrationService => createRegistrationService(patientDeps());
