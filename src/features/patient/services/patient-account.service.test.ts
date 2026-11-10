import { beforeAll, describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { ADMIN_EMAIL, linkOf, patientFixture } from '../testing/patient-deps.fixture';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '../testing/test-patient';
import { createPatientAccountService } from './patient-account.service';

const NEW_EMAIL = 'nuevo@ejemplo.test';
const RIGHT = TEST_PATIENT.password;
let hash = '';

beforeAll(async () => {
  hash = await hashPassword(RIGHT);
});

function setup(): ReturnType<typeof patientFixture> & { service: ReturnType<typeof createPatientAccountService> } {
  const fixture = patientFixture();
  addPatient(fixture.store, hash);
  return { ...fixture, service: createPatientAccountService(fixture.deps) };
}

describe('mis datos, contraseña y baja (US-32)', () => {
  it('CA-1: edita nombre y teléfono; con una versión vieja da STALE_VERSION', async () => {
    const { service } = setup();
    await service.updateProfile(PATIENT_ID, { name: 'Ana Nueva', phone: '11 9999-8888', version: 1 });
    await expect(service.profile(PATIENT_ID)).resolves.toEqual({ id: PATIENT_ID, name: 'Ana Nueva', email: TEST_PATIENT.email, phone: '11 9999-8888', version: 2 });
    await expect(service.updateProfile(PATIENT_ID, { name: 'Otra', phone: '11 9999-8888', version: 1 })).rejects.toMatchObject({ code: 'STALE_VERSION' });
  });

  it('CA-2: cambiar la contraseña pide la actual y cierra las otras sesiones', async () => {
    const { service, store } = setup();
    await expect(service.changePassword(PATIENT_ID, { currentPassword: 'mala', newPassword: 'clave-nueva-1' })).rejects.toMatchObject({ code: 'WRONG_PASSWORD' });
    await expect(service.changePassword(PATIENT_ID, { currentPassword: RIGHT, newPassword: 'clave-nueva-1' })).resolves.toEqual({ patientId: PATIENT_ID, sessionVersion: 2 });
    await expect(verifyPassword('clave-nueva-1', store.rows.get(PATIENT_ID)?.passwordHash ?? '')).resolves.toBe(true);
  });

  it('CA-3: eliminar la cuenta pide la contraseña y la borra', async () => {
    const { service, store } = setup();
    await expect(service.deleteAccount(PATIENT_ID, 'mala')).rejects.toMatchObject({ code: 'WRONG_PASSWORD' });
    await service.deleteAccount(PATIENT_ID, RIGHT);
    expect(store.rows.size).toBe(0);
    await expect(service.profile(PATIENT_ID)).rejects.toMatchObject({ code: 'UNAUTHENTICATED' });
  });
});

describe('cambiar el email (US-33)', () => {
  it('CA-1 y CA-3: manda el link al email nuevo y el cambio se aplica al tocarlo, cerrando las otras sesiones', async () => {
    const { service, store } = setup();
    const message = await service.requestEmailChange(PATIENT_ID, { email: NEW_EMAIL, currentPassword: RIGHT });
    expect(message).toMatchObject({ to: NEW_EMAIL, subject: 'Confirmá tu email nuevo' });
    expect(store.rows.get(PATIENT_ID)?.email).toBe(TEST_PATIENT.email);
    await service.confirmEmailChange(linkOf(message).token);
    expect(store.rows.get(PATIENT_ID)).toMatchObject({ email: NEW_EMAIL, sessionVersion: 2 });
  });

  it.each([
    ['la contraseña es incorrecta', { email: NEW_EMAIL, currentPassword: 'mala' }, 'WRONG_PASSWORD'],
    ['es el mismo email', { email: TEST_PATIENT.email, currentPassword: RIGHT }, 'VALIDATION'],
    ['es el email del admin', { email: ADMIN_EMAIL, currentPassword: RIGHT }, 'EMAIL_IN_USE'],
  ])('si %s da %s', async (_caso, input, code) => {
    const { service } = setup();
    await expect(service.requestEmailChange(PATIENT_ID, input)).rejects.toMatchObject({ code });
  });

  it('CA-2: si otra cuenta tomó el email antes de confirmar da EMAIL_IN_USE; el link vence a las 24 h', async () => {
    const { service, store, travel } = setup();
    const first = linkOf(await service.requestEmailChange(PATIENT_ID, { email: NEW_EMAIL, currentPassword: RIGHT }));
    addPatient(store, hash, { id: '9b1f2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d', email: NEW_EMAIL });
    await expect(service.confirmEmailChange(first.token)).rejects.toMatchObject({ code: 'EMAIL_IN_USE' });
    store.rows.delete('9b1f2c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d');
    travel(24 * 60);
    await expect(service.confirmEmailChange(first.token)).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
  });
});
