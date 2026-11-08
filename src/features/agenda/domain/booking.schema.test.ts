import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { ManualAppointmentInputSchema, SlotQuerySchema } from './booking.schema';

const LOCATION = '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10';
const VALID = { locationId: LOCATION, startsAt: '2026-11-10T13:00:00.000Z', name: ' Ana Prueba ', phone: '11 2345-6789', email: ' Ana@Ejemplo.TEST ', healthInsuranceId: '' };

const message = (input: unknown): string | undefined => ManualAppointmentInputSchema.safeParse(input).error?.issues[0]?.message;

describe('ManualAppointmentInputSchema', () => {
  it('normaliza los datos del paciente; sin obra social es Particular (null)', () => {
    expect(ManualAppointmentInputSchema.parse(VALID)).toEqual({
      locationId: LOCATION,
      startsAt: new Date('2026-11-10T13:00:00.000Z'),
      name: 'Ana Prueba',
      phone: '11 2345-6789',
      email: 'ana@ejemplo.test',
      healthInsuranceId: null,
    });
  });

  it('US-16 CA-1: el email es opcional en un turno cargado a mano', () => {
    expect(ManualAppointmentInputSchema.parse({ ...VALID, email: '' })).toMatchObject({ email: null });
  });

  it.each([
    [{ ...VALID, name: '' }, 'Ingresá el nombre del paciente.'],
    [{ ...VALID, name: 'x'.repeat(81) }, 'El nombre es demasiado largo (máximo 80 caracteres).'],
    [{ ...VALID, phone: '' }, 'Ingresá un teléfono.'],
    [{ ...VALID, phone: '2345-6789' }, 'Ingresá el teléfono con código de área, por ejemplo 11 2345-6789.'],
    [{ ...VALID, phone: 'once 2345 6789' }, 'Ingresá el teléfono con código de área, por ejemplo 11 2345-6789.'],
    [{ ...VALID, phone: '1'.repeat(21) }, 'El teléfono es demasiado largo.'],
    [{ ...VALID, email: 'no-es-email' }, 'Ingresá un email válido o dejalo vacío.'],
    [{ ...VALID, healthInsuranceId: 'otra' }, 'Elegí una obra social de la lista.'],
    [{ ...VALID, startsAt: '10/11 10:00' }, 'Elegí un horario.'],
    [{ ...VALID, locationId: '' }, 'Elegí una ubicación.'],
  ])('rechaza %o con "%s"', (input, expected) => {
    expect(message(input)).toBe(expected);
  });

  it('nunca lanza con entradas arbitrarias', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(() => ManualAppointmentInputSchema.safeParse(input)).not.toThrow();
      })
    );
  });
});

describe('SlotQuerySchema', () => {
  it('acepta una ubicación y un día', () => {
    expect(SlotQuerySchema.parse({ locationId: LOCATION, day: '2026-11-10' })).toEqual({ locationId: LOCATION, day: '2026-11-10' });
  });

  it('rechaza un día inválido', () => {
    expect(SlotQuerySchema.safeParse({ locationId: LOCATION, day: '2026-02-30' }).error?.issues[0]?.message).toBe('Elegí un día.');
  });
});
