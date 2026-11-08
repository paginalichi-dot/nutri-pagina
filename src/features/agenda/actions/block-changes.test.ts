import fc from 'fast-check';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formData, signedInAdmin } from '@/features/auth/testing/account-actions.fixture';
import { errorMessage } from '@/lib/errors';
import { fakeAgenda, seedAgenda } from '../testing/agenda-contract';
import { cancelAppointment, createManualAppointment, markAttendance, rescheduleAppointment } from './appointment-changes';
import { createBlock, deleteBlock } from './block-changes';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('../repository/agenda.repository', async () => ({ agendaRepository: (await import('../testing/agenda-contract')).fakeAgenda }));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/agenda-contract')).emailModule);

const MONDAY = { startsAt: new Date('2026-11-09T03:00:00Z'), endsAt: new Date('2026-11-10T03:00:00Z') };

describe('acciones de bloqueos (contrato)', () => {
  let centro: string;
  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    ({ centro } = await seedAgenda());
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('sin sesión no bloquea ni borra', async () => {
    await expect(createBlock(null, formData({ start: '2026-11-09T09:00', end: '2026-11-09T11:00', reason: '' }))).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
    await expect(deleteBlock(null, formData({ id: '00000000-0000-4000-8000-000000000000', version: '1' }))).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('US-14 CA-1 y CA-2: crea un bloqueo y lo borra', async () => {
    await signedInAdmin();
    await expect(createBlock(null, formData({ start: '2026-11-09T14:00', end: '2026-11-09T15:00', reason: 'Trámite' }))).resolves.toEqual({
      success: true,
      message: 'Bloqueo guardado: en ese rango no se ofrecen turnos.',
    });
    const [block] = await fakeAgenda.listBlocks(MONDAY);
    expect(block).toMatchObject({ startsAt: new Date('2026-11-09T17:00:00.000Z'), reason: 'Trámite' });
    await expect(deleteBlock(null, formData({ id: block?.id ?? '', version: '1' }))).resolves.toEqual({ success: true, message: 'Bloqueo borrado.' });
    await expect(deleteBlock(null, formData({ id: 'x', version: '1' }))).resolves.toMatchObject({ code: 'VALIDATION' });
  });

  it('US-14 CA-3 y CA-4: con turnos en el rango da BLOCK_HAS_APPOINTMENTS; fechas al revés dan VALIDATION', async () => {
    await signedInAdmin();
    await createManualAppointment(null, formData({ locationId: centro, startsAt: '2026-11-09T12:00:00.000Z', name: 'Ana', phone: '11 2345-6789', email: '', healthInsuranceId: '' }));
    await expect(createBlock(null, formData({ start: '2026-11-09T08:00', end: '2026-11-09T12:00', reason: '' }))).resolves.toMatchObject({ code: 'BLOCK_HAS_APPOINTMENTS' });
    await expect(createBlock(null, formData({ start: '2026-11-09T12:00', end: '2026-11-09T08:00', reason: '' }))).resolves.toEqual({
      success: false,
      code: 'VALIDATION',
      error: 'El fin del bloqueo tiene que ser posterior al inicio.',
    });
  });

  it('fuzz: ninguna acción de agenda lanza ni devuelve un error fuera del catálogo', async () => {
    await signedInAdmin();
    const fields = fc.record({ id: fc.string(), version: fc.string(), locationId: fc.constantFrom(centro, 'x'), startsAt: fc.string(), name: fc.string(), phone: fc.string(), start: fc.string(), end: fc.string() });
    await fc.assert(
      fc.asyncProperty(fields, async (input) => {
        for (const action of [createBlock, deleteBlock, markAttendance, cancelAppointment, rescheduleAppointment, createManualAppointment]) {
          const result = await action(null, formData(input));
          if (!result.success) expect(() => errorMessage(result.code ?? 'UNEXPECTED')).not.toThrow();
        }
      }),
      { numRuns: 40 }
    );
  });
});
