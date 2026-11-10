import { describe, expect, it } from 'vitest';
import { requestHeaders } from '@/test/request-headers';
import { requestIp } from './request-ip';

describe('requestIp', () => {
  it('toma la primera IP de x-forwarded-for (la del cliente, que Vercel completa)', async () => {
    requestHeaders.set('x-forwarded-for', ' 203.0.113.7 , 10.0.0.1');
    await expect(requestIp()).resolves.toBe('203.0.113.7');
  });

  it.each(['', ' , 10.0.0.1'])('sin una IP usable (%j) devuelve unknown', async (value) => {
    requestHeaders.set('x-forwarded-for', value);
    await expect(requestIp()).resolves.toBe('unknown');
  });

  it('sin el header devuelve unknown', async () => {
    await expect(requestIp()).resolves.toBe('unknown');
  });
});
