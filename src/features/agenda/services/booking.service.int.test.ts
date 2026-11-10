import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { databaseErrorCode } from '@/lib/db-errors';
import { resetAgendaTables } from '@/test/agenda-tables';
import { agendaRepository } from '../repository/agenda.repository';
import { CENTRO, PLACE_DATA } from '../testing/agenda-builders';
import { createBookingService } from './booking.service';

const NOW = new Date('2026-11-07T12:00:00Z');
const ANA = { name: 'Ana Prueba', phone: '11 2345-6789', email: 'ana@ejemplo.test' };
const at = (iso: string): Date => new Date(`2026-11-09T${iso}:00.000Z`);
const clock = { now: NOW };
const service = createBookingService({ repository: agendaRepository, clock: () => clock.now, appUrl: 'https://sitio.test', adminEmail: async () => null });

async function setup(): Promise<string> {
  clock.now = NOW;
  await resetAgendaTables();
  await db.agendaSettings.create({ data: { id: 1, slotMinutes: 45 } });
  const { id } = await db.location.create({ data: { name: CENTRO.name, kind: 'IN_PERSON', ...PLACE_DATA.IN_PERSON, hours: { create: CENTRO.hours } } });
  return id;
}

describe('bookingService (integración)', () => {
  it('US-21 CA-3: dos reservas simultáneas al mismo horario: sólo una se guarda', async () => {
    const locationId = await setup();
    const book = (email: string): Promise<unknown> => service.book({ ...ANA, email }, { locationId, startsAt: at('12:00'), healthInsuranceId: null });
    const results = await Promise.allSettled([book('ana@ejemplo.test'), book('beto@ejemplo.test'), book('caro@ejemplo.test')]);
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(1);
    await expect(db.appointment.count()).resolves.toBe(1);
  });

  it('US-21 CA-4: dos pedidos a la vez del mismo paciente no pasan el límite de 2', async () => {
    const locationId = await setup();
    await service.book(ANA, { locationId, startsAt: at('12:00'), healthInsuranceId: null });
    const results = await Promise.allSettled([at('12:45'), at('13:30'), at('14:15')].map((startsAt) => service.book(ANA, { locationId, startsAt, healthInsuranceId: null })));
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(1);
    expect(results.filter((result) => result.status === 'rejected' && databaseErrorCode(result.reason) === 'BOOKING_LIMIT')).toHaveLength(2);
    await expect(db.appointment.count({ where: { patientEmail: ANA.email } })).resolves.toBe(2);
  });

  it('T-10 CA-1: vencer dos veces a la vez no duplica cancelaciones ni avisos', async () => {
    const locationId = await setup();
    await service.book(ANA, { locationId, startsAt: at('12:00'), healthInsuranceId: null });
    clock.now = new Date('2026-11-09T00:00:00.000Z');
    const [first, second] = await Promise.all([service.expire(), service.expire()]);
    expect((first?.length ?? 0) + (second?.length ?? 0)).toBe(1);
    await expect(db.appointment.findFirst({ select: { status: true, version: true } })).resolves.toEqual({ status: 'CANCELLED', version: 2 });
  });

  it('US-25: reprogramar desde Mi espacio vuelve a pendiente en la base', async () => {
    const locationId = await setup();
    const { id } = await service.book(ANA, { locationId, startsAt: at('12:00'), healthInsuranceId: null });
    await db.appointment.update({ where: { id }, data: { status: 'CONFIRMED', version: 2 } });
    await service.rescheduleMine({ id, version: 2 }, { locationId, startsAt: at('13:30') }, ANA.email);
    await expect(db.appointment.findUnique({ where: { id }, select: { status: true, startsAt: true, version: true } })).resolves.toEqual({ status: 'PENDING', startsAt: at('13:30'), version: 3 });
  });
});
