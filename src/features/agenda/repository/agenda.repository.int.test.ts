import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { databaseErrorCode } from '@/lib/db-errors';
import { resetAgendaTables } from '@/test/agenda-tables';
import { type AgendaFixture, aNewAppointment, CENTRO, PLACE_DATA, rangeAt } from '../testing/agenda-builders';
import { agendaRepositoryBehavior } from '../testing/agenda-repository.behavior';
import { agendaRepository } from './agenda.repository';

async function prismaFixture(): Promise<AgendaFixture> {
  await resetAgendaTables();
  return {
    repository: agendaRepository,
    async addPlace({ name, kind, hours, active = true }) {
      const { id } = await db.location.create({ data: { name, kind, active, ...PLACE_DATA[kind], hours: { create: hours } }, select: { id: true } });
      return id;
    },
    addInsurance: async (name) => (await db.healthInsurance.create({ data: { name }, select: { id: true } })).id,
    setSlotMinutes: async (slotMinutes) => void (await db.agendaSettings.create({ data: { id: 1, slotMinutes } })),
  };
}

agendaRepositoryBehavior('Prisma', prismaFixture);

describe('agendaRepository (integración)', () => {
  it('T-6 CA-2: dos reservas simultáneas del mismo horario: sólo una se guarda', async () => {
    const { addPlace } = await prismaFixture();
    const centro = await addPlace(CENTRO);
    const book = (): Promise<string> => agendaRepository.inTransaction((tx) => tx.createAppointment(aNewAppointment(centro)));
    const results = await Promise.allSettled([book(), book(), book()]);
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(1);
    for (const result of results) if (result.status === 'rejected') expect(['SLOT_TAKEN', 'STALE_VERSION']).toContain(databaseErrorCode(result.reason));
    await expect(db.appointment.count()).resolves.toBe(1);
  });

  it('la base rechaza un turno que termina antes de empezar y un email con mayúsculas', async () => {
    const { addPlace } = await prismaFixture();
    const centro = await addPlace(CENTRO);
    await expect(db.appointment.create({ data: aNewAppointment(centro, { endsAt: new Date('2026-11-09T11:00:00Z') }) })).rejects.toThrow();
    await expect(db.appointment.create({ data: aNewAppointment(centro, { patientEmail: 'Ana@Ejemplo.test' }) })).rejects.toThrow();
  });

  it('un turno de una ubicación inexistente da RELATION_NOT_FOUND', async () => {
    await prismaFixture();
    const error = await agendaRepository.createAppointment(aNewAppointment('00000000-0000-4000-8000-000000000000')).catch((reason: unknown) => reason);
    expect(databaseErrorCode(error)).toBe('RELATION_NOT_FOUND');
  });

  it('la base rechaza un bloqueo que termina antes de empezar', async () => {
    await prismaFixture();
    await expect(db.timeBlock.create({ data: { startsAt: new Date('2026-11-09T12:00:00Z'), endsAt: new Date('2026-11-09T11:00:00Z') } })).rejects.toThrow();
    await expect(db.timeBlock.create({ data: { ...rangeAt('2026-11-09T12:00:00Z') } })).resolves.toBeTruthy();
  });
});
