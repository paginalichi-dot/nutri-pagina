import { z } from 'zod';
import { APPOINTMENT_STATUSES } from '@/features/agenda/domain/appointment.schema';

export const PATIENT_STATUSES = ['NEW', 'ACTIVE', 'INACTIVE'] as const;
export type PatientStatus = (typeof PATIENT_STATUSES)[number];

export const DirectoryAccountSchema = z.object({ id: z.uuid(), name: z.string(), email: z.string(), phone: z.string(), createdAt: z.date() });

export const DirectoryVisitSchema = z.object({
  id: z.uuid(),
  startsAt: z.date(),
  status: z.enum(APPOINTMENT_STATUSES),
  patientName: z.string(),
  patientPhone: z.string(),
  patientEmail: z.string().nullable(),
  locationName: z.string(),
  healthInsurance: z.string().nullable(),
});

export type DirectoryAccount = z.infer<typeof DirectoryAccountSchema>;
export type DirectoryVisit = z.infer<typeof DirectoryVisitSchema>;

export type DirectoryEntry = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  hasAccount: boolean;
  lastVisit: Date | null;
  nextVisit: Date | null;
  status: PatientStatus;
};

export type PatientFile = { entry: DirectoryEntry; upcoming: DirectoryVisit[]; past: DirectoryVisit[] };
