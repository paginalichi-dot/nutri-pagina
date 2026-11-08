import { beforeEach, describe, expect, it } from 'vitest';
import { type AgendaFixture, aNewAppointment, CENTRO, ONLINE, rangeAt } from './agenda-builders';

const MONDAY_9 = new Date('2026-11-09T12:00:00.000Z');

export function agendaSummaryReadsBehavior(name: string, setup: () => Promise<AgendaFixture>): void {
  describe(`${name}: lecturas del resumen de la agenda (US-26)`, () => {
    let fixture: AgendaFixture;
    let centro: string;
    beforeEach(async () => {
      fixture = await setup();
      centro = await fixture.addPlace(CENTRO);
    });

    it('junta las franjas de las ubicaciones activas, no las de las desactivadas', async () => {
      await fixture.addPlace({ ...ONLINE, active: false });
      await expect(fixture.repository.listActiveHours()).resolves.toEqual(CENTRO.hours);
    });

    it('el próximo turno es el primero pendiente o confirmado desde ahora, con su lugar', async () => {
      await expect(fixture.repository.findNextActive(MONDAY_9)).resolves.toBeNull();
      const cancelled = await fixture.repository.createAppointment(aNewAppointment(centro));
      await fixture.repository.updateStatus({ id: cancelled, version: 1 }, 'CANCELLED');
      const later = await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T14:00:00.000Z'), status: 'PENDING' }));
      await fixture.repository.createAppointment(aNewAppointment(centro, rangeAt('2026-11-09T15:00:00.000Z')));
      await expect(fixture.repository.findNextActive(MONDAY_9)).resolves.toMatchObject({ id: later, status: 'PENDING', place: { address: 'Calle Falsa 123' } });
    });

    it('los contactos anteriores a una fecha salen de turnos no cancelados', async () => {
      await fixture.repository.createAppointment(aNewAppointment(centro, { patientPhone: '11 1111-1111', patientEmail: null }));
      const cancelled = await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-09T14:00:00.000Z'), patientPhone: '11 2222-2222' }));
      await fixture.repository.updateStatus({ id: cancelled, version: 1 }, 'CANCELLED');
      await fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt('2026-11-10T12:00:00.000Z'), patientPhone: '11 3333-3333' }));
      await expect(fixture.repository.listContactsBefore(new Date('2026-11-10T03:00:00Z'))).resolves.toEqual([{ phone: '11 1111-1111', email: null }]);
    });
  });
}
