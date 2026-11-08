import { beforeEach, describe, expect, it } from 'vitest';
import { failsWith } from '@/features/location/testing/location-repository.behavior';
import { type AgendaFixture, aNewAppointment, CENTRO, ONLINE, rangeAt } from './agenda-builders';

const NOW = new Date('2026-11-07T12:00:00Z');
const MONDAY = { startsAt: new Date('2026-11-09T03:00:00Z'), endsAt: new Date('2026-11-10T03:00:00Z') };

export function agendaRepositoryBehavior(name: string, setup: () => Promise<AgendaFixture>): void {
  describe(`${name}: comportamiento del repositorio de agenda`, () => {
    let fixture: AgendaFixture;
    let centro: string;
    beforeEach(async () => {
      fixture = await setup();
      centro = await fixture.addPlace(CENTRO);
    });

    it('crea un turno y lo devuelve con su ubicación y su obra social', async () => {
      const insurance = await fixture.addInsurance('Prepaga Uno');
      const id = await fixture.repository.createAppointment(aNewAppointment(centro, { healthInsuranceId: insurance }));
      await expect(fixture.repository.findAppointment(id)).resolves.toMatchObject({
        id,
        locationName: 'Consultorio Centro',
        healthInsuranceName: 'Prepaga Uno',
        status: 'CONFIRMED',
        version: 1,
        place: { kind: 'IN_PERSON', address: 'Calle Falsa 123', directions: 'Piso 2', videoUrl: null },
      });
      await expect(fixture.repository.findAppointment('00000000-0000-4000-8000-000000000000')).resolves.toBeNull();
    });

    it('T-6 CA-2: dos turnos activos no se pisan, aunque sean de distintas ubicaciones', async () => {
      const online = await fixture.addPlace(ONLINE);
      await fixture.repository.createAppointment(aNewAppointment(centro));
      await failsWith(fixture.repository.createAppointment(aNewAppointment(online, rangeAt('2026-11-09T12:30:00.000Z'))), 'SLOT_TAKEN');
      await fixture.repository.createAppointment(aNewAppointment(online, rangeAt('2026-11-09T12:45:00.000Z')));
    });

    it('un turno cancelado libera el horario; con una versión vieja da STALE_VERSION', async () => {
      const id = await fixture.repository.createAppointment(aNewAppointment(centro));
      await fixture.repository.updateStatus({ id, version: 1 }, 'CANCELLED');
      await failsWith(fixture.repository.updateStatus({ id, version: 1 }, 'CONFIRMED'), 'STALE_VERSION');
      await fixture.repository.createAppointment(aNewAppointment(centro));
      expect((await fixture.repository.listAppointments(MONDAY)).map(({ status }) => status)).toEqual(['CANCELLED', 'CONFIRMED']);
    });

    it('mover un turno a un horario ocupado da SLOT_TAKEN; a uno libre, lo mueve', async () => {
      const first = await fixture.repository.createAppointment(aNewAppointment(centro));
      const second = await fixture.repository.createAppointment(aNewAppointment(centro, rangeAt('2026-11-09T13:00:00.000Z')));
      await failsWith(fixture.repository.moveAppointment({ id: second, version: 1 }, { locationId: centro, ...rangeAt('2026-11-09T12:15:00.000Z') }), 'SLOT_TAKEN');
      await fixture.repository.moveAppointment({ id: first, version: 1 }, { locationId: centro, ...rangeAt('2026-11-09T12:15:00.000Z') });
      await expect(fixture.repository.findAppointment(first)).resolves.toMatchObject({ startsAt: new Date('2026-11-09T12:15:00.000Z'), version: 2 });
    });

    it('lo ocupado junta turnos activos y bloqueos, sin el turno que se reprograma', async () => {
      const id = await fixture.repository.createAppointment(aNewAppointment(centro));
      const cancelled = await fixture.repository.createAppointment(aNewAppointment(centro, rangeAt('2026-11-09T14:00:00.000Z')));
      await fixture.repository.updateStatus({ id: cancelled, version: 1 }, 'CANCELLED');
      await fixture.repository.createBlock({ ...rangeAt('2026-11-09T18:00:00.000Z', 120), reason: 'Trámite' });
      await expect(fixture.repository.listBusy(MONDAY, null)).resolves.toHaveLength(2);
      await expect(fixture.repository.listBusy(MONDAY, id)).resolves.toEqual([rangeAt('2026-11-09T18:00:00.000Z', 120)]);
      await expect(fixture.repository.countActiveAppointments(MONDAY)).resolves.toBe(1);
    });

    it('devuelve los horarios de una ubicación, la duración y el próximo turno activo de un email', async () => {
      await fixture.setSlotMinutes(45);
      await expect(fixture.repository.findSchedule(centro)).resolves.toEqual({ active: true, hours: CENTRO.hours });
      await expect(fixture.repository.getSlotMinutes()).resolves.toBe(45);
      await fixture.repository.createAppointment(aNewAppointment(centro));
      await expect(fixture.repository.findActiveByEmail('ana@ejemplo.test', NOW)).resolves.toEqual(rangeAt('2026-11-09T12:00:00.000Z'));
      await expect(fixture.repository.findActiveByEmail('ana@ejemplo.test', new Date('2026-11-09T12:00:00Z'))).resolves.toBeNull();
    });

    it('lista y borra bloqueos con su versión', async () => {
      await fixture.repository.createBlock({ ...rangeAt('2026-11-09T18:00:00.000Z', 60), reason: null });
      const [block] = await fixture.repository.listBlocks(MONDAY);
      await failsWith(fixture.repository.deleteBlock({ id: block?.id ?? '', version: 2 }), 'STALE_VERSION');
      await fixture.repository.deleteBlock({ id: block?.id ?? '', version: 1 });
      await expect(fixture.repository.listBlocks(MONDAY)).resolves.toEqual([]);
    });
  });
}
