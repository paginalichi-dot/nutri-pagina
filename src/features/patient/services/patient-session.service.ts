import { verifySession } from '@/lib/auth/session-token';
import { AppError } from '@/lib/errors';
import type { PatientClaims } from '../domain/patient.schema';
import { type PatientRepository, patientRepository } from '../repository/patient.repository';

export type PatientSessionService = { authenticate(token: string | undefined): Promise<PatientClaims & { name: string; email: string }> };

export function createPatientSessionService(repository: Pick<PatientRepository, 'findById'>): PatientSessionService {
  return {
    async authenticate(token) {
      const claims = token ? await verifySession(token) : null;
      if (claims?.role !== 'patient') throw new AppError('UNAUTHENTICATED');
      const patient = await repository.findById(claims.subjectId);
      if (!patient?.emailVerifiedAt) throw new AppError('UNAUTHENTICATED');
      if (patient.sessionVersion !== claims.sessionVersion) throw new AppError('SESSION_EXPIRED');
      return { patientId: patient.id, sessionVersion: patient.sessionVersion, name: patient.name, email: patient.email };
    },
  };
}

export const patientSessionService = createPatientSessionService(patientRepository);
