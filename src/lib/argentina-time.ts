import { argentinaDay, argentinaTime } from './format-date-time';

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const MINUTE_MS = 60_000;

export const MINUTES_PER_DAY = 1440;

export const WEEKDAY_NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'] as const;

const utcMidnight = (day: string): Date => new Date(`${day}T00:00:00Z`);

export function isArgentinaDay(value: string): boolean {
  if (!DAY_PATTERN.test(value)) return false;
  const date = utcMidnight(value);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function argentinaInstant(day: string, minute: number): Date {
  // Por qué: Argentina no usa horario de verano desde 2009; si vuelve, este desplazamiento fijo pasa a salir de Intl.
  return new Date(Date.parse(`${day}T00:00:00-03:00`) + minute * MINUTE_MS);
}

export function argentinaWeekday(day: string): number {
  const weekday = utcMidnight(day).getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

export function addDays(day: string, days: number): string {
  const date = utcMidnight(day);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function startOfWeek(day: string): string {
  return addDays(day, 1 - argentinaWeekday(day));
}

export function minuteOfDay(value: Date): number {
  return timeToMinutes(argentinaTime(value)) ?? 0;
}

export function todayInArgentina(now: Date): string {
  return argentinaDay(now);
}

export function timeToMinutes(value: string): number | null {
  const match = TIME_PATTERN.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export function addMinutes(value: Date, minutes: number): Date {
  return new Date(value.getTime() + minutes * MINUTE_MS);
}

export function longDay(day: string): string {
  return new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(utcMidnight(day));
}

export function whenText(value: Date): string {
  return `${longDay(argentinaDay(value))} a las ${argentinaTime(value)}`;
}
