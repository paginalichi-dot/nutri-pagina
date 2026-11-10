import { adminRepository } from '@/features/auth/repository/admin.repository';
import { createOneTimeToken } from '@/lib/auth/token-hash';
import { appUrlFromEnv } from '@/lib/app-url';
import { TOKEN_HOURS, type TokenPurpose } from '../domain/patient.schema';
import { type PatientRepository, patientRepository } from '../repository/patient.repository';
import { type PatientTokenRepository, patientTokenRepository } from '../repository/patient-token.repository';

export type PatientDeps = {
  patients: PatientRepository;
  tokens: PatientTokenRepository;
  now: () => Date;
  appUrl: string;
  isAdminEmail: (email: string) => Promise<boolean>;
};

const PATHS: Readonly<Record<TokenPurpose, string>> = { VERIFY_EMAIL: '/verificar', RESET_PASSWORD: '/restablecer', CHANGE_EMAIL: '/confirmar-email' };

type LinkRequest = { patientId: string; purpose: TokenPurpose; newEmail?: string };

export async function issueLink(deps: PatientDeps, { patientId, purpose, newEmail }: LinkRequest): Promise<string> {
  const { token, hash } = createOneTimeToken();
  const createdAt = deps.now();
  const expiresAt = new Date(createdAt.getTime() + TOKEN_HOURS[purpose] * 3_600_000);
  await deps.tokens.issue({ patientId, purpose, tokenHash: hash, newEmail: newEmail ?? null, createdAt, expiresAt });
  return `${deps.appUrl}${PATHS[purpose]}/${token}`;
}

export const patientDeps = (): PatientDeps => ({
  patients: patientRepository,
  tokens: patientTokenRepository,
  now: () => new Date(),
  appUrl: appUrlFromEnv(process.env),
  isAdminEmail: async (email) => (await adminRepository.findCredentialsByEmail(email)) !== null,
});
