import 'server-only';
import { z } from 'zod';
import { guardAdminPage } from '@/features/auth/actions/require-admin';
import type { DirectoryEntry, PatientFile } from '../domain/patient-directory.schema';
import { patientDirectoryService } from '../services/patient-directory.service';

export async function getPatientDirectory(): Promise<DirectoryEntry[]> {
  await guardAdminPage();
  return patientDirectoryService.list();
}

export async function getPatientFile(id: string): Promise<PatientFile | null> {
  await guardAdminPage();
  if (!z.uuid().safeParse(id).success) return null;
  return patientDirectoryService.file(id);
}
