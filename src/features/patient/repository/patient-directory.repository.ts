import { db } from '@/lib/db';
import { type DirectoryAccount, DirectoryAccountSchema, type DirectoryVisit, DirectoryVisitSchema } from '../domain/patient-directory.schema';

export type PatientDirectoryRepository = {
  listAccounts(): Promise<DirectoryAccount[]>;
  listVisits(): Promise<DirectoryVisit[]>;
};

const VISIT = {
  id: true,
  startsAt: true,
  status: true,
  patientName: true,
  patientPhone: true,
  patientEmail: true,
  location: { select: { name: true } },
  healthInsurance: { select: { name: true } },
} as const;

export const patientDirectoryRepository: PatientDirectoryRepository = {
  async listAccounts() {
    const rows = await db.patient.findMany({ where: { emailVerifiedAt: { not: null } }, select: { id: true, name: true, email: true, phone: true, createdAt: true } });
    return rows.map((row) => DirectoryAccountSchema.parse(row));
  },

  async listVisits() {
    const rows = await db.appointment.findMany({ select: VISIT, orderBy: { startsAt: 'asc' } });
    return rows.map(({ location, healthInsurance, ...row }) => DirectoryVisitSchema.parse({ ...row, locationName: location.name, healthInsurance: healthInsurance?.name ?? null }));
  },
};
