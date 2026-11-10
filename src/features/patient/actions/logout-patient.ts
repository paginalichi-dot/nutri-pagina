'use server';

import { redirect } from 'next/navigation';
import { clearSessionCookie } from '@/lib/auth/session-cookie';

export async function logoutPatient(): Promise<void> {
  await clearSessionCookie();
  redirect('/');
}
