import { z } from 'zod';
import { isArgentinaDay } from '@/lib/argentina-time';

const optionalUuid = z
  .string()
  .trim()
  .refine((value) => value === '' || z.uuid().safeParse(value).success, { error: 'Elegí una obra social de la lista.' })
  .transform((value) => (value === '' ? null : value));

export const PhoneSchema = z
  .string()
  .trim()
  .min(1, { error: 'Ingresá un teléfono.' })
  .max(20, { error: 'El teléfono es demasiado largo.' })
  .refine((value) => /^\+?[\d\s()-]+$/.test(value) && value.replace(/\D/g, '').length >= 10, {
    error: 'Ingresá el teléfono con código de área, por ejemplo 11 2345-6789.',
  });

const OptionalEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((value) => value === '' || (value.length <= 254 && z.email().safeParse(value).success), { error: 'Ingresá un email válido o dejalo vacío.' })
  .transform((value) => (value === '' ? null : value));

export const PatientInputSchema = z.strictObject({
  name: z.string().trim().min(1, { error: 'Ingresá el nombre del paciente.' }).max(80, { error: 'El nombre es demasiado largo (máximo 80 caracteres).' }),
  phone: PhoneSchema,
  email: OptionalEmailSchema,
  healthInsuranceId: optionalUuid,
});

export const SlotChoiceSchema = z.strictObject({
  locationId: z.uuid({ error: 'Elegí una ubicación.' }),
  startsAt: z.iso.datetime({ error: 'Elegí un horario.' }).transform((value) => new Date(value)),
});

export const SlotQuerySchema = z.strictObject({
  locationId: z.uuid({ error: 'Elegí una ubicación.' }),
  day: z.string().refine(isArgentinaDay, { error: 'Elegí un día.' }),
});

export const ManualAppointmentInputSchema = z.strictObject({ ...SlotChoiceSchema.shape, ...PatientInputSchema.shape });

export const OnlineBookingInputSchema = z.strictObject({ ...SlotChoiceSchema.shape, healthInsuranceId: optionalUuid });

export type PatientInput = z.infer<typeof PatientInputSchema>;
export type SlotChoice = z.infer<typeof SlotChoiceSchema>;
export type SlotQuery = z.infer<typeof SlotQuerySchema>;
export type ManualAppointmentInput = z.infer<typeof ManualAppointmentInputSchema>;
export type OnlineBookingInput = z.infer<typeof OnlineBookingInputSchema>;
export type GridSlot = { startsAt: Date; free: boolean };
