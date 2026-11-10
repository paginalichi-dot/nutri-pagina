import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { HealthInsuranceInputSchema, SlotMinutesInputSchema } from './settings.schema';

describe('SlotMinutesInputSchema', () => {
  it.each([
    ['1', 1],
    ['7', 7],
    [' 50 ', 50],
    ['600', 600],
  ])('US-44 CA-2: acepta %s minutos', (slotMinutes, expected) => {
    expect(SlotMinutesInputSchema.parse({ slotMinutes, version: '0' })).toEqual({ slotMinutes: expected, version: 0 });
  });

  it.each([[''], ['0'], ['-5'], ['45.5'], ['1e2'], ['media hora'], ['99999999999']])('US-44 CA-2: rechaza «%s»', (slotMinutes) => {
    expect(SlotMinutesInputSchema.safeParse({ slotMinutes, version: '1' }).error?.issues[0]?.message).toBe('Ingresá los minutos como un número entero mayor que 0.');
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
