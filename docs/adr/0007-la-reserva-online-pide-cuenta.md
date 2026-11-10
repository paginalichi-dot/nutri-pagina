# 0007 — La reserva online pide cuenta

- **Estado**: Aceptado (2026-11-09) · Reemplaza «los pacientes reservan sin crear cuenta» y la gestión del turno con
  un link con token de `AGENTS.md`; se apoya en [0006](0006-cuentas-de-pacientes-con-email-y-contrasena.md)

## Contexto

El plan original del Sprint 4 era una reserva pública, sin cuenta, con un link con token en el email para cancelar o
reprogramar (`/turno/[token]`). En el Sprint 3 llegaron las cuentas de pacientes, con email verificado y «Mi
espacio». En el descubrimiento del Sprint 4 (2026-11-09) el dev decidió que reservar pida cuenta.

## Decisión

- **Reservar exige sesión de paciente.** `/reservar` entra en la zona del proxy que exige el rol `patient`. Sin
  sesión va a `/login?volver=/reservar` y, al entrar, vuelve. `volver` sólo acepta rutas internas (empieza con `/`,
  sin `//` ni `/\`), así no hay redirect abierto.
- **Los datos del turno salen de la cuenta**: nombre, email y teléfono. En cada reserva sólo se elige la obra social
  (opcional, «Particular»). El turno guarda una copia de esos datos, como los que carga Lisandro.
- **Gestión desde Mi espacio**, sin token: cancelar o reprogramar hasta 24 h antes, sobre los turnos cuyo email es el
  de la cuenta (también los que cargó Lisandro). Un turno de otro email responde `NOT_FOUND`, sin revelar que existe.
  Los emails traen «Gestionar mi turno», que abre el turno en Mi espacio (con inicio de sesión si hace falta).
- **Límite de 2 turnos por venir** (pendientes o confirmados) por email, contado dentro de la misma transacción
  `Serializable` que crea el turno: dos pedidos a la vez no lo saltean.
- **Las solicitudes vencen**: una reserva pendiente que Lisandro no confirmó se cancela sola 12 h antes del turno. Un
  endpoint protegido con `CRON_SECRET` la dispara; el cron llega con el despliegue (Sprint 5).
- **Límite de intentos por cuenta** (10 por hora) en reservar, cancelar y reprogramar, con la tabla `rate_limit` de
  0006: frena el spam de emails a Lisandro.

## Alternativas descartadas

- Reserva sin cuenta con link con token (lo previsto): suma una segunda forma de identificar al paciente, otro tipo
  de token y otra superficie pública, cuando la cuenta ya verifica el email.
- Reservar sin cuenta y crearla en el mismo paso: mezcla dos flujos y obliga a manejar emails sin verificar en la
  agenda.

## Consecuencias

- Reservar por primera vez pide registrarse y activar la cuenta: más fricción. Es la decisión del dev.
- Salen de la lista de acciones públicas «crear una reserva» y «gestionar un turno con token»; no hay
  `/turno/[token]`.
- El turno se vincula por email: si el paciente cambia su email, deja de ver (y gestionar) los turnos anteriores.
- Con 12 h de anticipación mínima y vencimiento 12 h antes, una reserva hecha cerca del límite puede vencer apenas
  corra el cron si Lisandro no la confirma (riesgo aceptado por el dev).
