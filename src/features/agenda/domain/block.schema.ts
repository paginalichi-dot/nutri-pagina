import { z } from 'zod';
import { argentinaInstant, isArgentinaDay, timeToMinutes } from '@/lib/argentina-time';

const LocalDateTimeSchema = z
  .string()
  .trim()
  .transform((value, context) => {
    const [day = '', time = ''] = value.split('T');
    const minutes = timeToMinutes(time.slice(0, 5));
    if (isArgentinaDay(day) && minutes !== null) return argentinaInstant(day, minutes);
    context.addIssue({ code: 'custom', message: 'Ingresá una fecha y una hora válidas.' });
    return z.NEVER;
  });

export const BlockInputSchema = z
  .strictObject({
    start: LocalDateTimeSchema,
    end: LocalDateTimeSchema,
    reason: z
      .string()
      .trim()
      .max(100, { error: 'El motivo es demasiado largo (máximo 100 caracteres).' })
      .transform((value) => (value === '' ? null : value)),
  })
  .transform(({ start, end, reason }) => ({ startsAt: start, endsAt: end, reason }))
  .refine(({ startsAt, endsAt }) => endsAt > startsAt, { error: 'El fin del bloqueo tiene que ser posterior al inicio.', path: ['end'] });

export const BlockRowSchema = z.object({ id: z.uuid(), startsAt: z.date(), endsAt: z.date(), reason: z.string().nullable(), version: z.int().positive() });

export type BlockInput = z.infer<typeof BlockInputSchema>;
export type BlockRow = z.infer<typeof BlockRowSchema>;
