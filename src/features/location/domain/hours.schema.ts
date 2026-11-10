import { z } from 'zod';
import { timeToMinutes } from '@/lib/argentina-time';
import { RecordRefSchema } from '@/lib/record-ref';

const TimeSchema = z.string().trim().refine((value) => timeToMinutes(value) !== null, { error: 'Ingresá una hora válida (hh:mm).' });
const WeekdaySchema = z.coerce.number<unknown>().int().min(1, { error: 'Elegí un día de la semana.' }).max(7, { error: 'Elegí un día de la semana.' });
const ORDER_ERROR = { error: 'La hora de fin tiene que ser posterior a la de inicio.', path: ['end'] };

const minutes = ({ start, end }: { start: string; end: string }): { startMinute: number; endMinute: number } => ({ startMinute: timeToMinutes(start) ?? 0, endMinute: timeToMinutes(end) ?? 0 });
const ordered = ({ startMinute, endMinute }: { startMinute: number; endMinute: number }): boolean => startMinute < endMinute;

export const WeeklyHoursInputSchema = z
  .strictObject({ locationId: z.uuid({ error: 'La ubicación no es válida.' }), weekday: WeekdaySchema, start: TimeSchema, end: TimeSchema })
  .transform(({ locationId, weekday, ...times }) => ({ locationId, weekday, ...minutes(times) }))
  .refine(ordered, ORDER_ERROR);

export const HoursRangeSchema = z
  .strictObject({ weekday: WeekdaySchema, start: TimeSchema, end: TimeSchema })
  .transform(({ weekday, ...times }) => ({ weekday, ...minutes(times) }))
  .refine(ordered, ORDER_ERROR);

export const WeeklyHoursUpdateSchema = RecordRefSchema.extend({ start: TimeSchema, end: TimeSchema })
  .transform(({ id, version, ...times }) => ({ ref: { id, version }, range: minutes(times) }))
  .refine(({ range }) => ordered(range), ORDER_ERROR);

export const WeeklyHoursRowSchema = z.object({
  id: z.uuid(),
  locationId: z.uuid(),
  weekday: z.int().min(1).max(7),
  startMinute: z.int().min(0).max(1439),
  endMinute: z.int().min(1).max(1440),
  version: z.int().positive(),
});

export type WeeklyHoursInput = z.infer<typeof WeeklyHoursInputSchema>;
export type HoursRange = z.infer<typeof HoursRangeSchema>;
export type MinuteRange = { startMinute: number; endMinute: number };
export type WeeklyHoursRow = z.infer<typeof WeeklyHoursRowSchema>;
