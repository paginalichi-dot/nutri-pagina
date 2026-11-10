'use server';

import { guardPublicAction } from '@/features/rate-limit/actions/guard-public-action';
import { type ActionResult, fail, failValidation } from '@/lib/action-result';
import { toActionFailure } from '@/lib/db-errors';
import { ResetPasswordInputSchema, TokenActionSchema } from '../domain/patient.schema';
import { passwordResetService } from '../services/password-reset.service';
import { patientAccountService } from '../services/patient-account.service';
import { registrationService } from '../services/registration.service';

type Redeem = (token: string) => Promise<void>;

async function redeemLink(formData: FormData, { redeem, message }: { redeem: Redeem; message: string }): Promise<ActionResult> {
  const parsed = TokenActionSchema.safeParse({ token: formData.get('token'), website: formData.get('website') });
  if (!parsed.success) return fail('INVALID_TOKEN');
  try {
    await guardPublicAction('link');
    await redeem(parsed.data.token);
    return { success: true, message };
  } catch (error) {
    return toActionFailure(error, 'el link');
  }
}

export async function verifyEmail(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return redeemLink(formData, { redeem: (token) => registrationService().verifyEmail(token), message: 'Listo. Tu cuenta está activa: ya podés entrar.' });
}

export async function confirmEmailChange(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const redeem: Redeem = (token) => patientAccountService().confirmEmailChange(token);
  return redeemLink(formData, { redeem, message: 'Listo. Tu email cambió: entrá de nuevo con el email nuevo.' });
}

export async function resetPassword(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = ResetPasswordInputSchema.safeParse({ token: formData.get('token'), password: formData.get('password'), website: formData.get('website') });
  if (!parsed.success) return parsed.error.issues.some(({ path }) => path[0] === 'token') ? fail('INVALID_TOKEN') : failValidation(parsed.error.issues[0]?.message);
  try {
    await guardPublicAction('link');
    await passwordResetService().resetPassword(parsed.data.token, parsed.data.password);
    return { success: true, message: 'Listo. Ya podés entrar con tu contraseña nueva.' };
  } catch (error) {
    return toActionFailure(error, 'tu contraseña');
  }
}
