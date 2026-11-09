import { beforeAll, describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { sha256 } from '@/lib/auth/token-hash';
import { ADMIN_EMAIL, linkOf, NOW, patientFixture } from '../testing/patient-deps.fixture';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '../testing/test-patient';
import { createRegistrationService } from './registration.service';

const INPUT = { name: TEST_PATIENT.name, email: TEST_PATIENT.email, phone: TEST_PATIENT.phone, password: TEST_PATIENT.password };
let hash = '';

beforeAll(async () => {
  hash = await hashPassword('otra-clave-vieja');
});

describe('registro y activación (US-28)', () => {
  it('CA-1: crea la cuenta sin verificar y manda el link de activación de 24 h, guardando sólo su hash', async () => {
    const { deps, store } = patientFixture();
    const message = await createRegistrationService(deps).register(INPUT);
    const { path, token } = linkOf(message);
    expect(message).toMatchObject({ to: TEST_PATIENT.email, subject: 'Activá tu cuenta' });
    expect(path).toBe('/verificar');
    expect([...store.rows.values()]).toEqual([expect.objectContaining({ name: TEST_PATIENT.name, emailVerifiedAt: null })]);
    expect(store.tokens).toEqual([expect.objectContaining({ tokenHash: sha256(token), purpose: 'VERIFY_EMAIL', expiresAt: new Date(NOW.getTime() + 86_400_000) })]);
  });

  it('CA-2: con un email ya verificado no crea nada y le avisa «Ya tenés una cuenta» con el link para restablecer', async () => {
    const { deps, store } = patientFixture();
    addPatient(store, hash);
    const message = await createRegistrationService(deps).register(INPUT);
    expect(message).toMatchObject({ to: TEST_PATIENT.email, subject: 'Ya tenés una cuenta' });
    expect(linkOf(message).path).toBe('/restablecer');
    expect(store.rows.size).toBe(1);
    await expect(verifyPassword(TEST_PATIENT.password, store.rows.get(PATIENT_ID)?.passwordHash ?? '')).resolves.toBe(false);
  });

  it('CA-2: con el email del admin no crea nada ni manda nada', async () => {
    const { deps, store } = patientFixture();
    await expect(createRegistrationService(deps).register({ ...INPUT, email: ADMIN_EMAIL })).resolves.toBeNull();
    expect(store.rows.size).toBe(0);
  });

  it('CA-4: sobre una cuenta sin verificar pisa sus datos y anula el link anterior', async () => {
    const { deps, store } = patientFixture();
    const service = createRegistrationService(deps);
    const first = linkOf(await service.register(INPUT));
    await service.register({ ...INPUT, name: 'Otro Nombre', password: 'clave-nueva-1' });
    expect(store.rows.size).toBe(1);
    expect([...store.rows.values()][0]).toMatchObject({ name: 'Otro Nombre' });
    await expect(service.verifyEmail(first.token)).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
  });

  it('CA-3: el link activa la cuenta una sola vez', async () => {
    const { deps, store } = patientFixture();
    const service = createRegistrationService(deps);
    const { token } = linkOf(await service.register(INPUT));
    await service.verifyEmail(token);
    expect([...store.rows.values()][0]?.emailVerifiedAt).toEqual(NOW);
    await expect(service.verifyEmail(token)).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
  });

  it('CA-3: un link de más de 24 h ya no sirve', async () => {
    const { deps, travel } = patientFixture();
    const service = createRegistrationService(deps);
    const { token } = linkOf(await service.register(INPUT));
    travel(24 * 60);
    await expect(service.verifyEmail(token)).rejects.toMatchObject({ code: 'INVALID_TOKEN' });
  });

  it('el reenvío manda un link nuevo sólo a una cuenta sin verificar', async () => {
    const { deps, store } = patientFixture();
    const service = createRegistrationService(deps);
    await expect(service.resendVerification('nadie@ejemplo.test')).resolves.toBeNull();
    addPatient(store, hash, { emailVerifiedAt: null });
    expect(linkOf(await service.resendVerification(TEST_PATIENT.email)).path).toBe('/verificar');
    store.rows.set(PATIENT_ID, { ...addPatient(store, hash) });
    await expect(service.resendVerification(TEST_PATIENT.email)).resolves.toBeNull();
  });

  it('si dos registros del mismo email llegan juntos, el segundo responde igual sin mandar nada', async () => {
    const { deps } = patientFixture();
    const racing = { ...deps, patients: { ...deps.patients, findByEmail: async () => null } };
    const service = createRegistrationService(racing);
    await service.register(INPUT);
    await expect(service.register(INPUT)).resolves.toBeNull();
  });
});
