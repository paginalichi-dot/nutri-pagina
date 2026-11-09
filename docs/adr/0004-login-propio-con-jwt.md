# 0004 — Login propio con JWT para el panel

- **Estado**: Aceptado (2026-11-06) · Reemplaza a la parte de autenticación de [0003](0003-prisma-y-supabase-auth.md) · [0006](0006-cuentas-de-pacientes-con-email-y-contrasena.md) lo amplía a admin y pacientes

## Contexto

ADR 0003 eligió Supabase Auth para el único usuario del panel. Con Supabase Auth, el login depende de un proyecto
en la nube incluso en desarrollo: la base de datos corre en Docker, pero el login no. Los tests tienen que simular
a Supabase y el flujo completo sólo se puede probar contra el proyecto real.

El dev quiere probar todo el sistema, login incluido, con Docker y sin depender de un servicio externo. Además ya
tiene un login con JWT en *gestor-empanaderia* (`jose`, cookie `httpOnly`, proxy que verifica el token).

## Decisión

- **Login propio** con email y contraseña. El usuario admin vive en una tabla propia (`admin_user`) en la misma
  base que el resto. No hay registro público: la cuenta de prueba la crea el seed, y el admin cambia su email y su
  contraseña desde el panel.
- **Sesión permanente**: un JWT HS256 firmado con `jose` y `JWT_SECRET` (sólo en el servidor), sin vencimiento,
  en una cookie `httpOnly`, `Secure` y `SameSite=Lax`. Los navegadores no guardan una cookie más de 400 días, así
  que el proxy la renueva en cada visita al panel.
- **Revocación**: el token lleva la `session_version` del admin. Cambiar el email o la contraseña la incrementa,
  y eso cierra todas las demás sesiones abiertas.
- **Contraseñas**: hash con `scrypt` de `node:crypto` (sal aleatoria por usuario y comparación con
  `timingSafeEqual`). No se suma una dependencia nativa como `bcrypt`.
- **Intentos fallidos**: se cuentan en la fila del admin (`failed_attempts`, `locked_until`), no en memoria,
  porque en Vercel cada instancia tiene su propia memoria.
- **Verificación**: `proxy.ts` sólo verifica la firma del token (chequeo optimista, sin base, como pide Next 16).
  `requireAdmin()` vuelve a verificarlo y además compara la `session_version` contra la base, en el layout de
  `/admin` y en cada action del panel. Como necesita el repositorio, vive en `src/features/auth/services/`, y es lo
  único de otro feature que pueden importar las actions del panel.
- Supabase queda sólo como host de PostgreSQL en producción.

## Alternativas descartadas

- Supabase Auth (ADR 0003): obliga a usar la nube en desarrollo y a simular el login en los tests.
- Copiar tal cual el login de gestor-empanaderia: su límite de intentos vive en memoria, responde más rápido
  cuando el usuario no existe (eso delata qué emails existen) y su `lib/auth` importa features, contra las reglas
  de capas de este repo.
- `bcrypt`: es un módulo nativo; `scrypt` viene con Node y cumple lo mismo.

## Consecuencias

- Todo el sistema se prueba con Docker: integración y E2E del login usan `db-test` y un admin ficticio del seed.
- El código de seguridad es propio, así que se prueba con nivel 3: tiempos parejos, bloqueo por intentos, token
  vencido o adulterado, y que el hash nunca salga del repositorio.
- No hay "olvidé mi contraseña": el admin la cambia desde el panel, sabiendo la actual.
- Como la sesión no vence, quien use un dispositivo con la sesión abierta entra al panel. Se cierra con "Cerrar
  sesión" o cambiando la contraseña. Si se filtra `JWT_SECRET`, se rota y se cierran todas las sesiones.
- Cada action del panel hace una consulta más a la base (la `session_version`).
- El alta del admin de producción queda para el ítem de despliegue.
- Variables: sale `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`;
  entra `JWT_SECRET`.
