import { beforeEach, describe, expect, it } from 'vitest';
import { failsWith } from '@/features/location/testing/location-repository.behavior';
import type { SettingsRepository } from '../repository/settings.repository';

export function settingsRepositoryBehavior(name: string, setup: () => Promise<SettingsRepository>): void {
  describe(`${name}: comportamiento del repositorio de ajustes`, () => {
    let repository: SettingsRepository;
    beforeEach(async () => {
      repository = await setup();
    });

    it('sin ajustes cargados devuelve null; la primera vez se guarda con la versión 0', async () => {
      await expect(repository.getSettings()).resolves.toBeNull();
      await repository.saveSlotMinutes(45, 0);
      await expect(repository.getSettings()).resolves.toEqual({ slotMinutes: 45, version: 1 });
    });

    it('cambiar la duración pide la versión vigente', async () => {
      await repository.saveSlotMinutes(45, 0);
      await failsWith(repository.saveSlotMinutes(30, 0), 'STALE_VERSION');
      await repository.saveSlotMinutes(30, 1);
      await expect(repository.getSettings()).resolves.toEqual({ slotMinutes: 30, version: 2 });
      await failsWith(repository.saveSlotMinutes(60, 1), 'STALE_VERSION');
    });

    it('obras sociales: crea, renombra, desactiva y lista las activas primero', async () => {
      const first = await repository.createHealthInsurance('Prepaga Uno');
      await repository.createHealthInsurance('Obra Dos');
      await repository.renameHealthInsurance({ id: first.id, version: 1 }, 'Prepaga Uno Plus');
      await repository.setHealthInsuranceActive({ id: first.id, version: 2 }, false);
      expect((await repository.listHealthInsurances()).map(({ name, active }) => [name, active])).toEqual([
        ['Obra Dos', true],
        ['Prepaga Uno Plus', false],
      ]);
      await failsWith(repository.setHealthInsuranceActive({ id: first.id, version: 2 }, true), 'STALE_VERSION');
    });

    it('rechaza una obra social repetida, sin importar mayúsculas', async () => {
      await repository.createHealthInsurance('Prepaga Uno');
      await failsWith(repository.createHealthInsurance('PREPAGA UNO'), 'DUPLICATE');
      const other = await repository.createHealthInsurance('Otra');
      await failsWith(repository.renameHealthInsurance({ id: other.id, version: 1 }, 'prepaga uno'), 'DUPLICATE');
    });
  });
}
