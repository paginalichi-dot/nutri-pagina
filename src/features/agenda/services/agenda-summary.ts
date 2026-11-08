import { addDays, argentinaInstant, startOfWeek, todayInArgentina } from '@/lib/argentina-time';
import { argentinaDay } from '@/lib/format-date-time';
import { whatsappNumber } from '@/lib/whatsapp';
import type { AgendaSummary, AppointmentRow, PatientContact, TimeRange } from '../domain/appointment.schema';
import type { AgendaRepository, WeeklySlot } from '../repository/agenda.repository';
import { availableSlots } from './availability';

type DayTime = { day: string; hours: readonly WeeklySlot[]; slotMinutes: number; blocks: readonly TimeRange[]; appointments: readonly TimeRange[] };

const patientKeys = ({ phone, email }: PatientContact): string[] => [`tel:${whatsappNumber(phone)}`, ...(email ? [`mail:${email.toLowerCase()}`] : [])];

export function countNewPatients(week: readonly PatientContact[], prior: readonly PatientContact[]): number {
  const known = new Set(prior.flatMap(patientKeys));
  let count = 0;
  for (const contact of week) {
    const keys = patientKeys(contact);
    if (!keys.some((key) => known.has(key))) count += 1;
    keys.forEach((key) => known.add(key));
  }
  return count;
}

export function dayTime({ day, hours, slotMinutes, blocks, appointments }: DayTime): { freeMinutes: number; availableMinutes: number } {
  const bookable = (busy: readonly TimeRange[]): number => availableSlots({ day, hours, slotMinutes, busy, now: argentinaInstant(day, 0), scope: 'panel' }).length * slotMinutes;
  return { availableMinutes: bookable(blocks), freeMinutes: bookable([...blocks, ...appointments]) };
}

const dayRange = (day: string, days = 1): TimeRange => ({ startsAt: argentinaInstant(day, 0), endsAt: argentinaInstant(addDays(day, days), 0) });

const contact = ({ patientPhone, patientEmail }: AppointmentRow): PatientContact => ({ phone: patientPhone, email: patientEmail });

export async function agendaSummary(repository: AgendaRepository, now: Date): Promise<AgendaSummary> {
  const today = todayInArgentina(now);
  const monday = startOfWeek(today);
  const [rows, blocks, hours, slotMinutes, prior, next] = await Promise.all([repository.listAppointments(dayRange(addDays(monday, -7), 14)), repository.listBlocks(dayRange(today)), repository.listActiveHours(), repository.getSlotMinutes(), repository.listContactsBefore(argentinaInstant(monday, 0)), repository.findNextActive(now)]);
  const active = rows.filter(({ status }) => status !== 'CANCELLED');
  const on = (from: string, days = 1): AppointmentRow[] => active.filter(({ startsAt }) => argentinaDay(startsAt) >= from && argentinaDay(startsAt) < addDays(from, days));
  const week = on(monday, 7);
  return {
    today: { count: on(today).length, yesterday: on(addDays(today, -1)).length },
    week: { count: week.length, previous: on(addDays(monday, -7), 7).length },
    newPatients: countNewPatients(week.map(contact), prior),
    time: slotMinutes === null ? null : dayTime({ day: today, hours, slotMinutes, blocks, appointments: on(today) }),
    next,
  };
}
