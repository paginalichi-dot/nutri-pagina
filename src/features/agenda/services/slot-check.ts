import { addDays, argentinaInstant } from '@/lib/argentina-time';
import { AppError } from '@/lib/errors';
import { argentinaDay } from '@/lib/format-date-time';
import type { AppointmentDetail } from '../domain/appointment.schema';
import type { AgendaRepository } from '../repository/agenda.repository';
import { type AvailabilityScope, availableSlots } from './availability';

type SlotRequest = { locationId: string; day: string; scope: AvailabilityScope; now: Date; ignoreId: string | null };
type SlotCheck = { locationId: string; startsAt: Date; now: Date; ignoreId: string | null };

export async function slotsFor(repository: AgendaRepository, { locationId, day, scope, now, ignoreId }: SlotRequest): Promise<{ slots: Date[]; slotMinutes: number }> {
  const [schedule, slotMinutes] = await Promise.all([repository.findSchedule(locationId), repository.getSlotMinutes()]);
  if (slotMinutes === null) throw new AppError('NO_SLOT_DURATION');
  if (!schedule?.active) return { slots: [], slotMinutes };
  const busy = await repository.listBusy({ startsAt: argentinaInstant(day, 0), endsAt: argentinaInstant(addDays(day, 1), 0) }, ignoreId);
  return { slots: availableSlots({ day, hours: schedule.hours, slotMinutes, busy, now, scope }), slotMinutes };
}

export async function assertSlotAvailable(repository: AgendaRepository, { locationId, startsAt, now, ignoreId }: SlotCheck): Promise<number> {
  if (startsAt <= now) throw new AppError('SLOT_TOO_SOON');
  const { slots, slotMinutes } = await slotsFor(repository, { locationId, day: argentinaDay(startsAt), scope: 'panel', now, ignoreId });
  if (!slots.some((slot) => slot.getTime() === startsAt.getTime())) throw new AppError('SLOT_TAKEN');
  return slotMinutes;
}

export async function mustFind(repository: AgendaRepository, id: string): Promise<AppointmentDetail> {
  const detail = await repository.findAppointment(id);
  if (!detail) throw new AppError('NOT_FOUND', { entity: 'el turno' });
  return detail;
}
