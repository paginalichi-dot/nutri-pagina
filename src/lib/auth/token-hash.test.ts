import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createOneTimeToken, keyedHash, sha256 } from './token-hash';

describe('token-hash', () => {
  beforeEach(() => {
    vi.stubEnv('JWT_SECRET', 'secreto-de-prueba-con-mas-de-32-caracteres');
  });

  it('un token de un solo uso son 32 bytes en base64url y la base guarda sólo su sha256', () => {
    const { token, hash } = createOneTimeToken();
    expect(token).toMatch(/^[\w-]{43}$/);
    expect(hash).toBe(sha256(token));
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(createOneTimeToken().token).not.toBe(token);
  });

  it('el hash con clave cambia con la clave, así no se puede adivinar desde la base', () => {
    const first = keyedHash('ana@ejemplo.test');
    expect(first).toMatch(/^[0-9a-f]{64}$/);
    expect(first).not.toBe(sha256('ana@ejemplo.test'));
    vi.stubEnv('JWT_SECRET', 'otra-clave-distinta-con-mas-de-32-caracteres');
    expect(keyedHash('ana@ejemplo.test')).not.toBe(first);
  });
});
