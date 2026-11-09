import { jwtVerify, SignJWT } from 'jose';
import { z } from 'zod';

export const SESSION_COOKIE = 'session';

const FOUR_HUNDRED_DAYS = 400 * 24 * 60 * 60;

export const SESSION_COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: FOUR_HUNDRED_DAYS } as const;

export const SESSION_ROLES = ['admin', 'patient'] as const;

export type SessionRole = (typeof SESSION_ROLES)[number];

export const HOME_BY_ROLE: Readonly<Record<SessionRole, string>> = { admin: '/admin', patient: '/mi-espacio' };

export type SessionToken = { subjectId: string; sessionVersion: number; role: SessionRole };

const PayloadSchema = z.object({ sub: z.uuid(), sv: z.int().positive(), r: z.enum(SESSION_ROLES).default('admin') });

export function sessionSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? '';
  if (secret.length < 32) throw new Error('JWT_SECRET falta o tiene menos de 32 caracteres.');
  return new TextEncoder().encode(secret);
}

export async function signSession({ subjectId, sessionVersion, role }: SessionToken): Promise<string> {
  return new SignJWT({ sv: sessionVersion, r: role }).setProtectedHeader({ alg: 'HS256' }).setSubject(subjectId).setIssuedAt().sign(sessionSecret());
}

export async function verifySession(token: string): Promise<SessionToken | null> {
  const key = sessionSecret();
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    const claims = PayloadSchema.parse(payload);
    return { subjectId: claims.sub, sessionVersion: claims.sv, role: claims.r };
  } catch {
    return null;
  }
}
