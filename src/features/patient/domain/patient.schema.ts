import { z } from 'zod';
import { PhoneSchema } from '@/features/agenda/domain/booking.schema';
import { EmailSchema } from '@/features/auth/domain/login.schema';

export const TOKEN_PURPOSES = ['VERIFY_EMAIL', 'RESET_PASSWORD', 'CHANGE_EMAIL'] as const;

export type TokenPurpose = (typeof TOKEN_PURPOSES)[number];

export const TOKEN_HOURS: Readonly<Record<TokenPurpose, number>> = { VERIFY_EMAIL: 24, RESET_PASSWORD: 1, CHANGE_EMAIL: 24 };

export const PatientRowSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  passwordHash: z.string().min(1),
  emailVerifiedAt: z.date().nullable(),
  sessionVersion: z.int().positive(),
  failedAttempts: z.int().nonnegative(),
  lockedUntil: z.date().nullable(),
  version: z.int().positive(),
});

export type PatientRow = z.infer<typeof PatientRowSchema>;

export type PatientProfile = Pick<PatientRow, 'id' | 'name' | 'email' | 'phone' | 'version'>;

export type PatientClaims = { patientId: string; sessionVersion: number };

export const NameSchema = z.string().trim().min(1, { error: 'Ingresá tu nombre.' }).max(80, { error: 'El nombre es demasiado largo (máximo 80 caracteres).' });

export const NewPasswordSchema = z
  .string()
  .min(8, { error: 'La contraseña tiene que tener al menos 8 caracteres.' })
  .max(128, { error: 'La contraseña es demasiado larga.' });

const CurrentPasswordSchema = z.string().min(1, { error: 'Ingresá tu contraseña.' }).max(128, { error: 'La contraseña es demasiado larga.' });

const Honeypot = z.literal('', { error: 'Revisá los datos ingresados.' });

export const TokenSchema = z.string().regex(/^[\w-]{43}$/, { error: 'El link no es válido o ya venció.' });

export const RegisterInputSchema = z.strictObject({
  name: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  password: NewPasswordSchema,
  consent: z.literal('on', { error: 'Para crear tu cuenta tenés que aceptar la política de privacidad.' }),
  website: Honeypot,
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const EmailRequestSchema = z.strictObject({ email: EmailSchema, website: Honeypot });

export const TokenActionSchema = z.strictObject({ token: TokenSchema, website: Honeypot });

export const ResetPasswordInputSchema = z.strictObject({ token: TokenSchema, password: NewPasswordSchema, website: Honeypot });

export const ProfileInputSchema = z.strictObject({ name: NameSchema, phone: PhoneSchema, version: z.coerce.number().int().positive() });

export type ProfileInput = z.infer<typeof ProfileInputSchema>;

export const EmailChangeInputSchema = z.strictObject({ email: EmailSchema, currentPassword: CurrentPasswordSchema });

export type EmailChangeInput = z.infer<typeof EmailChangeInputSchema>;

export const DeleteAccountInputSchema = z.strictObject({
  currentPassword: CurrentPasswordSchema,
  confirm: z.literal('on', { error: 'Confirmá que querés eliminar tu cuenta.' }),
});
