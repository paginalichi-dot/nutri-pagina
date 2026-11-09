import { db } from '@/lib/db';
import { AppError } from '@/lib/errors';
import { type PatientRow, PatientRowSchema } from '../domain/patient.schema';

export type NewPatient = Pick<PatientRow, 'name' | 'email' | 'phone' | 'passwordHash'> & { consentAt: Date };

export type PatientChange = Pick<PatientRow, 'id' | 'version'> &
  Partial<Pick<PatientRow, 'name' | 'phone' | 'passwordHash' | 'failedAttempts' | 'lockedUntil' | 'emailVerifiedAt'>> & {
    consentAt?: Date;
    endSessions?: boolean;
  };

export type PatientRepository = {
  findByEmail(email: string): Promise<PatientRow | null>;
  findById(id: string): Promise<PatientRow | null>;
  create(patient: NewPatient): Promise<string>;
  update(change: PatientChange): Promise<void>;
  remove(patient: Pick<PatientRow, 'id' | 'version'>): Promise<void>;
};

const ROW = {
  id: true,
  name: true,
  email: true,
  phone: true,
  passwordHash: true,
  emailVerifiedAt: true,
  sessionVersion: true,
  failedAttempts: true,
  lockedUntil: true,
  version: true,
} as const;

async function findOne(where: { email: string } | { id: string }): Promise<PatientRow | null> {
  const row = await db.patient.findUnique({ where, select: ROW });
  return row ? PatientRowSchema.parse(row) : null;
}

export const patientRepository: PatientRepository = {
  findByEmail: (email) => findOne({ email }),

  findById: (id) => findOne({ id }),

  async create(patient) {
    const { id } = await db.patient.create({ data: patient, select: { id: true } });
    return id;
  },

  async update({ id, version, endSessions = false, ...fields }) {
    const sessionVersion = endSessions ? { increment: 1 } : undefined;
    const { count } = await db.patient.updateMany({ where: { id, version }, data: { ...fields, sessionVersion, version: { increment: 1 } } });
    if (count === 0) throw new AppError('STALE_VERSION');
  },

  async remove({ id, version }) {
    const { count } = await db.patient.deleteMany({ where: { id, version } });
    if (count === 0) throw new AppError('STALE_VERSION');
  },
};
