import { createHash, createHmac, randomBytes } from 'node:crypto';
import { sessionSecret } from './session-token';

export type OneTimeToken = { token: string; hash: string };

export const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');

export const keyedHash = (value: string): string => createHmac('sha256', sessionSecret()).update(value).digest('hex');

export function createOneTimeToken(): OneTimeToken {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: sha256(token) };
}
