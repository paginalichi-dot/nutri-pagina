import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '@/lib/auth/password';
import { signSession, verifySession } from '@/lib/auth/session-token';
import { cookieJar } from '@/test/cookie-jar';
import { flushEmails, formOf, outbox, resetOutbox } from '../testing/patient-contract';
import { resetSharedStore, sharedStore } from '../testing/patient-modules';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '../testing/test-patient';
import { changePatientPassword, deleteAccount, requestEmailChange, updateProfile } from './account-changes';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('next/server', async (importOriginal) => (await import('../testing/patient-contract')).nextServerModule(importOriginal));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/patient-contract')).emailModule);
vi.mock('../repository/patient.repository', async () => (await import('../testing/patient-modules')).fakePatientRepositoryModule());
vi.mock('../repository/patient-token.repository', async () => (await import('../testing/patient-modules')).fakePatientTokenModule());
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());

let hash = '';
const RIGHT = TEST_PATIENT.password;

describe('Mi espacio: cambios de la cuenta (contrato, US-32 y US-33)', () => {
  beforeAll(async () => {
    hash = await hashPassword(RIGHT);
  });

  beforeEach(async () => {
    resetOutbox();
    resetSharedStore();
    addPatient(sharedStore, hash);
    cookieJar.set('session', await signSession({ subjectId: PATIENT_ID, sessionVersion: 1, role: 'patient' }));
  });

  it('sin sesión de paciente cada cambio da UNAUTHENTICATED', async () => {
    cookieJar.set('session', await signSession({ subjectId: PATIENT_ID, sessionVersion: 1, role: 'admin' }));
    for (const action of [updateProfile, changePatientPassword, requestEmailChange, deleteAccount]) {
      await expect(action(null, new FormData())).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
    }
  });

  it('US-32 CA-1: guarda nombre y teléfono; con una versión vieja da STALE_VERSION', async () => {
    await expect(updateProfile(null, formOf({ name: 'Ana Nueva', phone: '11 9999-8888', version: '1' }))).resolves.toEqual({ success: true, message: 'Guardamos tus datos.' });
    await expect(updateProfile(null, formOf({ name: 'Otra', phone: '11 9999-8888', version: '1' }))).resolves.toMatchObject({ code: 'STALE_VERSION' });
  });

  it('US-32 CA-2: con la contraseña actual cambia la contraseña y deja una sesión nueva', async () => {
    const fields = { currentPassword: 'mala', newPassword: 'clave-nueva-1', confirmPassword: 'clave-nueva-1' };
    await expect(changePatientPassword(null, formOf(fields))).resolves.toMatchObject({ code: 'WRONG_PASSWORD' });
    await expect(changePatientPassword(null, formOf({ ...fields, currentPassword: RIGHT }))).resolves.toMatchObject({ success: true });
    await expect(verifySession(cookieJar.get('session')?.value ?? '')).resolves.toMatchObject({ sessionVersion: 2, role: 'patient' });
  });

  it('US-33 CA-1: el link para cambiar el email llega al email nuevo', async () => {
    await expect(requestEmailChange(null, formOf({ email: 'nuevo@ejemplo.test', currentPassword: RIGHT }))).resolves.toMatchObject({ success: true });
    await flushEmails();
    expect(outbox.map(({ to, subject }) => [to, subject])).toEqual([['nuevo@ejemplo.test', 'Confirmá tu email nuevo']]);
  });

  it('US-32 CA-3: eliminar la cuenta pide la confirmación, la borra, cierra la sesión y vuelve al inicio', async () => {
    await expect(deleteAccount(null, formOf({ currentPassword: RIGHT }))).resolves.toEqual({ success: false, code: 'VALIDATION', error: 'Confirmá que querés eliminar tu cuenta.' });
    await expect(deleteAccount(null, formOf({ currentPassword: RIGHT, confirm: 'on' }))).rejects.toThrow('NEXT_REDIRECT:/');
    expect(sharedStore.rows.size).toBe(0);
    expect(cookieJar.get('session')).toBeUndefined();
  });
});
