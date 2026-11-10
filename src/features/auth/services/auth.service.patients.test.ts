import { beforeAll, describe, expect, it, vi } from 'vitest';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '@/features/patient/testing/test-patient';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { EMAIL, setupAuthService } from '../testing/auth-service.fixture';
import { MAX_FAILED_ATTEMPTS } from './auth.service';

vi.mock('@/lib/auth/password', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth/password')>();
  return { ...actual, verifyPassword: vi.fn(actual.verifyPassword) };
});

let hash = '';
const credentials = { email: TEST_PATIENT.email, password: TEST_PATIENT.password };

beforeAll(async () => {
  hash = await hashPassword(TEST_PATIENT.password);
});

describe('authService.login con pacientes (US-29)', () => {
  it('CA-1: un paciente verificado entra con el rol de paciente', async () => {
    const { service, store } = setupAuthService(hash);
    addPatient(store, hash);
    await expect(service.login(credentials)).resolves.toEqual({ subjectId: PATIENT_ID, sessionVersion: 1, role: 'patient' });
  });

  it('CA-2: sin verificar, la contraseña correcta da EMAIL_NOT_VERIFIED y la incorrecta INVALID_CREDENTIALS', async () => {
    const { service, store } = setupAuthService(hash);
    addPatient(store, hash, { emailVerifiedAt: null });
    await expect(service.login(credentials)).rejects.toMatchObject({ code: 'EMAIL_NOT_VERIFIED' });
    await expect(service.login({ ...credentials, password: 'mala' })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });

  it('CA-3: el bloqueo por intentos fallidos también vale para pacientes', async () => {
    const { service, store } = setupAuthService(hash);
    addPatient(store, hash, { failedAttempts: MAX_FAILED_ATTEMPTS - 1 });
    await expect(service.login({ ...credentials, password: 'mala' })).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    await expect(service.login(credentials)).rejects.toMatchObject({ code: 'RATE_LIMITED' });
    expect(store.rows.get(PATIENT_ID)).toMatchObject({ failedAttempts: MAX_FAILED_ATTEMPTS, version: 2 });
  });

  it('si un paciente comparte el email del admin, gana el admin', async () => {
    const { service, store } = setupAuthService(hash);
    addPatient(store, hash, { email: EMAIL });
    await expect(service.login({ email: EMAIL, password: TEST_PATIENT.password })).resolves.toMatchObject({ role: 'admin' });
  });

  it('CA-4: cada intento compara una sola contraseña, exista o no la cuenta', async () => {
    const { service, store } = setupAuthService(hash);
    addPatient(store, hash);
    const verify = vi.mocked(verifyPassword);
    for (const email of [TEST_PATIENT.email, 'nadie@ejemplo.test']) {
      verify.mockClear();
      await service.login({ email, password: 'mala' }).catch(() => undefined);
      expect(verify).toHaveBeenCalledOnce();
    }
  });

  it('CA-4: el intento fallido se guarda después de responder, así no tarda más que un email sin cuenta', async () => {
    const { service, store } = setupAuthService(hash);
    addPatient(store, hash);
    const pending: Array<() => Promise<void>> = [];
    const defer = (task: () => Promise<void>): void => void pending.push(task);
    await expect(service.login({ email: 'nadie@ejemplo.test', password: 'mala' }, defer)).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    expect(pending).toHaveLength(0);
    await expect(service.login({ ...credentials, password: 'mala' }, defer)).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    expect(store.rows.get(PATIENT_ID)).toMatchObject({ failedAttempts: 0, version: 1 });
    await Promise.all(pending.map((task) => task()));
    expect(store.rows.get(PATIENT_ID)).toMatchObject({ failedAttempts: 1, version: 2 });
  });
});
