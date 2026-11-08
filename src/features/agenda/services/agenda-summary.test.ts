import fc from 'fast-check';
import { beforeEach, describe, expect, it } from 'vitest';
import { aNewAppointment, CENTRO, ONLINE, rangeAt } from '../testing/agenda-builders';
import { type AgendaSetup, agendaSetup, MONDAY } from '../testing/agenda-service.fixture';
import { countNewPatients, dayTime } from './agenda-summary';

const ANA = { phone: '11 1111-1111', email: 'ana@ejemplo.test' };
const BETO = { phone: '11 2222-2222', email: null };

describe('countNewPatients (US-26 CA-3)', () => {
  it('es nuevo quien no aparece antes ni por teléfono ni por email, y cuenta una vez', () => {
    expect(countNewPatients([ANA, BETO, BETO], [])).toBe(2);
    expect(countNewPatients([{ phone: '+54 9 11 1111-1111', email: null }], [ANA])).toBe(0);
    expect(countNewPatients([{ phone: '11 9999-9999', email: 'ANA@ejemplo.test' }], [ANA])).toBe(0);
    expect(countNewPatients([ANA, { phone: '11 9999-9999', email: 'ana@ejemplo.test' }], [])).toBe(1);
  });

  it('fuzz: nunca pasa de los turnos de la semana y nadie conocido es nuevo', () => {
    const contact = fc.record({ phone: fc.string(), email: fc.option(fc.emailAddress(), { nil: null }) });
    fc.assert(
      fc.property(fc.array(contact), fc.array(contact), (week, prior) => {
        const count = countNewPatients(week, prior);
        expect(count).toBeGreaterThanOrEqual(0);
        expect(count).toBeLessThanOrEqual(week.length);
        expect(countNewPatients(week, [...prior, ...week])).toBe(0);
      })
    );
  });
});

describe('dayTime (US-26 CA-3)', () => {
  const hours = [...CENTRO.hours, ...ONLINE.hours];
  it('disponibles: la grilla del día menos los bloqueos; libres: además, menos los turnos', () => {
    expect(dayTime({ day: MONDAY, hours, slotMinutes: 45, blocks: [], appointments: [] })).toEqual({ availableMinutes: 315, freeMinutes: 315 });
    const blocks = [rangeAt('2026-11-09T19:00:00.000Z', 60)];
    expect(dayTime({ day: MONDAY, hours, slotMinutes: 45, blocks, appointments: [rangeAt('2026-11-09T12:00:00.000Z')] })).toEqual({ availableMinutes: 225, freeMinutes: 180 });
    expect(dayTime({ day: '2026-11-10', hours, slotMinutes: 45, blocks: [], appointments: [] })).toEqual({ availableMinutes: 0, freeMinutes: 0 });
  });
});

describe('agendaService.summary (US-26 CA-3 y CA-5)', () => {
  let setup: AgendaSetup;
  const add = (iso: string, overrides: Record<string, unknown> = {}): Promise<string> => setup.repository.createAppointment(aNewAppointment(setup.centro, { ...rangeAt(iso), patientPhone: ANA.phone, patientEmail: ANA.email, ...overrides }));
  beforeEach(async () => {
    setup = await agendaSetup();
    setup.clock.now = new Date('2026-11-09T13:00:00.000Z');
  });

  it('cuenta hoy contra ayer, la semana contra la anterior, los pacientes nuevos, las horas y el próximo turno', async () => {
    await add('2026-11-02T12:00:00.000Z');
    await add('2026-11-08T12:00:00.000Z');
    await add('2026-11-09T12:00:00.000Z');
    await add('2026-11-09T12:45:00.000Z', { patientPhone: BETO.phone, patientEmail: null });
    await setup.repository.updateStatus({ id: await add('2026-11-09T13:30:00.000Z', { patientPhone: '11 3333-3333' }), version: 1 }, 'CANCELLED');
    const next = await add('2026-11-11T12:00:00.000Z', { patientPhone: BETO.phone, patientEmail: null, status: 'PENDING' });
    await expect(setup.service.summary()).resolves.toMatchObject({
      today: { count: 2, yesterday: 1 },
      week: { count: 3, previous: 2 },
      newPatients: 1,
      time: { availableMinutes: 315, freeMinutes: 225 },
      next: { id: next, status: 'PENDING', locationName: 'Consultorio Centro' },
    });
  });

  it('sin duración definida no calcula horas, y sin turnos por venir no hay próximo', async () => {
    setup.repository.settings.slotMinutes = null;
    await expect(setup.service.summary()).resolves.toMatchObject({ time: null, next: null, newPatients: 0 });
  });
});
