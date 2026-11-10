import { randomUUID } from 'node:crypto';
import { AppError } from '@/lib/errors';
import type { PatientRow } from '../domain/patient.schema';
import type { PatientChange, PatientRepository } from '../repository/patient.repository';
import type { IssuedToken, PatientTokenRepository, Redemption } from '../repository/patient-token.repository';

export type FakeToken = IssuedToken & { usedAt: Date | null };

export type FakePatientStore = { rows: Map<string, PatientRow>; tokens: FakeToken[]; patients: PatientRepository; links: PatientTokenRepository };

function versioned(rows: Map<string, PatientRow>, { id, version }: Pick<PatientRow, 'id' | 'version'>): PatientRow {
  const row = rows.get(id);
  if (!row || row.version !== version) throw new AppError('STALE_VERSION');
  return row;
}

const FIELDS = ['name', 'phone', 'passwordHash', 'failedAttempts', 'lockedUntil', 'emailVerifiedAt'] as const;

function applyChange(rows: Map<string, PatientRow>, change: PatientChange): void {
  const row = versioned(rows, change);
  for (const key of FIELDS) if (change[key] !== undefined) Object.assign(row, { [key]: change[key] });
  Object.assign(row, { version: row.version + 1, sessionVersion: row.sessionVersion + (change.endSessions ? 1 : 0) });
}

function fakePatients(rows: Map<string, PatientRow>): PatientRepository {
  const byEmail = (email: string): PatientRow | undefined => [...rows.values()].find((row) => row.email === email);
  const copy = (row: PatientRow | undefined): PatientRow | null => (row ? { ...row } : null);
  return {
    findByEmail: async (email) => copy(byEmail(email)),
    findById: async (id) => copy(rows.get(id)),
    async create({ name, email, phone, passwordHash }) {
      if (byEmail(email)) throw new AppError('DUPLICATE');
      const id = randomUUID();
      rows.set(id, { id, name, email, phone, passwordHash, emailVerifiedAt: null, sessionVersion: 1, failedAttempts: 0, lockedUntil: null, version: 1 });
      return id;
    },
    update: async (change) => applyChange(rows, change),
    async remove(patient) {
      versioned(rows, patient);
      rows.delete(patient.id);
    },
  };
}

function redeemFake(store: Pick<FakePatientStore, 'rows' | 'tokens'>, { tokenHash, purpose, now, effect }: Redemption): boolean {
  const token = store.tokens.find((item) => item.tokenHash === tokenHash && item.purpose === purpose && item.usedAt === null && item.expiresAt > now);
  const row = token ? store.rows.get(token.patientId) : undefined;
  if (!token || !row) return false;
  const email = effect.useNewEmail ? token.newEmail : null;
  if (email && [...store.rows.values()].some((other) => other.email === email)) throw new AppError('EMAIL_IN_USE');
  token.usedAt = now;
  const ends = effect.passwordHash !== undefined || email !== null;
  if (effect.verifyEmail) row.emailVerifiedAt = now;
  if (effect.passwordHash !== undefined) Object.assign(row, { passwordHash: effect.passwordHash, failedAttempts: 0, lockedUntil: null });
  if (email) row.email = email;
  Object.assign(row, { version: row.version + 1, sessionVersion: row.sessionVersion + (ends ? 1 : 0) });
  return true;
}

export function createFakePatientStore(): FakePatientStore {
  const rows = new Map<string, PatientRow>();
  const tokens: FakeToken[] = [];
  const links: PatientTokenRepository = {
    async issue(token) {
      for (const item of tokens) if (item.patientId === token.patientId && item.purpose === token.purpose && item.usedAt === null) item.usedAt = token.createdAt;
      tokens.push({ ...token, usedAt: null });
    },
    redeem: async (redemption) => redeemFake({ rows, tokens }, redemption),
  };
  return { rows, tokens, patients: fakePatients(rows), links };
}
