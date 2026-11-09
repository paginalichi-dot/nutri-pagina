import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { errorMessage } from '@/lib/errors';
import { requestHeaders } from '@/test/request-headers';
import { formOf, resetOutbox } from '../testing/patient-contract';
import { resetSharedStore } from '../testing/patient-modules';
import { resendVerification } from './register';
import { requestPasswordReset } from './request-password-reset';
import { confirmEmailChange, resetPassword, verifyEmail } from './token-links';

vi.mock('next/server', async (importOriginal) => (await import('../testing/patient-contract')).nextServerModule(importOriginal));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/patient-contract')).emailModule);
vi.mock('../repository/patient.repository', async () => (await import('../testing/patient-modules')).fakePatientRepositoryModule());
vi.mock('../repository/patient-token.repository', async () => (await import('../testing/patient-modules')).fakePatientTokenModule());
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('@/features/rate-limit/repository/rate-limit.repository', async () => (await import('@/features/rate-limit/testing/rate-limit-repository.fake')).fakeRateLimitModule());

const LIMITED = { success: false, code: 'RATE_LIMITED', error: errorMessage('RATE_LIMITED') };
const TOKEN = 'a'.repeat(43);

describe('límite de intentos en acciones públicas (T-7 CA-4)', () => {
  beforeEach(() => {
    resetOutbox();
    resetSharedStore();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-09T12:01:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('el cuarto reenvío de activación al mismo email en una hora da RATE_LIMITED', async () => {
    requestHeaders.set('x-forwarded-for', '203.0.113.11');
    for (let attempt = 0; attempt < 3; attempt += 1) await resendVerification(null, formOf({ email: 'reenvio@ejemplo.test', website: '' }));
    await expect(resendVerification(null, formOf({ email: 'reenvio@ejemplo.test', website: '' }))).resolves.toEqual(LIMITED);
  });

  it('el cuarto pedido de «olvidé mi contraseña» con el mismo email en una hora da RATE_LIMITED', async () => {
    requestHeaders.set('x-forwarded-for', '203.0.113.12');
    for (let attempt = 0; attempt < 3; attempt += 1) await requestPasswordReset(null, formOf({ email: 'olvido@ejemplo.test', website: '' }));
    await expect(requestPasswordReset(null, formOf({ email: 'olvido@ejemplo.test', website: '' }))).resolves.toEqual(LIMITED);
  });

  it.each([
    { name: 'activar', action: verifyEmail, fields: { token: TOKEN, password: 'clave-nueva-123' }, host: 21 },
    { name: 'confirmar el email', action: confirmEmailChange, fields: { token: TOKEN, password: 'clave-nueva-123' }, host: 22 },
    { name: 'restablecer la contraseña', action: resetPassword, fields: { token: TOKEN, password: 'clave-nueva-123' }, host: 23 },
  ])('más de 20 links de $name desde la misma IP en una hora dan RATE_LIMITED', async ({ action, fields, host }) => {
    requestHeaders.set('x-forwarded-for', `203.0.113.${host}`);
    for (let attempt = 0; attempt < 20; attempt += 1) await action(null, formOf({ ...fields, website: '' }));
    await expect(action(null, formOf({ ...fields, website: '' }))).resolves.toEqual(LIMITED);
  }, 30_000);
});
