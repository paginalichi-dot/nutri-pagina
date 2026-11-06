---
name: start-task
description: Use BEFORE writing any code in the pagina-lichi repo — when starting a user story, enabler, bug fix or any new task. Runs the mandatory discovery questions, checks the backlog, and produces an approved plan in docs/plans/ before implementation.
---

# start-task — arrancar una tarea en pagina-lichi

Seguí estos pasos **en orden**. No escribas código de producción hasta completar el paso 5.

## 1. Contexto obligatorio

Leé `AGENTS.md`, `docs/workflow.md`, `docs/architecture.md` y, si existe, `docs/features/<feature>/README.md`.
Si la tarea toca UI, leé también `DESIGN.md`.

## 2. Ubicar la tarea en el backlog

- Buscá el ítem en `BACKLOG.md` (ID `US-N`, `T-N` o `BUG-N`).
- Si no existe: pedile al dev los datos y agregalo antes de seguir.
- Verificá que sus dependencias estén en `Hecho`. Si no, avisá y frená.

## 3. Descubrimiento

Hacele al dev las preguntas de `docs/workflow.md` §2 que **no** estén respondidas por la US, las specs
(`docs/requerimientos/specs.md`) o la doc del feature. Agrupalas en un solo mensaje, numeradas. Como mínimo cubrí:

1. Quién ejecuta cada acción (paciente sin cuenta o Lisandro en el panel) y qué pasa sin sesión.
2. Campos de entrada/salida con tipo, obligatoriedad, largo, formato, rango y unicidad.
3. Acciones inválidas → código de error y mensaje en español.
4. Concurrencia (¿dos pacientes reservando el mismo horario?) y fechas (UTC guardado, Argentina mostrado).
5. Estados de UI: carga, vacío, error.
6. Criterios de aceptación medibles.
7. Datos personales: qué se pide y por qué.
8. Si toca UI: qué componente de `DESIGN.md` se usa, o cuál se propone.

Las dudas de negocio que el dev no pueda responder van a "Preguntas abiertas" del ítem en `BACKLOG.md`. 
No inventes reglas de negocio.

## 4. Plan

Copiá `docs/templates/plan.md` a `docs/plans/<ID>-<slug>.md` y completalo: cambios por capa
(domain → schema/migración → repository → service → actions → ui), tabla de errores, restricciones de DB, tests por tipo, riesgos, archivos a crear/modificar
(respetando 100 líneas por archivo y responsabilidad única).

- Elegí el cambio más chico que resuelva el problema: un texto mal armado se arregla en su plantilla, no en cada
  llamada que la usa.
- Si cambia el modelo de datos, incluí el ERD hecho con `archify`.
- Declará el **nivel de tests** (1 texto o estilo, 2 lógica acotada, 3 profundo; `docs/testing.md` § Nivel de
  tests). Ante la duda, el de arriba.

## 5. Aprobación

Mostrale el plan al dev y **esperá su aprobación explícita**. Con la aprobación:

- `BACKLOG.md`: estado `En progreso`, dueño, fecha de inicio.
- Rama desde `develop`: `feat/<id>-<slug>` (ver `docs/git.md`).
- Implementá con TDD siguiendo el orden de `docs/workflow.md` §5 (skill `test-driven-development`).