# AGENTS.md — reglas para agentes de IA (y humanos)

Fuente **canónica** de reglas del repo. `CLAUDE.md` solo la importa (Claude Code). Si una regla cambia, se cambia
**acá** y en el doc detallado que corresponda.

## Contexto

Web profesional y sistema de turnos de Lisandro López, Licenciado en Nutrición, en [ciudad]. Tiene tres objetivos:

1. Presentarlo.
2. Mostrar sus sucursales.
3. Gestionar turnos: los pacientes reservan online sin crear cuenta, y Lisandro administra la agenda desde un panel privado.

El backlog vigente está en [`BACKLOG.md`](BACKLOG.md). Lo que pide el cliente, está en
[`docs/requerimientos/specs.md`](docs/requerimientos/specs.md). Cómo se ve está en [`DESIGN.md`](DESIGN.md).

Idioma:

- **Docs, commits y UI en español** de Argentina.
- **Código en inglés.**

## Antes de tocar código (obligatorio)

1. Leé [`docs/workflow.md`](docs/workflow.md) y seguilo paso a paso (skill `start-task`).
2. Identificá el ítem de `BACKLOG.md`. Si no existe, **no se programa**: primero se agrega.
3. Hacé las **preguntas de descubrimiento** al dev (lista en `docs/workflow.md` §2). No asumas reglas de negocio:
   si algo no está en la US ni en `docs/features/`, se pregunta.
4. Escribí el plan en `docs/plans/<ID>-<slug>.md` (plantilla `docs/templates/plan.md`), con su **nivel de tests**
   (`docs/testing.md`), y esperá aprobación. Si el ítem toca el modelo de datos, incluí el diagrama (ERD) hecho con
   `archify`.
5. Si el ítem toca UI, revisá `DESIGN.md` antes de planificar. Si el componente no está definido ahí, se propone
   primero en el plan.
6. Elegí **el cambio más chico que resuelva el problema**. Un texto mal armado se arregla en su plantilla, no en
   cada llamada que la usa.

## Reglas duras (el lint/CI las hace cumplir)

Las aplican ESLint (`eslint.config.mjs` + `eslint/`), lefthook y el CI, desde el primer commit (sin lista legacy; ADR 0001).

| Regla | Detalle |
|---|---|
| Tope de líneas | **100 líneas físicas por archivo de código** (`.ts/.tsx/.js/.mjs/.css`, tests incluidos). Funciones ≤ 40 líneas, ≤ 3 parámetros (usar objeto). No aplica a `.md`/JSON/YAML ni a `schema.prisma`. |
| Comentarios | **Cero**. El código se explica solo. Única excepción: en español, solo cuando el código no puede expresar el *por qué*, y empezando con `Por qué:` (así lo reconoce el lint). |
| Tipado | Sin `any`, sin `!` (non-null), sin `as` salvo en fronteras ya validadas (`as const` sí; la excepción se declara por archivo en la config de ESLint, nunca con un comentario). Tipos de retorno explícitos en exports. La ausencia se tipa explícitamente como `T \| null`. |
| Capas | `ui → actions → service → repository → db`. Nunca saltear ni invertir. Solo el repositorio toca Prisma (`@/lib/db`). Detalle en `docs/architecture.md`. |
| SQL | **Prohibido SQL plano** en código (`$queryRaw`, `$executeRaw`, `pg` directo). Siempre la API de Prisma Client. SQL a mano solo en archivos de migración, para lo que Prisma no expresa en el schema (`CHECK`, `EXCLUDE`, índices parciales). |
| Tipos compartidos | Viven **solo** en `src/features/<f>/domain` (schemas Zod + tipos inferidos). El código de cliente nunca importa `repository`, `services` ni `@/lib/db`. Los tipos generados por Prisma no salen del repositorio. |
| Restricciones | Toda regla de datos que Postgres pueda garantizar va en la base: en `schema.prisma` (`@unique`, `@db.VarChar(n)`, relaciones con `onDelete`) o en SQL de migración si Prisma no la soporta. |
| Concurrencia | Toda tabla mutable usa `version` (concurrencia optimista). Update/delete filtran por `id` **y** `version`; si afectan 0 filas ⇒ `STALE_VERSION`. |
| Errores | Toda acción inválida ⇒ `AppError(code)` del catálogo (`src/lib/errors`), con mensaje claro en español. Nunca `throw 'texto'` ni un error crudo al cliente: las Server Actions devuelven `ActionResult`. |
| Seguridad | Toda Server Action verifica en el servidor la sesión del admin (`requireAdmin()`, JWT propio; ADR 0004), salvo las acciones públicas, que se listan explícitamente (ver más abajo). Toda página nueva se registra en `src/proxy.ts`. Toda entrada se valida con Zod `strictObject`. Toda respuesta se valida contra su `RowSchema`. |
| Fechas | Se guardan y viajan en UTC (ISO 8601, `timestamptz`). Se muestran en `America/Argentina/Buenos_Aires` con `formatDateTime`. Nunca se usa la zona horaria del servidor ni del navegador. |
| Diseño | Solo tokens de `DESIGN.md` (variables CSS o clases de Tailwind), definidos en `src/app/tokens.css`. **Cero hex hardcodeados** en `src/**/*.{ts,tsx}` (ESLint lo rechaza). Botones, tabs y toggles siempre en forma de píldora. |
| Secretos | Jamás se commitea un `.env` real (hook + CI lo bloquean). Cada variable nueva va a `.env.example`. Los secretos (`JWT_SECRET`, claves de email) solo existen en el servidor. |

