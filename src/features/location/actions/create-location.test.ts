import fc from 'fast-check';
import { updateTag } from 'next/cache';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formData, signedInAdmin } from '@/features/auth/testing/account-actions.fixture';
import { errorMessage } from '@/lib/errors';
import { locationRepository } from '../repository/location.repository';
import { createLocation } from './create-location';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('../repository/location.repository', async () => ({ locationRepository: (await import('../testing/location-repository.fake')).createFakeLocationRepository() }));

function newLocation(fields: Record<string, string>, ranges: [string, string, string][]): FormData {
  const data = formData(fields);
  for (const [weekday, start, end] of ranges) {
    data.append('weekday', weekday);
    data.append('start', start);
    data.append('end', end);
  }
  return data;
}

const CENTRO = { kind: 'IN_PERSON', name: 'Sede Norte', address: 'Calle Falsa 123', directions: '', mapUrl: '', active: 'true' };

describe('createLocation (contrato, US-42)', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('sin sesión da UNAUTHENTICATED y no guarda nada', async () => {
    await expect(createLocation(null, newLocation(CENTRO, []))).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
    await expect(locationRepository.list()).resolves.toEqual([]);
  });

  it('CA-3: crea la ubicación con dos franjas el mismo día, refresca la home y lleva a su ficha', async () => {
    await signedInAdmin();
    const ranges: [string, string, string][] = [
      ['1', '09:00', '13:00'],
      ['1', '16:00', '20:00'],
    ];
    await expect(createLocation(null, newLocation(CENTRO, ranges))).rejects.toThrow(/NEXT_REDIRECT:\/admin\/ubicaciones\/[0-9a-f-]{36}/);
    expect(updateTag).toHaveBeenCalledWith('locations');
    const [created] = await locationRepository.list();
    expect(created).toMatchObject({ name: 'Sede Norte', active: true });
    expect((await locationRepository.listHours()).map(({ startMinute }) => startMinute)).toEqual([540, 960]);
  });

  it('CA-1: sin «active» la crea oculta; la online sin link da VALIDATION', async () => {
    await signedInAdmin();
    await expect(createLocation(null, newLocation({ kind: 'ONLINE', name: 'Online', videoUrl: '' }, []))).resolves.toMatchObject({ code: 'VALIDATION', error: 'Ingresá un link que empiece con https://.' });
    await expect(createLocation(null, newLocation({ kind: 'ONLINE', name: 'Online', videoUrl: 'https://meet.example.test/sala' }, []))).rejects.toThrow(/NEXT_REDIRECT/);
    await expect(locationRepository.list()).resolves.toContainEqual(expect.objectContaining({ name: 'Online', active: false }));
  });

  it('CA-3: franjas que se pisan dan HOURS_OVERLAP y no se crea nada', async () => {
    await signedInAdmin();
    const before = (await locationRepository.list()).length;
    const result = await createLocation(null, newLocation({ ...CENTRO, name: 'Choque' }, [['3', '09:00', '13:00'], ['3', '12:00', '14:00']]));
    expect(result).toEqual({ success: false, code: 'HOURS_OVERLAP', error: errorMessage('HOURS_OVERLAP') });
    await expect(locationRepository.list()).resolves.toHaveLength(before);
  });

  it('fuzz: nunca lanza un error crudo ni devuelve uno fuera del catálogo', async () => {
    await signedInAdmin();
    const fields = fc.record({ kind: fc.constantFrom('IN_PERSON', 'ONLINE', 'x'), name: fc.string(), address: fc.string(), videoUrl: fc.string(), active: fc.string() });
    const ranges = fc.array(fc.tuple(fc.string(), fc.string(), fc.string()), { maxLength: 4 });
    await fc.assert(
      fc.asyncProperty(fields, ranges, async (input, list) => {
        const result = await createLocation(null, newLocation(input, list)).catch((error: unknown) => {
          expect(String(error)).toMatch(/NEXT_REDIRECT/);
          return null;
        });
        if (result && !result.success) expect(() => errorMessage(result.code ?? 'UNEXPECTED')).not.toThrow();
      }),
      { numRuns: 80 }
    );
  });
});
