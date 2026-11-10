import { pendingSeedDay, SEED_LOCATIONS } from '@/features/agenda/testing/seed-test-agenda';
import { hashPassword } from '@/lib/auth/password';
import { addDays, addMinutes, argentinaInstant } from '@/lib/argentina-time';
import { db } from '@/lib/db';
import { TEST_PATIENT } from './test-patient';

async function seedAppointment(startsAt: Date, status: 'CONFIRMED' | 'ATTENDED'): Promise<void> {
  const centro = await db.location.findFirst({ where: { name: SEED_LOCATIONS.centro.name }, select: { id: true } });
  if (!centro || (await db.appointment.findFirst({ where: { startsAt, status: { not: 'CANCELLED' } } }))) return;
  const patient = { patientName: TEST_PATIENT.name, patientPhone: TEST_PATIENT.phone, patientEmail: TEST_PATIENT.email };
  await db.appointment.create({ data: { locationId: centro.id, startsAt, endsAt: addMinutes(startsAt, 45), status, source: 'PANEL', ...patient } });
}

export async function seedTestPatient(appEnv: string | undefined): Promise<void> {
  if (appEnv === 'production') throw new Error('El seed sólo carga datos ficticios: no corre con APP_ENV=production.');
  if (appEnv === 'test') await Promise.all([db.patient.deleteMany(), db.rateLimit.deleteMany()]);
  const now = new Date();
  const passwordHash = await hashPassword(TEST_PATIENT.password);
  const account = { name: TEST_PATIENT.name, phone: TEST_PATIENT.phone, passwordHash, emailVerifiedAt: now, consentAt: now };
  await db.patient.upsert({ where: { email: TEST_PATIENT.email }, create: { email: TEST_PATIENT.email, ...account }, update: { ...account, failedAttempts: 0, lockedUntil: null } });
  const day = pendingSeedDay(now);
  await seedAppointment(argentinaInstant(day, 11 * 60 + 15), 'CONFIRMED');
  await seedAppointment(argentinaInstant(addDays(day, -7), 9 * 60), 'ATTENDED');
}
