import type { RateLimitRepository } from '../repository/rate-limit.repository';

export type FakeRateLimitRepository = RateLimitRepository & { counts: Map<string, number> };

export function createFakeRateLimitRepository(): FakeRateLimitRepository {
  const counts = new Map<string, number>();
  return {
    counts,
    async hit({ key }) {
      const count = (counts.get(key) ?? 0) + 1;
      counts.set(key, count);
      return count;
    },
  };
}

export const sharedRateLimit: FakeRateLimitRepository = createFakeRateLimitRepository();

export async function fakeRateLimitModule(): Promise<Record<string, unknown>> {
  return { rateLimitRepository: sharedRateLimit };
}
