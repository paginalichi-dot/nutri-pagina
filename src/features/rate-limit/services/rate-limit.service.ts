import { keyedHash } from '@/lib/auth/token-hash';
import { AppError } from '@/lib/errors';
import { type RateLimitRepository, rateLimitRepository } from '../repository/rate-limit.repository';

export type RateRule = { limit: number; minutes: number };

export type PublicAction = 'login' | 'register' | 'resend' | 'forgot' | 'link';

export const RATE_RULES: Readonly<Record<PublicAction, { ip: RateRule; email?: RateRule }>> = {
  login: { ip: { limit: 20, minutes: 15 } },
  register: { ip: { limit: 5, minutes: 60 }, email: { limit: 3, minutes: 60 } },
  resend: { ip: { limit: 10, minutes: 60 }, email: { limit: 3, minutes: 60 } },
  forgot: { ip: { limit: 10, minutes: 60 }, email: { limit: 3, minutes: 60 } },
  link: { ip: { limit: 20, minutes: 60 } },
};

export type RateCheck = { action: PublicAction; scope: 'ip' | 'email'; value: string; rule: RateRule };

export type RateLimitService = { consume(checks: readonly RateCheck[]): Promise<void> };

type Deps = { repository: RateLimitRepository; now: () => Date };

async function consumeOne(check: RateCheck, { repository, now }: Deps): Promise<void> {
  const windowMs = check.rule.minutes * 60_000;
  const start = Math.floor(now().getTime() / windowMs) * windowMs;
  const key = `${check.action}:${check.scope}:${keyedHash(check.value)}:${start}`;
  const count = await repository.hit({ key, expiresAt: new Date(start + windowMs), now: now() });
  if (count > check.rule.limit) throw new AppError('RATE_LIMITED');
}

export function createRateLimitService(deps: Deps): RateLimitService {
  return {
    async consume(checks) {
      for (const check of checks) await consumeOne(check, deps);
    },
  };
}

export function publicActionChecks(action: PublicAction, { ip, email }: { ip: string; email?: string }): RateCheck[] {
  const { ip: ipRule, email: emailRule } = RATE_RULES[action];
  const checks: RateCheck[] = [{ action, scope: 'ip', value: ip, rule: ipRule }];
  if (email !== undefined && emailRule) checks.push({ action, scope: 'email', value: email, rule: emailRule });
  return checks;
}

export const rateLimitService = createRateLimitService({ repository: rateLimitRepository, now: () => new Date() });
