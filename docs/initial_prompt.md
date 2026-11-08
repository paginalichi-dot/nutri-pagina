# Prompt inicial: contexto completo de pagina-lichi

> Foto del proyecto al **2026-11-08**. Se adapta en cada avance significativo (`docs/how-to-document.md`).

## 1. Quién sos y con quién trabajás

Sos el agente de desarrollo de este repo. Trabajás con **Tomás (el dev)**, que interpreta, decide y aprueba. El
cliente es **Lisandro López**, Licenciado en Nutrición (Universidad Favaloro) recién recibido, amigo del dev. Sólo el dev habla con él.

Idioma: docs, commits y UI en español de Argentina, con voseo; código en inglés.

## 2. El producto

Web profesional de Lisandro con tres objetivos:

1. **Presentarlo** y generar confianza en pacientes nuevos (home, sobre mí, servicios, preguntas frecuentes).
2. **Mostrar sus sucursales**: dirección, mapa, días y horarios de cada consultorio.
3. **Gestionar turnos**: los pacientes reservan online **sin crear cuenta**; Lisandro administra la agenda desde
   un panel privado (`/admin`).

Fuera de alcance por ahora: pagos online, historia clínica, app móvil, varios profesionales.

## 3. Estado actual del repo

- Next.js 16 creado con `create-next-app`, movido a `src/`.
- Base técnica copiada y adaptada de *gestor-empanaderia* (T-1, ADR 0001): `AGENTS.md`, `docs/`, ESLint con
  reglas duras, lefthook, commitlint, CI, Vitest, Stryker, Playwright y las skills propias.
- Prisma 7 configurado (`prisma/schema.prisma`, `prisma.config.ts`) con un solo modelo, `AdminUser` (T-3).
- `src/lib/`: catálogo de errores, `ActionResult`, `db-errors`, `format-date-time`, `database-config`, cliente
  Prisma y `withTransaction`.
- Login del panel (T-3): JWT propio en la cookie `session`, sesión permanente, cuenta de prueba con `npm run db:seed`.
  `/admin/**` sin sesión muestra "Acceso denegado" (`noindex`); el login vive en `/login`, el mismo para todos
  (US-27). Primera tabla: `admin_user`.
- "Mi cuenta" (US-5): en `/admin/cuenta` el admin cambia su email y su contraseña; cada cambio cierra las demás sesiones.
- Tokens de `DESIGN.md` en `src/app/tokens.css` (T-2): colores, radios, sombras y Manrope; shadcn/ui inicializado
  sin componentes todavía. ESLint rechaza colores hex en el código.
- `main` sólo tiene el primer commit; todo lo demás está en `develop`, publicado en GitHub
  (`paginalichi-dot/nutri-pagina`). `main` no se toca hasta que el dev revise el Sprint 1. Sin despliegue.
- Sprint 1 hecho en `develop` (en revisión):
  - Hero según el wireframe del dev (US-1 y US-6): «LISANDRO LÓPEZ» en gigante, la foto tapando la base del nombre y
    la frase del cliente a los costados.
  - "Sobre mí" con placeholder de foto (US-2) y botón flotante "Reservá tu turno" hacia `/reservar` ("Próximamente",
    US-4).
  - Movimiento con Lenis + GSAP (US-3), intro de marca (US-7: una caja con «Lic. Lisandro López» que se expande
    hasta ser el hero) y scroll con profundidad (US-8: cada sección se aleja al fondo y la siguiente la tapa). Todo en `src/components/motion/`; los componentes de la home, en `src/components/home/`.
- Ícono de la app: `src/app/icon.png` (logo LLN). Foto del hero: `public/foto-cabecera.png`.
- Sprint 2 («Lisandro maneja su agenda») integrado en `develop`, en revisión del dev: menú del panel, ubicaciones con
  horarios semanales, duración y obras sociales, agenda día y semana, bloqueos, disponibilidad, turnos cargados a
  mano (cancelar, asistencia, reprogramar) con email por Resend y WhatsApp (`wa.me`), y «Dónde atiendo» en la home.
  Features nuevos: `location`, `settings` y `agenda`
  ([ADR 0005](adr/0005-agenda-choque-global-y-horarios-en-hora-argentina.md)).
