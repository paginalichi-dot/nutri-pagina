import { db } from '@/lib/db';

export type RateHit = { key: string; expiresAt: Date; now: Date };

export type RateLimitRepository = { hit(hit: RateHit): Promise<number> };

export const rateLimitRepository: RateLimitRepository = {
  async hit({ key, expiresAt, now }) {
    const { count } = await db.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, expiresAt },
      update: { count: { increment: 1 } },
      select: { count: true },
    });
    if (count === 1) await db.rateLimit.deleteMany({ where: { expiresAt: { lte: now } } });
    return count;
  },
};
