import { beforeEach, describe, expect, it } from 'vitest';
import { PATIENT } from '../testing/agenda-service.fixture';
import { ANA, bookAt, type BookingSetup, bookingSetup, MONDAY_AT } from '../testing/booking-service.fixture';

describe('bookingService: las solicitudes sin confirmar vencen 12 h antes (T-10)', () => {
  let setup: BookingSetup;
  beforeEach(async () => {
    setup = await bookingSetup();
  });

  it('T-10 CA-1: cancela los pendientes que empiezan en 12 h o menos y le avisa a cada paciente', async () => {
    const soon = (await bookAt(setup, MONDAY_AT('12:00'))).id;
    const later = (await setup.booking.book({ ...ANA, email: 'otra@ejemplo.test' }, { locationId: setup.online, startsAt: MONDAY_AT('19:00'), healthInsuranceId: null })).id;
    const confirmed = (await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_AT('12:45'), ...PATIENT, email: 'tres@ejemplo.test' })).id;
    setup.clock.now = new Date('2026-11-09T00:00:00.000Z');
    const emails = await setup.booking.expire();
    expect(emails.map(({ to, subject }) => [to, subject])).toEqual([[ANA.email, 'Tu turno con Lisandro López se canceló']]);
    await expect(setup.service.appointment(soon)).resolves.toMatchObject({ status: 'CANCELLED' });
    await expect(setup.service.appointment(later)).resolves.toMatchObject({ status: 'PENDING' });
    await expect(setup.service.appointment(confirmed)).resolves.toMatchObject({ status: 'CONFIRMED' });
  });

  it('T-10 CA-1: correrlo dos veces no cancela ni avisa dos veces', async () => {
    await bookAt(setup, MONDAY_AT('12:00'));
    setup.clock.now = new Date('2026-11-09T00:00:00.000Z');
    await expect(setup.booking.expire()).resolves.toHaveLength(1);
    await expect(setup.booking.expire()).resolves.toEqual([]);
  });

  it('T-10: si Lisandro lo tocó mientras tanto, no lo pisa', async () => {
    const id = (await bookAt(setup, MONDAY_AT('12:00'))).id;
    const stale = await setup.repository.listExpiringPending({ startsAt: new Date('2026-11-09T00:00:00.000Z'), endsAt: MONDAY_AT('12:00') });
    await setup.service.confirm({ id, version: 1 });
    setup.repository.listExpiringPending = async () => stale;
    setup.clock.now = new Date('2026-11-09T00:00:00.000Z');
    await expect(setup.booking.expire()).resolves.toEqual([]);
    await expect(setup.service.appointment(id)).resolves.toMatchObject({ status: 'CONFIRMED' });
  });
});
