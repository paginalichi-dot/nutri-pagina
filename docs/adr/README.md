# Decisiones de arquitectura (ADR)

Una decisión por archivo: `docs/adr/NNNN-titulo-en-kebab-case.md`, a partir de
[`docs/templates/adr.md`](../templates/adr.md). Un ADR aceptado no se edita: si la decisión cambia, se escribe uno
nuevo que lo reemplaza y se actualiza el estado del anterior.

| N° | Título | Estado | Fecha |
|---|---|---|---|
| [0001](0001-base-de-gestor-empanaderia.md) | Arquitectura, reglas y gates heredados de gestor-empanaderia | Aceptado | 2026-11-06 |
| [0002](0002-la-base-se-elige-con-app-env.md) | La base se elige con `APP_ENV`, no con `NODE_ENV` | Aceptado | 2026-11-06 |
| [0003](0003-prisma-y-supabase-auth.md) | Prisma como ORM y Supabase Auth para el panel | Aceptado; la parte de auth la reemplaza 0004 | 2026-11-06 |
| [0004](0004-login-propio-con-jwt.md) | Login propio con JWT para el panel | Aceptado | 2026-11-06 |
