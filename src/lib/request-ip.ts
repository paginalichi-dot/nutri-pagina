import 'server-only';
import { headers } from 'next/headers';

export async function requestIp(): Promise<string> {
  const forwarded = (await headers()).get('x-forwarded-for') ?? '';
  return forwarded.split(',')[0]?.trim() || 'unknown';
}
