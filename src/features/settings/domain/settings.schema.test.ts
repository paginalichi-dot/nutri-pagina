import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { HealthInsuranceInputSchema, SlotMinutesInputSchema } from './settings.schema';

describe('SlotMinutesInputSchema', () => {
  it.each([
    ['15', 15],
    ['45', 45],
    ['120', 120],
  ])('acepta %s minutos', (slotMinutes, expected) => {
    expect(SlotMinutesInputSchema.parse({ slotMinutes, version: '0' })).toEqual({ slotMinutes: expected, version: 0 });
  });

  it.each([
    ['10', 'La duración va de 15 a 120 minutos.'],
    ['125', 'La duración va de 15 a 120 minutos.'],
    ['47', 'Usá múltiplos de 5 minutos.'],
    ['45.5', 'La duración va de 15 a 120 minutos.'],
    ['media hora', 'La duración va de 15 a 120 minutos.'],
  ])('rechaza %s con "%s"', (slotMinutes, message) => {
    expect(SlotMinutesInputSchema.safeParse({ slotMinutes, version: '1' }).error?.issues[0]?.message).toBe(message);
  });

  it('rechaza una versión negativa', () => {
    expect(SlotMinutesInputSchema.safeParse({ slotMinutes: '45', version: '-1' }).error?.issues[0]?.message).toBe('El registro no es válido.');
  });
});

describe('HealthInsuranceInputSchema', () => {
  it('acepta un nombre y le saca los espacios', () => {
    expect(HealthInsuranceInputSchema.parse({ name: '  Prepaga Uno ' })).toEqual({ name: 'Prepaga Uno' });
  });

  it.each([
    ['', 'Ingresá el nombre de la obra social.'],
    ['x'.repeat(61), 'El nombre es demasiado largo (máximo 60 caracteres).'],
    [' PARTICULAR ', '«Particular» ya está siempre como opción.'],
  ])('rechaza «%s» con "%s"', (name, message) => {
    expect(HealthInsuranceInputSchema.safeParse({ name }).error?.issues[0]?.message).toBe(message);
  });

  it('nunca lanza con entradas arbitrarias', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(() => HealthInsuranceInputSchema.safeParse(input)).not.toThrow();
        expect(() => SlotMinutesInputSchema.safeParse(input)).not.toThrow();
      })
    );
  });
});
