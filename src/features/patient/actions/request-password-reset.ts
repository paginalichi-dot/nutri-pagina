'use server';

import { guardPublicAction } from '@/features/rate-limit/actions/guard-public-action';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { EmailRequestSchema } from '../domain/patient.schema';
import { passwordResetService } from '../services/password-reset.service';
import { sendLater } from './send-later';

export async function requestPasswordReset(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = EmailRequestSchema.safeParse({ email: formData.get('email'), website: formData.get('website') });
  if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
  try {
    await guardPublicAction('forgot', parsed.data.email);
    sendLater(await passwordResetService().requestReset(parsed.data.email));
    return { success: true, message: 'Si el email tiene una cuenta, te mandamos un link para elegir una contraseña nueva. Vence en 1 hora.' };
  } catch (error) {
    return toActionFailure(error, 'el pedido');
  }
}
