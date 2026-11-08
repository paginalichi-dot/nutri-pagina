import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formData, signedInAdmin } from '@/features/auth/testing/account-actions.fixture';
import { fakeAgenda, outbox, seedAgenda } from '../testing/agenda-contract';
import { aNewAppointment } from '../testing/agenda-builders';
import { cancelAppointment, confirmAppointment, createManualAppointment, markAttendance, rescheduleAppointment } from './appointment-changes';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());
vi.mock('../repository/agenda.repository', async () => ({ agendaRepository: (await import('../testing/agenda-contract')).fakeAgenda }));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/agenda-contract')).emailModule);

const MONDAY_9 = '2026-11-09T12:00:00.000Z';
const patient = { name: 'Ana Prueba', phone: '11 2345-6789', email: 'ana@ejemplo.test', healthInsuranceId: '' };

describe('acciones de turnos (contrato)', () => {
  let centro: string;
  let online: string;
  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    ({ centro, online } = await seedAgenda());
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const book = (fields: Record<string, string> = {}): ReturnType<typeof createManualAppointment> =>
    createManualAppointment(null, formData({ locationId: centro, startsAt: MONDAY_9, ...patient, ...fields }));

  it('sin sesión ninguna acción cambia nada', async () => {
    const data = formData({ id: '00000000-0000-4000-8000-000000000000', version: '1', locationId: centro, startsAt: MONDAY_9, ...patient });
    for (const action of [createManualAppointment, cancelAppointment, confirmAppointment, rescheduleAppointment, markAttendance]) await expect(action(null, data)).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
  });

  it('US-16: guarda el turno, avisa el email y devuelve el WhatsApp', async () => {
    await signedInAdmin();
    const result = await book();
    expect(result).toMatchObject({ success: true, message: 'Turno guardado para el lunes, 9 de noviembre a las 09:00. Le mandamos un email al paciente.' });
    expect(result.success && result.data.whatsappUrl).toMatch(/^https:\/\/wa\.me\/5491123456789\?text=/);
    expect(outbox).toHaveLength(1);
  });

  it('US-16 CA-3 y CA-6: avisa el email repetido y un horario tomado da SLOT_TAKEN', async () => {
    await signedInAdmin();
    await book();
    await expect(book({ startsAt: '2026-11-09T12:45:00.000Z', email: '' })).resolves.toMatchObject({ message: 'Turno guardado para el lunes, 9 de noviembre a las 09:45. No tiene email: avisale por WhatsApp.' });
    await expect(book({ startsAt: '2026-11-09T13:30:00.000Z' })).resolves.toMatchObject({ message: expect.stringContaining('Ojo: ese email ya tenía un turno el lunes, 9 de noviembre a las 09:00.') });
    await expect(book()).resolves.toEqual({ success: false, code: 'SLOT_TAKEN', error: 'Ese horario ya no está disponible. Elegí otro.' });
  });

  it.each([
    [{ name: '' }, 'Ingresá el nombre del paciente.'],
    [{ phone: '123' }, 'Ingresá el teléfono con código de área, por ejemplo 11 2345-6789.'],
    [{ startsAt: 'mañana' }, 'Elegí un horario.'],
  ])('US-16: datos inválidos %o dan VALIDATION', async (fields, error) => {
    await signedInAdmin();
    await expect(book(fields)).resolves.toEqual({ success: false, code: 'VALIDATION', error });
  });

  it('US-11 CA-2: sin duración definida da NO_SLOT_DURATION', async () => {
    await signedInAdmin();
    fakeAgenda.settings.slotMinutes = null;
    await expect(book()).resolves.toMatchObject({ code: 'NO_SLOT_DURATION', error: 'Todavía no definiste la duración de los turnos. Hacelo en Ajustes.' });
  });

  it('US-17 y US-18: cancela y reprograma con su versión', async () => {
    await signedInAdmin();
    const first = await book();
    const id = first.success ? first.data.appointmentId : '';
    const moved = await rescheduleAppointment(null, formData({ id, version: '1', locationId: online, startsAt: '2026-11-09T19:00:00.000Z' }));
    expect(moved).toMatchObject({ success: true, message: 'Turno movido al lunes, 9 de noviembre a las 16:00. Le mandamos un email al paciente.' });
    await expect(cancelAppointment(null, formData({ id, version: '1' }))).resolves.toMatchObject({ code: 'STALE_VERSION' });
    await expect(cancelAppointment(null, formData({ id, version: '2' }))).resolves.toMatchObject({ success: true, message: 'Turno cancelado. Le mandamos un email al paciente.' });
    await expect(rescheduleAppointment(null, formData({ id, version: '3', locationId: 'x', startsAt: MONDAY_9 }))).resolves.toMatchObject({ code: 'VALIDATION', error: 'Elegí una ubicación.' });
  });

  it('US-17 CA-3: marcar asistencia antes del turno da INVALID_TRANSITION', async () => {
    await signedInAdmin();
    const first = await book();
    const id = first.success ? first.data.appointmentId : '';
    await expect(markAttendance(null, formData({ id, version: '1', attended: 'true' }))).resolves.toMatchObject({ code: 'INVALID_TRANSITION' });
    vi.setSystemTime(new Date('2026-11-09T12:50:00Z'));
    await expect(markAttendance(null, formData({ id, version: '1', attended: 'true' }))).resolves.toEqual({ success: true, message: 'Marcado: asistió.' });
    await expect(markAttendance(null, formData({ id: 'x', version: '1' }))).resolves.toMatchObject({ code: 'VALIDATION' });
    await expect(cancelAppointment(null, formData({ id: 'x', version: '1' }))).resolves.toMatchObject({ code: 'VALIDATION' });
  });

  it('US-23: confirma un pendiente, avisa el email y no lo confirma dos veces', async () => {
    await signedInAdmin();
    const id = await fakeAgenda.createAppointment(aNewAppointment(centro, { status: 'PENDING', source: 'ONLINE' }));
    await expect(confirmAppointment(null, formData({ id, version: '1' }))).resolves.toMatchObject({ success: true, message: 'Turno confirmado. Le mandamos un email al paciente.' });
    await expect(confirmAppointment(null, formData({ id, version: '2' }))).resolves.toMatchObject({ code: 'INVALID_TRANSITION' });
    await expect(confirmAppointment(null, formData({ id: 'x', version: '1' }))).resolves.toMatchObject({ code: 'VALIDATION' });
  });
});
