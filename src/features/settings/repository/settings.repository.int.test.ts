import { describe, expect, it } from 'vitest';
import { aNewAppointment, PLACE_DATA, rangeAt } from '@/features/agenda/testing/agenda-builders';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { settingsRepositoryBehavior } from '../testing/settings-repository.behavior';
import { settingsRepository } from './settings.repository';

settingsRepositoryBehavior('Prisma', async () => {
  await resetAgendaTables();
  return settingsRepository;
});

describe('settingsRepository (integración)', () => {
  it.each([
    ['una duración de 0', { id: 1, slotMinutes: 0 }],
    ['una duración negativa', { id: 1, slotMinutes: -5 }],
    ['una segunda fila de ajustes', { id: 2, slotMinutes: 45 }],
  ])('la base rechaza %s', async (_caso, data) => {
    await resetAgendaTables();
    await expect(db.agendaSettings.create({ data })).rejects.toThrow();
  });

  it('US-44 CA-2: la base acepta cualquier entero positivo (7 minutos)', async () => {
    await resetAgendaTables();
    await settingsRepository.saveSlotMinutes(7, 0);
    await expect(settingsRepository.getSettings()).resolves.toEqual({ slotMinutes: 7, version: 1 });
  });

  it.each([['Particular'], ['  particular '], ['  ']])('la base rechaza la obra social «%s»', async (name) => {
    await resetAgendaTables();
    await expect(db.healthInsurance.create({ data: { name } })).rejects.toThrow();
  });

  it('US-44 CA-3: cuenta los turnos no cancelados de cada obra social', async () => {
    await resetAgendaTables();
    const { id: locationId } = await db.location.create({ data: { name: 'Consultorio Centro', kind: 'IN_PERSON', ...PLACE_DATA.IN_PERSON }, select: { id: true } });
    const [uno, dos] = [await settingsRepository.createHealthInsurance('Prepaga Uno'), await settingsRepository.createHealthInsurance('Obra Dos')];
    await db.appointment.create({ data: aNewAppointment(locationId, { healthInsuranceId: uno.id }) });
    await db.appointment.create({ data: aNewAppointment(locationId, { healthInsuranceId: uno.id, ...rangeAt('2026-11-10T12:00:00.000Z') }) });
    await db.appointment.create({ data: aNewAppointment(locationId, { healthInsuranceId: dos.id, status: 'CANCELLED', ...rangeAt('2026-11-11T12:00:00.000Z') }) });
    await db.appointment.create({ data: aNewAppointment(locationId, rangeAt('2026-11-12T12:00:00.000Z')) });
    expect([...(await settingsRepository.appointmentsByHealthInsurance())]).toEqual([[uno.id, 2]]);
  });
});
