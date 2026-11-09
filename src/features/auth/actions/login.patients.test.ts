import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetSharedStore, sharedStore } from '@/features/patient/testing/patient-modules';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '@/features/patient/testing/test-patient';
import { sharedRateLimit } from '@/features/rate-limit/testing/rate-limit-repository.fake';
import { hashPassword } from '@/lib/auth/password';
import { verifySession } from '@/lib/auth/session-token';
import { cookieJar } from '@/test/cookie-jar';
import { requestHeaders } from '@/test/request-headers';
import { login } from './login';

vi.mock('next/navigation', async () => (await import('../testing/module-mocks')).navigationMock);
vi.mock('next/server', async (importOriginal) => (await import('@/features/patient/testing/patient-contract')).nextServerModule(importOriginal));
vi.mock('../repository/admin.repository', async () => (await import('../testing/module-mocks')).fakeRepositoryModule());
vi.mock('@/features/patient/repository/patient.repository', async () => (await import('@/features/patient/testing/patient-modules')).fakePatientRepositoryModule());
vi.mock('@/features/rate-limit/repository/rate-limit.repository', async () => (await import('@/features/rate-limit/testing/rate-limit-repository.fake')).fakeRateLimitModule());

let hash = '';

const form = (password: string = TEST_PATIENT.password): FormData => {
  const data = new FormData();
  Object.entries({ email: TEST_PATIENT.email, password, website: '' }).forEach(([key, value]) => data.set(key, value));
  return data;
};

describe('login de pacientes (contrato, US-29)', () => {
  beforeAll(async () => {
    hash = await hashPassword(TEST_PATIENT.password);
  });

  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    resetSharedStore();
    sharedRateLimit.counts.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('CA-1: un paciente verificado queda con una sesión de paciente y va a /mi-espacio', async () => {
    addPatient(sharedStore, hash);
    await expect(login(null, form())).rejects.toThrow('NEXT_REDIRECT:/mi-espacio');
    await expect(verifySession(cookieJar.get('session')?.value ?? '')).resolves.toEqual({ subjectId: PATIENT_ID, sessionVersion: 1, role: 'patient' });
  });

  it('CA-2: sin activar, con la contraseña correcta, da EMAIL_NOT_VERIFIED y no deja sesión', async () => {
    addPatient(sharedStore, hash, { emailVerifiedAt: null });
    await expect(login(null, form())).resolves.toEqual({ success: false, code: 'EMAIL_NOT_VERIFIED', error: 'Activá tu cuenta con el link que te mandamos.' });
    expect(cookieJar.get('session')).toBeUndefined();
  });

  it('T-7 CA-4: más de 20 intentos desde la misma IP en 15 minutos dan RATE_LIMITED', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-09T12:01:00Z'));
    requestHeaders.set('x-forwarded-for', '203.0.113.7');
    for (let attempt = 0; attempt < 20; attempt += 1) await login(null, form('mala-clave'));
    await expect(login(null, form())).resolves.toMatchObject({ code: 'RATE_LIMITED' });
    requestHeaders.set('x-forwarded-for', '198.51.100.2');
    await expect(login(null, form('mala-clave'))).resolves.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  }, 30_000);
});
