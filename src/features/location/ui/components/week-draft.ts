import { timeToMinutes, WEEKDAY_NAMES } from '@/lib/argentina-time';

export type DraftRange = { key: number; start: string; end: string };
export type WeekDraft = readonly DraftRange[][];

export const EMPTY_WEEK: WeekDraft = WEEKDAY_NAMES.map(() => []);

const length = ({ start, end }: DraftRange): number => {
  const [from, to] = [timeToMinutes(start), timeToMinutes(end)];
  return from !== null && to !== null && to > from ? to - from : 0;
};

export function weeklyHours(week: WeekDraft): string {
  const minutes = week.flat().reduce((total, range) => total + length(range), 0);
  return (Math.round((minutes / 60) * 10) / 10).toLocaleString('es-AR');
}

export function weekSummary(week: WeekDraft): { day: string; ranges: string }[] {
  return week.flatMap((ranges, index) => {
    const valid = ranges.filter((range) => length(range) > 0);
    return valid.length > 0 ? [{ day: WEEKDAY_NAMES[index] ?? '', ranges: valid.map(({ start, end }) => `${start} – ${end}`).join(' · ') }] : [];
  });
}

export function withDay(week: WeekDraft, weekday: number, ranges: DraftRange[]): WeekDraft {
  return week.map((current, index) => (index === weekday ? ranges : current));
}
