'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { clearSessionCookie } from '@/lib/auth/session-cookie';

export async function logout(): Promise<void> {
  await clearSessionCookie();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}
