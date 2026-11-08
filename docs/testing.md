# Estrategia de tests

Todo cambio de comportamiento viene con tests. Se escriben **antes** del código (TDD, skill
`test-driven-development`): test que falla → código mínimo → refactor.

## Tipos de test

| Tipo | Dónde | Archivo | Qué verifica |
|---|---|---|---|
| Unit: dominio | `src/features/<f>/domain/` | `*.test.ts` | Schemas Zod: entradas válidas e inválidas, con el **mensaje exacto** en español. |
| Unit: service | `src/features/<f>/services/` | `*.test.ts` | Reglas de negocio con el repositorio **fake en memoria**: disponibilidad, límites de reserva, estados del turno, `version`, errores del catálogo. |
| Tipos | junto al schema | `*.test-d.ts` | Con `expectTypeOf`, que los tipos inferidos sean los esperados (por ejemplo, `version: number`). |
| Contrato (caja negra) | `src/features/<f>/actions/` | `*.contract.test.ts` | La Server Action vista desde afuera: entrada → `ActionResult`. Con y sin sesión, `data` validada contra su `*RowSchema` y un test por fila de la tabla de errores. |
| Fuzz | junto al schema o a la action | `*.fuzz.test.ts` | Con `fast-check`, que ninguna entrada arbitraria haga lanzar a la action ni devuelva un error fuera del catálogo. Es el equivalente de "nunca un 500". |
| Integración | `src/features/<f>/repository/` | `*.int.test.ts` | El repositorio Prisma contra un Postgres real (`db-test`): `unique`, FK, `check` y `exclude`; filtro por `version`; transacciones; dos reservas simultáneas del mismo horario. |
| Componente | `src/features/<f>/ui/`, `src/components/` | `*.test.tsx` | Testing Library: estados de carga, vacío y error; validación del formulario; foco y teclado. |
| E2E | `tests/` (Page Objects en `tests/pages/`) | `*.spec.ts` | Playwright en desktop y mobile: flujos críticos en un navegador real, como reservar, cancelar con el link y el panel admin. |
| Mutación | `domain/`, `services/` y `lib/` puro | Stryker | Que los tests fallen cuando se altera la lógica. Umbral ≥ 70. |

Herramientas: Vitest para unit, tipos, contrato, fuzz, integración y componente; `@testing-library/react` con
`jsdom`; `fast-check`; `@stryker-mutator/core` con el runner de Vitest; Playwright.

### Cómo se arma un test de contrato

Una Server Action depende de `next/headers` (cookies), de la sesión (cookie con JWT) y de los repositorios. En el test
de contrato:

- La sesión del admin se arma con `signSession` y `cookieJar.set('session', token)`; el repositorio se reemplaza por el
  fake con `vi.mock(…, fakeRepositoryModule)` y `next/navigation` con `navigationMock` (`features/auth/testing/module-mocks.ts`). `next/headers`
  está simulado para todos los tests por `src/test/setup/next-headers.setup.ts`, que además limpia cookies, spies y
  variables después de cada test.
- En el proyecto unit, `src/test/setup/no-database.setup.ts` reemplaza `@/lib/db` por un objeto que falla al
  usarse: un test unit nunca toca la base.
- Los repositorios del feature se reemplazan por sus fakes en memoria con `vi.mock`.
- Se llama a la action exportada como lo haría el cliente y se verifica sólo lo observable: `success`, el código
  y el mensaje del error, y la forma de `data` contra el `*RowSchema`.

Para que el fake no mienta, **la misma suite de comportamiento del repositorio corre contra el fake (unit) y
contra Prisma (integración)**. Si el fake se aparta del real, falla la suite del fake.

### Infraestructura: integración, no mutación

Repositorios, `lib/db`, `proxy.ts`, el envío de emails y los scripts de base son infraestructura: valen por cómo
hablan con algo externo. Se prueban con integración (contra `db-test`) o con E2E, y **quedan fuera de Stryker**.
La mutación se concentra donde están las decisiones: `domain/`, `services/` y las utilidades puras de `lib/`.
El proveedor de email nunca se llama desde unit ni contrato: se reemplaza por un fake en el borde.

### Qué **no** cubre cada capa (y por eso existen las otras)

