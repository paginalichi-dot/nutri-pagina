'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ChangePasswordInputSchema } from '@/features/auth/domain/account.schema';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { clearSessionCookie, startSession } from '@/lib/auth/session-cookie';
import { toActionFailure } from '@/lib/db-errors';
import { DeleteAccountInputSchema, EmailChangeInputSchema, ProfileInputSchema } from '../domain/patient.schema';
import { patientAccountService } from '../services/patient-account.service';
import { requirePatient } from './require-patient';
import { sendLater } from './send-later';

const fields = (formData: FormData, names: readonly string[]): Record<string, FormDataEntryValue | null> =>
  Object.fromEntries(names.map((name) => [name, formData.get(name)]));

export async function updateProfile(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const { patientId } = await requirePatient();
    const parsed = ProfileInputSchema.safeParse(fields(formData, ['name', 'phone', 'version']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await patientAccountService().updateProfile(patientId, parsed.data);
    revalidatePath('/mi-espacio');
    return { success: true, message: 'Guardamos tus datos.' };
  } catch (error) {
    return toActionFailure(error, 'tus datos');
  }
}

export async function changePatientPassword(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const { patientId } = await requirePatient();
    const parsed = ChangePasswordInputSchema.safeParse(fields(formData, ['currentPassword', 'newPassword', 'confirmPassword']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    const claims = await patientAccountService().changePassword(patientId, parsed.data);
    await startSession({ subjectId: claims.patientId, sessionVersion: claims.sessionVersion, role: 'patient' });
    return { success: true, message: 'Listo. Cambiamos tu contraseña y cerramos tus otras sesiones.' };
  } catch (error) {
    return toActionFailure(error, 'tu contraseña');
  }
}

export async function requestEmailChange(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const { patientId } = await requirePatient();
    const parsed = EmailChangeInputSchema.safeParse(fields(formData, ['email', 'currentPassword']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    sendLater(await patientAccountService().requestEmailChange(patientId, parsed.data));
    return { success: true, message: `Te mandamos un link a ${parsed.data.email}. El cambio se aplica cuando lo toques.` };
  } catch (error) {
    return toActionFailure(error, 'tu email');
  }
}

export async function deleteAccount(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const { patientId } = await requirePatient();
    const parsed = DeleteAccountInputSchema.safeParse(fields(formData, ['currentPassword', 'confirm']));
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await patientAccountService().deleteAccount(patientId, parsed.data.currentPassword);
    await clearSessionCookie();
  } catch (error) {
    return toActionFailure(error, 'tu cuenta');
  }
  redirect('/');
}
