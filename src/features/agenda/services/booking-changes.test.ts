import { beforeEach, describe, expect, it } from 'vitest';
import { PATIENT } from '../testing/agenda-service.fixture';
import { ANA, bookAt, type BookingSetup, bookingSetup, LISANDRO, MONDAY_AT } from '../testing/booking-service.fixture';

const MONDAY_ONLINE = MONDAY_AT('19:00');

describe('bookingService: el paciente cancela y reprograma desde Mi espacio (US-24, US-25)', () => {
  let setup: BookingSetup;
  let id: string;
  beforeEach(async () => {
    setup = await bookingSetup();
    ({ id } = await bookAt(setup, MONDAY_AT('12:00')));
  });

  it('US-24 CA-1 y CA-2: cancela su turno, libera el horario y avisa a los dos', async () => {
    const emails = await setup.booking.cancelMine({ id, version: 1 }, ANA.email);
    expect(emails.map(({ to, subject }) => [to, subject])).toEqual([
      [ANA.email, 'Tu turno con Lisandro López se canceló'],
      [LISANDRO, 'Ana Prueba canceló su turno'],
    ]);
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'CANCELLED' });
    await expect(setup.service.slots({ locationId: setup.centro, day: '2026-11-09' }, 'public')).resolves.toContainEqual(MONDAY_AT('12:00'));
  });

  it('US-24 CA-2: el turno de otro email (o uno inexistente) da NOT_FOUND, sin revelar que existe', async () => {
    await expect(setup.booking.cancelMine({ id, version: 1 }, 'otra@ejemplo.test')).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(setup.booking.findMine(id, 'otra@ejemplo.test')).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(setup.booking.cancelMine({ id: '00000000-0000-4000-8000-000000000000', version: 1 }, ANA.email)).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(setup.booking.findMine(id, ANA.email)).resolves.toMatchObject({ id });
  });

  it('US-24 CA-1: con menos de 24 h da CHANGE_TOO_LATE; con 24 h justas, todavía puede', async () => {
    setup.clock.now = new Date('2026-11-08T12:00:01.000Z');
    await expect(setup.booking.cancelMine({ id, version: 1 }, ANA.email)).rejects.toMatchObject({ code: 'CHANGE_TOO_LATE' });
    await expect(setup.booking.rescheduleMine({ id, version: 1 }, { locationId: setup.online, startsAt: MONDAY_ONLINE }, ANA.email)).rejects.toMatchObject({ code: 'CHANGE_TOO_LATE' });
    setup.clock.now = new Date('2026-11-08T12:00:00.000Z');
    await expect(setup.booking.cancelMine({ id, version: 1 }, ANA.email)).resolves.toHaveLength(2);
  });

  it('US-24: no cancela dos veces; con una versión vieja da STALE_VERSION', async () => {
    await expect(setup.booking.cancelMine({ id, version: 5 }, ANA.email)).rejects.toMatchObject({ code: 'STALE_VERSION' });
    await setup.booking.cancelMine({ id, version: 1 }, ANA.email);
    await expect(setup.booking.cancelMine({ id, version: 2 }, ANA.email)).rejects.toMatchObject({ code: 'INVALID_TRANSITION' });
  });

  it('US-25 CA-1: reprograma a otro horario público de cualquier ubicación y vuelve a pendiente', async () => {
    const manual = (await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_AT('13:30'), ...PATIENT })).id;
    const emails = await setup.booking.rescheduleMine({ id: manual, version: 1 }, { locationId: setup.online, startsAt: MONDAY_ONLINE }, ANA.email);
    await expect(setup.service.appointment(manual)).resolves.toMatchObject({ status: 'PENDING', locationId: setup.online, startsAt: MONDAY_ONLINE, version: 2 });
    expect(emails.map(({ to, subject }) => [to, subject])).toEqual([
      [ANA.email, 'Recibimos tu cambio de turno'],
      [LISANDRO, 'Ana Prueba pidió cambiar su turno'],
    ]);
    expect(emails[0]?.text).toContain('lunes, 9 de noviembre a las 10:30');
    expect(emails[0]?.text).toContain('lunes, 9 de noviembre a las 16:00');
    expect(emails[0]?.html).not.toContain('meet.example.test');
  });

  it('US-25 CA-1: no reprograma a un horario ocupado; el horario propio sí cuenta como libre', async () => {
    const other = await setup.booking.book({ ...ANA, email: 'otra@ejemplo.test' }, { locationId: setup.centro, startsAt: MONDAY_AT('12:45'), healthInsuranceId: null });
    await expect(setup.booking.rescheduleMine({ id, version: 1 }, { locationId: setup.centro, startsAt: MONDAY_AT('12:45') }, ANA.email)).rejects.toMatchObject({ code: 'SLOT_TAKEN' });
    await setup.booking.cancelMine({ id: other.id, version: 1 }, 'otra@ejemplo.test');
    const nextMonday = new Date('2026-11-16T12:00:00.000Z');
    setup.clock.now = new Date('2026-11-08T11:00:00.000Z');
    await expect(setup.booking.rescheduleMine({ id, version: 1 }, { locationId: setup.centro, startsAt: MONDAY_AT('12:00') }, ANA.email)).resolves.toHaveLength(2);
    setup.clock.now = new Date('2026-11-09T11:00:00.000Z');
    await expect(setup.booking.rescheduleMine({ id, version: 2 }, { locationId: setup.centro, startsAt: nextMonday }, ANA.email)).rejects.toMatchObject({ code: 'CHANGE_TOO_LATE' });
  });
});
