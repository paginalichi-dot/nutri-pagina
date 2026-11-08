import { describe, expect, it } from 'vitest';
import { db } from '@/lib/db';
import { resetAgendaTables } from '@/test/agenda-tables';
import { agendaRepository } from '../repository/agenda.repository';
import { CENTRO, PLACE_DATA, rangeAt } from '../testing/agenda-builders';
import { createAgendaService } from './agenda.service';

const NOW = new Date('2026-11-07T12:00:00Z');
const MONDAY_9 = new Date('2026-11-09T12:00:00.000Z');
const PATIENT = { name: 'Ana Prueba', phone: '11 2345-6789', email: null, healthInsuranceId: null };

async function setup(): Promise<string> {
  await resetAgendaTables();
  await db.agendaSettings.create({ data: { id: 1, slotMinutes: 45 } });
  const { id } = await db.location.create({ data: { name: CENTRO.name, kind: 'IN_PERSON', ...PLACE_DATA.IN_PERSON, hours: { create: CENTRO.hours } } });
  return id;
}

describe('agendaService (integración)', () => {
  const service = createAgendaService({ repository: agendaRepository, clock: () => NOW, sendEmail: async () => true });

  it('US-14 CA-6: un bloqueo y un turno simultáneos sobre el mismo horario no conviven', async () => {
    const locationId = await setup();
    const results = await Promise.allSettled([
      service.createBlock({ ...rangeAt('2026-11-09T11:00:00.000Z', 180), reason: null }),
      service.createManual({ locationId, startsAt: MONDAY_9, ...PATIENT }),
    ]);
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(1);
    const [blocks, appointments] = await Promise.all([db.timeBlock.count(), db.appointment.count()]);
    expect(blocks + appointments).toBe(1);
  });

  it('T-6 CA-2: dos turnos simultáneos del mismo horario desde el panel: sólo uno se guarda', async () => {
    const locationId = await setup();
    const book = (): Promise<unknown> => service.createManual({ locationId, startsAt: MONDAY_9, ...PATIENT });
    const results = await Promise.allSettled([book(), book()]);
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(1);
    await expect(db.appointment.count()).resolves.toBe(1);
  });

  it('T-6: turnos simultáneos en horarios distintos se guardan todos (reintenta el conflicto serializable)', async () => {
    const locationId = await setup();
    const starts = ['2026-11-09T12:00:00.000Z', '2026-11-09T12:45:00.000Z', '2026-11-09T13:30:00.000Z', '2026-11-09T14:15:00.000Z'];
    const results = await Promise.allSettled(starts.map((iso) => service.createManual({ locationId, startsAt: new Date(iso), ...PATIENT })));
    expect(results.filter(({ status }) => status === 'fulfilled')).toHaveLength(starts.length);
  });

  it('US-15 CA-4: un turno guardado de noche se lista en su día argentino, aunque en UTC sea el día siguiente', async () => {
    const locationId = await setup();
    await db.weeklyHours.create({ data: { locationId, weekday: 1, startMinute: 22 * 60, endMinute: 23 * 60 } });
    await service.createManual({ locationId, startsAt: new Date('2026-11-10T01:00:00.000Z'), ...PATIENT });
    await expect(service.agenda('2026-11-09', 1)).resolves.toMatchObject({ appointments: [{ startsAt: new Date('2026-11-10T01:00:00.000Z') }] });
    await expect(service.agenda('2026-11-10', 1)).resolves.toMatchObject({ appointments: [] });
  });
});
