import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { AppError, isAppError } from '@/lib/errors';
import type { AdminCredentialsRow, LoginState, SessionClaims } from '../domain/admin.schema';
import type { LoginInput } from '../domain/login.schema';
import { type AdminRepository, adminRepository } from '../repository/admin.repository';

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

type Credentials = Pick<LoginInput, 'email' | 'password'>;
type Deps = { repository: AdminRepository; now: () => Date };

export type AuthService = { login(credentials: Credentials): Promise<SessionClaims> };

let fallbackHash: Promise<string> | undefined;
const timingFallback = (): Promise<string> => (fallbackHash ??= hashPassword('relleno-para-que-el-tiempo-sea-parejo'));

const isLocked = (admin: AdminCredentialsRow, now: Date): boolean => admin.lockedUntil !== null && admin.lockedUntil > now;

async function saveIgnoringRace(repository: AdminRepository, state: LoginState): Promise<void> {
  try {
    await repository.saveLoginState(state);
  } catch (error) {
    if (!isAppError(error) || error.code !== 'STALE_VERSION') throw error;
  }
}

async function registerFailure(admin: AdminCredentialsRow, { repository, now }: Deps): Promise<never> {
  const failedAttempts = (admin.lockedUntil === null ? admin.failedAttempts : 0) + 1;
  const locks = failedAttempts >= MAX_FAILED_ATTEMPTS;
  const lockedUntil = locks ? new Date(now().getTime() + LOCK_MINUTES * 60_000) : null;
  await saveIgnoringRace(repository, { id: admin.id, version: admin.version, failedAttempts, lockedUntil });
  throw new AppError(locks ? 'RATE_LIMITED' : 'INVALID_CREDENTIALS');
}

async function login({ email, password }: Credentials, deps: Deps): Promise<SessionClaims> {
  const admin = await deps.repository.findCredentialsByEmail(email);
  const valid = await verifyPassword(password, admin?.passwordHash ?? (await timingFallback()));
  if (!admin) throw new AppError('INVALID_CREDENTIALS');
  if (isLocked(admin, deps.now())) throw new AppError('RATE_LIMITED');
  if (!valid) return registerFailure(admin, deps);
  if (admin.failedAttempts > 0 || admin.lockedUntil !== null) {
    await saveIgnoringRace(deps.repository, { id: admin.id, version: admin.version, failedAttempts: 0, lockedUntil: null });
  }
  return { adminId: admin.id, sessionVersion: admin.sessionVersion };
}

export function createAuthService(deps: Deps): AuthService {
  return { login: (credentials) => login(credentials, deps) };
}

export const authService = createAuthService({ repository: adminRepository, now: () => new Date() });
