import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { LoginInputSchema } from './login.schema';

const VALID = { email: 'admin@ejemplo.test', password: 'una-clave', website: '' };

function firstMessage(input: unknown): string | undefined {
  const result = LoginInputSchema.safeParse(input);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe('LoginInputSchema', () => {
  it('acepta un login válido y normaliza el email a minúsculas y sin espacios', () => {
    expect(LoginInputSchema.parse({ ...VALID, email: '  Admin@Ejemplo.TEST ' })).toEqual(VALID);
  });

  it.each([
    [{ ...VALID, email: 'no-es-un-email' }, 'Ingresá un email válido.'],
    [{ ...VALID, email: `${'a'.repeat(250)}@ej.test` }, 'El email es demasiado largo.'],
    [{ ...VALID, password: '' }, 'Ingresá tu contraseña.'],
    [{ ...VALID, password: 'x'.repeat(129) }, 'La contraseña es demasiado larga.'],
    [{ ...VALID, website: 'http://spam.test' }, 'Revisá los datos ingresados.'],
  ])('rechaza %o con "%s"', (input, message) => {
    expect(firstMessage(input)).toBe(message);
  });

  it('acepta una contraseña de 128 caracteres', () => {
    expect(LoginInputSchema.safeParse({ ...VALID, password: 'x'.repeat(128) }).success).toBe(true);
  });

  it('rechaza campos de más', () => {
    expect(LoginInputSchema.safeParse({ ...VALID, role: 'admin' }).success).toBe(false);
  });

  it('nunca lanza: cualquier entrada se acepta o se rechaza con un mensaje', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        const result = LoginInputSchema.safeParse(input);
        expect(result.success || result.error.issues.length > 0).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
