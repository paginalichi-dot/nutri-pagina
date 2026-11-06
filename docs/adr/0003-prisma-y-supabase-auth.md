# 0003 — Prisma como ORM y Supabase Auth para el panel

- **Estado**: Aceptado (2026-11-06)

## Contexto

El dev eligió Next.js, PostgreSQL en Supabase y Prisma. gestor-empanaderia usa Drizzle y un login propio con JWT.

## Decisión

- **Prisma 7** con `@prisma/adapter-pg`. El cliente vive en `src/lib/db/index.ts` y lo usan sólo los repositorios.
- **Prohibido SQL plano en código** (`$queryRaw`, `$executeRaw`, `pg` directo): ESLint lo bloquea. El SQL a mano
  va sólo en migraciones, para restricciones que Prisma no expresa (`CHECK`, `EXCLUDE`, índices parciales).
- Los tipos generados por Prisma no salen del repositorio: `domain` define los suyos con Zod.
- **Supabase Auth** para el único usuario del panel. Los pacientes no tienen cuenta.

## Alternativas descartadas

- Drizzle: es lo que usa gestor-empanaderia, pero el dev eligió Prisma para este proyecto.
- Login propio con JWT y `bcrypt`: más código de seguridad propio para un solo usuario.

## Consecuencias

La regla "sin SQL plano" cambia de forma (en Drizzle era prohibir el import `sql`). Las restricciones de la base
viven repartidas entre `schema.prisma` y el SQL de las migraciones, y se prueban con integración.
