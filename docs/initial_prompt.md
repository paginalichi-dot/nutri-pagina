# Prompt inicial: contexto completo de pagina-lichi

> Foto del proyecto al **2026-11-06**. Se adapta en cada avance significativo (`docs/how-to-document.md`).

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

- Next.js 16 creado con `create-next-app`, movido a `src/`. La home es un placeholder.
- Base técnica copiada y adaptada de *gestor-empanaderia* (T-1, ADR 0001): `AGENTS.md`, `docs/`, ESLint con
  reglas duras, lefthook, commitlint, CI, Vitest, Stryker, Playwright y las skills propias.
- Prisma 7 configurado (`prisma/schema.prisma`, `prisma.config.ts`) **sin modelos todavía**.
- `src/lib/`: catálogo de errores, `ActionResult`, `db-errors`, `format-date-time`, `database-config`, cliente
  Prisma y `withTransaction`.
- `src/proxy.ts` cierra `/admin` hasta que exista el login (T-3).
- `DESIGN.md` define la identidad visual, pero los tokens todavía no están en `globals.css` (T-2).
- Primer commit (`chore: estructura inicial del proyecto`) en `main` y `develop`, publicado en GitHub
  (`paginalichi-dot/nutri-pagina`). Sin despliegue.
- Sprint 1 cargado en `BACKLOG.md` a partir del primer pedido del cliente: hero con su nombre en gigante y su
  frase (US-1), "Sobre mí" (US-2), scroll suave con aparición de secciones (US-3) y botón flotante "Reservá tu turno" (US-4).
- La foto del hero ya está: `public/foto-cabecera.png`, recortada y sin fondo.

## 4. Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript `strict` · Tailwind CSS v4 + shadcn/ui ·
Zod 4 · Prisma 7 + PostgreSQL (Docker en local, Supabase en producción) · Supabase Auth (sólo el panel) ·
Vercel · Vitest 5 · Testing Library · fast-check · Stryker · Playwright.

## 5. Arquitectura en un minuto

`ui → actions → services → repository → db`, con `domain` (Zod) compartido. Sólo el repositorio toca Prisma; los
tipos de Prisma no salen de ahí. Detalle en `docs/architecture.md`.

## 6. Reglas duras

La fuente es `AGENTS.md`. Las que más se olvidan: 100 líneas por archivo, cero comentarios (salvo `Por qué:`),
sin `any` ni `!` ni `as`, sin SQL plano, `version` en tablas mutables, `ActionResult` siempre, fechas en UTC
mostradas en Argentina, cero datos personales en logs, sólo tokens de `DESIGN.md`.

## 7. Dominio: turnos

- Un horario de una sucursal no puede tener dos turnos activos: lo garantiza la base.
- La disponibilidad sale de los horarios de cada sucursal, la duración del servicio, los turnos activos y los
  bloqueos.
- Estados: `PENDIENTE → CONFIRMADO → ASISTIO | AUSENTE`; `CANCELADO` libera el horario.
- El paciente cancela con un link de un solo uso que llega por email.

Sin definir todavía (ver "Preguntas abiertas" en `BACKLOG.md`): si los turnos se confirman solos, la duración de
cada consulta, la anticipación mínima y el proveedor de email.

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
