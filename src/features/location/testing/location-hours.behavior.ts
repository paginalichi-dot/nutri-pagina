import { beforeEach, describe, expect, it } from 'vitest';
import type { LocationRepository } from '../repository/location.repository';
import { failsWith, IN_PERSON, ONLINE } from './location-repository.behavior';

const MORNING = { weekday: 1, startMinute: 540, endMinute: 780 };
const AFTERNOON = { weekday: 1, startMinute: 960, endMinute: 1200 };

export function locationHoursBehavior(name: string, setup: () => Promise<LocationRepository>): void {
  describe(`${name}: crear con horarios y editar franjas (US-41, US-42)`, () => {
    let repository: LocationRepository;
    beforeEach(async () => {
      repository = await setup();
    });

    it('US-42 CA-3: crea la ubicación oculta con dos franjas el mismo día', async () => {
      const created = await repository.createWithHours(IN_PERSON, false, [MORNING, AFTERNOON]);
      expect(created).toMatchObject({ name: IN_PERSON.name, active: false, version: 1 });
      expect((await repository.listHours()).map(({ locationId, startMinute }) => [locationId, startMinute])).toEqual([
        [created.id, 540],
        [created.id, 960],
      ]);
    });

    it('US-42 CA-3: si una franja se pisa no guarda nada', async () => {
      const centro = await repository.create(IN_PERSON);
      await repository.addHours({ ...MORNING, locationId: centro.id });
      await failsWith(repository.createWithHours(ONLINE, true, [AFTERNOON, { weekday: 1, startMinute: 600, endMinute: 660 }]), 'HOURS_OVERLAP');
      expect((await repository.list()).map(({ name }) => name)).toEqual([IN_PERSON.name]);
      expect(await repository.listHours()).toHaveLength(1);
    });

    it('US-42 CA-3: dos franjas que se pisan entre sí, o un nombre repetido, no guardan nada', async () => {
      await failsWith(repository.createWithHours(IN_PERSON, true, [MORNING, { weekday: 1, startMinute: 700, endMinute: 800 }]), 'HOURS_OVERLAP');
      await repository.create(IN_PERSON);
      await failsWith(repository.createWithHours({ ...IN_PERSON, name: 'consultorio centro' }, true, [AFTERNOON]), 'DUPLICATE');
      expect(await repository.listHours()).toEqual([]);
    });

    it('US-41 CA-3: edita una franja con su versión; si se pisa da HOURS_OVERLAP', async () => {
      const { id: locationId } = await repository.create(IN_PERSON);
      const morning = await repository.addHours({ ...MORNING, locationId });
      await repository.addHours({ ...AFTERNOON, locationId });
      await repository.updateHours({ id: morning.id, version: 1 }, { startMinute: 480, endMinute: 720 });
      await failsWith(repository.updateHours({ id: morning.id, version: 1 }, { startMinute: 480, endMinute: 700 }), 'STALE_VERSION');
      await failsWith(repository.updateHours({ id: morning.id, version: 2 }, { startMinute: 480, endMinute: 1000 }), 'HOURS_OVERLAP');
      expect((await repository.listHours()).map(({ startMinute, endMinute, version }) => [startMinute, endMinute, version])).toEqual([
        [480, 720, 2],
        [960, 1200, 1],
      ]);
    });
  });
}
