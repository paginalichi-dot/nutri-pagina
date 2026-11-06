# 0001 — Arquitectura, reglas y gates heredados de gestor-empanaderia

- **Estado**: Aceptado (2026-11-06)

## Contexto

El proyecto arranca de cero. El dev ya tiene en *gestor-empanaderia* un flujo de trabajo, una arquitectura en
capas y unos gates (ESLint con reglas duras, lefthook, commitlint, CI, Vitest, Stryker y Playwright) que funcionan
con agentes de IA.

## Decisión

Se copian el flujo (`docs/workflow.md`), las reglas (`AGENTS.md`), los gates y las skills propias (`start-task`,
`finish-task`, `delegate-task`), adaptados a este dominio. Como no hay código heredado, las reglas duras rigen
**desde el primer commit**: no hay lista legacy.

## Alternativas descartadas

- Empezar sin reglas y sumarlas después: es exactamente lo que obligó a la lista legacy en gestor-empanaderia.

## Consecuencias

Más estructura de la que un sitio chico necesitaría al principio, a cambio de que el sistema de turnos nazca
testeado. Los cambios al flujo se hacen acá y no se sincronizan con gestor-empanaderia.
