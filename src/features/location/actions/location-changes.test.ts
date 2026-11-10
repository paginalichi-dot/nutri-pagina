import fc from 'fast-check';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formData, signedInAdmin } from '@/features/auth/testing/account-actions.fixture';
import { errorMessage } from '@/lib/errors';
import { locationRepository } from '../repository/location.repository';
import type { FakeLocationRepository } from '../testing/location-repository.fake';
import { addHours, deleteHours, setLocationActive, updateHours } from './location-changes';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('../repository/location.repository', async () => ({ locationRepository: (await import('../testing/location-repository.fake')).createFakeLocationRepository() }));

const fake = (): FakeLocationRepository => Object.assign(locationRepository, { upcoming: Reflect.get(locationRepository, 'upcoming'), activity: Reflect.get(locationRepository, 'activity') });

async function newLocation(name: string): Promise<string> {
  return (await locationRepository.create({ kind: 'IN_PERSON', name, address: 'Calle 1', directions: null, mapUrl: null, videoUrl: null })).id;
}

describe('acciones de ubicaciones (contrato)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('sin sesión, ninguna acción cambia nada', async () => {
    const data = formData({ id: '00000000-0000-4000-8000-000000000000', version: '1', active: 'false' });
    for (const action of [setLocationActive, addHours, updateHours, deleteHours]) await expect(action(null, data)).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('US-9 CA-4: desactiva y reactiva una ubicación', async () => {
    await signedInAdmin();
    const id = await newLocation('Activa');
    await expect(setLocationActive(null, formData({ id, version: '1', active: 'false' }))).resolves.toEqual({ success: true, message: 'La ubicación ya no se ofrece.' });
    await expect(setLocationActive(null, formData({ id, version: '2', active: 'true' }))).resolves.toEqual({ success: true, message: 'La ubicación vuelve a ofrecerse.' });
  });

  it('US-9 CA-4: con turnos por venir da HAS_ACTIVE_APPOINTMENTS', async () => {
    await signedInAdmin();
    const id = await newLocation('Con turnos');
    fake().upcoming.set(id, 2);
    await expect(setLocationActive(null, formData({ id, version: '1', active: 'false' }))).resolves.toEqual({
      success: false,
      code: 'HAS_ACTIVE_APPOINTMENTS',
      error: 'Tiene turnos por venir: cancelalos o reprogramalos primero.',
    });
  });

  it('US-10 CA-1 y CA-2: agrega franjas y rechaza las que se pisan (HOURS_OVERLAP)', async () => {
    await signedInAdmin();
    const locationId = await newLocation('Franjas');
    await expect(addHours(null, formData({ locationId, weekday: '5', start: '09:00', end: '13:00' }))).resolves.toEqual({ success: true, message: 'Agregamos la franja.' });
    await expect(addHours(null, formData({ locationId, weekday: '5', start: '12:00', end: '14:00' }))).resolves.toMatchObject({ success: false, code: 'HOURS_OVERLAP' });
    await expect(addHours(null, formData({ locationId, weekday: '5', start: '14:00', end: '13:00' }))).resolves.toMatchObject({ code: 'VALIDATION', error: 'La hora de fin tiene que ser posterior a la de inicio.' });
  });

  it('US-10 CA-3: borra una franja y con una versión vieja da STALE_VERSION', async () => {
    await signedInAdmin();
    const locationId = await newLocation('Borrar franja');
    const { id } = await locationRepository.addHours({ locationId, weekday: 6, startMinute: 600, endMinute: 660 });
    await expect(deleteHours(null, formData({ id, version: '3' }))).resolves.toMatchObject({ code: 'STALE_VERSION' });
    await expect(deleteHours(null, formData({ id, version: '1' }))).resolves.toEqual({ success: true, message: 'Borramos la franja.' });
    await expect(deleteHours(null, formData({ id: 'x', version: '1' }))).resolves.toMatchObject({ code: 'VALIDATION' });
    await expect(setLocationActive(null, formData({ id: 'x', version: '1' }))).resolves.toMatchObject({ code: 'VALIDATION' });
  });

  it('US-41 CA-3: edita una franja; si se pisa da HOURS_OVERLAP y con una versión vieja STALE_VERSION', async () => {
    await signedInAdmin();
    const locationId = await newLocation('Editar franja');
    const { id } = await locationRepository.addHours({ locationId, weekday: 2, startMinute: 540, endMinute: 600 });
    await locationRepository.addHours({ locationId, weekday: 2, startMinute: 720, endMinute: 780 });
    await expect(updateHours(null, formData({ id, version: '1', start: '08:00', end: '10:30' }))).resolves.toEqual({ success: true, message: 'Guardamos la franja.' });
    await expect(updateHours(null, formData({ id, version: '2', start: '08:00', end: '12:30' }))).resolves.toMatchObject({ code: 'HOURS_OVERLAP' });
    await expect(updateHours(null, formData({ id, version: '1', start: '08:00', end: '09:00' }))).resolves.toMatchObject({ code: 'STALE_VERSION' });
  });

  it('fuzz: ninguna entrada hace lanzar ni devuelve un error fuera del catálogo', async () => {
    await signedInAdmin();
    const fields = fc.record({ id: fc.string(), version: fc.string(), locationId: fc.string(), weekday: fc.string(), start: fc.string(), end: fc.string() });
    await fc.assert(
      fc.asyncProperty(fields, async (input) => {
        for (const action of [setLocationActive, addHours, updateHours, deleteHours]) {
          const result = await action(null, formData(input));
          if (!result.success) expect(() => errorMessage(result.code ?? 'UNEXPECTED')).not.toThrow();
        }
      }),
      { numRuns: 60 }
    );
  });
});
