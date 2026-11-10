'use server';

import { revalidatePath } from 'next/cache';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { startSession } from '@/lib/auth/session-cookie';
import { adminSession } from '../domain/admin.schema';
import { toActionFailure } from '@/lib/db-errors';
import { ChangeEmailInputSchema } from '../domain/account.schema';
import { accountService } from '../services/account.service';
import { requireAdmin } from './require-admin';

export async function changeEmail(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const { adminId } = await requireAdmin();
    const parsed = ChangeEmailInputSchema.safeParse({ email: formData.get('email'), currentPassword: formData.get('currentPassword') });
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await startSession(adminSession(await accountService.changeEmail(adminId, parsed.data)));
    revalidatePath('/admin', 'layout');
    return { success: true, message: `Listo. Desde ahora entrás con ${parsed.data.email}.` };
  } catch (error) {
    return toActionFailure(error, 'tu cuenta');
  }
}