## Reglas del dominio: turnos

Detalle completo en `docs/features/turno/README.md`.

- **Sin doble reserva.** Un horario de una sucursal no puede tener dos turnos activos. Se garantiza en la base (restricción `EXCLUDE` o `UNIQUE` parcial en la migración), y además se crea el turno dentro de una transacción. Si hay choque ⇒ `SLOT_TAKEN`.
- **Disponibilidad.** Se calcula a partir de los horarios de cada sucursal, la duración del servicio, los turnos activos y los bloqueos que cargue Lisandro. Es lógica de `service`, con tests de nivel 3.
- **Límites de reserva.** No se puede reservar en el pasado ni con menos de [X] horas de anticipación ⇒ `SLOT_TOO_SOON`.
- **Estados.** `PENDIENTE → CONFIRMADO → ASISTIO | AUSENTE`, y `CANCELADO` desde `PENDIENTE` o `CONFIRMADO`. Un turno cancelado libera el horario.
- **Cancelación por el paciente.** Se hace con un link de un solo uso y con vencimiento, que llega en el email de confirmación. No requiere cuenta.
- **Acciones públicas (sin sesión).** Solo estas: leer servicios, sucursales y disponibilidad; crear una reserva; cancelar con token. Llevan rate limiting y honeypot.

## Datos personales

Esta web maneja datos de pacientes en un contexto de salud (Ley 25.326).

- Se piden solo los datos necesarios para el turno: nombre, email, teléfono y obra social opcional. Nada de historia clínica.
- **Cero datos personales en logs**, errores, reportes de tests o analytics. Los errores inesperados se loguean sólo con nombre y código (`src/lib/db-errors.ts`).
- El formulario de reserva lleva consentimiento explícito y un link a la política de privacidad.
- Los seeds y tests usan solo datos ficticios.

## Contenido

- **Nunca inventar contenido real:** ni testimonios, ni cifras, ni títulos, ni la matrícula. Si falta un dato, va
  un placeholder visible `[Completar: …]` y se anota en "Preguntas abiertas" de `BACKLOG.md`.

## Comandos

```bash
npm run test:watch       # mientras desarrollás
npm run lint && npm run typecheck
npm run test:coverage    # unit + contrato + fuzz + componentes + cobertura (lo corre pre-push)
npm run test:int         # integración de repositorios (requiere `docker compose up -d --wait db-test`)
npm run test:e2e         # Playwright en Chromium (mobile 375px y desktop)
npm run test:mutation    # Stryker (score ≥ 70)
npm run db:migrate       # prisma migrate dev (crear y aplicar una migración en local)
npm run db:generate      # prisma generate (también corre en postinstall)
npm run verify           # lint, tipos, cobertura, integración, mutación y build. Obligatorio en nivel 3 y al cerrar el sprint.
```

La base se elige con `APP_ENV`, nunca con `NODE_ENV` (ADR 0002):

