import { describe, expect, it } from 'vitest';
import { argentinaMonthRange, blockTouchesHours, locationStats } from './location-stats';

const NOVEMBER = argentinaMonthRange(new Date('2026-11-15T12:00:00Z'));
const MONDAY_MORNING = [{ weekday: 1, startMinute: 540, endMinute: 780 }];
const SUNDAY_NIGHT = [{ weekday: 7, startMinute: 1320, endMinute: 1439 }];
const block = (from: string, to: string): { startsAt: Date; endsAt: Date } => ({ startsAt: new Date(from), endsAt: new Date(to) });

describe('estadísticas de la ubicación (US-41 CA-4)', () => {
  it('el mes va de la medianoche argentina del 1 a la del 1 del mes siguiente', () => {
    expect(NOVEMBER).toEqual({ startsAt: new Date('2026-11-01T03:00:00Z'), endsAt: new Date('2026-12-01T03:00:00Z') });
    expect(argentinaMonthRange(new Date('2026-12-01T02:30:00Z'))).toEqual(NOVEMBER);
  });

  it.each([
    ['pisa una franja del lunes', block('2026-11-09T13:00:00Z', '2026-11-09T14:00:00Z'), true],
    ['toca justo el final de la franja', block('2026-11-09T16:00:00Z', '2026-11-09T17:00:00Z'), false],
    ['termina justo cuando empieza la franja', block('2026-11-09T11:00:00Z', '2026-11-09T12:00:00Z'), false],
    ['cae un martes', block('2026-11-10T13:00:00Z', '2026-11-10T14:00:00Z'), false],
    ['es una semana entera', block('2026-11-04T03:00:00Z', '2026-11-11T03:00:00Z'), true],
    ['es de otro mes', block('2026-12-07T13:00:00Z', '2026-12-07T14:00:00Z'), false],
  ])('un bloqueo que %s cuenta: %s', (_caso, value, expected) => {
    expect(blockTouchesHours(value, MONDAY_MORNING, NOVEMBER)).toBe(expected);
  });

  it('cruce de medianoche: un bloqueo del domingo 22 h al lunes 2 h argentinos pisa la franja del domingo a la noche', () => {
    expect(blockTouchesHours(block('2026-11-09T01:00:00Z', '2026-11-09T05:00:00Z'), SUNDAY_NIGHT, NOVEMBER)).toBe(true);
    expect(blockTouchesHours(block('2026-11-09T03:00:00Z', '2026-11-09T05:00:00Z'), SUNDAY_NIGHT, NOVEMBER)).toBe(false);
  });

  it('sólo la parte del bloqueo dentro del mes cuenta', () => {
    expect(blockTouchesHours(block('2026-11-30T13:00:00Z', '2026-12-07T15:00:00Z'), MONDAY_MORNING, NOVEMBER)).toBe(true);
    expect(blockTouchesHours(block('2026-10-26T13:00:00Z', '2026-11-01T05:00:00Z'), MONDAY_MORNING, NOVEMBER)).toBe(false);
  });

  it('junta los turnos del mes con los bloqueos que pisan sus horarios', () => {
    const activity = { appointments: 6, blocks: [block('2026-11-09T13:00:00Z', '2026-11-09T14:00:00Z'), block('2026-11-10T13:00:00Z', '2026-11-10T14:00:00Z')] };
    expect(locationStats(activity, MONDAY_MORNING, NOVEMBER)).toEqual({ appointmentsThisMonth: 6, blocksThisMonth: 1 });
  });
});
