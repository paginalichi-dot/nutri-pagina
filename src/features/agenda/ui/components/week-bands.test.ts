import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { bandOf, bandStarts, touchesBand } from './timeline-layout';

describe('franjas de 4 horas de la semana (US-26 CA-9)', () => {
  it('por defecto van de 08 a 20 y se estiran de a 4 horas', () => {
    expect(bandStarts([])).toEqual([8, 12, 16]);
    expect(bandStarts([{ start: 360, end: 405 }])).toEqual([4, 8, 12, 16]);
    expect(bandStarts([{ start: 1215, end: 1260 }])).toEqual([8, 12, 16, 20]);
    expect(bandStarts([{ start: 0, end: 1440 }])).toEqual([0, 4, 8, 12, 16, 20]);
  });

  it('un turno cae en la franja de su hora de inicio', () => {
    expect([bandOf(540), bandOf(720), bandOf(1395), bandOf(0)]).toEqual([8, 12, 20, 0]);
  });

  it('un bloqueo toca cada franja que se pisa con él', () => {
    const block = { start: 660, end: 840 };
    expect([4, 8, 12, 16].map((band) => touchesBand(block, band))).toEqual([false, true, true, false]);
    expect(touchesBand({ start: 480, end: 720 }, 12)).toBe(false);
  });

  it('fuzz: la franja de cada item está entre las que se muestran', () => {
    const minutes = fc.tuple(fc.integer({ min: 0, max: 1439 }), fc.integer({ min: 1, max: 600 })).map(([start, length]) => ({ start, end: Math.min(1440, start + length) }));
    fc.assert(
      fc.property(fc.array(minutes, { maxLength: 8 }), (items) => {
        const bands = bandStarts(items);
        for (const item of items) expect(bands).toContain(bandOf(item.start));
      })
    );
  });
});