- Local y tests: `LOCAL_DATABASE_URL` (Docker `db` en el puerto 5435; `db-test` en el 5436).
- Producción (`APP_ENV=production`): la app usa `DATABASE_URL` (pooler de Supabase, puerto 6543) y las
  migraciones, `DIRECT_URL` (conexión directa, puerto 5432).

`prisma db push` está prohibido: todo cambio de schema va con una migración versionada.

## Definition of Done (resumen; completo en `docs/definition-of-done.md`)

- [ ] Tests nuevos para la lógica nueva: unit + contrato (caja negra) + fuzz + integración si tocó repositorio o schema.
- [ ] Cada acción inválida tiene su error, su mensaje y su test (tabla en `docs/features/<f>/README.md`).
- [ ] Los tests del **nivel del ítem** en verde (`docs/testing.md`):
  - nivel 1: texto o estilo;
  - nivel 2: lógica acotada;
  - nivel 3: cambio profundo, con `npm run verify` (cobertura ≥ 90/85, mutación ≥ 70).

  Al cerrar el sprint, `npm run verify` siempre.
- [ ] Si tocó turnos: tests de doble reserva concurrente, zona horaria (incluido el cruce de medianoche) y cancelación.
- [ ] Si tocó UI: respeta `DESIGN.md`, se revisó con `impeccable` (`critique` y `polish`), y anda en 375px y en desktop, con teclado.
- [ ] Docs del feature, ADR si hubo decisión, `.env.example` y seed actualizados si aplica.
- [ ] `docs/initial_prompt.md` adaptado si fue un avance significativo (criterios en `docs/how-to-document.md`).
- [ ] `BACKLOG.md` actualizado: estado, fecha y hora de cierre de cada criterio, y horas reales del ítem.
- [ ] Commits Conventional Commits en español. ANTES de commitear, mostrarle al dev una **lista breve y en
      lenguaje simple** (para alguien que no sabe nada técnico) de todo lo esencial que entra en el commit. Esa
      lista es lo que el dev aprueba; sin su OK no se commitea ni se pushea.
- [ ] **Sin PR** (regla general): cada ítem va en su rama y se integra con `git merge --squash` a `develop` (un
      commit por ítem), con el OK del dev, push y borrado de la rama. Detalle en `docs/git.md`.

## Mapa de documentación

`DESIGN.md` · `docs/initial_prompt.md` (contexto completo para arrancar) · `docs/architecture.md` · `docs/workflow.md` ·
`docs/git.md` · `docs/testing.md` · `docs/definition-of-done.md` · `docs/conventions/` · `docs/features/` ·
`docs/adr/` · `docs/how-to-document.md` · `docs/filosofia-de-trabajo.md`

## Skills del repo

Viven en `.agents/skills/` y, copiadas e idénticas, en `.claude/skills/` (Claude Code). Las dos carpetas se
versionan (`docs/workflow.md` §8).

**Propias:**

- `start-task`: descubrimiento y plan.
- `finish-task`: Definition of Done y cierre.
- `delegate-task`: reparte el trabajo en subagentes Haiku, Sonnet u Opus según la dificultad.

**De diseño:**

- `ui-ux-pro-max`: propone componentes, siempre dentro de `DESIGN.md`.
- `impeccable`: `critique`, `audit` y `polish` al cerrar UI.
- `archify`: diagramas de arquitectura y ERD para los planes.

**De método:**

- `ponytail`: el cambio más chico.
- `systematic-debugging`: primero la causa raíz.
- `verification-before-completion`: evidencia antes de decir "listo".

**De terceros** (las de `skills-lock.json`): TDD, Next.js (best practices, cache components), React y composición, Postgres/Supabase,
Tailwind, TypeScript avanzado, Playwright, accesibilidad, SEO, code review, refactor, revisión de seguridad y
Conventional Commits.

Cómo agregarlas o actualizarlas: `docs/workflow.md` §8.

Si una skill o `.agents/rules/` contradice este archivo, **gana este archivo**. Algunos ejemplos:

- `conventional-commit` pide commits en inglés: acá van en español.
- Los planes de Superpowers (`writing-plans`) van a `docs/plans/`, no a su carpeta por defecto.
- `ui-ux-pro-max` no puede cambiar la paleta ni la tipografía de `DESIGN.md`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
