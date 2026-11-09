import 'server-only';
import { redirect } from 'next/navigation';
import { readSessionToken } from '@/lib/auth/session-cookie';
import { isAppError } from '@/lib/errors';
import type { PatientClaims } from '../domain/patient.schema';
import { patientSessionService } from '../services/patient-session.service';

export type CurrentPatient = PatientClaims & { name: string; email: string };

export async function requirePatient(): Promise<CurrentPatient> {
  return patientSessionService.authenticate(await readSessionToken());
}

export async function currentPatient(): Promise<CurrentPatient | null> {
  try {
    return await requirePatient();
  } catch (error) {
    if (isAppError(error)) return null;
    throw error;
  }
}

export async function guardPatientPage(): Promise<CurrentPatient> {
  const patient = await currentPatient();
  if (!patient) redirect('/login');
  return patient;
}
