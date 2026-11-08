import { beforeEach, describe, expect, it } from 'vitest';
import { databaseErrorCode } from '@/lib/db-errors';
import type { ErrorCode } from '@/lib/errors';
import type { LocationData } from '../domain/location.schema';
import type { LocationRepository } from '../repository/location.repository';

export const IN_PERSON: LocationData = { kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: null, mapUrl: null, videoUrl: null };
export const ONLINE: LocationData = { kind: 'ONLINE', name: 'Online', address: null, directions: null, mapUrl: null, videoUrl: 'https://meet.example.test/sala' };

export async function failsWith(promise: Promise<unknown>, code: ErrorCode): Promise<void> {
  const error = await promise.then(
    () => null,
    (reason: unknown) => reason
  );
  expect(databaseErrorCode(error)).toBe(code);
}

export function locationRepositoryBehavior(name: string, setup: () => Promise<LocationRepository>): void {
  describe(`${name}: comportamiento del repositorio de ubicaciones`, () => {
    let repository: LocationRepository;
    beforeEach(async () => {
      repository = await setup();
    });

    it('crea una ubicación activa en la versión 1 y la encuentra por id', async () => {
      const created = await repository.create(IN_PERSON);
      expect(created).toMatchObject({ ...IN_PERSON, active: true, version: 1 });
      await expect(repository.findById(created.id)).resolves.toEqual(created);
    });

    it('lista primero las activas y después por nombre', async () => {
      const zeta = await repository.create({ ...IN_PERSON, name: 'Zeta' });
      await repository.create({ ...IN_PERSON, name: 'Beta' });
      await repository.create(ONLINE);
      await repository.setActive({ id: zeta.id, version: 1 }, false);
      expect((await repository.list()).map((row) => row.name)).toEqual(['Beta', 'Online', 'Zeta']);
    });

    it('rechaza un nombre repetido, sin importar mayúsculas, y una segunda ubicación online', async () => {
      await repository.create(IN_PERSON);
      await repository.create(ONLINE);
      await failsWith(repository.create({ ...IN_PERSON, name: 'consultorio centro' }), 'DUPLICATE');
      await failsWith(repository.create({ ...ONLINE, name: 'Otra online' }), 'DUPLICATE');
    });

    it('update cambia los datos y suma una versión; con una versión vieja da STALE_VERSION', async () => {
      const { id } = await repository.create(IN_PERSON);
      await repository.update({ id, version: 1 }, { ...IN_PERSON, directions: 'Piso 2' });
      await expect(repository.findById(id)).resolves.toMatchObject({ directions: 'Piso 2', version: 2 });
      await failsWith(repository.update({ id, version: 1 }, IN_PERSON), 'STALE_VERSION');
      await failsWith(repository.setActive({ id, version: 1 }, false), 'STALE_VERSION');
    });

    it('las franjas de dos ubicaciones no se pisan; las contiguas sí se aceptan', async () => {
      const centro = await repository.create(IN_PERSON);
      const online = await repository.create(ONLINE);
      await repository.addHours({ locationId: centro.id, weekday: 1, startMinute: 540, endMinute: 780 });
      await repository.addHours({ locationId: online.id, weekday: 1, startMinute: 780, endMinute: 900 });
      await repository.addHours({ locationId: online.id, weekday: 2, startMinute: 540, endMinute: 780 });
      await failsWith(repository.addHours({ locationId: online.id, weekday: 1, startMinute: 600, endMinute: 660 }), 'HOURS_OVERLAP');
      expect((await repository.listHours()).map(({ weekday, startMinute }) => [weekday, startMinute])).toEqual([
        [1, 540],
        [1, 780],
        [2, 540],
      ]);
    });

    it('una franja de una ubicación inexistente da RELATION_NOT_FOUND', async () => {
      await failsWith(repository.addHours({ locationId: '00000000-0000-4000-8000-000000000000', weekday: 1, startMinute: 0, endMinute: 60 }), 'RELATION_NOT_FOUND');
    });

    it('borra una franja con su versión; con una versión vieja da STALE_VERSION', async () => {
      const { id: locationId } = await repository.create(IN_PERSON);
      const hours = await repository.addHours({ locationId, weekday: 3, startMinute: 600, endMinute: 720 });
      await failsWith(repository.deleteHours({ id: hours.id, version: 2 }), 'STALE_VERSION');
      await repository.deleteHours({ id: hours.id, version: 1 });
      await expect(repository.listHours()).resolves.toEqual([]);
    });
  });
}
