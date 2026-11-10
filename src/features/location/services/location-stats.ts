import { addDays, argentinaInstant, argentinaWeekday } from '@/lib/argentina-time';
import { argentinaDay, argentinaMonth } from '@/lib/format-date-time';
import type { WeeklyHoursRow } from '../domain/hours.schema';
import type { Instants, LocationStats, MonthActivity } from '../domain/new-location.schema';

type Weekly = Pick<WeeklyHoursRow, 'weekday' | 'startMinute' | 'endMinute'>;

export function argentinaMonthRange(now: Date): Instants {
  const { start, end } = argentinaMonth(now);
  return { startsAt: argentinaInstant(start, 0), endsAt: argentinaInstant(addDays(end, 1), 0) };
}

function daysBetween(first: string, last: string): string[] {
  const days: string[] = [];
  for (let day = first; day <= last; day = addDays(day, 1)) days.push(day);
  return days;
}

export function blockTouchesHours(block: Instants, hours: Weekly[], month: Instants): boolean {
  const from = Math.max(block.startsAt.getTime(), month.startsAt.getTime());
  const to = Math.min(block.endsAt.getTime(), month.endsAt.getTime());
  if (from >= to) return false;
  return daysBetween(argentinaDay(new Date(from)), argentinaDay(new Date(to - 1))).some((day) =>
    hours
      .filter(({ weekday }) => weekday === argentinaWeekday(day))
      .some(({ startMinute, endMinute }) => argentinaInstant(day, startMinute).getTime() < to && from < argentinaInstant(day, endMinute).getTime())
  );
}

export function locationStats(activity: MonthActivity, hours: Weekly[], month: Instants): LocationStats {
  return { appointmentsThisMonth: activity.appointments, blocksThisMonth: activity.blocks.filter((block) => blockTouchesHours(block, hours, month)).length };
}
