import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFakeRateLimitRepository, type FakeRateLimitRepository } from '../testing/rate-limit-repository.fake';
import { createRateLimitService, publicActionChecks, RATE_RULES, type RateLimitService } from './rate-limit.service';

const START = new Date('2026-11-09T12:00:00Z');
let clock = START;
let repository: FakeRateLimitRepository;
let service: RateLimitService;
const register = (ip: string, email?: string): Promise<void> => service.consume(publicActionChecks('register', { ip, email }));

describe('rateLimitService (T-7)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    clock = START;
    repository = createFakeRateLimitRepository();
    service = createRateLimitService({ repository, now: () => clock });
  });

  it('CA-2: deja pasar hasta el límite por IP y el siguiente pedido da RATE_LIMITED', async () => {
    for (let attempt = 0; attempt < RATE_RULES.register.ip.limit; attempt += 1) await register('203.0.113.7');
    await expect(register('203.0.113.7')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    await expect(register('198.51.100.2')).resolves.toBeUndefined();
  });

  it('CA-2: el límite por email corta aunque cada pedido venga de otra IP', async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) await register(`203.0.113.${attempt}`, 'ana@ejemplo.test');
    await expect(register('203.0.113.9', 'ana@ejemplo.test')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('cada ventana arranca de cero', async () => {
    for (let attempt = 0; attempt <= RATE_RULES.login.ip.limit; attempt += 1) await service.consume(publicActionChecks('login', { ip: 'x' })).catch(() => undefined);
    clock = new Date(START.getTime() + RATE_RULES.login.ip.minutes * 60_000);
    await expect(service.consume(publicActionChecks('login', { ip: 'x' }))).resolves.toBeUndefined();
  });

  it('CA-1: la clave guardada nunca lleva la IP ni el email en claro', async () => {
    await register('203.0.113.7', 'ana@ejemplo.test');
    const keys = [...repository.counts.keys()].join(' ');
    expect(keys).not.toContain('203.0.113.7');
    expect(keys).not.toContain('ana@ejemplo.test');
    expect(keys).toMatch(/^register:ip:[0-9a-f]{64}:\d+ register:email:[0-9a-f]{64}:\d+$/);
  });

  it('el email se cuenta sólo en las acciones que tienen regla por email', () => {
    expect(publicActionChecks('login', { ip: 'x', email: 'ana@ejemplo.test' }).map(({ scope }) => scope)).toEqual(['ip']);
    expect(publicActionChecks('forgot', { ip: 'x', email: 'ana@ejemplo.test' }).map(({ scope }) => scope)).toEqual(['ip', 'email']);
  });
});
