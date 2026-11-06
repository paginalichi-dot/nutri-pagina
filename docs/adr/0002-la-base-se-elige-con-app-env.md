# 0002 — La base se elige con `APP_ENV`, no con `NODE_ENV`

- **Estado**: Aceptado (2026-11-06)

## Contexto

`next build` y `next start` corren con `NODE_ENV=production` también en local y en el CI. Si la base se eligiera
por `NODE_ENV`, un build local apuntaría a producción.

## Decisión

`src/lib/db/database-config.ts` decide con `APP_ENV`:

- `APP_ENV=production`: carga `.env.prod`; la app usa `DATABASE_URL` (pooler de Supabase, con SSL) y las
  migraciones, `DIRECT_URL`.
- Cualquier otro valor (vacío, `development`, `test`): carga `.env.local` y usa `LOCAL_DATABASE_URL`, obligatoria.
- Un valor desconocido es un error.

## Alternativas descartadas

- `NODE_ENV`: ver contexto.

## Consecuencias

En Vercel hay que definir `APP_ENV=production`, `DATABASE_URL` y `DIRECT_URL`. Los tests de integración y E2E
además verifican que la URL sea la de `db-test` (`src/test/test-database-url.ts`).
