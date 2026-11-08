# US-5 · El admin cambia su email y su contraseña

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#us-5--el-admin-cambia-su-email-y-su-contraseña)
- **Nivel de tests**: 3 · Profundo (seguridad: credenciales y sesiones)
- **Estado del plan**: Aprobado (2026-11-06)
- **Depende de**: T-3 (tabla `admin_user`, `requireAdmin()`, `password.ts`, `session-token.ts`)

## Objetivo

Desde `/admin/cuenta`, el admin cambia el email con el que entra y su contraseña. Así la cuenta de prueba del seed
se puede convertir en la de Lisandro sin tocar la base a mano.

## Descubrimiento

- **Actor**: el admin con sesión. Sin sesión ⇒ `UNAUTHENTICATED` (lo garantiza `requireAdmin()`).
- **Confirmación**: los dos cambios piden la contraseña actual. Es la práctica estándar: si alguien encuentra la
  sesión abierta, no puede quedarse con la cuenta. Aprobado por el dev con el plan.
- **Cambiar email**: email nuevo (formato válido, ≤ 254, en minúsculas) + contraseña actual.
- **Cambiar contraseña**: actual + nueva (8 a 128 caracteres) + repetición de la nueva.
- **Sesiones**: cualquiera de los dos cambios incrementa la `session_version`: se cierran las demás sesiones
  abiertas y la actual recibe un token nuevo, así que sigue adentro.
- **Concurrencia**: update por `id` y `version`; si chocan ⇒ `STALE_VERSION`.
- **Estados de UI**: dos formularios separados en la misma página; mientras envía, "Guardando…"; al terminar, un
  aviso "Listo, se guardó el cambio."; si falla, el mensaje arriba del botón, con ícono y texto en Pimentón.
- **Diseño**: versión silenciosa del panel, tarjetas Papel con radio 16px; los mismos inputs de la tarjeta de login (T-3, ahora en `form-parts.tsx`) y píldora Verde Lima
  "Guardar" (una por formulario: son dos formularios distintos dentro de una vista de trabajo).

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| domain | `src/features/auth/domain/account.schema.ts` | `ChangeEmailInputSchema`, `ChangePasswordInputSchema` (con `refine` de repetición). |
| errores | `src/lib/errors/codes.ts`, `src/lib/action-result.ts` | `WRONG_PASSWORD`: "La contraseña actual no es correcta." `failValidation(mensaje)` devuelve `VALIDATION` con el mensaje del campo. |
| repository | `src/features/auth/repository/admin.repository.ts` | `findCredentialsById` y `updateCredentials` (email y/o hash) por `id` y `version`, incrementando `session_version`. |
| service | `src/features/auth/services/account.service.ts` | Verifica la contraseña actual, aplica el cambio y devuelve la nueva `session_version`. |
| actions | `src/features/auth/actions/change-email.ts`, `change-password.ts` | `requireAdmin()` → validación → service → cookie nueva → `ActionResult`. |
| ui | `src/app/admin/(panel)/cuenta/page.tsx`, `src/features/auth/ui/components/change-email-form.tsx`, `change-password-form.tsx` | Página "Mi cuenta" y link desde el panel. |
| docs | `docs/features/auth/README.md` | Comportamiento y tabla de errores. |

## Modelo de datos

Sin cambios: usa `admin_user` de T-3.

## Errores

| Acción inválida | `code` | Mensaje |
|---|---|---|
| Sin sesión | `UNAUTHENTICATED` | Iniciá sesión para continuar. |
| Sesión cerrada por otro cambio | `SESSION_EXPIRED` | Tu sesión venció. Volvé a iniciar sesión. |
| Email con formato inválido, contraseña nueva fuera de 8–128 o repetición distinta | `VALIDATION` | Revisá los datos ingresados (y el mensaje del campo). |
| Contraseña actual incorrecta | `WRONG_PASSWORD` | La contraseña actual no es correcta. |
| El email nuevo ya existe | `DUPLICATE` | Ya existe un registro con esos datos. |
| Otro cambio se guardó antes | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. |

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit (domain) | Los dos schemas: válidos, inválidos con mensaje exacto, repetición distinta; fuzz. |
| Unit (`account.service` con fake) | Contraseña actual mala ⇒ `WRONG_PASSWORD` sin cambiar nada; cambio bueno incrementa `session_version`; el login viejo deja de andar y el nuevo anda. |
| Contrato (actions) | Una fila por error; sin sesión ⇒ `UNAUTHENTICATED`; la respuesta nunca trae contraseña ni hash; la cookie se reemplaza. |
| Integración (`db-test`) | `updateEmail` y `updatePassword` con `STALE_VERSION` y `DUPLICATE`. |
| Componente | Los dos formularios: labels, "Guardando…", aviso de éxito, error visible, teclado. |
| E2E (lo corre el dev) | Con la cuenta de prueba: cambiar la contraseña, cerrar sesión y entrar con la nueva. |

## Riesgos

- Que el admin se quede afuera por un error al cambiar el email: el cambio sólo se guarda con la contraseña actual
  correcta, y el aviso de éxito muestra el email nuevo.