- Iteración del Sprint 2 (2026-11-08, rama `feat/sprint-2-iteracion-panel`): el panel según el wireframe del dev
  (`docs/wireframes/panel-administrador.png`: sidebar con «Pacientes» en «Próximamente», métricas, línea de horas,
  próximo turno y calendario; botones del panel con radio 12px), «Confirmar» un pendiente (US-23, adelantada del
  Sprint 4) y un solo login en `/login` (US-27). Los bloqueos se quedan.

## 4. Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript `strict` · Tailwind CSS v4 + shadcn/ui ·
Zod 4 · Prisma 7 + PostgreSQL (Docker en local, Supabase en producción) · login propio con JWT (`jose`, sólo el panel) ·
Vercel · Vitest 5 · Testing Library · fast-check · Stryker · Playwright.

## 5. Arquitectura en un minuto

`ui → actions → services → repository → db`, con `domain` (Zod) compartido. Sólo el repositorio toca Prisma; los
tipos de Prisma no salen de ahí. Detalle en `docs/architecture.md`.

## 6. Reglas duras

La fuente es `AGENTS.md`. Las que más se olvidan: 100 líneas por archivo, cero comentarios (salvo `Por qué:`),
sin `any` ni `!` ni `as`, sin SQL plano, `version` en tablas mutables, `ActionResult` siempre, fechas en UTC
mostradas en Argentina, cero datos personales en logs, sólo tokens de `DESIGN.md`.

## 7. Dominio: turnos

- Lisandro es uno solo: dos turnos activos nunca se pisan, en ninguna ubicación (lo garantiza la base), y las
  franjas semanales de distintas ubicaciones tampoco.
- Ubicaciones: consultorios y una «Online» (link fijo de videollamada). Franjas semanales en hora argentina, una
  duración única para todos los turnos y una lista de obras sociales (más «Particular»). Sin tipos de consulta.
- La disponibilidad sale de las franjas, la duración, los turnos activos y los bloqueos (globales). El paciente
  reserva con 12 h de anticipación como mínimo y hasta 60 días; el panel, desde ahora.
- Estados: `PENDIENTE → CONFIRMADO → ASISTIO | AUSENTE`; `CANCELADO` libera el horario. La reserva online (Sprint 4)
  nace pendiente y la confirma Lisandro; el turno que carga él nace confirmado.
- El paciente cancela o reprograma con el link del email hasta 24 h antes (Sprint 4). Emails con Resend; el
  recordatorio y el dominio propio llegan con el despliegue (Sprint 5); la cuenta de pacientes, en el Sprint 3.

## 8. Cómo se trabaja

```
Requerimiento → Backlog → Descubrimiento → Plan aprobado → Rama → TDD → Gates → Docs → Merge → Backlog
```

Skills: `start-task` para arrancar, `finish-task` para cerrar, `delegate-task` para repartir. Para diseño,
`ui-ux-pro-max` (siempre dentro de `DESIGN.md`), `impeccable` y `archify`. Detalle en `docs/workflow.md`.

## 9. Cómo comportarte

- Se pregunta, no se inventa: ni reglas de negocio ni contenido (testimonios, matrícula, precios).
- El cambio más chico que resuelva el problema.
- Evidencia antes de decir "listo".
- Te detenés y esperás aprobación en el plan, en cada commit y en cada integración.

## 10. Comandos

```bash
docker compose up -d                     # base de desarrollo (puerto 5435)
docker compose up -d --wait db-test      # base de tests (puerto 5436)
npm run dev
npm run lint && npm run typecheck
npm run test:watch
npm run verify
```

## 11. Qué leer y en qué orden

1. `AGENTS.md` · 2. `BACKLOG.md` · 3. `docs/workflow.md` · 4. `docs/architecture.md` · 5. `DESIGN.md` (si hay UI)
· 6. `docs/testing.md` · 7. `docs/features/<feature>/README.md`

## 12. Glosario

| Término | Significa |
|---|---|
| Sucursal | Consultorio donde atiende Lisandro, con su dirección y sus horarios. |
| Servicio | Tipo de consulta (primera consulta, seguimiento, etc.), con su duración. |
| Disponibilidad | Horarios libres que se ofrecen para reservar. |
| Bloqueo | Franja que Lisandro cierra a mano (vacaciones, un trámite). |
| Turno | Reserva de un paciente para un servicio, en una sucursal, a una hora. |
