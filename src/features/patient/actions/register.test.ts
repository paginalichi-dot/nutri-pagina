import fc from 'fast-check';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { errorMessage } from '@/lib/errors';
import { resetSharedStore, sharedStore } from '../testing/patient-modules';
import { flushEmails, formOf, outbox, resetOutbox } from '../testing/patient-contract';
import { TEST_PATIENT } from '../testing/test-patient';
import { register, resendVerification } from './register';

vi.mock('next/server', async (importOriginal) => (await import('../testing/patient-contract')).nextServerModule(importOriginal));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/patient-contract')).emailModule);
vi.mock('../repository/patient.repository', async () => (await import('../testing/patient-modules')).fakePatientRepositoryModule());
vi.mock('../repository/patient-token.repository', async () => (await import('../testing/patient-modules')).fakePatientTokenModule());
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('@/features/rate-limit/repository/rate-limit.repository', async () => (await import('@/features/rate-limit/testing/rate-limit-repository.fake')).fakeRateLimitModule());

const VALID = { name: TEST_PATIENT.name, email: TEST_PATIENT.email, phone: TEST_PATIENT.phone, password: TEST_PATIENT.password, consent: 'on', website: '' };
const GENERIC = 'Listo. Si los datos están bien, te mandamos un email para activar tu cuenta. Si no lo ves, revisá el correo no deseado.';

describe('register (contrato, US-28)', () => {
  beforeEach(() => {
    resetOutbox();
    resetSharedStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('CA-1 y CA-2: responde lo mismo con un email nuevo y con uno ya verificado; cambia sólo el email que llega', async () => {
    await expect(register(null, formOf({ ...VALID, email: ' Paciente@Ejemplo.TEST ' }))).resolves.toEqual({ success: true, message: GENERIC });
    await flushEmails();
    expect(outbox.map(({ to, subject }) => [to, subject])).toEqual([[TEST_PATIENT.email, 'Activá tu cuenta']]);
    for (const row of sharedStore.rows.values()) row.emailVerifiedAt = new Date();
    await expect(register(null, formOf({ ...VALID, email: `${TEST_PATIENT.email.slice(0, 3)}${TEST_PATIENT.email.slice(3)}` }))).resolves.toEqual({ success: true, message: GENERIC });
    await flushEmails();
    expect(outbox[1]?.subject).toBe('Ya tenés una cuenta');
  });

  it.each([
    ['sin consentimiento', { consent: '' }, 'Para crear tu cuenta tenés que aceptar la política de privacidad.'],
    ['con una contraseña corta', { password: 'corta' }, 'La contraseña tiene que tener al menos 8 caracteres.'],
    ['con un teléfono sin código de área', { phone: '1234' }, 'Ingresá el teléfono con código de área, por ejemplo 11 2345-6789.'],
    ['con el honeypot completo', { website: 'http://spam.test' }, 'Revisá los datos ingresados.'],
  ])('%s da VALIDATION con su mensaje y no crea nada', async (_caso, fields, message) => {
    await expect(register(null, formOf({ ...VALID, ...fields }))).resolves.toEqual({ success: false, code: 'VALIDATION', error: message });
    expect(sharedStore.rows.size).toBe(0);
  });

  it('T-7 CA-4: el cuarto registro con el mismo email en una hora da RATE_LIMITED', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-09T12:01:00Z'));
    for (let attempt = 0; attempt < 3; attempt += 1) await register(null, formOf({ ...VALID, email: 'limite@ejemplo.test' }));
    await expect(register(null, formOf({ ...VALID, email: 'limite@ejemplo.test' }))).resolves.toEqual({ success: false, code: 'RATE_LIMITED', error: errorMessage('RATE_LIMITED') });
  });

  it('el reenvío responde siempre lo mismo y sólo manda a una cuenta sin activar', async () => {
    await register(null, formOf({ ...VALID, email: 'reenvio@ejemplo.test' }));
    await flushEmails();
    const resent = await resendVerification(null, formOf({ email: 'reenvio@ejemplo.test', website: '' }));
    await expect(resendVerification(null, formOf({ email: 'nadie@ejemplo.test', website: '' }))).resolves.toEqual(resent);
    await flushEmails();
    expect(outbox.map(({ to }) => to)).toEqual(['reenvio@ejemplo.test', 'reenvio@ejemplo.test']);
  });

  it('fuzz: cualquier formulario responde con un resultado del catálogo, nunca con un error crudo', async () => {
    await fc.assert(
      fc.asyncProperty(fc.dictionary(fc.constantFrom('name', 'email', 'phone', 'password', 'consent', 'website'), fc.string()), async (fields) => {
        const result = await register(null, formOf(fields));
        expect(result.success || ['VALIDATION', 'RATE_LIMITED'].includes(result.code ?? '')).toBe(true);
      }),
      { numRuns: 40 }
    );
  });
});
