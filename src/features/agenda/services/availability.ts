import { addMinutes, argentinaInstant, argentinaWeekday } from '@/lib/argentina-time';
import type { TimeRange } from '../domain/appointment.schema';
import type { GridSlot } from '../domain/booking.schema';

export const MIN_NOTICE_HOURS = 12;
export const HORIZON_DAYS = 60;

export type AvailabilityScope = 'public' | 'panel';

export type WeeklyRange = { weekday: number; startMinute: number; endMinute: number };

export type AvailabilityInput = {
  day: string;
  hours: readonly WeeklyRange[];
  slotMinutes: number;
  busy: readonly TimeRange[];
  now: Date;
  scope: AvailabilityScope;
};

const overlaps = (a: TimeRange, b: TimeRange): boolean => a.startsAt < b.endsAt && b.startsAt < a.endsAt;

export function bookingWindow(now: Date, scope: AvailabilityScope): { earliest: Date; latest: Date } {
  const earliest = scope === 'public' ? addMinutes(now, MIN_NOTICE_HOURS * 60) : now;
  return { earliest, latest: addMinutes(now, HORIZON_DAYS * 24 * 60) };
}

function rangeStarts(day: string, range: WeeklyRange, slotMinutes: number): Date[] {
  const starts: Date[] = [];
  for (let minute = range.startMinute; minute + slotMinutes <= range.endMinute; minute += slotMinutes) starts.push(argentinaInstant(day, minute));
  return starts;
}

export function slotGrid({ day, hours, slotMinutes, busy, now, scope }: AvailabilityInput): GridSlot[] {
  const { earliest, latest } = bookingWindow(now, scope);
  const weekday = argentinaWeekday(day);
  return hours
    .filter((range) => range.weekday === weekday)
    .toSorted((a, b) => a.startMinute - b.startMinute)
    .flatMap((range) => rangeStarts(day, range, slotMinutes))
    .filter((startsAt) => startsAt >= earliest && startsAt <= latest)
    .map((startsAt) => ({ startsAt, free: !busy.some((taken) => overlaps({ startsAt, endsAt: addMinutes(startsAt, slotMinutes) }, taken)) }));
}

export const availableSlots = (input: AvailabilityInput): Date[] => slotGrid(input).flatMap(({ startsAt, free }) => (free ? [startsAt] : []));
