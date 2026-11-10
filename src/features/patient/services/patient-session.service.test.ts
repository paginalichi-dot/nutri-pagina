import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type SessionRole, signSession } from '@/lib/auth/session-token';
import { patientFixture } from '../testing/patient-deps.fixture';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '../testing/test-patient';
import { patientEmail } from './patient-emails';
import { createPatientSessionService } from './patient-session.service';

const token = (role: SessionRole, sessionVersion = 1): Promise<string> => signSession({ subjectId: PATIENT_ID, sessionVersion, role });

describe('sesión del paciente (T-8 CA-4)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('con su sesión vigente devuelve el paciente y su nombre', async () => {
    const { store } = patientFixture();
    addPatient(store, 'scrypt$x$y');
    await expect(createPatientSessionService(store.patients).authenticate(await token('patient'))).resolves.toEqual({ patientId: PATIENT_ID, sessionVersion: 1, name: TEST_PATIENT.name, email: TEST_PATIENT.email, phone: TEST_PATIENT.phone });
  });

  it('sin token, con la sesión del admin, sin cuenta o sin verificar da UNAUTHENTICATED', async () => {
    const { store } = patientFixture();
    const service = createPatientSessionService(store.patients);
    await expect(service.authenticate(undefined)).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
    await expect(service.authenticate(await token('patient'))).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
    addPatient(store, 'scrypt$x$y', { emailVerifiedAt: null });
    await expect(service.authenticate(await token('patient'))).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
    addPatient(store, 'scrypt$x$y');
    await expect(service.authenticate(await token('admin'))).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('si la sesión se cerró (cambió la versión) da SESSION_EXPIRED', async () => {
    const { store } = patientFixture();
    addPatient(store, 'scrypt$x$y', { sessionVersion: 2 });
    await expect(createPatientSessionService(store.patients).authenticate(await token('patient', 1))).rejects.toMatchObject({ code: 'SESSION_EXPIRED' });
  });
});

describe('emails de la cuenta', () => {
  it('saludan por el nombre, escapan el HTML y llevan el link en texto y en el botón', () => {
    const message = patientEmail('verify', { to: 'ana@ejemplo.test', name: '<Ana> Pérez', url: 'https://lisandro.test/verificar/abc' });
    expect(message.text).toContain('Hola <Ana>.');
    expect(message.html).toContain('Hola &lt;Ana&gt;.');
    expect(message.text).toContain('https://lisandro.test/verificar/abc');
    expect(message.html).toContain('href="https://lisandro.test/verificar/abc"');
  });
});
