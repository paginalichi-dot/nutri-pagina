'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { type ActionResult, fail } from '@/lib/action-result';
import { writeSessionCookie } from '@/lib/auth/session-cookie';
import { signSession } from '@/lib/auth/session-token';
import { toActionFailure } from '@/lib/db-errors';
import { LoginInputSchema } from '../domain/login.schema';
import { authService } from '../services/auth.service';

export async function login(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = LoginInputSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    website: formData.get('website'),
  });
  if (!parsed.success) return fail('VALIDATION');
  try {
    const session = await authService.login(parsed.data);
    await writeSessionCookie(await signSession(session));
  } catch (error) {
    return toActionFailure(error, 'el inicio de sesión');
  }
  revalidatePath('/admin', 'layout');
  redirect('/admin');
}
