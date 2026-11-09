# Patient (cuentas de pacientes)

Decisión de base: [ADR 0006](../../adr/0006-cuentas-de-pacientes-con-email-y-contrasena.md). Plan:
[Sprint 3](../../plans/sprint-3-cuenta-pacientes.md). Límite de intentos: feature `rate-limit` (T-7).

## Qué hace

- **Registro** (`/registro`, US-28): nombre, email, teléfono, contraseña (8 a 128) y consentimiento con link a
  `/privacidad`. Responde siempre «Listo. Si los datos están bien, te mandamos un email…», exista o no el email:
  - email nuevo: crea la cuenta sin verificar y manda «Activá tu cuenta» (link de 24 h);
  - email de una cuenta sin verificar: pisa nombre, teléfono y contraseña, y manda un link nuevo (el anterior deja de
    servir);
  - email de una cuenta verificada: no cambia nada y manda «Ya tenés una cuenta» con un link para restablecer;
  - email del admin: no hace nada.
- **Activar** (`/verificar/[token]`): la página sólo muestra el botón «Activar mi cuenta»; el link se usa al tocarlo.
- **Entrar** (`/login`, US-29): el mismo login que el admin (feature `auth`). Sin activar, con la contraseña
  correcta, dice «Activá tu cuenta con el link que te mandamos.» y ofrece «Reenviar el email».
- **Olvidé mi contraseña** (`/recuperar` y `/restablecer/[token]`, US-30): link de 1 h y un solo uso. Restablecer
  cierra las otras sesiones, limpia el bloqueo por intentos y, como prueba que el email es suyo, verifica la cuenta.
- **Mi espacio** (`/mi-espacio`, US-31 a US-33): próximos turnos y anteriores (los de `appointment.patient_email`
  igual a su email), nombre y teléfono, cambio de contraseña (cierra las otras sesiones), cambio de email (se aplica
  al tocar el link que llega al email nuevo, 24 h; cierra las otras sesiones) y «Eliminar mi cuenta» (borra la
  cuenta y sus links; los turnos quedan en la agenda).
- **Ícono del hero** (US-35): con o sin sesión, una tarjeta con «Iniciar sesión» y «Registrate», o «Hola, Nombre».

## Quién lo usa

| Acción | Sin sesión | Paciente | Admin |
|---|---|---|---|
| Registrarse, reenviar la activación, pedir el link de «olvidé» | Sí | Sí | Sí |
| Usar un link de un solo uso | Sí (el link es la credencial) | Sí | Sí |
| Ver `/mi-espacio` y cambiar sus datos | No: va a `/login` | Sí | No: va a `/login` |

## Server Actions

| Action | Entrada | Pública |
|---|---|---|
| `register` | `name`, `email`, `phone`, `password`, `consent`, `website` | Sí (honeypot + 5/h por IP y 3/h por email) |
| `resendVerification` | `email`, `website` | Sí (10/h por IP, 3/h por email) |
| `requestPasswordReset` | `email`, `website` | Sí (10/h por IP, 3/h por email) |
| `verifyEmail`, `confirmEmailChange` | `token`, `website` | Sí (20/h por IP) |
| `resetPassword` | `token`, `password`, `website` | Sí (20/h por IP) |
| `updateProfile` | `name`, `phone`, `version` | No (`requirePatient`) |
| `changePatientPassword` | `currentPassword`, `newPassword`, `confirmPassword` | No |
| `requestEmailChange` | `email`, `currentPassword` | No |
| `deleteAccount` | `currentPassword`, `confirm` | No |

Los emails salen con `after()`, después de responder, así la respuesta tarda lo mismo exista o no la cuenta. Las
lecturas (`getMyProfile`, `getMyAppointments`, `currentPatient`) no son Server Actions.

## Errores

| Acción inválida | `code` | Mensaje | Test |
|---|---|---|---|
| Falta el consentimiento, contraseña corta, teléfono sin código de área, honeypot completo | `VALIDATION` | El mensaje del campo (p. ej. «Para crear tu cuenta tenés que aceptar la política de privacidad.») | `register.test.ts` |
| Más pedidos que el límite por IP o por email | `RATE_LIMITED` | Hiciste demasiados intentos. Esperá unos minutos y probá de nuevo. | `register.test.ts`, `login.patients.test.ts`, `token-links.limits.test.ts` |
| Link inventado, mal formado, usado, vencido o reemplazado | `INVALID_TOKEN` | El link no es válido o ya venció. | `token-links.test.ts`, services |
| Entrar sin haber activado la cuenta (con la contraseña correcta) | `EMAIL_NOT_VERIFIED` | Activá tu cuenta con el link que te mandamos. | `login.patients.test.ts` |
| Contraseña actual incorrecta al cambiar contraseña, email o al borrar la cuenta | `WRONG_PASSWORD` | La contraseña actual no es correcta. | `account-changes.test.ts`, services |
| Cambiar a un email que ya usa otra cuenta (o el del admin) | `EMAIL_IN_USE` | Ese email ya lo usa otra cuenta. | `patient-account.service.test.ts`, integración |
| Guardar datos que cambiaron en otra pestaña | `STALE_VERSION` | Otra persona cambió estos datos. Ya se actualizaron; intentá de nuevo. | `account-changes.test.ts` |
| Cambiar datos sin sesión de paciente | `UNAUTHENTICATED` | Iniciá sesión para continuar. | `account-changes.test.ts` |

## Datos

Tablas `patient`, `patient_token` y `rate_limit` (migración `patient_account`). Emails siempre en minúscula
(`CHECK`); de los links se guarda sólo el sha256; un solo link activo por paciente y propósito (índice único
parcial); `new_email` obligatorio sólo en el cambio de email; borrar un paciente borra sus links. El límite de
intentos guarda claves con hash con clave (nunca una IP ni un email en claro). La cuenta de prueba
(`paciente@ejemplo.test`, datos ficticios) la carga el seed, con un turno próximo y uno anterior.

## Tests que cubren los criterios

- Integración (`*.int.test.ts`): las restricciones de la migración, links usados dos veces a la vez y borrar la cuenta
  sin borrar sus turnos (`patient-appointments.int.test.ts`).
- E2E: `tests/patient.spec.ts` (registro, activación, Mi espacio, restablecer, cambio de email y baja),
  `tests/patient-access.spec.ts` (abrir un link no cambia nada; `/login` con sesión lleva a Mi espacio) y
  `tests/hero-account.spec.ts` (ícono del hero con teclado, líneas a mano y flecha).
- El login no espera a guardar un intento fallido: lo guarda con `after()`, así un email con cuenta y uno sin cuenta
  tardan lo mismo (`auth.service.patients.test.ts`).
