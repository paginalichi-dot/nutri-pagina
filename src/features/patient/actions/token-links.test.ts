import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { flushEmails, formOf, outbox, resetOutbox, tokenFrom } from '../testing/patient-contract';
import { resetSharedStore, sharedStore } from '../testing/patient-modules';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '../testing/test-patient';
import { requestPasswordReset } from './request-password-reset';
import { confirmEmailChange, resetPassword, verifyEmail } from './token-links';

vi.mock('next/server', async (importOriginal) => (await import('../testing/patient-contract')).nextServerModule(importOriginal));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/patient-contract')).emailModule);
vi.mock('../repository/patient.repository', async () => (await import('../testing/patient-modules')).fakePatientRepositoryModule());
vi.mock('../repository/patient-token.repository', async () => (await import('../testing/patient-modules')).fakePatientTokenModule());
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('@/features/rate-limit/repository/rate-limit.repository', async () => (await import('@/features/rate-limit/testing/rate-limit-repository.fake')).fakeRateLimitModule());

const INVALID = { success: false, code: 'INVALID_TOKEN', error: 'El link no es válido o ya venció.' };
let hash = '';

async function resetLink(): Promise<string> {
  await requestPasswordReset(null, formOf({ email: TEST_PATIENT.email, website: '' }));
  await flushEmails();
  return tokenFrom(outbox.at(-1));
}

describe('links de un solo uso (contrato)', () => {
  beforeAll(async () => {
    hash = await hashPassword(TEST_PATIENT.password);
  });

  beforeEach(() => {
    resetOutbox();
    resetSharedStore();
  });

  it('US-30 CA-1: «olvidé mi contraseña» responde igual exista o no la cuenta', async () => {
    addPatient(sharedStore, hash);
    const known = await requestPasswordReset(null, formOf({ email: TEST_PATIENT.email, website: '' }));
    await expect(requestPasswordReset(null, formOf({ email: 'nadie@ejemplo.test', website: '' }))).resolves.toEqual(known);
    await flushEmails();
    expect(outbox.map(({ to }) => to)).toEqual([TEST_PATIENT.email]);
  });

  it('US-30 CA-2 y CA-3: el link restablece la contraseña una sola vez', async () => {
    addPatient(sharedStore, hash);
    const token = await resetLink();
    await expect(resetPassword(null, formOf({ token, password: 'clave-nueva-123', website: '' }))).resolves.toEqual({ success: true, message: 'Listo. Ya podés entrar con tu contraseña nueva.' });
    await expect(verifyPassword('clave-nueva-123', sharedStore.rows.get(PATIENT_ID)?.passwordHash ?? '')).resolves.toBe(true);
    await expect(resetPassword(null, formOf({ token, password: 'otra-clave-123', website: '' }))).resolves.toEqual(INVALID);
  });

  it('una contraseña nueva corta da VALIDATION y no gasta el link', async () => {
    addPatient(sharedStore, hash);
    const token = await resetLink();
    await expect(resetPassword(null, formOf({ token, password: 'corta', website: '' }))).resolves.toMatchObject({ code: 'VALIDATION' });
    await expect(resetPassword(null, formOf({ token, password: 'clave-nueva-123', website: '' }))).resolves.toMatchObject({ success: true });
  });

  it.each([
    ['activar', verifyEmail],
    ['confirmar el email', confirmEmailChange],
  ])('US-28 CA-3: %s con un link inventado o mal formado da INVALID_TOKEN', async (_caso, action) => {
    await expect(action(null, formOf({ token: 'a'.repeat(43), website: '' }))).resolves.toEqual(INVALID);
    await expect(action(null, formOf({ token: '../../etc', website: '' }))).resolves.toEqual(INVALID);
    await expect(action(null, new FormData())).resolves.toEqual(INVALID);
  });

  it('US-28 CA-3: el link de activación activa la cuenta', async () => {
    addPatient(sharedStore, hash, { emailVerifiedAt: null });
    const { register } = await import('./register');
    await register(null, formOf({ name: TEST_PATIENT.name, email: TEST_PATIENT.email, phone: TEST_PATIENT.phone, password: TEST_PATIENT.password, consent: 'on', website: '' }));
    await flushEmails();
    await expect(verifyEmail(null, formOf({ token: tokenFrom(outbox.at(-1)), website: '' }))).resolves.toMatchObject({ success: true });
    expect(sharedStore.rows.get(PATIENT_ID)?.emailVerifiedAt).not.toBeNull();
  });
});
