import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { WeeklyHoursUpdateSchema } from './hours.schema';
import { MAX_NEW_RANGES, NewLocationInputSchema } from './new-location.schema';

const ID = '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10';
const CENTRO = { kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: '', mapUrl: '' };
const MONDAY = { weekday: '1', start: '09:00', end: '13:00' };

describe('WeeklyHoursUpdateSchema (US-41 CA-3)', () => {
  it('separa la referencia y pasa la franja a minutos', () => {
    expect(WeeklyHoursUpdateSchema.parse({ id: ID, version: '2', start: '16:00', end: '20:00' })).toEqual({ ref: { id: ID, version: 2 }, range: { startMinute: 960, endMinute: 1200 } });
  });

  it.each([
    [{ id: ID, version: '2', start: '16:00', end: '16:00' }, 'La hora de fin tiene que ser posterior a la de inicio.'],
    [{ id: ID, version: '2', start: 'x', end: '16:00' }, 'Ingresá una hora válida (hh:mm).'],
    [{ id: 'x', version: '2', start: '09:00', end: '10:00' }, 'El registro no es válido.'],
  ])('rechaza %o con "%s"', (input, message) => {
    expect(WeeklyHoursUpdateSchema.safeParse(input).error?.issues[0]?.message).toBe(message);
  });
});

describe('NewLocationInputSchema (US-42)', () => {
  it('CA-1: arma la ubicación, la visibilidad y varias franjas por día', () => {
    const parsed = NewLocationInputSchema.parse({ location: CENTRO, active: false, hours: [MONDAY, { weekday: '1', start: '16:00', end: '20:00' }] });
    expect(parsed).toEqual({
      location: { kind: 'IN_PERSON', name: 'Consultorio Centro', address: 'Calle Falsa 123', directions: null, mapUrl: null },
      active: false,
      hours: [
        { weekday: 1, startMinute: 540, endMinute: 780 },
        { weekday: 1, startMinute: 960, endMinute: 1200 },
      ],
    });
  });

  it('CA-1: la online pide el link', () => {
    expect(NewLocationInputSchema.safeParse({ location: { kind: 'ONLINE', name: 'Online', videoUrl: '' }, active: true, hours: [] }).error?.issues[0]?.message).toBe('Ingresá un link que empiece con https://.');
  });

  it('rechaza una franja al revés y demasiadas franjas', () => {
    expect(NewLocationInputSchema.safeParse({ location: CENTRO, active: true, hours: [{ ...MONDAY, end: '08:00' }] }).error?.issues[0]?.message).toBe('La hora de fin tiene que ser posterior a la de inicio.');
    const many = Array.from({ length: MAX_NEW_RANGES + 1 }, () => MONDAY);
    expect(NewLocationInputSchema.safeParse({ location: CENTRO, active: true, hours: many }).error?.issues[0]?.message).toBe(`Cargá como mucho ${MAX_NEW_RANGES} franjas.`);
  });

  it('nunca lanza con entradas arbitrarias', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(() => NewLocationInputSchema.safeParse(input)).not.toThrow();
        expect(() => WeeklyHoursUpdateSchema.safeParse(input)).not.toThrow();
      })
    );
  });
});
