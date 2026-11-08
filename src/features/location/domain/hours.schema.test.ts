import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { WeeklyHoursInputSchema } from './hours.schema';

const LOCATION_ID = '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10';
const VALID = { locationId: LOCATION_ID, weekday: '1', start: '09:00', end: '13:30' };

describe('WeeklyHoursInputSchema', () => {
  it('convierte la franja a minutos del día', () => {
    expect(WeeklyHoursInputSchema.parse(VALID)).toEqual({ locationId: LOCATION_ID, weekday: 1, startMinute: 540, endMinute: 810 });
  });

  it.each([
    [{ ...VALID, weekday: '0' }, 'Elegí un día de la semana.'],
    [{ ...VALID, weekday: '8' }, 'Elegí un día de la semana.'],
    [{ ...VALID, start: '9' }, 'Ingresá una hora válida (hh:mm).'],
    [{ ...VALID, end: '25:00' }, 'Ingresá una hora válida (hh:mm).'],
    [{ ...VALID, end: '09:00' }, 'La hora de fin tiene que ser posterior a la de inicio.'],
    [{ ...VALID, end: '08:00' }, 'La hora de fin tiene que ser posterior a la de inicio.'],
    [{ ...VALID, locationId: 'x' }, 'La ubicación no es válida.'],
  ])('rechaza %o con "%s"', (input, message) => {
    expect(WeeklyHoursInputSchema.safeParse(input).error?.issues[0]?.message).toBe(message);
  });

  it('el error de orden se marca en la hora de fin', () => {
    expect(WeeklyHoursInputSchema.safeParse({ ...VALID, end: '08:00' }).error?.issues[0]?.path).toEqual(['end']);
  });

  it('nunca lanza con entradas arbitrarias', () => {
    fc.assert(fc.property(fc.anything(), (input) => {
      expect(() => WeeklyHoursInputSchema.safeParse(input)).not.toThrow();
    }));
  });
});
