import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { BlockInputSchema } from './block.schema';

describe('BlockInputSchema', () => {
  it('US-14 CA-1: interpreta las fechas en hora de Argentina y las guarda en UTC', () => {
    expect(BlockInputSchema.parse({ start: '2026-12-24T22:00', end: '2027-01-02T09:00', reason: ' Vacaciones ' })).toEqual({
      startsAt: new Date('2026-12-25T01:00:00.000Z'),
      endsAt: new Date('2027-01-02T12:00:00.000Z'),
      reason: 'Vacaciones',
    });
  });

  it('el motivo es opcional', () => {
    expect(BlockInputSchema.parse({ start: '2026-11-10T09:00', end: '2026-11-10T11:00', reason: '' })).toMatchObject({ reason: null });
  });

  it.each([
    [{ start: '2026-11-10', end: '2026-11-10T11:00', reason: '' }, 'Ingresá una fecha y una hora válidas.'],
    [{ start: '2026-11-31T09:00', end: '2026-12-01T11:00', reason: '' }, 'Ingresá una fecha y una hora válidas.'],
    [{ start: '2026-11-10T11:00', end: '2026-11-10T11:00', reason: '' }, 'El fin del bloqueo tiene que ser posterior al inicio.'],
    [{ start: '2026-11-10T09:00', end: '2026-11-10T11:00', reason: 'x'.repeat(101) }, 'El motivo es demasiado largo (máximo 100 caracteres).'],
  ])('US-14 CA-4: rechaza %o con "%s"', (input, message) => {
    expect(BlockInputSchema.safeParse(input).error?.issues[0]?.message).toBe(message);
  });

  it('nunca lanza con entradas arbitrarias', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(() => BlockInputSchema.safeParse(input)).not.toThrow();
      })
    );
  });
});
