import 'server-only';
import { forbidden, redirect } from 'next/navigation';
import { readSessionToken } from '@/lib/auth/session-cookie';
import { isAppError } from '@/lib/errors';
import type { SessionClaims } from '../domain/admin.schema';
import { sessionService } from '../services/session.service';

export async function requireAdmin(): Promise<SessionClaims> {
  return sessionService.authenticate(await readSessionToken());
}

export async function hasAdminSession(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch (error) {
    if (isAppError(error)) return false;
    throw error;
  }
}

export async function guardAdminPage(): Promise<void> {
  try {
    await requireAdmin();
  } catch (error) {
    if (!isAppError(error)) throw error;
    if (error.code === 'SESSION_EXPIRED') redirect('/login');
    forbidden();
  }
}
