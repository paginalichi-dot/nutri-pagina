import { beforeEach, describe, expect, it } from 'vitest';
import { fakeAgendaFixture } from '../testing/agenda-repository.fake-fixture';
import { PATIENT } from '../testing/agenda-service.fixture';
import { ANA, bookAt, type BookingSetup, bookingSetup, LISANDRO, MONDAY_AT } from '../testing/booking-service.fixture';

describe('bookingService: el paciente reserva online (US-21, US-22)', () => {
  let setup: BookingSetup;
  beforeEach(async () => {
    setup = await bookingSetup();
  });

  it('US-21 CA-3: nace pendiente y ONLINE, con los datos de la cuenta y la obra social elegida', async () => {
    const { id } = await setup.booking.book(ANA, { locationId: setup.centro, startsAt: MONDAY_AT('12:00'), healthInsuranceId: setup.insurance });
    await expect(setup.service.appointment(id)).resolves.toMatchObject({
      status: 'PENDING',
      source: 'ONLINE',
      patientName: 'Ana Prueba',
      patientPhone: '11 2345-6789',
      patientEmail: 'ana@ejemplo.test',
      healthInsuranceName: 'Prepaga Uno',
      endsAt: MONDAY_AT('12:45'),
    });
  });

  it('US-22 CA-1 y CA-2: arma «Recibimos tu solicitud» para el paciente y el aviso para Lisandro', async () => {
    const { id, emails } = await bookAt(setup, MONDAY_AT('12:00'));
    expect(emails.map(({ to, subject }) => [to, subject])).toEqual([
      ['ana@ejemplo.test', 'Recibimos tu solicitud de turno'],
      [LISANDRO, 'Nueva solicitud de turno de Ana Prueba'],
    ]);
    expect(emails[0]?.html).toContain(`https://sitio.test/mi-espacio/turnos/${id}`);
    expect(emails[0]?.text).toContain('Pendiente de confirmación');
    expect(emails[1]?.html).toContain(`https://sitio.test/admin/turnos/${id}`);
    expect(emails[1]?.text).toContain('Particular');
  });

  it('US-22 CA-2: sin cuenta de admin, sólo sale el email del paciente', async () => {
    setup.admin.email = null;
    const { emails } = await bookAt(setup, MONDAY_AT('12:00'));
    expect(emails.map(({ to }) => to)).toEqual([ANA.email]);
  });

  it('US-21 CA-3: no reserva a menos de 12 h, a más de 60 días ni en un horario ocupado', async () => {
    await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_AT('12:45'), ...PATIENT, email: null });
    await expect(bookAt(setup, MONDAY_AT('12:45'))).rejects.toMatchObject({ code: 'SLOT_TAKEN' });
    await expect(bookAt(setup, new Date('2027-01-11T12:00:00.000Z'))).rejects.toMatchObject({ code: 'SLOT_TAKEN' });
    setup.clock.now = new Date('2026-11-09T01:00:00.000Z');
    await expect(bookAt(setup, MONDAY_AT('12:00'))).rejects.toMatchObject({ code: 'SLOT_TOO_SOON' });
  });

  it('US-21 CA-4: con 2 turnos por venir (contando el que cargó Lisandro) da BOOKING_LIMIT', async () => {
    await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_AT('12:00'), ...PATIENT });
    await expect(setup.booking.roomLeft(ANA.email)).resolves.toBe(1);
    const { id } = await bookAt(setup, MONDAY_AT('12:45'));
    await expect(setup.booking.roomLeft(ANA.email)).resolves.toBe(0);
    await expect(bookAt(setup, MONDAY_AT('13:30'))).rejects.toMatchObject({ code: 'BOOKING_LIMIT' });
    await setup.booking.cancelMine({ id, version: 1 }, ANA.email);
    await expect(bookAt(setup, MONDAY_AT('13:30'))).resolves.toMatchObject({ id: expect.any(String) });
  });

  it('US-21 CA-2: los días del calendario son los que tienen algún horario público libre', async () => {
    const days = await setup.booking.bookableDays(setup.centro);
    expect(days[0]).toBe('2026-11-09');
    expect(days.at(-1)).toBe('2027-01-04');
    expect(days).toHaveLength(9);
    await expect(setup.booking.bookableDays('00000000-0000-4000-8000-000000000000')).resolves.toEqual([]);
  });

  it('zona horaria: un turno a las 00:30 hora argentina cae en su día y las 12 h se cuentan en UTC', async () => {
    const guardia = await fakeAgendaFixture(setup.repository).addPlace({ name: 'Guardia', kind: 'ONLINE', hours: [{ weekday: 2, startMinute: 0, endMinute: 60 }] });
    setup.repository.settings.slotMinutes = 30;
    const midnight = new Date('2026-11-10T03:30:00.000Z');
    const days = await setup.booking.bookableDays(guardia);
    expect(days[0]).toBe('2026-11-10');
    expect(days).not.toContain('2026-11-09');
    await expect(setup.service.slots({ locationId: guardia, day: '2026-11-10' }, 'public')).resolves.toEqual([new Date('2026-11-10T03:00:00.000Z'), midnight]);
    setup.clock.now = new Date('2026-11-09T15:31:00.000Z');
    await expect(bookAt(setup, midnight, guardia)).rejects.toMatchObject({ code: 'SLOT_TOO_SOON' });
    setup.clock.now = new Date('2026-11-09T15:30:00.000Z');
    const { id } = await bookAt(setup, midnight, guardia);
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ startsAt: midnight, status: 'PENDING' });
  });
});
