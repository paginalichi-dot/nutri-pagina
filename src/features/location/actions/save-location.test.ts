import fc from 'fast-check';
import { updateTag } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formData, signedInAdmin } from '@/features/auth/testing/account-actions.fixture';
import { errorMessage } from '@/lib/errors';
import { locationRepository } from '../repository/location.repository';
import { saveLocation } from './save-location';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('../repository/location.repository', async () => ({ locationRepository: (await import('../testing/location-repository.fake')).createFakeLocationRepository() }));

const CENTRO = { kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: '', mapUrl: '' };

describe('saveLocation (contrato)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('sin sesión da UNAUTHENTICATED y no guarda nada', async () => {
    await expect(saveLocation(null, formData(CENTRO))).resolves.toMatchObject({ success: false, code: 'UNAUTHENTICATED' });
  });

  it('US-9 CA-3: edita una ubicación con su versión', async () => {
    await signedInAdmin();
    const { id } = await locationRepository.create({ kind: 'ONLINE', name: 'Online', videoUrl: 'https://meet.example.test/a', address: null, directions: null, mapUrl: null });
    const result = await saveLocation(null, formData({ id, version: '1', kind: 'ONLINE', name: 'Consultas online', videoUrl: 'https://meet.example.test/b' }));
    expect(result).toEqual({ success: true, message: 'Guardamos los cambios.' });
    expect(updateTag).toHaveBeenCalledWith('locations');
    await expect(locationRepository.findById(id)).resolves.toMatchObject({ name: 'Consultas online', version: 2 });
  });

  it.each<{ caso: string; data: Record<string, string>; code: string; error: string }>([
    { caso: 'falta la dirección', data: { ...CENTRO, address: '' }, code: 'VALIDATION', error: 'Ingresá la dirección.' },
    { caso: 'falta el registro', data: CENTRO, code: 'VALIDATION', error: 'El registro no es válido.' },
    { caso: 'el link de videollamada no es https', data: { kind: 'ONLINE', name: 'Online', videoUrl: 'http://x.test' }, code: 'VALIDATION', error: 'Ingresá un link que empiece con https://.' },
    { caso: 'la versión no es válida', data: { ...CENTRO, id: 'x', version: '1' }, code: 'VALIDATION', error: 'El registro no es válido.' },
    { caso: 'la versión es vieja', data: { ...CENTRO, id: '00000000-0000-4000-8000-000000000000', version: '9' }, code: 'STALE_VERSION', error: errorMessage('STALE_VERSION') },
  ])('si $caso da $code', async ({ data, code, error }) => {
    await signedInAdmin();
    await expect(saveLocation(null, formData(data))).resolves.toEqual({ success: false, code, error });
  });

  it('US-9 CA-5: un nombre repetido da DUPLICATE', async () => {
    await signedInAdmin();
    await locationRepository.create({ kind: 'IN_PERSON', name: 'Repetida', address: 'Calle 1', directions: null, mapUrl: null, videoUrl: null });
    const { id } = await locationRepository.create({ kind: 'IN_PERSON', name: 'Otra', address: 'Calle 2', directions: null, mapUrl: null, videoUrl: null });
    await expect(saveLocation(null, formData({ ...CENTRO, id, version: '1', name: 'REPETIDA' }))).resolves.toMatchObject({ success: false, code: 'DUPLICATE' });
  });

  it('fuzz: nunca lanza ni devuelve un error fuera del catálogo', async () => {
    await signedInAdmin();
    const fields = fc.record({ kind: fc.constantFrom('IN_PERSON', 'ONLINE', 'x'), name: fc.string(), address: fc.string(), videoUrl: fc.string(), id: fc.string() });
    await fc.assert(
      fc.asyncProperty(fields, async (input) => {
        const result = await saveLocation(null, formData(input));
        if (!result.success) expect(() => errorMessage(result.code ?? 'UNEXPECTED')).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });
});
