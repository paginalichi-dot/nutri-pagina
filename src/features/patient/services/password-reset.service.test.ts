import { beforeAll, describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { linkOf, NOW, patientFixture } from '../testing/patient-deps.fixture';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '../testing/test-patient';
import { createPasswordResetService } from './password-reset.service';

let hash = '';

beforeAll(async () => {
  hash = await hashPassword(TEST_PATIENT.password);
});

describe('olvidé mi contraseña (US-30)', () => {
  it('CA-1: a un email sin cuenta no le manda nada', async () => {
    const { deps } = patientFixture();
    await expect(createPasswordResetService(deps).requestReset('nadie@ejemplo.test')).resolves.toBeNull();
  });

  it('CA-1 y CA-2: el link de 1 h cambia la contraseña, cierra las otras sesiones, limpia el bloqueo y verifica el email', async () => {
    const { deps, store } = patientFixture();
    addPatient(store, hash, { failedAttempts: 5, lockedUntil: new Date(NOW.getTime() + 60_000), emailVerifiedAt: null });
    const service = createPasswordResetService(deps);
    const message = await service.requestReset(TEST_PATIENT.email);
    expect(message).toMatchObject({ to: TEST_PATIENT.email, subject: 'Elegí una contraseña nueva' });
    expect(store.tokens[0]?.expiresAt).toEqual(new Date(NOW.getTime() + 3_600_000));
    await service.resetPassword(linkOf(message).token, 'clave-nueva-123');
    const row = store.rows.get(PATIENT_ID);
    expect(row).toMatchObject({ sessionVersion: 2, failedAttempts: 0, lockedUntil: null, emailVerifiedAt: NOW });
    await expect(verifyPassword('clave-nueva-123', row?.passwordHash ?? '')).resolves.toBe(true);
  });

  it('CA-3: un link usado, vencido o reemplazado no sirve', async () => {
    const { deps, store, travel } = patientFixture();
    addPatient(store, hash);
    const service = createPasswordResetService(deps);
    const used = linkOf(await service.requestReset(TEST_PATIENT.email)).token;
    await service.resetPassword(used, 'clave-nueva-123');
    await expect(service.resetPassword(used, 'otra-clave-123')).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
    const replaced = linkOf(await service.requestReset(TEST_PATIENT.email)).token;
    const latest = linkOf(await service.requestReset(TEST_PATIENT.email)).token;
    await expect(service.resetPassword(replaced, 'otra-clave-123')).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
    travel(61);
    await expect(service.resetPassword(latest, 'otra-clave-123')).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
  });
});
