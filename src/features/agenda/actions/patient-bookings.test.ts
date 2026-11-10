import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushEmails, formOf } from '@/features/patient/testing/patient-contract';
import { resetSharedStore, sharedStore } from '@/features/patient/testing/patient-modules';
import { addPatient, PATIENT_ID, TEST_PATIENT } from '@/features/patient/testing/test-patient';
import { sharedRateLimit } from '@/features/rate-limit/testing/rate-limit-repository.fake';
import { signSession } from '@/lib/auth/session-token';
import { cookieJar } from '@/test/cookie-jar';
import { aNewAppointment } from '../testing/agenda-builders';
import { fakeAgenda, outbox, seedAgenda } from '../testing/agenda-contract';
import { bookAppointment, cancelMyAppointment, rescheduleMyAppointment } from './patient-bookings';

vi.mock('next/navigation', async () => (await import('@/features/auth/testing/module-mocks')).navigationMock);
vi.mock('next/server', async (importOriginal) => (await import('@/features/patient/testing/patient-contract')).nextServerModule(importOriginal));
vi.mock('@/lib/email/send-email', async () => (await import('../testing/agenda-contract')).emailModule);
vi.mock('../repository/agenda.repository', async () => ({ agendaRepository: (await import('../testing/agenda-contract')).fakeAgenda }));
vi.mock('@/features/patient/repository/patient.repository', async () => (await import('@/features/patient/testing/patient-modules')).fakePatientRepositoryModule());
vi.mock('@/features/rate-limit/repository/rate-limit.repository', async () => (await import('@/features/rate-limit/testing/rate-limit-repository.fake')).fakeRateLimitModule());
vi.mock('@/features/auth/repository/admin.repository', async () => (await import('@/features/auth/testing/module-mocks')).fakeRepositoryModule());

const at = (time: string): string => `2026-11-09T${time}:00.000Z`;
const MINE = { patientEmail: TEST_PATIENT.email, status: 'PENDING', source: 'ONLINE' } as const;

describe('reserva y gestión del paciente (contrato, US-21, US-24, US-25)', () => {
  let centro: string;
  const book = (startsAt: string): ReturnType<typeof bookAppointment> => bookAppointment(null, formOf({ locationId: centro, startsAt, healthInsuranceId: '' }));
  beforeEach(async () => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
    ({ centro } = await seedAgenda());
    resetSharedStore();
    sharedRateLimit.counts.clear();
    addPatient(sharedStore, 'scrypt$sal$clave');
    cookieJar.set('session', await signSession({ subjectId: PATIENT_ID, sessionVersion: 1, role: 'patient' }));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('sin sesión de paciente (o con la del admin) nada cambia: UNAUTHENTICATED', async () => {
    const data = formOf({ id: '00000000-0000-4000-8000-000000000000', version: '1', locationId: centro, startsAt: at('12:00'), healthInsuranceId: '' });
    for (const role of [null, 'admin'] as const) {
      if (role) cookieJar.set('session', await signSession({ subjectId: PATIENT_ID, sessionVersion: 1, role }));
      else cookieJar.delete('session');
      for (const action of [bookAppointment, cancelMyAppointment, rescheduleMyAppointment]) await expect(action(null, data)).resolves.toMatchObject({ code: 'UNAUTHENTICATED' });
    }
    await expect(fakeAgenda.listByPatientEmail(TEST_PATIENT.email)).resolves.toEqual([]);
  });

  it('US-21: reserva con los datos de la cuenta, nace pendiente y le llega «Recibimos tu solicitud»', async () => {
    const result = await book(at('12:00'));
    expect(result).toMatchObject({ success: true, message: 'Pediste un turno para el lunes, 9 de noviembre a las 09:00.' });
    const [stored] = await fakeAgenda.listByPatientEmail(TEST_PATIENT.email);
    expect(stored).toMatchObject({ status: 'PENDING', source: 'ONLINE', patientName: TEST_PATIENT.name, patientPhone: TEST_PATIENT.phone });
    await flushEmails();
    expect(outbox.map(({ subject }) => subject)).toEqual(['Recibimos tu solicitud de turno']);
  });

  it('US-21: horario inválido da VALIDATION; el tercer turno por venir, BOOKING_LIMIT', async () => {
    await expect(book('mañana')).resolves.toMatchObject({ code: 'VALIDATION', error: 'Elegí un horario.' });
    await book(at('12:00'));
    await book(at('12:45'));
    await expect(book(at('13:30'))).resolves.toMatchObject({ code: 'BOOKING_LIMIT', error: 'Ya tenés dos turnos por venir. Cancelá o reprogramá uno para reservar otro.' });
  });

  it('US-24: cancela el suyo; el de otro email da NOT_FOUND; a menos de 24 h, CHANGE_TOO_LATE', async () => {
    const other = await fakeAgenda.createAppointment(aNewAppointment(centro, { patientEmail: 'otra@ejemplo.test' }));
    await expect(cancelMyAppointment(null, formOf({ id: other, version: '1' }))).resolves.toMatchObject({ code: 'NOT_FOUND', error: 'El turno ya no existe.' });
    const mine = await fakeAgenda.createAppointment(aNewAppointment(centro, { ...MINE, startsAt: new Date(at('13:30')), endsAt: new Date(at('14:15')) }));
    await expect(cancelMyAppointment(null, formOf({ id: mine, version: '1' }))).resolves.toMatchObject({ success: true, message: 'Cancelaste tu turno. Le avisamos a Lisandro.' });
    const late = await fakeAgenda.createAppointment(aNewAppointment(centro, { ...MINE, startsAt: new Date('2026-11-08T11:00:00Z'), endsAt: new Date('2026-11-08T11:45:00Z') }));
    await expect(cancelMyAppointment(null, formOf({ id: late, version: '1' }))).resolves.toMatchObject({ code: 'CHANGE_TOO_LATE' });
  });

  it('US-25: reprograma el suyo y vuelve a pendiente', async () => {
    const mine = await fakeAgenda.createAppointment(aNewAppointment(centro, { patientEmail: TEST_PATIENT.email }));
    const result = await rescheduleMyAppointment(null, formOf({ id: mine, version: '1', locationId: centro, startsAt: at('12:45') }));
    expect(result).toMatchObject({ success: true, message: 'Pediste el cambio al lunes, 9 de noviembre a las 09:45. Lisandro lo tiene que confirmar.' });
    await expect(fakeAgenda.findAppointment(mine)).resolves.toMatchObject({ status: 'PENDING', startsAt: new Date(at('12:45')) });
  });

  it('límite de intentos: más de 10 por hora por cuenta da RATE_LIMITED', async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) await book('mañana');
    await expect(book(at('12:00'))).resolves.toMatchObject({ code: 'RATE_LIMITED' });
  });
});
