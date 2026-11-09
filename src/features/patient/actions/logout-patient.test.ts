import { describe, expect, it, vi } from 'vitest';
import { cookieJar } from '@/test/cookie-jar';
import { logoutPatient } from './logout-patient';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);

describe('logoutPatient (contrato, US-32 CA-4)', () => {
  it('borra la cookie de sesión y lleva al inicio', async () => {
    cookieJar.set('session', 'token-ficticio');
    await expect(logoutPatient()).rejects.toThrow('NEXT_REDIRECT:/');
    expect(cookieJar.get('session')).toBeUndefined();
  });

  it('sin sesión también lleva al inicio sin fallar', async () => {
    await expect(logoutPatient()).rejects.toThrow('NEXT_REDIRECT:/');
  });
});
