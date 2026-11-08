import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { dayMinutes, HOUR_HEIGHT, hourSpan, onDay, placement } from './timeline-layout';

const range = (startsAt: string, endsAt: string): { startsAt: Date; endsAt: Date } => ({ startsAt: new Date(startsAt), endsAt: new Date(endsAt) });

describe('línea de horas (US-26 CA-4)', () => {
  it('ubica un turno por sus minutos en hora argentina, también el de las 22:00 que en UTC es el día siguiente', () => {
    expect(dayMinutes('2026-11-09', range('2026-11-09T12:00:00Z', '2026-11-09T12:45:00Z'))).toEqual({ start: 540, end: 585 });
    const late = range('2026-11-10T01:00:00Z', '2026-11-10T01:45:00Z');
    expect(onDay('2026-11-09')(late)).toBe(true);
    expect(dayMinutes('2026-11-09', late)).toEqual({ start: 1320, end: 1365 });
  });

  it('un bloqueo de varios días ocupa el día entero', () => {
    const block = range('2026-11-08T15:00:00Z', '2026-11-11T15:00:00Z');
    expect(onDay('2026-11-09')(block)).toBe(true);
    expect(dayMinutes('2026-11-09', block)).toEqual({ start: 0, end: 1440 });
  });

  it('va de 08:00 a 18:00 y se estira si algo cae afuera', () => {
    expect(hourSpan([])).toEqual({ first: 8, last: 18 });
    expect(
      hourSpan([
        { start: 420, end: 465 },
        { start: 1320, end: 1365 },
      ])
    ).toEqual({ first: 7, last: 23 });
  });

  it('la posición sale de los minutos y un turno muy corto igual se lee', () => {
    expect(placement({ start: 540, end: 585 }, 8)).toEqual({ top: HOUR_HEIGHT, height: 48 });
    expect(placement({ start: 480, end: 490 }, 8).height).toBe(34);
  });

  it('fuzz: todo lo que entra en el rango queda adentro de la línea', () => {
    const minutes = fc.tuple(fc.integer({ min: 0, max: 1439 }), fc.integer({ min: 1, max: 240 })).map(([start, length]) => ({ start, end: Math.min(1440, start + length) }));
    fc.assert(
      fc.property(fc.array(minutes, { maxLength: 6 }), (items) => {
        const { first, last } = hourSpan(items);
        for (const item of items) {
          const { top } = placement(item, first);
          expect(top).toBeGreaterThanOrEqual(0);
          expect(top).toBeLessThanOrEqual((last - first) * HOUR_HEIGHT);
        }
      })
    );
  });
});
