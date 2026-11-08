import { beforeEach, describe, expect, it } from 'vitest';
import { LocationInputSchema } from '../domain/location.schema';
import { createFakeLocationRepository, type FakeLocationRepository } from '../testing/location-repository.fake';
import { createLocationService, type LocationService } from './location.service';

const NOW = new Date('2026-11-07T12:00:00Z');
const CENTRO = LocationInputSchema.parse({ kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: 'Piso 2', mapUrl: '' });
const ONLINE = LocationInputSchema.parse({ kind: 'ONLINE', name: 'Online', videoUrl: 'https://meet.example.test/sala' });

describe('locationService', () => {
  let repository: FakeLocationRepository;
  let service: LocationService;

  beforeEach(() => {
    repository = createFakeLocationRepository();
    service = createLocationService({ repository, clock: () => NOW });
  });

  it('US-9 CA-2: crea una ubicación presencial', async () => {
    await expect(service.create(CENTRO)).resolves.toMatchObject({ name: 'Consultorio Centro', kind: 'IN_PERSON', active: true });
  });

  it('US-10 CA-1: devuelve cada ubicación con sus franjas', async () => {
    const centro = await service.create(CENTRO);
    const online = await service.create(ONLINE);
    await service.addHours({ locationId: centro.id, weekday: 1, startMinute: 540, endMinute: 780 });
    await service.addHours({ locationId: online.id, weekday: 2, startMinute: 600, endMinute: 660 });
    const [first] = await service.list();
    expect(first?.hours).toEqual([expect.objectContaining({ locationId: centro.id, weekday: 1 })]);
    await expect(service.get(online.id)).resolves.toMatchObject({ hours: [expect.objectContaining({ weekday: 2 })] });
  });

  it('get de una ubicación inexistente da NOT_FOUND', async () => {
    await expect(service.get('00000000-0000-4000-8000-000000000000')).rejects.toMatchObject({ code: 'NOT_FOUND', message: 'La ubicación ya no existe.' });
  });

  it('US-19: la lista pública trae sólo las activas y nunca el link de videollamada', async () => {
    const centro = await service.create(CENTRO);
    const online = await service.create(ONLINE);
    await service.addHours({ locationId: centro.id, weekday: 1, startMinute: 540, endMinute: 780 });
    await service.setActive({ id: online.id, version: 1 }, false);
    const locations = await service.listPublic();
    expect(locations).toEqual([
      { id: centro.id, name: 'Consultorio Centro', kind: 'IN_PERSON', address: 'Calle Falsa 123', directions: 'Piso 2', mapUrl: null, hours: [{ weekday: 1, startMinute: 540, endMinute: 780 }] },
    ]);
  });

  it('US-9 CA-4: con turnos por venir no se desactiva (HAS_ACTIVE_APPOINTMENTS)', async () => {
    const { id } = await service.create(CENTRO);
    repository.upcoming.set(id, 1);
    await expect(service.setActive({ id, version: 1 }, false)).rejects.toMatchObject({ code: 'HAS_ACTIVE_APPOINTMENTS' });
    await expect(service.get(id)).resolves.toMatchObject({ active: true });
  });

  it('US-9 CA-4: sin turnos por venir se desactiva y se vuelve a activar', async () => {
    const { id } = await service.create(CENTRO);
    await service.setActive({ id, version: 1 }, false);
    await expect(service.get(id)).resolves.toMatchObject({ active: false, version: 2 });
    repository.upcoming.set(id, 3);
    await service.setActive({ id, version: 2 }, true);
    await expect(service.get(id)).resolves.toMatchObject({ active: true });
  });

  it('US-9 CA-3: update puede pasar una presencial a online y deja sin dirección', async () => {
    const { id } = await service.create(CENTRO);
    await service.update({ id, version: 1 }, ONLINE);
    await expect(service.get(id)).resolves.toMatchObject({ kind: 'ONLINE', address: null, directions: null, videoUrl: 'https://meet.example.test/sala' });
  });

  it('US-10 CA-3: borra una franja', async () => {
    const { id: locationId } = await service.create(CENTRO);
    await service.addHours({ locationId, weekday: 4, startMinute: 540, endMinute: 600 });
    const [hours] = (await service.get(locationId)).hours;
    await service.deleteHours({ id: hours?.id ?? '', version: 1 });
    await expect(service.get(locationId)).resolves.toMatchObject({ hours: [] });
  });
});
