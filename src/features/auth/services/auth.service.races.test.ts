import { beforeAll, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '@/lib/auth/password';
import { AppError } from '@/lib/errors';
import { EMAIL, setupAuthService } from '../testing/auth-service.fixture';

let hash = '';

beforeAll(async () => {
  hash = await hashPassword('clave-buena');
});

describe('authService.login: escrituras que chocan o fallan', () => {
  it('un login correcto sin intentos previos no escribe en la base', async () => {
    const { service, repository } = setupAuthService(hash);
    const save = vi.spyOn(repository, 'saveLoginState');
    await service.login({ email: EMAIL, password: 'clave-buena' });
    expect(save).not.toHaveBeenCalled();
  });

  it('si otro intento escribió antes (STALE_VERSION), igual responde como fallido', async () => {
    const { service, repository } = setupAuthService(hash);
    vi.spyOn(repository, 'saveLoginState').mockRejectedValue(new AppError('STALE_VERSION'));
    await expect(service.login({ email: EMAIL, password: 'mala' })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });

  it('cualquier otro AppError de la base se propaga', async () => {
    const { service, repository } = setupAuthService(hash);
    vi.spyOn(repository, 'saveLoginState').mockRejectedValue(new AppError('NOT_FOUND'));
    await expect(service.login({ email: EMAIL, password: 'mala' })).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('un error inesperado de la base se propaga', async () => {
    const { service, repository } = setupAuthService(hash, { failedAttempts: 1 });
    vi.spyOn(repository, 'saveLoginState').mockRejectedValue(new Error('base caída'));
    await expect(service.login({ email: EMAIL, password: 'clave-buena' })).rejects.toThrow('base caída');
  });
});
