import type { PatientLoginSource } from '@/features/auth/domain/admin.schema';
import { type PatientRepository, patientRepository } from '../repository/patient.repository';

export function createPatientLoginSource(repository: Pick<PatientRepository, 'findByEmail' | 'update'>): PatientLoginSource {
  return {
    async findLoginAccount(email) {
      const patient = await repository.findByEmail(email);
      if (!patient) return null;
      const { id, passwordHash, sessionVersion, failedAttempts, lockedUntil, version, emailVerifiedAt } = patient;
      return { id, passwordHash, sessionVersion, failedAttempts, lockedUntil, version, verified: emailVerifiedAt !== null };
    },
    saveLoginState: (state) => repository.update(state),
  };
}

export const patientLoginSource = createPatientLoginSource(patientRepository);
