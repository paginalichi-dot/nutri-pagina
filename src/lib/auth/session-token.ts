import { jwtVerify, SignJWT } from 'jose';
import { z } from 'zod';

export const SESSION_COOKIE = 'session';

const FOUR_HUNDRED_DAYS = 400 * 24 * 60 * 60;

export const SESSION_COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: FOUR_HUNDRED_DAYS } as const;

export type SessionToken = { adminId: string; sessionVersion: number };

const PayloadSchema = z.object({ sub: z.uuid(), sv: z.int().positive() });

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? '';
  if (secret.length < 32) throw new Error('JWT_SECRET falta o tiene menos de 32 caracteres.');
  return new TextEncoder().encode(secret);
}

export async function signSession({ adminId, sessionVersion }: SessionToken): Promise<string> {
  return new SignJWT({ sv: sessionVersion }).setProtectedHeader({ alg: 'HS256' }).setSubject(adminId).setIssuedAt().sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionToken | null> {
  const key = secretKey();
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    const claims = PayloadSchema.parse(payload);
    return { adminId: claims.sub, sessionVersion: claims.sv };
  } catch {
    return null;
  }
}
