import { describe, expect, it } from 'vitest';
import { createFakeSettingsRepository } from '../testing/settings-repository.fake';
import { createSettingsService } from './settings.service';

describe('settingsService', () => {
  it('US-11 CA-1: guarda la duración y la devuelve', async () => {
    const service = createSettingsService(createFakeSettingsRepository());
    await service.saveSlotMinutes({ slotMinutes: 40, version: 0 });
    await expect(service.getSettings()).resolves.toEqual({ slotMinutes: 40, version: 1 });
  });

  it('US-12 CA-3: las desactivadas siguen en la lista completa pero no en la de activas', async () => {
    const service = createSettingsService(createFakeSettingsRepository());
    await service.createHealthInsurance('Prepaga Uno');
    await service.createHealthInsurance('Obra Dos');
    const [obra] = await service.listHealthInsurances();
    await service.setHealthInsuranceActive({ id: obra?.id ?? '', version: 1 }, false);
    await service.renameHealthInsurance({ id: obra?.id ?? '', version: 2 }, 'Obra Dos Plus');
    expect((await service.listActiveHealthInsurances()).map(({ name }) => name)).toEqual(['Prepaga Uno']);
    expect((await service.listHealthInsurances()).map(({ name }) => name)).toEqual(['Prepaga Uno', 'Obra Dos Plus']);
  });

  it('US-44 CA-3: cada obra social trae su cantidad de turnos, 0 si no tiene', async () => {
    const counts = new Map<string, number>();
    const service = createSettingsService(createFakeSettingsRepository(counts));
    await service.createHealthInsurance('Prepaga Uno');
    await service.createHealthInsurance('Obra Dos');
    const [obra] = await service.listHealthInsurances();
    counts.set(obra?.id ?? '', 3);
    expect((await service.listHealthInsuranceUsage()).map(({ name, appointments }) => [name, appointments])).toEqual([
      ['Obra Dos', 3],
      ['Prepaga Uno', 0],
    ]);
  });
});
