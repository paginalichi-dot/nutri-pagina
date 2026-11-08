import { z } from 'zod';

export const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Ingresá un email válido.' }).max(254, { error: 'El email es demasiado largo.' }));

export const LoginInputSchema = z.strictObject({
  email: EmailSchema,
  password: z.string().min(1, { error: 'Ingresá tu contraseña.' }).max(128, { error: 'La contraseña es demasiado larga.' }),
  website: z.literal('', { error: 'Revisá los datos ingresados.' }),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
