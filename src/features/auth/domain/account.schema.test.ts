import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { ChangeEmailInputSchema, ChangePasswordInputSchema } from './account.schema';

const EMAIL = { email: 'lisandro@ejemplo.test', currentPassword: 'actual' };
const PASSWORD = { currentPassword: 'actual', newPassword: 'nueva-clave', confirmPassword: 'nueva-clave' };

function firstMessage(schema: typeof ChangeEmailInputSchema | typeof ChangePasswordInputSchema, input: unknown): string | undefined {
  const result = schema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('ChangeEmailInputSchema', () => {
  it('acepta un email nuevo y lo normaliza', () => {
    expect(ChangeEmailInputSchema.parse({ ...EMAIL, email: ' Lisandro@Ejemplo.TEST ' })).toEqual(EMAIL);
  });

  it.each([
    [{ ...EMAIL, email: 'no-es-email' }, 'Ingresá un email válido.'],
    [{ ...EMAIL, currentPassword: '' }, 'Ingresá tu contraseña actual.'],
    [{ ...EMAIL, currentPassword: 'x'.repeat(129) }, 'La contraseña es demasiado larga.'],
  ])('rechaza %o con "%s"', (input, message) => {
    expect(firstMessage(ChangeEmailInputSchema, input)).toBe(message);
  });

  it('rechaza campos de más', () => {
    expect(ChangeEmailInputSchema.safeParse({ ...EMAIL, id: 'otro' }).success).toBe(false);
  });
});

describe('ChangePasswordInputSchema', () => {
  it('acepta una contraseña nueva de 8 a 128 caracteres repetida igual', () => {
    expect(ChangePasswordInputSchema.parse(PASSWORD)).toEqual(PASSWORD);
    const longest = 'x'.repeat(128);
    expect(ChangePasswordInputSchema.safeParse({ ...PASSWORD, newPassword: longest, confirmPassword: longest }).success).toBe(true);
  });

  it.each([
    [{ ...PASSWORD, currentPassword: '' }, 'Ingresá tu contraseña actual.'],
    [{ ...PASSWORD, newPassword: '1234567', confirmPassword: '1234567' }, 'La contraseña nueva tiene que tener al menos 8 caracteres.'],
    [{ ...PASSWORD, newPassword: 'x'.repeat(129), confirmPassword: 'x'.repeat(129) }, 'La contraseña es demasiado larga.'],
    [{ ...PASSWORD, confirmPassword: 'otra-clave' }, 'Las contraseñas no coinciden.'],
  ])('rechaza %o con "%s"', (input, message) => {
    expect(firstMessage(ChangePasswordInputSchema, input)).toBe(message);
  });

  it('la repetición distinta se marca en el campo de repetición', () => {
    const result = ChangePasswordInputSchema.safeParse({ ...PASSWORD, confirmPassword: 'otra-clave' });
    expect(result.success ? [] : result.error.issues[0]?.path).toEqual(['confirmPassword']);
  });

  it('nunca lanza: cualquier entrada se acepta o se rechaza con un mensaje', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        const result = ChangePasswordInputSchema.safeParse(input);
        expect(result.success || result.error.issues.length > 0).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
