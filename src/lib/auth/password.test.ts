import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('password', () => {
  it('un hash verifica su contraseña y no otra', async () => {
    const hash = await hashPassword('clave-correcta');
    await expect(verifyPassword('clave-correcta', hash)).resolves.toBe(true);
    await expect(verifyPassword('clave-incorrecta', hash)).resolves.toBe(false);
  });

  it('usa una sal distinta en cada hash y nunca guarda la contraseña', async () => {
    const [first, second] = await Promise.all([hashPassword('misma-clave'), hashPassword('misma-clave')]);
    expect(first).not.toBe(second);
    expect(first).not.toContain('misma-clave');
    expect(first.split('$')).toHaveLength(3);
    expect(first.startsWith('scrypt$')).toBe(true);
  });

  it('rechaza un hash válido si el esquema no es scrypt', async () => {
    const hash = await hashPassword('clave');
    await expect(verifyPassword('clave', hash.replace('scrypt$', 'bcrypt$'))).resolves.toBe(false);
  });

  it.each(['', 'bcrypt$abc$def', 'scrypt$$def', 'scrypt$abc$', 'scrypt$abc'])('rechaza un hash con formato inválido: %s', async (stored) => {
    await expect(verifyPassword('cualquiera', stored)).resolves.toBe(false);
  });

  it('rechaza un hash con la clave derivada recortada', async () => {
    const [scheme, salt, key] = (await hashPassword('clave')).split('$');
    await expect(verifyPassword('clave', `${scheme}$${salt}$${key?.slice(0, 20)}`)).resolves.toBe(false);
  });
});
