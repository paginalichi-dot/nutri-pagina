import { describe, expect, it } from 'vitest';
import { aNewAppointment, rangeAt } from '@/features/agenda/testing/agenda-builders';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { locationHoursBehavior } from '../testing/location-hours.behavior';
import { IN_PERSON } from '../testing/location-repository.behavior';
import { locationRepository } from './location.repository';

locationHoursBehavior('Prisma', async () => {
  await resetAgendaTables();
  return locationRepository;
});

const NOVEMBER = { startsAt: new Date('2026-11-01T03:00:00Z'), endsAt: new Date('2026-12-01T03:00:00Z') };

describe('locationRepository.monthActivity (US-41 CA-4, integración)', () => {
  it('cuenta los turnos no cancelados del mes en esa ubicación y trae los bloqueos que tocan el mes', async () => {
    await resetAgendaTables();
    const { id } = await locationRepository.create(IN_PERSON);
    const other = await locationRepository.create({ ...IN_PERSON, name: 'Otra' });
    await db.appointment.create({ data: aNewAppointment(id, rangeAt('2026-11-10T12:00:00.000Z')) });
    await db.appointment.create({ data: aNewAppointment(id, { ...rangeAt('2026-11-11T12:00:00.000Z'), status: 'CANCELLED' }) });
    await db.appointment.create({ data: aNewAppointment(id, rangeAt('2026-12-01T02:30:00.000Z')) });
    await db.appointment.create({ data: aNewAppointment(id, rangeAt('2026-12-01T04:00:00.000Z')) });
    await db.appointment.create({ data: aNewAppointment(other.id, rangeAt('2026-11-12T12:00:00.000Z')) });
    await db.timeBlock.create({ data: { startsAt: new Date('2026-10-31T20:00:00Z'), endsAt: new Date('2026-11-01T05:00:00Z') } });
    await db.timeBlock.create({ data: { startsAt: new Date('2026-12-02T12:00:00Z'), endsAt: new Date('2026-12-02T13:00:00Z') } });
    const activity = await locationRepository.monthActivity(id, NOVEMBER);
    expect(activity).toEqual({ appointments: 2, blocks: [{ startsAt: new Date('2026-10-31T20:00:00Z'), endsAt: new Date('2026-11-01T05:00:00Z') }] });
  });
});
