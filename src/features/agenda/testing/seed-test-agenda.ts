import { addDays, addMinutes, argentinaInstant, argentinaWeekday, todayInArgentina } from '@/lib/argentina-time';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';

const WEEKDAYS = [1, 2, 3, 4, 5];

export const SEED_LOCATIONS = {
  centro: { name: 'Consultorio de ejemplo', kind: 'IN_PERSON', address: 'Calle Ficticia 123', directions: 'Piso 1, consultorio B', mapUrl: null, videoUrl: null },
  online: { name: 'Online de ejemplo', kind: 'ONLINE', address: null, directions: null, mapUrl: null, videoUrl: 'https://meet.example.test/sala-de-ejemplo' },
} as const;

export const PENDING_PATIENTS = ['Paciente pendiente 1', 'Paciente pendiente 2'] as const;

const HOURS = { centro: { startMinute: 9 * 60, endMinute: 13 * 60 }, online: { startMinute: 16 * 60, endMinute: 19 * 60 } } as const;

export function pendingSeedDay(now: Date): string {
  let day = addDays(todayInArgentina(now), 3);
  while (argentinaWeekday(day) > 5) day = addDays(day, 1);
  return day;
}

async function seedLocation(key: keyof typeof SEED_LOCATIONS): Promise<void> {
  if (await db.location.findFirst({ where: { name: SEED_LOCATIONS[key].name } })) return;
  const hours = WEEKDAYS.map((weekday) => ({ weekday, ...HOURS[key] }));
  await db.location.create({ data: { ...SEED_LOCATIONS[key], hours: { create: hours } } });
}

async function seedPending(now: Date): Promise<void> {
  const centro = await db.location.findFirst({ where: { name: SEED_LOCATIONS.centro.name }, select: { id: true } });
  if (!centro) return;
  for (const [index, patientName] of PENDING_PATIENTS.entries()) {
    const startsAt = argentinaInstant(pendingSeedDay(now), HOURS.centro.startMinute + index * 45);
    if (await db.appointment.findFirst({ where: { OR: [{ patientName, startsAt: { gt: now } }, { startsAt, status: { not: 'CANCELLED' } }] } })) continue;
    const patient = { patientName, patientPhone: `11 5555-000${index}`, patientEmail: null };
    await db.appointment.create({ data: { locationId: centro.id, startsAt, endsAt: addMinutes(startsAt, 45), status: 'PENDING', source: 'ONLINE', ...patient } });
  }
}

export async function seedTestAgenda(appEnv: string | undefined): Promise<void> {
  if (appEnv === 'production') throw new Error('El seed sólo carga datos ficticios: no corre con APP_ENV=production.');
  if (appEnv === 'test') await resetAgendaTables();
  await db.agendaSettings.upsert({ where: { id: 1 }, create: { id: 1, slotMinutes: 45 }, update: {} });
  for (const name of ['Obra Social de Ejemplo', 'Prepaga Ficticia']) {
    if (!(await db.healthInsurance.findFirst({ where: { name } }))) await db.healthInsurance.create({ data: { name } });
  }
  if ((await db.location.count()) > 0 && !(await db.location.findFirst({ where: { name: SEED_LOCATIONS.centro.name } }))) return;
  await seedLocation('centro');
  await seedLocation('online');
  await seedPending(new Date());
}
