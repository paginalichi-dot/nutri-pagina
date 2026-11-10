import { addDays, addMinutes } from '@/lib/argentina-time';
import { AppError } from '@/lib/errors';
import { argentinaDay } from '@/lib/format-date-time';
import type { AgendaRepository } from '../repository/agenda.repository';
import { availableSlots, bookingWindow } from './availability';

function daysBetween(first: string, last: string): string[] {
  const days: string[] = [];
  for (let day = first; day <= last; day = addDays(day, 1)) days.push(day);
  return days;
}

export async function bookableDays(repository: AgendaRepository, { locationId, now }: { locationId: string; now: Date }): Promise<string[]> {
  const [schedule, slotMinutes] = await Promise.all([repository.findSchedule(locationId), repository.getSlotMinutes()]);
  if (slotMinutes === null) throw new AppError('NO_SLOT_DURATION');
  if (!schedule?.active) return [];
  const { earliest, latest } = bookingWindow(now, 'public');
  const busy = await repository.listBusy({ startsAt: earliest, endsAt: addMinutes(latest, slotMinutes) }, null);
  const free = (day: string): boolean => availableSlots({ day, hours: schedule.hours, slotMinutes, busy, now, scope: 'public' }).length > 0;
  return daysBetween(argentinaDay(earliest), argentinaDay(latest)).filter(free);
}
