import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { rateLimitRepository } from './rate-limit.repository';

const NOW = new Date('2026-11-09T12:00:00Z');
const LATER = new Date('2026-11-09T13:00:00Z');

describe('rateLimitRepository (integración)', () => {
  beforeEach(async () => {
    await db.rateLimit.deleteMany();
  });

  it('T-7 CA-3: diez pedidos simultáneos cuentan diez', async () => {
    const counts = await Promise.all(Array.from({ length: 10 }, () => rateLimitRepository.hit({ key: 'login:ip:x:1', expiresAt: LATER, now: NOW })));
    expect(counts.toSorted((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('al abrir una ventana borra las que ya vencieron', async () => {
    await db.rateLimit.create({ data: { key: 'viejo', count: 3, expiresAt: NOW } });
    await rateLimitRepository.hit({ key: 'nuevo', expiresAt: LATER, now: NOW });
    await expect(db.rateLimit.findMany({ select: { key: true } })).resolves.toEqual([{ key: 'nuevo' }]);
  });

  it('la base rechaza un contador en cero', async () => {
    await expect(db.rateLimit.create({ data: { key: 'cero', count: 0, expiresAt: LATER } })).rejects.toThrow();
  });
});
