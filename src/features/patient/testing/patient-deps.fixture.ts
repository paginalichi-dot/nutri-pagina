import type { EmailMessage } from '@/lib/email/send-email';
import type { PatientDeps } from '../services/patient-deps';
import { createFakePatientStore, type FakePatientStore } from './patient-store.fake';

export const NOW = new Date('2026-11-09T12:00:00Z');
export const ADMIN_EMAIL = 'admin@ejemplo.test';

export type PatientFixture = { deps: PatientDeps; store: FakePatientStore; travel: (minutes: number) => void };

export function patientFixture(): PatientFixture {
  const store = createFakePatientStore();
  let now = NOW;
  const deps: PatientDeps = {
    patients: store.patients,
    tokens: store.links,
    now: () => now,
    appUrl: 'https://lisandro.test',
    isAdminEmail: async (email) => email === ADMIN_EMAIL,
  };
  const travel = (minutes: number): void => {
    now = new Date(now.getTime() + minutes * 60_000);
  };
  return { deps, store, travel };
}

export function linkOf(message: EmailMessage | null): { path: string; token: string } {
  const match = /https:\/\/lisandro\.test(\/[a-z-]+)\/([\w-]{43})/.exec(message?.text ?? '');
  if (!match?.[1] || !match[2]) throw new Error('El email no trae un link de un solo uso.');
  return { path: match[1], token: match[2] };
}
