import { beforeEach, describe, expect, it } from 'vitest';
import { aNewAppointment, PLACE_DATA, rangeAt } from '@/features/agenda/testing/agenda-builders';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { patientDirectoryRepository } from './patient-directory.repository';

const ACCOUNT = { name: 'Ana Prueba', email: 'ana@ejemplo.test', phone: '11 2345-6789', passwordHash: 'scrypt$x$y', consentAt: new Date('2026-11-09T12:00:00Z') };

describe('patientDirectoryRepository (US-43, integración)', () => {
  beforeEach(async () => {
    await resetAgendaTables();
    await db.patient.deleteMany();
  });

  it('trae sólo las cuentas activadas y los turnos con el nombre de su ubicación y su obra social', async () => {
    await db.patient.create({ data: { ...ACCOUNT, emailVerifiedAt: new Date('2026-11-09T12:00:00Z') } });
    await db.patient.create({ data: { ...ACCOUNT, email: 'sin-activar@ejemplo.test' } });
    const { id: locationId } = await db.location.create({ data: { name: 'Consultorio Centro', kind: 'IN_PERSON', ...PLACE_DATA.IN_PERSON }, select: { id: true } });
    const { id: insuranceId } = await db.healthInsurance.create({ data: { name: 'Prepaga Uno' }, select: { id: true } });
    await db.appointment.create({ data: aNewAppointment(locationId, { ...rangeAt('2026-11-12T12:00:00.000Z'), healthInsuranceId: insuranceId }) });
    await db.appointment.create({ data: aNewAppointment(locationId, { ...rangeAt('2026-11-10T12:00:00.000Z'), patientEmail: null }) });

    await expect(patientDirectoryRepository.listAccounts()).resolves.toEqual([expect.objectContaining({ email: 'ana@ejemplo.test', name: 'Ana Prueba' })]);
    const visits = await patientDirectoryRepository.listVisits();
    expect(visits.map(({ startsAt, patientEmail, locationName, healthInsurance }) => [startsAt.toISOString(), patientEmail, locationName, healthInsurance])).toEqual([
      ['2026-11-10T12:00:00.000Z', null, 'Consultorio Centro', null],
      ['2026-11-12T12:00:00.000Z', 'ana@ejemplo.test', 'Consultorio Centro', 'Prepaga Uno'],
    ]);
  });
});
