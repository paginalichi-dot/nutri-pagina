import { patientLoginSource } from '@/features/patient/services/patient-login';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import type { SessionRole, SessionToken } from '@/lib/auth/session-token';
import { AppError, isAppError } from '@/lib/errors';
import type { LoginCredentials, LoginState, PatientLoginSource } from '../domain/admin.schema';
import type { LoginInput } from '../domain/login.schema';
import { type AdminRepository, adminRepository } from '../repository/admin.repository';

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

type Credentials = Pick<LoginInput, 'email' | 'password'>;
type Deps = { repository: AdminRepository; patients: PatientLoginSource; now: () => Date };
type Account = LoginCredentials & { role: SessionRole; save: (state: LoginState) => Promise<void> };

export type Defer = (task: () => Promise<void>) => void;

export type AuthService = { login(credentials: Credentials, defer?: Defer): Promise<SessionToken> };

let fallbackHash: Promise<string> | undefined;
const timingFallback = (): Promise<string> => (fallbackHash ??= hashPassword('relleno-para-que-el-tiempo-sea-parejo'));

const isLocked = (account: Account, now: Date): boolean => account.lockedUntil !== null && account.lockedUntil > now;

async function findAccount(email: string, { repository, patients }: Deps): Promise<Account | null> {
  const [admin, patient] = await Promise.all([repository.findCredentialsByEmail(email), patients.findLoginAccount(email)]);
  if (admin) return { ...admin, verified: true, role: 'admin', save: (state) => repository.saveLoginState(state) };
  return patient ? { ...patient, role: 'patient', save: (state) => patients.saveLoginState(state) } : null;
}

async function saveIgnoringRace(account: Account, state: Omit<LoginState, 'id' | 'version'>): Promise<void> {
  try {
    await account.save({ id: account.id, version: account.version, ...state });
  } catch (error) {
    if (!isAppError(error) || error.code !== 'STALE_VERSION') throw error;
  }
}

async function registerFailure(account: Account, { now, defer }: { now: Date; defer?: Defer }): Promise<never> {
  const failedAttempts = (account.lockedUntil === null ? account.failedAttempts : 0) + 1;
  const locks = failedAttempts >= MAX_FAILED_ATTEMPTS;
  const save = (): Promise<void> => saveIgnoringRace(account, { failedAttempts, lockedUntil: locks ? new Date(now.getTime() + LOCK_MINUTES * 60_000) : null });
  if (defer) defer(save);
  else await save();
  throw new AppError(locks ? 'RATE_LIMITED' : 'INVALID_CREDENTIALS');
}

async function login({ email, password }: Credentials, deps: Deps & { defer?: Defer }): Promise<SessionToken> {
  const account = await findAccount(email, deps);
  const valid = await verifyPassword(password, account?.passwordHash ?? (await timingFallback()));
  if (!account) throw new AppError('INVALID_CREDENTIALS');
  if (isLocked(account, deps.now())) throw new AppError('RATE_LIMITED');
  if (!valid) return registerFailure(account, { now: deps.now(), defer: deps.defer });
  if (account.failedAttempts > 0 || account.lockedUntil !== null) await saveIgnoringRace(account, { failedAttempts: 0, lockedUntil: null });
  if (!account.verified) throw new AppError('EMAIL_NOT_VERIFIED');
  return { subjectId: account.id, sessionVersion: account.sessionVersion, role: account.role };
}

export function createAuthService(deps: Deps): AuthService {
  return { login: (credentials, defer) => login(credentials, { ...deps, defer }) };
}

export const authService = createAuthService({ repository: adminRepository, patients: patientLoginSource, now: () => new Date() });
