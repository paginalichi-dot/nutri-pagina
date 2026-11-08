import { z } from 'zod';
import { timeToMinutes } from '@/lib/argentina-time';

const TimeSchema = z.string().trim().refine((value) => timeToMinutes(value) !== null, { error: 'Ingresá una hora válida (hh:mm).' });

export const WeeklyHoursInputSchema = z
  .strictObject({
    locationId: z.uuid({ error: 'La ubicación no es válida.' }),
    weekday: z.coerce.number<unknown>().int().min(1, { error: 'Elegí un día de la semana.' }).max(7, { error: 'Elegí un día de la semana.' }),
    start: TimeSchema,
    end: TimeSchema,
  })
  .transform(({ locationId, weekday, start, end }) => ({ locationId, weekday, startMinute: timeToMinutes(start) ?? 0, endMinute: timeToMinutes(end) ?? 0 }))
  .refine(({ startMinute, endMinute }) => startMinute < endMinute, { error: 'La hora de fin tiene que ser posterior a la de inicio.', path: ['end'] });

export const WeeklyHoursRowSchema = z.object({
  id: z.uuid(),
  locationId: z.uuid(),
  weekday: z.int().min(1).max(7),
  startMinute: z.int().min(0).max(1439),
  endMinute: z.int().min(1).max(1440),
  version: z.int().positive(),
});

export type WeeklyHoursInput = z.infer<typeof WeeklyHoursInputSchema>;
export type WeeklyHoursRow = z.infer<typeof WeeklyHoursRowSchema>;
