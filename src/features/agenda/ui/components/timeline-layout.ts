import { addDays, argentinaInstant, MINUTES_PER_DAY, minuteOfDay } from '@/lib/argentina-time';
import type { TimeRange } from '../../domain/appointment.schema';

export const HOUR_HEIGHT = 64;
const MIN_HEIGHT = 34;
const DEFAULT_SPAN = { first: 8, last: 18 };

export type DayMinutes = { start: number; end: number };

export function onDay(day: string): (item: TimeRange) => boolean {
  const [start, end] = [argentinaInstant(day, 0), argentinaInstant(addDays(day, 1), 0)];
  return (item) => item.startsAt < end && item.endsAt > start;
}

export function dayMinutes(day: string, { startsAt, endsAt }: TimeRange): DayMinutes {
  const start = startsAt <= argentinaInstant(day, 0) ? 0 : minuteOfDay(startsAt);
  const end = endsAt >= argentinaInstant(addDays(day, 1), 0) ? MINUTES_PER_DAY : minuteOfDay(endsAt);
  return { start, end };
}

export function hourSpan(items: readonly DayMinutes[]): { first: number; last: number } {
  const first = Math.min(DEFAULT_SPAN.first, ...items.map(({ start }) => Math.floor(start / 60)));
  const last = Math.max(DEFAULT_SPAN.last, ...items.map(({ end }) => Math.ceil(end / 60)));
  return { first, last };
}

const BAND_HOURS = 4;
const DEFAULT_BANDS = { first: 8, last: 20 };

export const bandOf = (minute: number): number => Math.floor(minute / (BAND_HOURS * 60)) * BAND_HOURS;

export const touchesBand = ({ start, end }: DayMinutes, band: number): boolean => start < (band + BAND_HOURS) * 60 && end > band * 60;

export function bandStarts(items: readonly DayMinutes[]): number[] {
  const first = Math.min(DEFAULT_BANDS.first, ...items.map(({ start }) => bandOf(start)));
  const last = Math.max(DEFAULT_BANDS.last, ...items.map(({ end }) => Math.ceil(end / (BAND_HOURS * 60)) * BAND_HOURS));
  return Array.from({ length: (last - first) / BAND_HOURS }, (_, index) => first + index * BAND_HOURS);
}

export function placement({ start, end }: DayMinutes, firstHour: number): { top: number; height: number } {
  return { top: ((start - firstHour * 60) * HOUR_HEIGHT) / 60, height: Math.max(((end - start) * HOUR_HEIGHT) / 60, MIN_HEIGHT) };
}
