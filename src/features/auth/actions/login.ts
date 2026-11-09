'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { after } from 'next/server';
import { guardPublicAction } from '@/features/rate-limit/actions/guard-public-action';
import { type ActionFailure, type ActionResult, fail } from '@/lib/action-result';
import { startSession } from '@/lib/auth/session-cookie';
import { HOME_BY_ROLE, type SessionRole } from '@/lib/auth/session-token';
import { toActionFailure } from '@/lib/db-errors';
import { type LoginInput, LoginInputSchema } from '../domain/login.schema';
import { authService } from '../services/auth.service';

async function signIn(input: LoginInput): Promise<SessionRole | ActionFailure> {
  try {
    await guardPublicAction('login');
    const session = await authService.login(input, after);
    await startSession(session);
    return session.role;
  } catch (error) {
    return toActionFailure(error, 'el inicio de sesión');
  }
}

export async function login(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = LoginInputSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    website: formData.get('website'),
  });
  if (!parsed.success) return fail('VALIDATION');
  const role = await signIn(parsed.data);
  if (typeof role !== 'string') return role;
  revalidatePath(HOME_BY_ROLE[role], 'layout');
  redirect(HOME_BY_ROLE[role]);
}
