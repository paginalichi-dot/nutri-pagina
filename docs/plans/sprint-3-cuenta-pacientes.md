# Sprint 3 · Cuenta de pacientes (login) + 4 cambios de diseño

- **Ítems**: [`BACKLOG.md`](../../BACKLOG.md#sprint-3--cuenta-de-pacientes)
- **Nivel de tests**: 3 · Profundo
- **Estado del plan**: Aprobado (2026-11-08)
- **Decisión**: [ADR 0006](../adr/0006-cuentas-de-pacientes-con-email-y-contrasena.md)

## Contexto

El dev reordenó los sprints (2026-11-08): el 3 es el login de pacientes, el 4 la reserva online y el 5 el deploy.
Para el Sprint 3 trajo 5 wireframes nuevos (`docs/wireframes/`): `login.png` (login partido, con una luz verde que
sale por detrás de la tarjeta), `hero-animado.png` (líneas a mano alrededor de Lisandro y de las frases),
`cuenta-1.png` / `cuenta-2.png` (ícono de cuenta arriba a la derecha del hero, con la tarjeta «Mi espacio») y
`cambio-de-lugar-flecha(-mobile).png` (la flecha para bajar se muestra en otro lugar). Hoy `/login` sólo sirve al
admin y los pacientes no tienen cuenta (ADR 0003/0004): este sprint les da cuenta propia.

## Decisiones del dev (2026-11-08)

| Tema | Decisión |
|---|---|
| Ingreso | Sólo email + contraseña (sin Google). El mismo `/login` para todos: el admin va a `/admin`, el paciente a `/mi-espacio`. |
| Alta | Registro libre («Registrate»): nombre, email, teléfono, contraseña y consentimiento con link a la política de privacidad (US-20 sube a este sprint). |
| Verificación | El email se verifica con un link. Sin verificar no se puede entrar: el login dice «Activá tu cuenta con el link que te mandamos» y ofrece «Reenviar el email». |
| Mi espacio | Próximos turnos y turnos pasados (los de su email verificado) y sus datos: nombre y teléfono editables, cambio de contraseña, cambio de email (se aplica al tocar el link que llega al email nuevo) y cerrar sesión. Nunca historia clínica. |
| Olvidé mi contraseña | Link por email de un solo uso, vence en 1 h; al restablecer se cierran las otras sesiones. Hasta el deploy (Sprint 5) los emails sólo llegan a la casilla dueña de Resend. |
| Textos del login | «Lic. Lisandro López», «Tu salud, en **foco.**» (foco en contorno Verde Lima), «Tus turnos de nutrición, en un solo lugar.» y dos íconos: Turnos e Historial (Recordatorios se suma en el Sprint 5). |
| Login en el celular | Sólo la tarjeta sobre Hueso, con el logo arriba; el panel verde se oculta. |
| Luz verde | Halo Verde Lima detrás de la tarjeta que respira lento (~4 s); quieto con «reducir movimiento». |
| Ícono del hero | Sin sesión: tarjeta «Mi espacio» con «Iniciar sesión» y «Registrate». Con sesión: «Hola, Nombre», «Ir a mi espacio» y «Cerrar sesión». Se abre con clic o toque (anda en celular y teclado). |
| Líneas del hero | Trazos Verde Lima finos que se dibujan al terminar la intro (DrawSVG); con «reducir movimiento» ya están dibujados. En el celular sólo las de las frases. |
| Sprints 1 y 2 | Se cierran antes de arrancar (ver «Paso 0»). |
| Baja | «Eliminar mi cuenta» en Mi espacio, con contraseña y confirmación. Se borra la cuenta; los turnos que cargó Lisandro quedan en su agenda. |
| Panel | «Pacientes» sigue en «Próximamente»: este sprint es del lado del paciente. |

Supuestos míos (se pueden corregir al aprobar):
- El link de los emails no cambia nada con un GET: la página muestra un botón que confirma (la misma regla de
  `AGENTS.md` para el link del turno). Así un escáner de correo no activa ni cambia nada.
- Registro, reenvío y «olvidé» responden siempre lo mismo, exista o no el email (no se revela quién tiene cuenta).
  Si el email ya tiene cuenta, el email que llega dice «Ya tenés cuenta» con el link para restablecer.
- Contraseña de 8 a 128 caracteres; nombre hasta 80; teléfono con el `PhoneSchema` de agenda.
- La reserva sigue sin cuenta (`AGENTS.md`); si la reserva del Sprint 4 pide cuenta queda en «Preguntas abiertas».
- `«¿Olvidaste tu contraseña?»` va en Verde Bosque subrayado, no en Verde Lima como el wireframe: Verde Lima sobre
  blanco es ilegible (1.5:1) y `DESIGN.md` lo prohíbe.
- «Iniciar sesión» de la tarjeta del hero es una píldora Verde Lima: es una segunda píldora lima en la home, pero
  sólo aparece cuando el paciente abre la tarjeta. Se anota como excepción en `DESIGN.md`.

## Paso 0 · Cerrar los Sprints 1 y 2 (antes de la rama del Sprint 3)

1. `BACKLOG.md`: los ítems de los Sprints 1 y 2 pasan a `Hecho`, con `Merge` y «Horas reales ≈ N h (estimadas con
   los commits)»; T-1 CA-4 se cierra con el tag.
2. `docker compose up -d --wait db-test` y `npm run verify` en verde.
3. Lista simple → OK del dev → commit `docs(backlog): cerrar los sprints 1 y 2` en `develop`.
4. `main`: `git merge --no-ff f35cec1 -m "chore(release): sprint 1"` + tag `sprint-1`; después
   `git merge --no-ff develop -m "chore(release): sprint 2"` + tag `sprint-2`. Push de `develop`, `main` y tags sólo
   con el OK del dev.

## Cómo se trabaja

Como en el Sprint 2: un solo plan para el sprint (este, copiado a `docs/plans/sprint-3-cuenta-pacientes.md`), el
**ADR 0006 «Cuentas de pacientes con email y contraseña»** (reemplaza «los pacientes no tienen cuenta» de los ADR
0003/0004 y el link mágico previsto), rama `feat/sprint-3-cuenta-pacientes` desde `develop`, todo el sprint de una,
TDD, y al final un resumen simple → lista de commit → OK del dev → un merge squash a `develop`. Nivel de tests **3**
(`npm run verify`).

## Ítems del sprint (en orden de dependencia)

| ID | Qué | Criterios clave |
|---|---|---|
| T-7 | Límite de intentos en acciones públicas (sube del Sprint 4) | Honeypot + límite por IP y por email; el pedido que pasa el límite da `RATE_LIMITED`; la tabla nunca guarda IP ni email en claro. |
| US-20 | Política de privacidad `/privacidad` (sube del Sprint 4) | Ley 25.326: finalidad, datos, derechos, contacto y baja; lo que falte va como `[Completar: …]`; link desde el registro. |
| T-8 | Modelo de pacientes y rol en la sesión | Migración con las restricciones; las cookies del admin siguen andando; una cookie de paciente en `/admin` ve «Acceso denegado». |
| US-28 | Registro y activación | Campos + consentimiento; misma respuesta exista o no el email; sin activar no entra (`EMAIL_NOT_VERIFIED`); el link actúa sólo con el botón, una vez, 24 h. |
| US-29 | Ingreso de pacientes | El admin va a `/admin` y el paciente a `/mi-espacio`; bloqueo por intentos también para pacientes; «Reenviar el email» genérico; `/login` con sesión redirige según el rol. |
| US-30 | Olvidé mi contraseña | Link de 1 h y un solo uso; respuesta genérica; al restablecer se cierran las otras sesiones y se limpia el bloqueo. |
| US-31 | Mi espacio: mis turnos | Próximos (ascendente) y anteriores (descendente), sólo los de su email; hora argentina; sin sesión lleva a `/login`. |
| US-32 | Mi espacio: mis datos, contraseña y baja | Nombre y teléfono con `STALE_VERSION`; cambiar contraseña pide la actual y cierra las otras sesiones; «Eliminar mi cuenta» con contraseña y confirmación; cerrar sesión. |
| US-33 | Mi espacio: cambiar el email | Pide la contraseña; el cambio se aplica al tocar el link del email nuevo (24 h, una vez); email ocupado ⇒ `EMAIL_IN_USE`; cierra las otras sesiones. |
| US-34 | Login con el diseño nuevo (`login.png`) | Panel verde sólo desde 1024px; luz que respira, quieta con «reducir movimiento»; 375px y teclado; ojo de la contraseña. |
| US-35 | Ícono de cuenta en el hero (`cuenta-1/2.png`) | Tarjeta correcta con y sin sesión; la home sigue estática (PPR); sin salto de layout; clic, toque y teclado. |
| US-36 | Líneas a mano en el hero (`hero-animado.png`) | Se dibujan al terminar la intro; `aria-hidden`; en el celular sólo las de las frases. |
| US-37 | Flecha para bajar en su nuevo lugar (`cambio-de-lugar-flecha*.png`) | Desktop: a la izquierda de la frase de cierre; celular: a la izquierda, por encima del botón flotante; nunca lo pisa. |

## Datos (migración `patient_account`)

```mermaid
erDiagram
  PATIENT ||--o{ PATIENT_TOKEN : "emite (cascade)"
  PATIENT ||..o{ APPOINTMENT : "email = patient_email (sin FK)"
  PATIENT { uuid id PK; varchar email UK; varchar name; varchar phone; varchar password_hash; timestamptz email_verified_at; timestamptz consent_at; int session_version; int failed_attempts; timestamptz locked_until; int version }
  PATIENT_TOKEN { uuid id PK; uuid patient_id FK; enum purpose; char64 token_hash UK; varchar new_email; timestamptz expires_at; timestamptz used_at; int version }
  RATE_LIMIT { varchar key PK; int count; timestamptz expires_at }
```

- Emails siempre en minúscula (`EmailSchema` ya hace `trim().toLowerCase()`): `CHECK (email = lower(email))` en
  `patient`, `patient_token.new_email` y `admin_user`; la migración pasa a minúscula `appointment.patient_email`
  existente (no pierde datos, pero no se deshace) y le suma el mismo CHECK. Así «Mis turnos» usa el índice que ya
  existe.
- `patient_token`: se guarda sólo el sha256 del token (32 bytes aleatorios, base64url). `purpose` VERIFY_EMAIL (24 h),
  RESET_PASSWORD (1 h), CHANGE_EMAIL (24 h). SQL a mano: `new_email` obligatorio sólo en CHANGE_EMAIL y un índice
  único parcial (un solo token activo por paciente y propósito). Se consume con `updateMany` filtrando `used_at null`
  y vigencia: 0 filas ⇒ `INVALID_TOKEN` (un doble clic no lo usa dos veces).
- `rate_limit`: clave `acción:alcance:sha256(valor):ventana`, `upsert` con incremento atómico; sin `version`
  porque nunca se lee y reescribe (excepción anotada en el ADR); borra lo vencido al abrir ventana.
- Baja: borrar `patient` borra sus tokens (cascade); los turnos no tienen FK y quedan.

## Sesión, login y seguridad

- El JWT suma el rol: `{sub, sv, r: 'admin' | 'patient'}`; sin `r` vale `admin` (las cookies de hoy siguen andando).
  `SessionToken` pasa a `{subjectId, role, sessionVersion}` (`src/lib/auth/session-token.ts` y sus usos).
- `src/proxy.ts`: `/admin/**` exige rol admin (si no, «Acceso denegado», como hoy) y `/mi-espacio/**` exige rol
  paciente (si no, redirige a `/login`). Cierra el hueco de hoy: el proxy sólo mira la firma.
- `requireAdmin` también rechaza el rol paciente. Nuevo `requirePatient` / `guardPatientPage` (rol, fila,
  `session_version` y email verificado).
- Un solo `login`: `auth.service` busca el email en admin y en paciente; gana el admin; siempre corre un solo scrypt
  (hash de relleno si no existe); el bloqueo por intentos vive en la fila de cada uno. `EMAIL_NOT_VERIFIED` sólo
  sale con la contraseña correcta, así no revela nada.
- Registro con el email del admin o de un paciente verificado: nada se crea; al verificado le llega «Ya tenés una
  cuenta» con el link para restablecer. Con un email registrado pero sin verificar: se pisan los datos y se emite un
  token nuevo (nadie probó todavía ser dueño de ese email).
- Los emails salen con `after()` desde la action, así registro, reenvío y «olvidé» tardan lo mismo exista o no el
  email. Los links llevan `APP_URL` (variable nueva en `.env.example`).
- Páginas de token (`/verificar/[token]`, `/restablecer/[token]`, `/confirmar-email/[token]`): el GET no lee la
  base, sólo muestra el botón; `noindex` y `referrer: no-referrer`.
- Acciones públicas nuevas (se suman a la lista de `AGENTS.md`): registrar, reenviar activación, activar, pedir y
  confirmar restablecimiento, confirmar cambio de email.

## Código (respetando capas y 100 líneas)

- `src/features/patient/` nuevo: `domain` (schemas de registro, token, perfil y turno propio), `repository`
  (`patient.repository.ts`, `patient-token.repository.ts`), `services` (registro, restablecer, cuenta, cambio de
  email, sesión, plantillas de email con `renderEmail`), `actions` (una por archivo + `require-patient.ts` +
  `patient-queries.ts`), `ui/components` y `testing` (fake, seed y datos ficticios).
- `src/features/rate-limit/` nuevo (repository + service + `guardPublicAction` con honeypot e IP); se habilita como
  import entre features en `docs/architecture.md` y en la regla de capas de ESLint, igual que `requireAdmin`.
- `src/lib/auth/one-time-token.ts` (crear y hashear tokens) y `src/lib/request-ip.ts` (primer `x-forwarded-for`).
- Agenda: `listByPatientEmail(email)` en su repositorio y `myAppointments` detrás de `requirePatient`.
- Logout reusa `auth/actions/logout.ts`. Reusa `hashPassword`/`verifyPassword`, `EmailSchema`, `PhoneSchema`,
  `STATUS_LABELS`, `formatDateTime`, `renderEmail`, `Field`/`FormFeedback`/`SubmitButton`.
- Hero: `AccountStatus` (Server Component en `<Suspense>`, fallback = el mismo ícono sin sesión) le pasa
  `{ name | null }` a `AccountMenu` (cliente).

## Errores nuevos

| Acción inválida | `code` | Mensaje |
|---|---|---|
| Entrar sin haber activado la cuenta (con la contraseña correcta) | `EMAIL_NOT_VERIFIED` | Activá tu cuenta con el link que te mandamos. |
| Cambiar al email de otra cuenta | `EMAIL_IN_USE` | Ese email ya lo usa otra cuenta. |

El resto reusa el catálogo: `INVALID_TOKEN`, `VALIDATION` (sin consentimiento, contraseñas distintas, honeypot),
`RATE_LIMITED`, `WRONG_PASSWORD`, `STALE_VERSION`, `UNAUTHENTICATED`, `SESSION_EXPIRED`. La tabla completa va a
`docs/features/patient/README.md`.

## Tests (nivel 3)

| Tipo | Qué prueba |
|---|---|
| Unit | Servicios con fakes: ramas de enumeración, vencimientos, qué sube `session_version`, bloqueo; `one-time-token`, `request-ip`, rol por defecto del JWT. |
| Contrato (actions) | La tabla de errores de cada action, honeypot, respuestas genéricas, redirección por rol, outbox fake. |
| Fuzz | Schemas (normalizar el email es idempotente, token sólo base64url), payloads de JWT adulterados. |
| Integración (`db-test`) | CHECK de minúscula, índice único parcial, cascade al borrar, dos `consume` simultáneos ⇒ 1 éxito, `hit` concurrente cuenta bien, `listByPatientEmail`. |
| E2E | Registro → link desde la outbox → activar → entrar → Mi espacio con el turno sembrado; olvidé → restablecer → la sesión vieja se cae; cambio de email; baja; cookie de paciente en `/admin` denegada; login 375px y teclado; ícono del hero con y sin sesión. |

E2E sin emails reales: con `EMAIL_OUTBOX_DIR` (sólo fuera de producción; en producción tira error) el sender
escribe cada email como JSON; `.env.test` apunta a `.e2e-outbox` (en `.gitignore`) y `tests/support/outbox.ts` saca
el link. El seed suma un paciente verificado ficticio y un turno con su email.

## Docs

ADR 0006; `AGENTS.md` (acciones públicas, datos personales del registro); `docs/features/patient/README.md` nuevo;
`docs/features/auth/README.md`, `docs/architecture.md`, `DESIGN.md` (login, luz, Mi espacio, ícono del hero,
líneas, flecha y la excepción de la segunda píldora lima), `BACKLOG.md` (ítems del sprint, T-7 y US-20 suben),
`.env.example` (`APP_URL`, `EMAIL_OUTBOX_DIR`) y `docs/initial_prompt.md`.

## Riesgos

- **Rol paciente colándose al panel**: rol en el proxy y en `requireAdmin`, con test.
- **Enumeración por tiempos**: un scrypt siempre, emails en `after()`, mensajes genéricos y tests de tiempo.
- **Cambiar el email esconde los turnos cargados con el email viejo** (se buscan por email): lo dice el texto de
  «Cambiar el email».
- **Hasta el deploy, Resend sólo entrega a tu casilla**: la prueba manual con otros emails espera al Sprint 5; los
  E2E usan la outbox.
- **Migración de `patient_email` a minúscula**: reescribe filas existentes sin perder datos; no se deshace.
- **Política de privacidad**: es un borrador con `[Completar: …]`; la tiene que revisar Lisandro (sigue en
  «Preguntas abiertas»).

## Diseño (UI)

> Ajustes posteriores del dev (2026-11-08 y 2026-11-09). Lo vigente está en `DESIGN.md` y en los criterios de
> `BACKLOG.md`:
>
> - la luz se prende y se apaga cada 1 s;
> - en desktop, la flecha va a la derecha de la frase de apertura;
> - en el celular también se ven las curvas del cuerpo, y el login muestra el logo arriba de la tarjeta;
> - el ícono suma chispas, brillo de vidrio y la variante del admin.

- **Login** (`/login`, `login.png`): desde 1024px, dos mitades. Izquierda Verde Bosque: logo LLN en disco Verde
  Lima + «LIC. LISANDRO LÓPEZ» (nav 15px/600, +1px), título display 700 «Tu salud, / en **foco.**» (foco en
  contorno Verde Lima, como «LÓPEZ» del hero), bajada Niebla y dos íconos Lucide en discos (`CalendarDays` Turnos,
  `FileText` Historial). Derecha Hueso: tarjeta Papel radio 30px, «Ingresá a tu cuenta» + «Gestioná tus turnos y tu
  historial», Email, Contraseña con botón de ojo (mostrar/ocultar, `aria-pressed`), «¿Olvidaste tu contraseña?»,
  «Entrar» Verde Lima a todo el ancho y «¿No tenés cuenta? **Registrate**». Sin el botón de Google ni el separador
  «o». Luz: un `::before` Verde Lima desenfocado detrás de la tarjeta que anima sólo `opacity`/`transform` (4 s,
  `motion-safe`). Inputs y botones del login: píldoras del sitio público (radio 25px / 9999px), no los rectángulos
  del panel.
- **Registro / Recuperar / Restablecer / Activar / Confirmar email**: la misma tarjeta con luz, sin el panel verde.
- **Mi espacio** (`/mi-espacio`, sitio público): banda Hueso, «Hola, **Nombre**» con subrayado Verde Lima, tarjeta
  «Tus próximos turnos» (fecha, hora, ubicación, chip de estado), «Tus turnos anteriores» y «Tus datos» (nombre,
  teléfono, email, contraseña), «Cerrar sesión» Gris Nube. Vacío: «Todavía no tenés turnos.» El único Verde Lima
  por pantalla es el de cada formulario.
- **Ícono del hero** (`cuenta-1/2.png`): botón redondo de 48px arriba a la derecha del marco, aro Verde Lima, ícono
  `UserRound` y tres chispas Verde Lima; abre una tarjeta Verde Bosque con borde `line-on-dark`, radio 25px:
  «Mi espacio» + texto + píldora Verde Lima «Iniciar sesión» con disco de flecha + «¿Todavía no tenés una cuenta?
  **Registrate**» (Verde Lima sobre Verde Bosque, 7.9:1). Componente cliente chico (`useState`, Escape y clic
  afuera cierran, `aria-expanded`/`aria-controls`), sin dependencias nuevas. El estado de sesión lo trae un Server
  Component dentro de `<Suspense>` para que la home siga siendo estática (PPR) y la intro no espere a la base.
- **Líneas del hero** (`hero-animado.png`): un SVG `aria-hidden` por grupo con `path data-draw` (trazo Verde Lima
  2–3px, sin relleno): tres trazos alrededor de Lisandro (hombro izquierdo, cuello derecho, brazo derecho) y, en las
  frases, un corchete escalonado y un subrayado. `introTimeline` los dibuja con DrawSVG después de la entrada del
  hero; sin intro (reducir movimiento, ancla, sin JS) quedan dibujados.
- **Flecha para bajar** (`cambio-de-lugar-flecha*.png`): `ScrollHint` deja la esquina del marco y se ancla a la
  frase de cierre: en desktop a su izquierda, a la altura de la última línea (entre la foto y el texto); en el
  celular a la izquierda, a la altura de «la base de tu salud», por encima del botón flotante.

Todo pasa por `impeccable` (`critique` y `polish`) en 375px y desktop, con teclado.

## Verificación

1. Paso 0: `npm run verify` en verde antes de los tags.
2. Durante el sprint: `npm run test:watch`; por ítem `npm run lint && npm run typecheck` y los tests relacionados.
3. Migración: `npm run db:migrate` local y `docker compose up -d --wait db-test` + `npm run test:int`.
4. `npm run test:e2e` completo (Chromium desktop y mobile), con la outbox de emails.
5. Capturas con una spec temporal de Playwright (1440, 1024, 375) del login, el registro, Mi espacio, el hero con
   la tarjeta abierta (con y sin sesión), las líneas y la flecha, comparadas con los wireframes; `impeccable`
   `critique` y `polish`; la spec se borra.
6. `npm run build`: la home sigue saliendo como página estática con su hueco dinámico (PPR).
7. Cierre: `npm run verify`, `BACKLOG.md` con fecha y hora de cada criterio, resumen simple, lista de commit y OK
   del dev; push sólo con su OK.

## Preguntas abiertas que quedan en el backlog

- ¿La reserva del Sprint 4 va a pedir cuenta o se sigue pudiendo sin cuenta?
- Datos del responsable y plazo de guarda para la política de privacidad (Ley 25.326).
