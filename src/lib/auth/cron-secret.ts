import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (value: string): Buffer => createHash('sha256').update(value).digest();

export function isCronAuthorized(authorization: string | null, secret: string | undefined): boolean {
  if (!secret || !authorization) return false;
  return timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`));
}
