import { describe, expect, it } from 'vitest';
import { appUrlFromEnv } from './app-url';

describe('appUrlFromEnv', () => {
  it('usa APP_URL sin la barra final', () => {
    expect(appUrlFromEnv({ APP_URL: 'https://lisandrolopez.test/' })).toBe('https://lisandrolopez.test');
  });

  it('en local, sin APP_URL, apunta al servidor de desarrollo', () => {
    expect(appUrlFromEnv({})).toBe('http://localhost:3000');
  });

  it('en producción, sin APP_URL, falla en voz alta', () => {
    expect(() => appUrlFromEnv({ APP_ENV: 'production' })).toThrow('APP_URL falta');
  });
});
