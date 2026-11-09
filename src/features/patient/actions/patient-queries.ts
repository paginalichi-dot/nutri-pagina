import 'server-only';
import type { PatientProfile } from '../domain/patient.schema';
import { patientAccountService } from '../services/patient-account.service';
import { guardPatientPage } from './require-patient';

export async function getMyProfile(): Promise<PatientProfile> {
  const { patientId } = await guardPatientPage();
  return patientAccountService().profile(patientId);
}
