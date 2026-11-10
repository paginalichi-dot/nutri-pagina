'use server';

import { guardPublicAction } from '@/features/rate-limit/actions/guard-public-action';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { EmailRequestSchema, RegisterInputSchema } from '../domain/patient.schema';
import { registrationService } from '../services/registration.service';
import { sendLater } from './send-later';

const REGISTERED = 'Listo. Si los datos están bien, te mandamos un email para activar tu cuenta. Si no lo ves, revisá el correo no deseado.';
const RESENT = 'Si tu cuenta todavía no está activa, te mandamos un email nuevo con el link.';

const field = (formData: FormData, name: string): FormDataEntryValue | null => formData.get(name);

export async function register(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const names = ['name', 'email', 'phone', 'password', 'consent', 'website'] as const;
  const parsed = RegisterInputSchema.safeParse(Object.fromEntries(names.map((name) => [name, field(formData, name)])));
  if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
  try {
    await guardPublicAction('register', parsed.data.email);
    sendLater(await registrationService().register(parsed.data));
    return { success: true, message: REGISTERED };
  } catch (error) {
    return toActionFailure(error, 'tu registro');
  }
}

export async function resendVerification(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = EmailRequestSchema.safeParse({ email: field(formData, 'email'), website: field(formData, 'website') });
  if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
  try {
    await guardPublicAction('resend', parsed.data.email);
    sendLater(await registrationService().resendVerification(parsed.data.email));
    return { success: true, message: RESENT };
  } catch (error) {
    return toActionFailure(error, 'el envío del email');
  }
}
