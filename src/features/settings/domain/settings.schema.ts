import { z } from 'zod';

const DURATION_ERROR = 'Ingresá los minutos como un número entero mayor que 0.';
const MAX_INT = 2_147_483_647;

export const SlotMinutesInputSchema = z.strictObject({
  slotMinutes: z
    .string({ error: DURATION_ERROR })
    .trim()
    .regex(/^\d+$/, { error: DURATION_ERROR })
    .transform(Number)
    .pipe(z.int().min(1, { error: DURATION_ERROR }).max(MAX_INT, { error: DURATION_ERROR })),
  version: z.coerce.number<unknown>().int().nonnegative({ error: 'El registro no es válido.' }),
});

export const AgendaSettingsRowSchema = z.object({ slotMinutes: z.int().positive(), version: z.int().positive() });

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
export type HealthInsuranceUsage = HealthInsuranceRow & { appointments: number };
