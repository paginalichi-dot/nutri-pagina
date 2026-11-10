'use server';

import { revalidatePath } from 'next/cache';
import { type ActionResult, failValidation } from '@/lib/action-result';
import { startSession } from '@/lib/auth/session-cookie';
import { adminSession } from '../domain/admin.schema';
import { toActionFailure } from '@/lib/db-errors';
import { ChangePasswordInputSchema } from '../domain/account.schema';
import { accountService } from '../services/account.service';
import { requireAdmin } from './require-admin';

export async function changePassword(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  try {
    const { adminId } = await requireAdmin();
    const parsed = ChangePasswordInputSchema.safeParse({
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    });
    if (!parsed.success) return failValidation(parsed.error.issues[0]?.message);
    await startSession(adminSession(await accountService.changePassword(adminId, parsed.data)));
    revalidatePath('/admin', 'layout');
    return { success: true, message: 'Listo. Desde ahora entrás con la contraseña nueva.' };
  } catch (error) {
    return toActionFailure(error, 'tu cuenta');
  }
}
