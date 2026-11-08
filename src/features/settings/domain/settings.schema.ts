import { z } from 'zod';

const DURATION_ERROR = 'La duración va de 15 a 120 minutos.';

export const SlotMinutesInputSchema = z.strictObject({
  slotMinutes: z.coerce
    .number<unknown>({ error: DURATION_ERROR })
    .int({ error: DURATION_ERROR })
    .min(15, { error: DURATION_ERROR })
    .max(120, { error: DURATION_ERROR })
    .multipleOf(5, { error: 'Usá múltiplos de 5 minutos.' }),
  version: z.coerce.number<unknown>().int().nonnegative({ error: 'El registro no es válido.' }),
});

export const AgendaSettingsRowSchema = z.object({ slotMinutes: z.int().min(15).max(120), version: z.int().positive() });

export const HealthInsuranceInputSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Ingresá el nombre de la obra social.' })
    .max(60, { error: 'El nombre es demasiado largo (máximo 60 caracteres).' })
    .refine((name) => name.toLowerCase() !== 'particular', { error: '«Particular» ya está siempre como opción.' }),
});

export const HealthInsuranceRowSchema = z.object({ id: z.uuid(), name: z.string(), active: z.boolean(), version: z.int().positive() });

export type SlotMinutesInput = z.infer<typeof SlotMinutesInputSchema>;
export type AgendaSettingsRow = z.infer<typeof AgendaSettingsRowSchema>;
export type HealthInsuranceRow = z.infer<typeof HealthInsuranceRowSchema>;
