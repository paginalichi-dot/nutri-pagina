import { z } from 'zod';
import { EmailSchema } from './login.schema';

const CurrentPasswordSchema = z.string().min(1, { error: 'Ingresá tu contraseña actual.' }).max(128, { error: 'La contraseña es demasiado larga.' });

export const ChangeEmailInputSchema = z.strictObject({
  email: EmailSchema,
  currentPassword: CurrentPasswordSchema,
});

export const ChangePasswordInputSchema = z
  .strictObject({
    currentPassword: CurrentPasswordSchema,
    newPassword: z
      .string()
      .min(8, { error: 'La contraseña nueva tiene que tener al menos 8 caracteres.' })
      .max(128, { error: 'La contraseña es demasiado larga.' }),
    confirmPassword: z.string(),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    error: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export type ChangeEmailInput = z.infer<typeof ChangeEmailInputSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordInputSchema>;
