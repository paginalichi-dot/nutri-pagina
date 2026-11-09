import type { PatientRow } from '../domain/patient.schema';
import type { FakePatientStore } from './patient-store.fake';

export const PATIENT_ID = '3b1f2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';

export const TEST_PATIENT = { name: 'Paciente de Prueba', email: 'paciente@ejemplo.test', phone: '11 2345-6789', password: 'clave-del-paciente' } as const;

export function addPatient(store: FakePatientStore, passwordHash: string, overrides: Partial<PatientRow> = {}): PatientRow {
  const row: PatientRow = {
    id: PATIENT_ID,
    name: TEST_PATIENT.name,
    email: TEST_PATIENT.email,
    phone: TEST_PATIENT.phone,
    passwordHash,
    emailVerifiedAt: new Date('2026-11-01T12:00:00Z'),
    sessionVersion: 1,
    failedAttempts: 0,
    lockedUntil: null,
    version: 1,
    ...overrides,
  };
  store.rows.set(row.id, row);
  return row;
}
