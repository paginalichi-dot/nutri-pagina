import { expect } from 'vitest';
import { createPatientLoginSource } from '@/features/patient/services/patient-login';
import { createFakePatientStore, type FakePatientStore } from '@/features/patient/testing/patient-store.fake';
import { type AuthService, createAuthService } from '../services/auth.service';
import { createFakeAdminRepository, type FakeAdmin, type FakeAdminRepository } from './admin-repository.fake';

export const NOW = new Date('2026-11-06T20:00:00Z');
export const EMAIL = 'admin@ejemplo.test';
export const ADMIN_ID = '7d3f8a3e-2f4b-4c1d-9a7e-1b2c3d4e5f60';

export type AuthFixture = { repository: FakeAdminRepository; admin: () => FakeAdmin; service: AuthService; store: FakePatientStore };

export function setupAuthService(passwordHash: string, overrides: Partial<FakeAdmin> = {}): AuthFixture {
  const repository = createFakeAdminRepository([
    { id: ADMIN_ID, email: EMAIL, passwordHash, sessionVersion: 2, failedAttempts: 0, lockedUntil: null, version: 1, ...overrides },
  ]);
  const admin = (): FakeAdmin => repository.admins.get(EMAIL) ?? expect.fail('falta el admin');
  const store = createFakePatientStore();
  const service = createAuthService({ repository, patients: createPatientLoginSource(store.patients), now: () => NOW });
  return { repository, admin, service, store };
}

export const minutesAfterNow = (minutes: number): Date => new Date(NOW.getTime() + minutes * 60_000);
