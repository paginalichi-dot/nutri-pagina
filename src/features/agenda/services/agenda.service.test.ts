import { beforeEach, describe, expect, it } from 'vitest';
import { argentinaTime } from '@/lib/format-date-time';
import { rangeAt } from '../testing/agenda-builders';
import { type AgendaSetup, agendaSetup, MONDAY, MONDAY_9, PATIENT } from '../testing/agenda-service.fixture';

const times = (dates: Date[]): string[] => dates.map((date) => argentinaTime(date));

describe('agendaService: horarios y bloqueos', () => {
  let setup: AgendaSetup;
  beforeEach(async () => {
    setup = await agendaSetup();
  });

  it('US-15 CA-1: ofrece los horarios de la ubicación según la duración', async () => {
    await expect(setup.service.slots({ locationId: setup.centro, day: MONDAY }, 'panel').then(times)).resolves.toEqual(['09:00', '09:45', '10:30', '11:15', '12:00']);
    await expect(setup.service.slots({ locationId: setup.online, day: MONDAY }, 'panel').then(times)).resolves.toEqual(['16:00', '16:45']);
  });

  it('US-15 CA-6: una ubicación desactivada o inexistente no ofrece horarios', async () => {
    const place = setup.repository.places.get(setup.centro);
    if (place) place.active = false;
    await expect(setup.service.slots({ locationId: setup.centro, day: MONDAY }, 'panel')).resolves.toEqual([]);
    await expect(setup.service.slots({ locationId: '00000000-0000-4000-8000-000000000000', day: MONDAY }, 'panel')).resolves.toEqual([]);
  });

  it('US-11 CA-2: sin duración definida da NO_SLOT_DURATION', async () => {
    setup.repository.settings.slotMinutes = null;
    await expect(setup.service.slots({ locationId: setup.centro, day: MONDAY }, 'panel')).rejects.toMatchObject({ code: 'NO_SLOT_DURATION' });
  });

  it('US-14 CA-1 y CA-5: un bloqueo saca los horarios de todas las ubicaciones', async () => {
    await setup.service.createBlock({ ...rangeAt('2026-11-09T12:30:00.000Z', 7 * 60), reason: 'Trámite' });
    await expect(setup.service.slots({ locationId: setup.centro, day: MONDAY }, 'panel').then(times)).resolves.toEqual([]);
    await expect(setup.service.slots({ locationId: setup.online, day: MONDAY }, 'panel').then(times)).resolves.toEqual(['16:45']);
  });

  it('US-14 CA-3: no deja bloquear un rango con turnos (BLOCK_HAS_APPOINTMENTS)', async () => {
    await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT });
    await expect(setup.service.createBlock({ ...rangeAt('2026-11-09T11:00:00.000Z', 120), reason: null })).rejects.toMatchObject({ code: 'BLOCK_HAS_APPOINTMENTS' });
    await expect(setup.service.agenda(MONDAY, 1)).resolves.toMatchObject({ blocks: [] });
  });

  it('US-14 CA-2: borra un bloqueo y el horario vuelve a ofrecerse', async () => {
    await setup.service.createBlock({ ...rangeAt('2026-11-09T12:00:00.000Z', 45), reason: null });
    const { blocks } = await setup.service.agenda(MONDAY, 1);
    await setup.service.deleteBlock({ id: blocks[0]?.id ?? '', version: 1 });
    await expect(setup.service.slots({ locationId: setup.centro, day: MONDAY }, 'panel').then(times)).resolves.toContain('09:00');
  });

  it('US-13 CA-1 y CA-2: la agenda del día y de la semana traen turnos y bloqueos de ese rango', async () => {
    await setup.service.createManual({ locationId: setup.centro, startsAt: MONDAY_9, ...PATIENT });
    await setup.service.createBlock({ ...rangeAt('2026-11-12T12:00:00.000Z', 60), reason: null });
    await expect(setup.service.agenda(MONDAY, 1)).resolves.toMatchObject({ appointments: [{ patientName: 'Ana Prueba' }], blocks: [] });
    const week = await setup.service.agenda(MONDAY, 7);
    expect([week.appointments.length, week.blocks.length]).toEqual([1, 1]);
    await expect(setup.service.agenda('2026-11-08', 1)).resolves.toEqual({ appointments: [], blocks: [] });
  });

  it('appointment de un turno inexistente da NOT_FOUND', async () => {
    await expect(setup.service.appointment('00000000-0000-4000-8000-000000000000')).rejects.toMatchObject({ code: 'NOT_FOUND', message: 'El turno ya no existe.' });
  });
});
