import { beforeEach, describe, expect, it } from 'vitest';
import { NewLocationInputSchema } from '../domain/new-location.schema';
import { createFakeLocationRepository, type FakeLocationRepository } from '../testing/location-repository.fake';
import { createLocationService, type LocationService } from './location.service';

const NOW = new Date('2026-11-15T12:00:00Z');
const NEW_CENTRO = NewLocationInputSchema.parse({
  location: { kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: '', mapUrl: '' },
  active: true,
  hours: [
    { weekday: '1', start: '09:00', end: '13:00' },
    { weekday: '1', start: '16:00', end: '20:00' },
  ],
});

describe('locationService: horarios y números (US-41, US-42)', () => {
  let repository: FakeLocationRepository;
  let service: LocationService;

  beforeEach(() => {
    repository = createFakeLocationRepository();
    service = createLocationService({ repository, clock: () => NOW });
  });

  it('US-42 CA-3: crea la ubicación con sus franjas', async () => {
    const { id } = await service.createWithHours(NEW_CENTRO);
    expect((await service.get(id)).hours.map(({ startMinute }) => startMinute)).toEqual([540, 960]);
  });

  it('US-41 CA-3: edita una franja', async () => {
    const { id } = await service.createWithHours(NEW_CENTRO);
    const [morning] = (await service.get(id)).hours;
    await service.updateHours({ id: morning?.id ?? '', version: 1 }, { startMinute: 480, endMinute: 720 });
    await expect(service.get(id)).resolves.toMatchObject({ hours: [expect.objectContaining({ startMinute: 480, endMinute: 720, version: 2 }), expect.anything()] });
  });

  it('US-41 CA-4: cuenta los turnos del mes y sólo los bloqueos que pisan sus horarios', async () => {
    const { id } = await service.createWithHours(NEW_CENTRO);
    const monday = { startsAt: new Date('2026-11-09T13:00:00Z'), endsAt: new Date('2026-11-09T14:00:00Z') };
    const tuesday = { startsAt: new Date('2026-11-10T13:00:00Z'), endsAt: new Date('2026-11-10T14:00:00Z') };
    repository.activity.set(id, { appointments: 6, blocks: [monday, tuesday] });
    await expect(service.stats(id)).resolves.toEqual({ appointmentsThisMonth: 6, blocksThisMonth: 1 });
  });
});
