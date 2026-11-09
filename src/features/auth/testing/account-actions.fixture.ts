import { hashPassword } from '@/lib/auth/password';
import { signSession } from '@/lib/auth/session-token';
import { cookieJar } from '@/test/cookie-jar';
import { adminRepository } from '../repository/admin.repository';
import { TEST_ADMIN } from './test-admin';

let hash: Promise<string> | undefined;

export async function signedInAdmin(): Promise<{ id: string; token: string }> {
  await adminRepository.upsertAdmin({ email: TEST_ADMIN.email, passwordHash: await (hash ??= hashPassword(TEST_ADMIN.password)) });
  const admin = await adminRepository.findCredentialsByEmail(TEST_ADMIN.email);
  const id = admin?.id ?? '';
  const token = await signSession({ subjectId: id, sessionVersion: admin?.sessionVersion ?? 1, role: 'admin' });
  cookieJar.set('session', token);
  return { id, token };
}

export function formData(fields: Record<string, string>): FormData {
  const data = new FormData();
  Object.entries(fields).forEach(([key, value]) => data.set(key, value));
  return data;
}
