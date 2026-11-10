import { beforeEach, describe, expect, it } from 'vitest';
import { type AgendaFixture, aNewAppointment, CENTRO, rangeAt } from './agenda-builders';

const NOW = new Date('2026-11-09T11:00:00.000Z');
const PENDING = { status: 'PENDING', source: 'ONLINE' } as const;

export function agendaPendingReadsBehavior(name: string, setup: () => Promise<AgendaFixture>): void {
  describe(`${name}: solicitudes y turnos por venir (Sprint 4)`, () => {
    let fixture: AgendaFixture;
    let centro: string;
    beforeEach(async () => {
      fixture = await setup();
      centro = await fixture.addPlace(CENTRO);
    });

    it('US-21 CA-4: cuenta los turnos por venir de un email, pendientes o confirmados, de cualquier origen', async () => {
      await fixture.repository.createAppointment(aNewAppointment(centro));
      await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T13:00:00.000Z'), ...PENDING }));
      const cancelled = await fixture.repository.createAppointment(aNewAppointment(centro, rangeAt('2026-11-09T14:00:00.000Z')));
      await fixture.repository.updateStatus({ id: cancelled, version: 1 }, 'CANCELLED');
      await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T15:00:00.000Z'), patientEmail: 'otra@ejemplo.test' }));
      await expect(fixture.repository.countUpcomingByEmail('ana@ejemplo.test', NOW)).resolves.toBe(2);
      await expect(fixture.repository.countUpcomingByEmail('ana@ejemplo.test', new Date('2026-11-09T12:30:00.000Z'))).resolves.toBe(1);
    });

    it('US-39: lista y cuenta las solicitudes pendientes por venir, ordenadas', async () => {
      const later = await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T14:00:00.000Z'), ...PENDING }));
      const first = await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T12:00:00.000Z'), ...PENDING }));
      await fixture.repository.createAppointment(aNewAppointment(centro, rangeAt('2026-11-09T13:00:00.000Z')));
      await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T10:00:00.000Z'), ...PENDING }));
      await expect(fixture.repository.countPending(NOW)).resolves.toBe(2);
      expect((await fixture.repository.listPending(NOW)).map(({ id }) => id)).toEqual([first, later]);
    });

    it('T-10: vencen los pendientes que empiezan después de ahora y hasta el límite (incluido), con su lugar', async () => {
      const soon = await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T12:00:00.000Z'), ...PENDING }));
      const edge = await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T23:00:00.000Z'), ...PENDING }));
      await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-10T00:00:00.000Z'), ...PENDING }));
      await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T10:00:00.000Z'), ...PENDING }));
      await fixture.repository.createAppointment(aNewAppointment(centro, rangeAt('2026-11-09T13:00:00.000Z')));
      const expiring = await fixture.repository.listExpiringPending({ startsAt: NOW, endsAt: new Date('2026-11-09T23:00:00.000Z') });
      expect(expiring.map(({ id }) => id)).toEqual([soon, edge]);
      expect(expiring[0]).toMatchObject({ status: 'PENDING', place: { address: 'Calle Falsa 123' } });
    });

    it('US-25: mover un turno puede cambiarle el estado en el mismo paso', async () => {
      const id = await fixture.repository.createAppointment(aNewAppointment(centro));
      await fixture.repository.moveAppointment({ id, version: 1 }, { locationId: centro, ...rangeAt('2026-11-09T13:00:00.000Z'), status: 'PENDING' });
      await expect(fixture.repository.findAppointment(id)).resolves.toMatchObject({ status: 'PENDING', version: 2, startsAt: new Date('2026-11-09T13:00:00.000Z') });
    });
  });
}
