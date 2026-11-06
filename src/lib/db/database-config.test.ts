import { describe, expect, it } from 'vitest';
import { envFileFor, resolveDatabaseConfig, resolveMigrationUrl } from './database-config';

const LOCAL_URL = 'postgresql://postgres:password@127.0.0.1:5435/nutricion_db';
const PRODUCTION_URL = 'postgresql://usuario:clave@base-de-produccion.example.com:6543/postgres';

describe('envFileFor', () => {
  it.each([
    ['sin APP_ENV', {}, '.env.local'],
    ['NODE_ENV=production sin APP_ENV (next build y next start)', { NODE_ENV: 'production' }, '.env.local'],
    ['APP_ENV=development', { APP_ENV: 'development' }, '.env.local'],
    ['APP_ENV=test', { APP_ENV: 'test' }, '.env.local'],
    ['APP_ENV=production', { APP_ENV: 'production' }, '.env.prod'],
  ])('%s carga %s', (_caso, env, expected) => {
    expect(envFileFor(env)).toBe(expected);
  });
});

describe('resolveDatabaseConfig', () => {
  it('usa la base local sin SSL y con log de consultas cuando no es producción', () => {
    expect(resolveDatabaseConfig({ LOCAL_DATABASE_URL: LOCAL_URL })).toEqual({ url: LOCAL_URL, ssl: false, logQueries: true, maxConnections: undefined });
  });

  it('con NODE_ENV=production pero sin APP_ENV no usa la base de producción', () => {
    const env = { NODE_ENV: 'production', LOCAL_DATABASE_URL: LOCAL_URL, DATABASE_URL: PRODUCTION_URL };
    expect(resolveDatabaseConfig(env).url).toBe(LOCAL_URL);
  });

  it('usa la base de producción con SSL sólo con APP_ENV=production', () => {
    const env = { APP_ENV: 'production', LOCAL_DATABASE_URL: LOCAL_URL, DATABASE_URL: PRODUCTION_URL };
    expect(resolveDatabaseConfig(env)).toEqual({ url: PRODUCTION_URL, ssl: true, logQueries: false, maxConnections: 10 });
  });

  it('falla con un mensaje claro si falta LOCAL_DATABASE_URL', () => {
    expect(() => resolveDatabaseConfig({ DATABASE_URL: PRODUCTION_URL })).toThrow('Falta la variable de entorno LOCAL_DATABASE_URL.');
  });

  it('falla con un mensaje claro si en producción falta DATABASE_URL', () => {
    expect(() => resolveDatabaseConfig({ APP_ENV: 'production', LOCAL_DATABASE_URL: LOCAL_URL })).toThrow('Falta la variable de entorno DATABASE_URL.');
  });

  it.each([['prod'], ['PRODUCTION'], ['staging']])('rechaza el valor desconocido APP_ENV=%s', (appEnv) => {
    expect(() => resolveDatabaseConfig({ APP_ENV: appEnv, LOCAL_DATABASE_URL: LOCAL_URL })).toThrow(`APP_ENV inválido: "${appEnv}". Valores posibles: production, development, test o vacío.`);
  });
});

describe('resolveMigrationUrl', () => {
  const DIRECT_URL = 'postgresql://usuario:clave@base-de-produccion.example.com:5432/postgres';

  it('migra la base local cuando no es producción', () => {
    expect(resolveMigrationUrl({ LOCAL_DATABASE_URL: LOCAL_URL, DIRECT_URL })).toBe(LOCAL_URL);
  });

  it('migra por la conexión directa con APP_ENV=production', () => {
    expect(resolveMigrationUrl({ APP_ENV: 'production', DIRECT_URL, DATABASE_URL: PRODUCTION_URL })).toBe(DIRECT_URL);
  });

  it('falla con un mensaje claro si en producción falta DIRECT_URL', () => {
    expect(() => resolveMigrationUrl({ APP_ENV: 'production', DATABASE_URL: PRODUCTION_URL })).toThrow('Falta la variable de entorno DIRECT_URL.');
  });
});
