import { db } from '@/lib/db';

export async function resetAgendaTables(): Promise<void> {
  await db.appointment.deleteMany();
  await db.timeBlock.deleteMany();
  await db.weeklyHours.deleteMany();
  await db.location.deleteMany();
  await db.healthInsurance.deleteMany();
  await db.agendaSettings.deleteMany();
}
