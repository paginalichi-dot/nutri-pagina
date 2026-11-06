# Auth (login del panel)

Decisión de base: [ADR 0004](../../adr/0004-login-propio-con-jwt.md). Plan: [T-3](../../plans/T-3-login-panel.md).

## Qué hace

- El admin entra por `/admin/login` con email y contraseña. No hay registro público ni "olvidé mi contraseña".
- La sesión es un JWT HS256 (`jose`, `JWT_SECRET`) sin vencimiento, en la cookie `session` (`httpOnly`, `Secure`,
  `SameSite=Lax`, 400 días). El proxy la renueva en cada navegación real del navegador (`sec-fetch-dest: document`) a `/admin/**` y la borra si el token es inválido.
- El token lleva `sub` (id del admin) y `sv` (`session_version`). `requireAdmin()` verifica la firma y compara
  `sv` con la base: si no coincide, la sesión está cerrada (`SESSION_EXPIRED`). Cambiar email o contraseña (US-5)
  incrementa la `session_version` y cierra las demás sesiones.
- Cualquiera que entre a `/admin` o `/admin/**` sin una sesión válida ve "Acceso denegado" (`noindex`; responde 200, ver "Riesgos" en el plan). Ningún
  link lleva al login. Una sesión cerrada desde otro dispositivo vuelve a `/admin/login`.
- Las contraseñas se guardan con `scrypt` (`node:crypto`, sal de 16 bytes) y se comparan con `timingSafeEqual`. Un
  email inexistente se compara contra un hash de relleno, para que tarde lo mismo.
- 5 intentos fallidos seguidos bloquean el login 15 minutos. El contador vive en la fila del admin
  (`failed_attempts`, `locked_until`) y vuelve a cero con un login correcto o cuando vence el bloqueo.
- La cuenta de prueba la crea `npm run db:seed` (datos ficticios en `src/features/auth/testing/test-admin.ts`). El
  seed se niega con `APP_ENV=production`. El E2E la carga sola (`e2e:server`).

## Quién lo usa

| Acción | Paciente (sin cuenta) | Admin |
|---|---|---|
| Ver `/admin/**` | No: "Acceso denegado" | Sí |
| Iniciar sesión | — (la página existe, pero nada lleva ahí) | Sí |
| Cerrar sesión | — | Sí |

## Server Actions

| Action | Entrada | Salida | Pública |
|---|---|---|---|
| `login` (`actions/login.ts`) | `FormData`: `email`, `password`, `website` (honeypot vacío) | `ActionResult`; si sale bien, cookie + `redirect('/admin')` | Sí (honeypot + bloqueo por intentos) |
| `logout` (`actions/logout.ts`) | — | borra la cookie + `redirect('/admin/login')` | — |

`requireAdmin()`, `hasAdminSession()` y `guardAdminPage()` viven en `actions/require-admin.ts` (no son Server
Actions). Toda action del panel de cualquier feature empieza con `await requireAdmin()`.

## Pantallas

- `/admin/login`: tarjeta de login (`DESIGN.md`, panel admin). Con sesión válida lleva a `/admin`.
- `/admin`: título "Panel" y "Cerrar sesión". El layout `(panel)` llama a `guardAdminPage()`.
- `src/app/forbidden.tsx`: "Acceso denegado" con la píldora Verde Lima "Volver al inicio".

## Errores

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Email inválido, contraseña vacía o de más de 128, honeypot completo o faltante | `VALIDATION` | Revisá los datos ingresados. | `login.test.ts` |
| Email inexistente o contraseña incorrecta | `INVALID_CREDENTIALS` | El email o la contraseña no son correctos. | `login.test.ts`, `auth.service.test.ts` |
| 5 intentos fallidos seguidos, o login durante el bloqueo | `RATE_LIMITED` | Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo. | `login.test.ts`, `auth.service.test.ts` |
| Action o página del panel sin cookie o con token adulterado | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `require-admin.test.ts`, `session.service.test.ts` |
| Sesión cerrada (cambió la `session_version`) | `SESSION_EXPIRED` | Tu sesión venció. Volvé a iniciar sesión. | `require-admin.test.ts`, `session.service.test.ts` |
| Falla la base | `UNEXPECTED` | No se pudo procesar el inicio de sesión. Intentá de nuevo en unos minutos. | `login.test.ts` |

## Mi cuenta (US-5)

- En `/admin/cuenta` (link "Mi cuenta" desde el panel) el admin cambia su email o su contraseña. Los dos cambios
  piden la contraseña actual. La contraseña nueva tiene de 8 a 128 caracteres y se escribe dos veces.
- Cualquiera de los dos cambios incrementa la `session_version`: se cierran las demás sesiones y esta recibe un token
  nuevo, así que sigue adentro. El proxy no renueva la cookie en actions ni en precargas, para no pisar ese token nuevo (ni el
  borrado de "Cerrar sesión").
- Plan: [US-5](../../plans/US-5-cuenta-admin.md). El E2E usa una cuenta propia (`E2E_ACCOUNT_ADMIN`), que el seed crea
  sólo con `APP_ENV=test`, para no chocar con los tests del login.

| Action | Entrada | Salida | Pública |
|---|---|---|---|
| `changeEmail` (`actions/change-email.ts`) | `FormData`: `email`, `currentPassword` | `ActionResult` con "Listo. Desde ahora entrás con …" | No |
| `changePassword` (`actions/change-password.ts`) | `FormData`: `currentPassword`, `newPassword`, `confirmPassword` | `ActionResult` con "Listo. Desde ahora entrás con la contraseña nueva." | No |

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `change-email.test.ts`, `change-password.test.ts` |
| Email inválido, contraseña actual vacía, nueva fuera de 8–128 o repetición distinta | `VALIDATION` | El mensaje del campo (p. ej. "Las contraseñas no coinciden.") | `account.schema.test.ts`, contratos |
| Contraseña actual incorrecta | `WRONG_PASSWORD` | La contraseña actual no es correcta. | `account.service.test.ts`, contratos |
| El email nuevo ya lo usa otra cuenta | `DUPLICATE` | Ya existe un registro con esos datos. | `change-email.test.ts`, integración |
| Otro cambio se guardó antes | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. | `change-email.test.ts`, integración |