| Capa | No detecta | Lo cubre |
|---|---|---|
| Unit (service con fake) | Que la query real haga lo que el fake simula; las restricciones de Postgres | Integración |
| Integración | Permisos, validación de entrada, forma del `ActionResult` | Contrato |
| Contrato | Que la pantalla muestre el error; estados de carga y vacío | Componente |
| Componente | Cookies reales, `proxy.ts`, navegación, dos pacientes a la vez | E2E |
| E2E | La combinatoria de entradas: es lento y cubre pocos casos | Unit + fuzz |
| Fuzz | Que el resultado sea el **correcto**: sólo prueba que no explote | Unit + contrato |
| Cobertura | Que los tests tengan asserts útiles | Mutación |

## Criterios de aceptación → tests

Cada criterio de aceptación de la US se traduce en al menos un test con su texto en la descripción. Cada fila
de la tabla de errores del feature (`docs/features/<f>/README.md`) tiene su test.

| Origen | Nombre del test |
|---|---|
| Criterio de aceptación | `it('US-5 CA-2: rechaza un horario que ya está tomado')` |
| Fila de la tabla de errores | `it('SLOT_TAKEN: avisa que el horario se ocupó mientras el paciente elegía')` |
| Bug corregido | `it('regression BUG-1: no muestra turnos del día anterior después de medianoche')`. Tiene que fallar antes del fix. |

## Reutilización (equivalentes a JUnit)

| JUnit  | Uso en este repo |
|---|---|
| `@Test` | `it('…')` en Vitest, `test('…')` en Playwright |
| `@DisplayName` | El texto del `it`, en español y en presente: "rechaza un horario pasado" |
| `@Nested` | `describe` anidado por escenario |
| `@BeforeEach` / `@AfterEach` | `beforeEach` / `afterEach`: fake nuevo en unit, tablas vacías en integración |
| `@BeforeAll` / `@AfterAll` | `beforeAll` / `afterAll`; lo global (migraciones de `db-test`) va en `globalSetup` |
| `@ParameterizedTest` + `@CsvSource` | `it.each([...])`: la herramienta para la tabla de errores y los valores frontera |
| `assertThrows` | `await expect(promesa).rejects.toThrow(...)`. Una action no lanza: se compara su `ActionResult` |
| Mockito `@Mock` | **Fakes en memoria** primero; `vi.fn()` para callbacks; `vi.mock()` sólo en los bordes (`next/headers`, email) |
| `@InjectMocks` | Fábrica con dependencias por parámetro: `createBookingService({ turnoRepository, clock })` |
| Test Data Builder | `src/features/<f>/testing/builders.ts`: `aTurno({ sucursalId })`, con valores por defecto válidos |
| Testcontainers | Servicio `db-test` de Docker Compose |
| `@Tag("integration")` | Sufijo del archivo (`*.int.test.ts`) y proyecto aparte en la config de Vitest |
| `@Disabled` | `it.skip`: no se mergea sin un ítem `BUG-N` que lo justifique |

Reglas:

- Un comportamiento por test. Si el nombre necesita una "y", son dos tests.
- Cada test arma sus datos y no depende del orden ni de otro test. En E2E se usan datos efímeros con sufijo único.
- **El tiempo se inyecta** (`clock`): ningún test de turnos depende de la hora real.
- Fakes antes que mocks. No se verifica "que se llamó a X" cuando se puede verificar el resultado.
- Sólo datos ficticios: nunca nombres, emails ni teléfonos reales.
- Nada de código sólo para tests en producción: builders, fakes y helpers viven en `testing/` o `src/test/`.
- En E2E: selectores por rol y texto visible; `data-testid` sólo cuando no hay otro; Page Objects en
  `tests/pages/`; nunca `waitForTimeout`.
- Prohibido `.only`: Playwright usa `forbidOnly` en CI y Vitest `allowOnly: false`.
- El tope de 100 líneas también vale para los tests: un archivo por action o por escenario.

## Cuándo se corre cada cosa

