# 0006 — Cuentas de pacientes con email y contraseña

- **Estado**: Aceptado (2026-11-08) · Reemplaza «los pacientes no tienen cuenta» de [0003](0003-prisma-y-supabase-auth.md)
  y amplía [0004](0004-login-propio-con-jwt.md) a dos roles

## Contexto

Hasta el Sprint 2, la única cuenta era la del admin y los pacientes reservaban sin cuenta. El backlog preveía un
login de pacientes con link mágico por email. En el Sprint 3 el dev trajo el wireframe del login (`login.png`) y
decidió (2026-11-08): email y contraseña, registro libre con verificación del email, «olvidé mi contraseña» por
email y un espacio propio («Mi espacio») con sus turnos y sus datos, desde el mismo `/login` que el admin.

## Decisión

- **Tabla propia** `patient`, separada de `admin_user`: nombre, email (único, en minúscula), teléfono, hash de la
  contraseña, `email_verified_at`, `consent_at`, `session_version`, intentos fallidos, bloqueo y `version`.
- **Un solo login** para los dos roles. El servicio busca el email en las dos tablas y gana el admin; siempre
  calcula un solo `scrypt` (contra un hash de relleno si el email no existe), así el tiempo no delata qué emails
  tienen cuenta. Un paciente sin verificar recibe `EMAIL_NOT_VERIFIED` sólo si la contraseña es correcta.
- **Rol en la sesión**: el JWT de 0004 suma `r: 'admin' | 'patient'`; un token sin `r` es de admin (los únicos
  que existían). El proxy exige el rol de cada zona (`/admin/**` admin, `/mi-espacio/**` paciente), y
  `requireAdmin` / `requirePatient` lo vuelven a verificar contra la base junto con la `session_version`.
- **Links de un solo uso** (activar la cuenta 24 h, restablecer la contraseña 1 h, confirmar un email nuevo 24 h):
  32 bytes aleatorios; la base guarda sólo su sha256, un solo token activo por paciente y propósito, y se consume
  con una actualización condicional (un doble clic no lo usa dos veces). La página del link no cambia nada con un
  GET: muestra un botón que confirma.
- **Sin enumeración**: registrarse, reenviar la activación y «olvidé mi contraseña» responden siempre lo mismo, y
  los emails salen después de responder (`after()`). Si el email ya tiene una cuenta verificada, le llega «Ya tenés
  una cuenta»; si tiene una sin verificar, se pisan sus datos (nadie probó todavía ser dueño de ese email).
- **Límite de intentos** para las acciones públicas en la base (`rate_limit`), por IP y por email, con las claves
  hasheadas: en Vercel cada instancia tiene su propia memoria. Es la única tabla mutable sin `version`: sólo se
  incrementa con una operación atómica y nunca se lee para reescribirla.
- **Mis turnos** se buscan por email (`appointment.patient_email`, ya indexado), sin clave foránea: los turnos los
  carga Lisandro y son de su agenda. Por eso todos los emails se guardan en minúscula (lo garantiza un `CHECK`).
- **Baja**: el paciente borra su cuenta con su contraseña; se borran sus tokens y sus turnos quedan en la agenda.

## Alternativas descartadas

- Link mágico por email (lo previsto): el dev prefirió email y contraseña, como el wireframe; además, hasta el
  deploy Resend sólo entrega a la casilla dueña de la cuenta.
- Google: el dev lo dejó fuera por ahora (pide un proyecto en Google Cloud y credenciales).
- Una tabla `user` con rol para admin y pacientes: obliga a migrar al admin y mezcla reglas distintas (el admin no
  se registra ni recupera la contraseña por email).
- Límite de intentos en memoria: no sirve con varias instancias.

## Consecuencias

- `/login` atiende a los dos roles y redirige según el rol.
- Hay registro público: suma consentimiento explícito y la política de privacidad (US-20) al mismo sprint.
- Si el paciente cambia su email, deja de ver los turnos que Lisandro cargó con el anterior.
- Hasta el deploy (Sprint 5), los emails de prueba sólo llegan a la casilla dueña de Resend; los E2E leen los
  links de una carpeta local (`EMAIL_OUTBOX_DIR`), que en producción no se puede usar.
- Se suman acciones públicas a la lista de `AGENTS.md`, todas con honeypot y límite de intentos.
