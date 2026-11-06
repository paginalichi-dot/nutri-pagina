import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from './session-token';

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function writeSessionCookie(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
