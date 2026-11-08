import fc from 'fast-check';
import { updateTag } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formData, signedInAdmin } from '@/features/auth/testing/account-actions.fixture';
import { errorMessage } from '@/lib/errors';
import { settingsRepository } from '../repository/settings.repository';
import { createHealthInsurance, renameHealthInsurance, saveSlotMinutes, setHealthInsuranceActive } from './settings-changes';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('../repository/settings.repository', async () => ({ settingsRepository: (await import('../testing/settings-repository.fake')).createFakeSettingsRepository() }));

const ACTIONS = [saveSlotMinutes, createHealthInsurance, renameHealthInsurance, setHealthInsuranceActive];

describe('acciones de ajustes (contrato)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('sin sesión ninguna acción cambia nada', async () => {
    for (const action of ACTIONS) await expect(action(null, formData({ name: 'X', slotMinutes: '45', version: '0' }))).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
    await expect(settingsRepository.getSettings()).resolves.toBeNull();
  });

  it('US-11 CA-1 y CA-4: guarda la duración; fuera de rango da VALIDATION y una versión vieja STALE_VERSION', async () => {
    await signedInAdmin();
    await expect(saveSlotMinutes(null, formData({ slotMinutes: '45', version: '0' }))).resolves.toEqual({ success: true, message: 'Listo: los turnos duran 45 minutos.' });
    await expect(saveSlotMinutes(null, formData({ slotMinutes: '200', version: '1' }))).resolves.toEqual({ success: false, code: 'VALIDATION', error: 'La duración va de 15 a 120 minutos.' });
    await expect(saveSlotMinutes(null, formData({ slotMinutes: '30', version: '0' }))).resolves.toMatchObject({ code: 'STALE_VERSION' });
    expect(updateTag).toHaveBeenCalledWith('health-insurances');
  });

  it('US-12 CA-1 y CA-4: agrega, renombra y rechaza repetidas', async () => {
    await signedInAdmin();
    await expect(createHealthInsurance(null, formData({ name: 'Prepaga Uno' }))).resolves.toEqual({ success: true, message: 'Agregamos Prepaga Uno.' });
    await expect(createHealthInsurance(null, formData({ name: 'prepaga uno' }))).resolves.toMatchObject({ code: 'DUPLICATE' });
    await expect(createHealthInsurance(null, formData({ name: 'Particular' }))).resolves.toMatchObject({ code: 'VALIDATION', error: '«Particular» ya está siempre como opción.' });
    const [row] = await settingsRepository.listHealthInsurances();
    await expect(renameHealthInsurance(null, formData({ id: row?.id ?? '', version: '1', name: 'Prepaga Uno Plus' }))).resolves.toEqual({ success: true, message: 'Guardamos el nombre.' });
    await expect(renameHealthInsurance(null, formData({ id: row?.id ?? '', version: '2', name: '' }))).resolves.toMatchObject({ code: 'VALIDATION' });
    await expect(renameHealthInsurance(null, formData({ id: 'x', version: '2', name: 'Otra' }))).resolves.toMatchObject({ code: 'VALIDATION' });
  });

  it('US-12 CA-3: desactiva y reactiva una obra social', async () => {
    await signedInAdmin();
    await createHealthInsurance(null, formData({ name: 'Para desactivar' }));
    const row = (await settingsRepository.listHealthInsurances()).find(({ name }) => name === 'Para desactivar');
    await expect(setHealthInsuranceActive(null, formData({ id: row?.id ?? '', version: '1', active: 'false' }))).resolves.toEqual({ success: true, message: 'Ya no se ofrece.' });
    await expect(setHealthInsuranceActive(null, formData({ id: row?.id ?? '', version: '2', active: 'true' }))).resolves.toEqual({ success: true, message: 'Vuelve a ofrecerse.' });
    await expect(setHealthInsuranceActive(null, formData({ id: 'x', version: '1' }))).resolves.toMatchObject({ code: 'VALIDATION' });
  });

  it('fuzz: ninguna entrada hace lanzar ni devuelve un error fuera del catálogo', async () => {
    await signedInAdmin();
    const fields = fc.record({ id: fc.string(), version: fc.string(), name: fc.string(), slotMinutes: fc.string(), active: fc.string() });
    await fc.assert(
      fc.asyncProperty(fields, async (input) => {
        for (const action of ACTIONS) {
          const result = await action(null, formData(input));
          if (!result.success) expect(() => errorMessage(result.code ?? 'UNEXPECTED')).not.toThrow();
        }
      }),
      { numRuns: 60 }
    );
  });
});
