# T-3 · Login del panel con JWT propio

- **Ítem**: [`BACKLOG.md`](../../BACKLOG.md#t-3--login-del-panel-con-jwt-propio)
- **Nivel de tests**: 3 · Profundo (seguridad, schema y `proxy.ts`)
- **Estado del plan**: Aprobado (2026-11-06)
- **Decisión de base**: [ADR 0004](../adr/0004-login-propio-con-jwt.md)

## Objetivo

El admin entra por `/admin/login` con su email y su contraseña y queda con la sesión iniciada para siempre, hasta
que la cierre. Cualquier otra persona que escriba `/admin` en la barra ve "Acceso denegado" y nunca llega al
login. Sin sesión, nadie ve el panel ni puede ejecutar sus acciones. Todavía no hay agenda: el panel muestra un
título y "Cerrar sesión". Todo se prueba con Docker, con una cuenta admin de prueba.

## Descubrimiento

- **Actor**: el admin (hoy, una cuenta de prueba; después, Lisandro). El resto de los visitantes son pacientes;
  cuáles de sus acciones van a pedir login se define más adelante (pregunta abierta del Sprint 2).
- **Método**: email y contraseña. Sin registro público ni "olvidé mi contraseña".
- **Cuenta de prueba**: la crea `npm run db:seed` con datos ficticios (email y contraseña en `prisma/seed.ts`). El
  seed se niega a correr con `APP_ENV=production`. El cambio de email y contraseña es la US-5.
- **Fuera de alcance**: el alta del admin real en producción (ítem de despliegue).
- **Datos de entrada**: email (formato válido, ≤ 254, se guarda en minúsculas), contraseña (1 a 128) y un
  honeypot oculto que tiene que llegar vacío. Todo con `z.strictObject`.
- **Datos que salen**: ninguno. La contraseña y el hash nunca salen del servidor; el hash no sale del repositorio
  más que hacia el service que lo compara.
- **Acceso denegado** (decisión del dev, 2026-11-06): sin cuentas de paciente, el sistema no distingue a un
  paciente del admin sin sesión. Por eso `/admin` y todo `/admin/**` sin una sesión válida muestran "Acceso
  denegado" (`noindex`): el proxy reescribe a `/acceso-denegado` y el layout repite el chequeo con `forbidden()`
  (`experimental.authInterrupts`). Con Cache Components el estado queda en 200 (ver Riesgos). El login vive sólo
  en `/admin/login`: ningún link lleva ahí y el admin lo guarda en favoritos.
- **Camino feliz**: `/admin/login` → completa → "Entrar" → `/admin`. `/admin/login` con sesión → `/admin`.
  "Cerrar sesión" → `/admin/login`. Una sesión cerrada desde otro dispositivo (US-5) → `/admin/login`.
- **Sesión permanente** (decisión del dev): el JWT lleva `sub` (id) y `sv` (`session_version`) y no vence. La
  cookie `session` dura 400 días (el máximo de los navegadores) y el proxy la renueva en cada visita a `/admin`.
- **Revocación**: `requireAdmin()` compara `sv` con la `session_version` de la base; si no coincide, la sesión
  está cerrada. La US-5 la incrementa al cambiar email o contraseña.
- **Intentos fallidos**: 5 seguidos bloquean el login 15 minutos. Un email inexistente tarda lo mismo que uno
  existente (se compara contra un hash de relleno).
- **Concurrencia**: la fila tiene `version`; si dos intentos chocan (`STALE_VERSION`), el intento se responde
  igual como fallido.
- **Estados de UI**: mientras envía, "Entrando…" y botón deshabilitado; si falla, el mensaje aparece arriba del
  botón, con ícono y texto en Pimentón.
- **Fechas**: `locked_until` en `timestamptz` (UTC).
- **Acciones públicas**: `login` se suma a la lista de `AGENTS.md`, con honeypot y el bloqueo por intentos.
- **Componente nuevo para `DESIGN.md`**: "Tarjeta de login" del panel. Fondo Hueso, tarjeta Papel con radio 30px,
  inputs del formulario de reserva (radio 25px, Gris Nube, label 15px/600, foco Verde Bosque con halo Verde Lima)
  y píldora Verde Lima "Entrar". Y "Pantalla de acceso denegado": banda Hueso, título "Acceso **denegado**" (500 +
  700), la línea "Esta sección es privada." y la píldora Verde Lima "Volver al inicio" con disco de flecha.

## Cambios por capa

| Capa | Archivos | Cambio |
|---|---|---|
| dependencias | `package.json`, `next.config.ts` | `jose`. Script `db:seed`. `experimental.authInterrupts: true` para `forbidden()`. |
| domain | `src/features/auth/domain/login.schema.ts`, `admin.schema.ts` | `LoginInputSchema`, `AdminCredentialsRowSchema`, `AdminSessionRowSchema` y tipos. |
| schema / migración | `prisma/schema.prisma`, `prisma/migrations/<fecha>_admin_user/` | Modelo `AdminUser` (tabla `admin_user`). |
| errores | `src/lib/errors/codes.ts` | `INVALID_CREDENTIALS`: "El email o la contraseña no son correctos." |
| lib | `src/lib/auth/password.ts` | `hashPassword` y `verifyPassword` con `scrypt` y `timingSafeEqual`. |
| lib | `src/lib/auth/session-token.ts` | `signSession` y `verifySession` (`jose`, sin `exp`), nombre y opciones de la cookie. Sin base: lo usa el proxy. |
| repository | `src/features/auth/repository/admin.repository.ts` (+ fake en `testing/`) | `findCredentialsByEmail`, `findSessionVersion`, `registerFailure`, `resetFailures` (por `id` y `version`), `insertAdmin` (seed). |
| service | `src/features/auth/services/auth.service.ts` | `login`: bloqueo, comparación con tiempo parejo, contador de intentos; devuelve `id` y `session_version`. |
| actions | `src/features/auth/actions/require-admin.ts` | `requireAdmin()` (lee la cookie y llama a `session.service`): sin cookie o token adulterado ⇒ `UNAUTHENTICATED`; `sv` distinto al de la base (sesión cerrada) ⇒ `SESSION_EXPIRED`. |
| actions | `src/features/auth/actions/login.ts`, `logout.ts` | `login`: valida, llama al service, firma el JWT y pone la cookie; devuelve `ActionResult`. `logout`: borra la cookie. |
| proxy | `src/proxy.ts` | En `/admin/**`: token válido ⇒ renueva la cookie; token adulterado ⇒ la borra; sin sesión, todo `/admin/**` salvo `/admin/login` se reescribe a `/acceso-denegado`. |
| ui | `src/app/admin/(panel)/layout.tsx`, `page.tsx` | El layout llama a `requireAdmin()`: `UNAUTHENTICATED` ⇒ `forbidden()`; `SESSION_EXPIRED` ⇒ `/admin/login`. La página muestra "Panel" y "Cerrar sesión". |
| ui | `src/components/access-denied.tsx`, `src/app/acceso-denegado/page.tsx`, `src/app/forbidden.tsx` | Pantalla de acceso denegado (`noindex`). |
| ui | `src/app/admin/login/page.tsx`, `src/features/auth/ui/components/login-form.tsx` | Con sesión válida ⇒ `/admin`; si no, la tarjeta de login con `useActionState`. |
| seed | `prisma/seed.ts` | Cuenta admin de prueba, con datos ficticios; se niega con `APP_ENV=production`. |
| env | `.env.test` | Suma un `JWT_SECRET` ficticio. `.env.example` ya se actualizó con el ADR 0004. |
| docs | `docs/features/auth/README.md`, `docs/features/README.md`, `AGENTS.md`, `DESIGN.md`, `docs/architecture.md`, `docs/testing.md` | Comportamiento y errores; acciones públicas; componente nuevo; `requireAdmin` en la tabla de capas; helper de sesión en tests. |

## Modelo de datos

```prisma
model AdminUser {
  id             String    @id @default(uuid()) @db.Uuid
  email          String    @unique @db.VarChar(254)
  passwordHash   String    @map("password_hash") @db.VarChar(255)
  sessionVersion Int       @default(1) @map("session_version")
  failedAttempts Int       @default(0) @map("failed_attempts")
  lockedUntil    DateTime? @map("locked_until") @db.Timestamptz
  version        Int       @default(1)
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt      DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  @@map("admin_user")
}
```

En el SQL de la migración: `CHECK (email = lower(email))`, `CHECK (failed_attempts >= 0)` y
`CHECK (session_version >= 1)`. Es una sola tabla, sin relaciones: el ERD con `archify` se suma si el dev lo pide.

## Errores

| Acción inválida | `code` | Mensaje |
|---|---|---|
| Email o contraseña con formato inválido, o honeypot completo | `VALIDATION` | Revisá los datos ingresados. |
| Email inexistente o contraseña incorrecta | `INVALID_CREDENTIALS` | El email o la contraseña no son correctos. |
| 5 intentos fallidos seguidos (bloqueo de 15 min) | `RATE_LIMITED` | Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo. |
| Action del panel sin cookie o con token adulterado | `UNAUTHENTICATED` | Iniciá sesión para continuar. |
| Sesión cerrada (cambió la `session_version`) | `SESSION_EXPIRED` | Tu sesión venció. Volvé a iniciar sesión. |
| Falla la base | `UNEXPECTED` | No se pudo procesar el registro. Intentá de nuevo en unos minutos. |

## Tests

| Tipo | Qué prueba |
|---|---|
| Unit (domain) | `LoginInputSchema`: válidos, inválidos con mensaje exacto, campos de más; fuzz. |
| Unit (`password`) | Un hash verifica su contraseña y no otra; dos hashes de la misma contraseña son distintos (sal). |
| Unit (`session-token`) | Token firmado se verifica; adulterado o firmado con otra clave falla; no tiene `exp`. |
| Unit (`auth.service` con fake) | Camino feliz; contraseña mala suma un intento; el 5.º bloquea; bloqueado ⇒ `RATE_LIMITED` aunque la contraseña sea buena; al vencer el bloqueo se puede entrar; éxito reinicia el contador; email inexistente compara igual contra el hash de relleno. |
| Unit (`require-admin` con fake) | Sin cookie o token inválido ⇒ `UNAUTHENTICATED`; `sv` viejo ⇒ `SESSION_EXPIRED`; válido ⇒ id del admin. |
| Contrato (`login`, `logout`) | Una fila por error de la tabla; la cookie sale `httpOnly`, `Secure`, `SameSite=Lax` y con 400 días; fuzz: ningún error fuera del catálogo y nunca vuelve la contraseña ni el hash. |
| Unit (proxy) | Token válido en `/admin` ⇒ pasa y renueva la cookie; token adulterado ⇒ borra la cookie; sin token ⇒ pasa sin tocar nada; `/` no se toca. |
| Integración (`db-test`) | Repositorio: alta, búsqueda por email, `STALE_VERSION`, los `CHECK` de la migración, y que ninguna consulta de sesión devuelva el hash. Seed: crea la cuenta de prueba y no corre con `APP_ENV=production`. |
| Componente | `LoginForm`: labels, "Entrando…", mensaje de error visible, uso con teclado. |
| E2E (lo corre el dev) | `/admin` y `/admin/algo` sin sesión ⇒ "Acceso denegado", la URL no cambia y lleva `noindex`. Con la cuenta de prueba del seed en `db-test`: login correcto entra; incorrecto muestra el error; "Cerrar sesión" vuelve al login. |
| Gate | `npm run verify` completo (cobertura, integración, mutación ≥ 70, build). |

## Riesgos

- Código de seguridad propio: se cubre con la tabla de tests de arriba y la mutación sobre `lib/auth` y los
  services.
- Sesión permanente: quien use un dispositivo con la sesión abierta entra al panel. Se cierra con "Cerrar sesión"
  o cambiando la contraseña (US-5).
- Alguien puede bloquear la cuenta probando contraseñas a propósito: el bloqueo dura 15 minutos y no se agranda.
  Si pasa seguido, se suma un límite por IP.
- `JWT_SECRET` filtrado permite fabricar sesiones: vive sólo en el servidor, tiene al menos 32 bytes aleatorios y
  se rota si hay sospecha.
- Romper el acceso por un error en el proxy: los tests cubren cada ruta, y `requireAdmin()` en el layout es la
  segunda barrera.
- No hay 403 real: con Cache Components la respuesta empieza a enviarse antes del chequeo, y Next ignora el estado de
  una reescritura a una página estática. La pantalla y el `noindex` cumplen el pedido; un 403 exigiría que el proxy
  descargue la página y la devuelva él mismo. `authInterrupts` es experimental: si cambia, alcanza con el proxy.
