import { describe, expect, it } from 'vitest';
import { aNewAppointment, CENTRO, rangeAt } from '../testing/agenda-builders';
import { fakeAgendaFixture } from '../testing/agenda-repository.fake-fixture';
import { createAgendaService } from './agenda.service';

const NOW = new Date('2026-11-09T13:00:00.000Z');

describe('mis turnos (US-31)', () => {
  it('CA-1: próximos del más cercano y anteriores del más reciente; un cancelado no es un próximo turno', async () => {
    const fixture = fakeAgendaFixture();
    const centro = await fixture.addPlace(CENTRO);
    const create = (at: string, status: 'PENDING' | 'CONFIRMED' = 'CONFIRMED'): Promise<string> =>
      fixture.repository.createAppointment(aNewAppointment(centro, { ...rangeAt(at), status, patientEmail: 'ana@ejemplo.test' }));
    const past = await create('2026-11-09T12:00:00.000Z');
    const soon = await create('2026-11-09T14:00:00.000Z', 'PENDING');
    const later = await create('2026-11-10T14:00:00.000Z');
    const cancelled = await create('2026-11-11T14:00:00.000Z');
    await fixture.repository.updateStatus({ id: cancelled, version: 1 }, 'CANCELLED');
    const service = createAgendaService({ repository: fixture.repository, clock: () => NOW, sendEmail: async () => true });
    const mine = await service.mine('ana@ejemplo.test');
    expect(mine.upcoming.map(({ id }) => id)).toEqual([soon, later]);
    expect(mine.past.map(({ id }) => id)).toEqual([cancelled, past]);
  });
});