| Momento | Comando | Incluye |
|---|---|---|
| Mientras programás | `npm run test:watch` | Vitest en modo watch: unit, tipos, contrato y fuzz |
| `git commit` (hook) | lint, typecheck y bloqueo de `.env` | ESLint (con el tope de líneas) y `tsc --noEmit` |
| `git push` (hook) | `npm run test:coverage` y `skills:check` | Unit, tipos, contrato, fuzz y componente, con umbrales de cobertura |
| Si tocaste un repositorio o el schema | `npm run test:int` | Integración contra `db-test` |
| Si tocaste un flujo cubierto por E2E | `npm run test:e2e` | Playwright en Chromium desktop y mobile |
| Antes de integrar a `develop` | Lo que pide el nivel del ítem ([abajo](#nivel-de-tests-de-cada-ítem)) | En nivel 3, `npm run verify` |
| Cierre del sprint | `npm run verify` y `npm run test:e2e` | Todo, siempre, sin importar el nivel de los ítems |
| Push a `develop` o `main` | GitHub Actions | Lo mismo que `verify`, en jobs paralelos. Sin E2E: se corren a mano |

## Nivel de tests de cada ítem

| Nivel | Cuándo | Qué se corre antes de integrar |
|---|---|---|
| 1 · Texto o estilo | Sin lógica nueva: textos, clases de Tailwind, tokens, docs, skills | `npm run lint && npm run typecheck`, los tests relacionados y los E2E que miran ese texto |
| 2 · Lógica acotada | Una función, un componente, un bug de causa conocida | Lo del nivel 1 + `npm run test:coverage`; `npm run test:int` si tocó un repositorio |
| 3 · Profundo | Schema o migración, turnos y disponibilidad, seguridad (sesión, `proxy.ts`), cambios que cruzan capas | `npm run verify` completo, con mutación, y los E2E del flujo |

- Tests relacionados: `npx vitest related --run --project unit --project component <archivos tocados>`.
- Las salidas largas (tests, mutación, build) van a un log, y se lee sólo el resumen o los fallos.

## Velocidad de la suite

| Suite | Objetivo | Cómo |
|---|---|---|
| Unit, tipos, contrato y fuzz | < 30 s | Sin red ni base: fakes en memoria. Fuzz con 100 corridas por propiedad. |
| Integración | < 2 min | `db-test` en `tmpfs`, migraciones una sola vez en `globalSetup`, tablas vacías entre tests, archivos en serie. |
| E2E | < 5 min | Datos efímeros en vez de resetear la base. |
| Mutación | < 10 min | Sólo `domain/`, `services/` y `lib/` puro, con el modo incremental de Stryker. |

Reintentos: 0 en local y 1 en el CI. Un test que pasa al segundo intento es inestable y se investiga.

## Bases de datos

- Desarrollo: servicio `db` (postgres:15 en `127.0.0.1:5435`, base `nutricion_db`).
- Tests: servicio `db-test`. Nunca se testea contra la base de desarrollo, y **jamás** contra producción.

| Uso | Detalle |
|---|---|
| `db-test` | postgres:15 en `127.0.0.1:5436`, base `nutricion_test`, con `tmpfs` y perfil `test` (`docker compose up -d` no lo levanta). Se configura en `.env.test`, que está versionado. Se levanta con `docker compose up -d --wait db-test`. |
| Integración | `src/test/integration.global-setup.ts` aborta si `NODE_ENV=production`, si `APP_ENV=production` o si `LOCAL_DATABASE_URL` no es la de `db-test`, y aplica las migraciones con `prisma migrate deploy`. |
| E2E | `npm run test:e2e` carga `.env.test`, y `playwright.config.ts` aborta si la URL no es la de `db-test`. El `webServer` (`npm run e2e:server`) aplica las migraciones, corre el seed (con `APP_ENV=test` vacía las tablas de la agenda y carga una agenda de ejemplo: dos ubicaciones, horarios de lunes a viernes, 45 minutos y dos obras sociales) y levanta la app con `next build` + `next start` en el puerto 3100, con la carpeta `.next-e2e`. Los E2E que cambian horarios corren sólo en `chromium`; los que cargan turnos usan días distintos por proyecto y terminan cancelándolos. |

## Reportes

| Reporte | Dónde | Umbral o uso |
|---|---|---|
| Cobertura (Vitest, v8) | `coverage/index.html` | Líneas, funciones y statements ≥ 90 %; branches ≥ 85 %. Si no se cumplen, falla el push. |
| Mutación (Stryker) | `reports/mutation/mutation.html` | Score ≥ 70. Cada mutante sobreviviente es un assert que falta. |
| E2E (Playwright) | `playwright-report/` | Trazas en el primer reintento. |

Fuera de la cobertura: `prisma/`, `src/generated/`, `src/app/`, `src/proxy.ts`, `src/lib/db/index.ts`,
`src/lib/db/transaction.ts`, los repositorios (se prueban con integración) y los helpers de test.

### Movimiento

- Los componentes de `src/components/motion/` (Lenis y GSAP) sólo corren en un navegador real: quedan fuera de la
  cobertura unitaria (`vitest.config.mts`) y los cubre `tests/motion.spec.ts`, con `reducedMotion: 'no-preference'`.
- El resto de los E2E corre con `reducedMotion: 'reduce'` (`playwright.config.ts`): sin animaciones, son
  deterministas.
