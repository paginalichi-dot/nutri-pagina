import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { databaseErrorCode } from '@/lib/db-errors';
import { patientRepository } from './patient.repository';
import { patientTokenRepository } from './patient-token.repository';

const NOW = new Date('2026-11-09T12:00:00Z');
const LATER = new Date('2026-11-10T12:00:00Z');
const PATIENT = { name: 'Ana Prueba', email: 'ana@ejemplo.test', phone: '11 2345-6789', passwordHash: 'scrypt$x$y', consentAt: NOW };
const hashOf = (digit: string): string => digit.repeat(64);

async function issue(patientId: string, digit: string, purpose: 'VERIFY_EMAIL' | 'CHANGE_EMAIL' = 'VERIFY_EMAIL'): Promise<void> {
  const newEmail = purpose === 'CHANGE_EMAIL' ? 'nuevo@ejemplo.test' : null;
  await patientTokenRepository.issue({ patientId, purpose, tokenHash: hashOf(digit), newEmail, createdAt: NOW, expiresAt: LATER });
}

const redeem = (digit: string, purpose: 'VERIFY_EMAIL' | 'CHANGE_EMAIL' = 'VERIFY_EMAIL'): Promise<boolean> =>
  patientTokenRepository.redeem({ tokenHash: hashOf(digit), purpose, now: NOW, effect: purpose === 'VERIFY_EMAIL' ? { verifyEmail: true } : { useNewEmail: true } });

describe('patientRepository (integración)', () => {
  beforeEach(async () => {
    await db.patient.deleteMany();
  });

  it('T-8 CA-1: el email es único, en minúscula, y el nombre no puede estar vacío', async () => {
    await patientRepository.create(PATIENT);
    await expect(patientRepository.create(PATIENT).catch(databaseErrorCode)).resolves.toBe('DUPLICATE');
    await expect(patientRepository.create({ ...PATIENT, email: 'Otra@Ejemplo.test' })).rejects.toThrow();
    await expect(patientRepository.create({ ...PATIENT, email: 'b@ejemplo.test', name: '  ' })).rejects.toThrow();
  });

  it('actualiza con la versión, sube la de sesión si se pide y borra con la versión', async () => {
    const id = await patientRepository.create(PATIENT);
    await patientRepository.update({ id, version: 1, name: 'Ana Nueva', endSessions: true });
    await expect(patientRepository.findById(id)).resolves.toMatchObject({ name: 'Ana Nueva', sessionVersion: 2, version: 2 });
    await expect(patientRepository.update({ id, version: 1, name: 'Vieja' })).rejects.toMatchObject({ code: 'STALE_VERSION' });
    await expect(patientRepository.remove({ id, version: 1 })).rejects.toMatchObject({ code: 'STALE_VERSION' });
    await patientRepository.remove({ id, version: 2 });
    await expect(patientRepository.findByEmail(PATIENT.email)).resolves.toBeNull();
  });

  it('T-8 CA-1: un solo link activo por propósito; emitir otro anula el anterior; borrar la cuenta borra sus links', async () => {
    const id = await patientRepository.create(PATIENT);
    await issue(id, 'a');
    await issue(id, 'b');
    await expect(redeem('a')).resolves.toBe(false);
    await expect(redeem('b')).resolves.toBe(true);
    await expect(patientRepository.findById(id)).resolves.toMatchObject({ emailVerifiedAt: NOW });
    await patientRepository.remove({ id, version: 2 });
    await expect(db.patientToken.count()).resolves.toBe(0);
  });

  it('dos usos simultáneos del mismo link: sólo uno sirve', async () => {
    const id = await patientRepository.create(PATIENT);
    await issue(id, 'c');
    const results = await Promise.all([redeem('c'), redeem('c'), redeem('c')]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it('confirmar un email que ya usa otra cuenta da EMAIL_IN_USE y el link sigue sin usar', async () => {
    const id = await patientRepository.create(PATIENT);
    await patientRepository.create({ ...PATIENT, email: 'nuevo@ejemplo.test' });
    await issue(id, 'd', 'CHANGE_EMAIL');
    await expect(redeem('d', 'CHANGE_EMAIL')).rejects.toMatchObject({ code: 'EMAIL_IN_USE' });
    await expect(db.patientToken.findFirst({ where: { tokenHash: hashOf('d') } })).resolves.toMatchObject({ usedAt: null });
  });

  it('la base exige el email nuevo sólo en el cambio de email', async () => {
    const id = await patientRepository.create(PATIENT);
    const token = { patientId: id, tokenHash: hashOf('e'), createdAt: NOW, expiresAt: LATER };
    await expect(db.patientToken.create({ data: { ...token, purpose: 'VERIFY_EMAIL', newEmail: 'x@ejemplo.test' } })).rejects.toThrow();
    await expect(db.patientToken.create({ data: { ...token, purpose: 'CHANGE_EMAIL' } })).rejects.toThrow();
  });
});
