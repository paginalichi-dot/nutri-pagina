import { describe, expect, it } from 'vitest';
import { APPOINTMENT_STATUSES, type AppointmentStatus, canTransition, isActiveStatus, STATUS_LABELS } from './appointment.schema';

const ALLOWED: ReadonlyArray<readonly [AppointmentStatus, AppointmentStatus]> = [
  ['PENDING', 'CONFIRMED'],
  ['PENDING', 'CANCELLED'],
  ['CONFIRMED', 'ATTENDED'],
  ['CONFIRMED', 'NO_SHOW'],
  ['CONFIRMED', 'CANCELLED'],
];

describe('canTransition', () => {
  it.each(ALLOWED)('T-6 CA-3: permite %s → %s', (from, to) => {
    expect(canTransition(from, to)).toBe(true);
  });

  it('T-6 CA-3: rechaza cualquier otra transición', () => {
    const others = APPOINTMENT_STATUSES.flatMap((from) => APPOINTMENT_STATUSES.map((to) => [from, to] as const)).filter(
      ([from, to]) => !ALLOWED.some(([a, b]) => a === from && b === to)
    );
    expect(others).toHaveLength(20);
    for (const [from, to] of others) expect(canTransition(from, to)).toBe(false);
  });
});

describe('estados', () => {
  it('sólo pendiente y confirmado ocupan el horario', () => {
    expect(APPOINTMENT_STATUSES.filter(isActiveStatus)).toEqual(['PENDING', 'CONFIRMED']);
  });

  it('cada estado tiene su nombre en español', () => {
    expect(Object.values(STATUS_LABELS)).toEqual(['Pendiente', 'Confirmado', 'Asistió', 'Ausente', 'Cancelado']);
  });
});
