import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { aNewAppointment, PLACE_DATA } from '@/features/agenda/testing/agenda-builders';
import { patientRepository } from './patient.repository';

const PATIENT = { name: 'Ana Prueba', email: 'ana@ejemplo.test', phone: '11 2345-6789', passwordHash: 'scrypt$x$y', consentAt: new Date('2026-11-09T12:00:00Z') };

describe('patientRepository y la agenda (integración)', () => {
  beforeEach(async () => {
    await resetAgendaTables();
    await db.patient.deleteMany();
  });

  it('US-32 CA-3: borrar la cuenta deja en la agenda los turnos con su email', async () => {
    const { id: locationId } = await db.location.create({ data: { name: 'Consultorio Centro', kind: 'IN_PERSON', ...PLACE_DATA.IN_PERSON }, select: { id: true } });
    await db.appointment.create({ data: aNewAppointment(locationId, { patientEmail: PATIENT.email }) });
    const id = await patientRepository.create(PATIENT);
    await patientRepository.remove({ id, version: 1 });
    await expect(patientRepository.findById(id)).resolves.toBeNull();
    await expect(db.appointment.findMany({ select: { patientEmail: true } })).resolves.toEqual([{ patientEmail: PATIENT.email }]);
  });
});
