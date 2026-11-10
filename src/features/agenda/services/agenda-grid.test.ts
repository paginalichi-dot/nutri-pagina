import { describe, expect, it } from 'vitest';
import { bookAt, bookingSetup, MONDAY_AT } from '../testing/booking-service.fixture';

describe('agendaService.grid (US-40 CA-5)', () => {
  it('trae todos los horarios públicos del día y marca los ocupados', async () => {
    const setup = await bookingSetup();
    await bookAt(setup, MONDAY_AT('12:45'));
    const grid = await setup.service.grid({ locationId: setup.centro, day: '2026-11-09' });
    expect(grid.map(({ startsAt, free }) => [startsAt.toISOString(), free])).toEqual([
      ['2026-11-09T12:00:00.000Z', true],
      ['2026-11-09T12:45:00.000Z', false],
      ['2026-11-09T13:30:00.000Z', true],
      ['2026-11-09T14:15:00.000Z', true],
      ['2026-11-09T15:00:00.000Z', true],
    ]);
  });

  it('una ubicación inexistente no tiene horarios', async () => {
    const setup = await bookingSetup();
    await expect(setup.service.grid({ locationId: '00000000-0000-4000-8000-000000000000', day: '2026-11-09' })).resolves.toEqual([]);
  });
});
