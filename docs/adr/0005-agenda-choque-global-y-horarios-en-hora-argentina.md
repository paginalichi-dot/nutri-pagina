# 0005 — Agenda: choque global de turnos y horarios semanales en hora argentina

- **Estado**: Aceptado (2026-11-07)

## Contexto

Lisandro atiende solo, en varias ubicaciones (consultorios y online). El Sprint 2 suma horarios semanales por
ubicación, bloqueos, turnos cargados desde el panel y el cálculo de disponibilidad. `AGENTS.md` decía "un horario de
una sucursal no puede tener dos turnos activos" y "las fechas se guardan en UTC".

## Decisión

1. **Choque global.** Dos turnos activos (todo estado salvo `CANCELLED`) nunca se pisan en el tiempo, en ninguna
   ubicación: `EXCLUDE USING gist (tstzrange(starts_at, ends_at) WITH &&)` en `appointment`. Las franjas semanales
   tampoco se pisan entre ubicaciones (`EXCLUDE` sobre el minuto de la semana en `weekly_hours`).
2. **Horarios semanales en hora argentina.** Una franja se guarda como día de la semana (1 = lunes) y minutos desde la
   medianoche argentina. No es un instante, así que no va en UTC; los turnos y bloqueos sí son instantes y van en
   `timestamptz`. El paso de "lunes 9:00" a UTC lo hace `argentinaInstant` con desplazamiento fijo `-03:00`
   (Argentina no usa horario de verano desde 2009).
3. **Bloqueo contra turno.** Un bloqueo y un turno viven en tablas distintas, así que la base no puede impedir que se
   pisen. Crear un turno, moverlo o crear un bloqueo corre en una transacción `Serializable`; si dos chocan, una
   falla con `40001`. Con tablas chicas Postgres bloquea de más, así que dos turnos en horarios distintos también
   pueden chocar: `agendaRepository.inTransaction` reintenta hasta 5 veces, con una espera corta al azar; si igual
   falla, el usuario ve `STALE_VERSION`. Los emails se mandan después de la transacción, así que un reintento nunca
   duplica un aviso.
4. **Una sola duración.** Todos los turnos duran lo mismo (`agenda_settings`, fila única); la grilla de cada franja
   sale de esa duración, desde el inicio de la franja.

## Alternativas descartadas

- Choque por ubicación: permite dar dos turnos a la misma hora en dos lugares, imposible para una sola persona.
- Franjas en UTC: un "lunes 22:00" argentino cae martes en UTC y la regla semanal se rompe.
- Lock con SQL a mano (`pg_advisory_xact_lock`): `AGENTS.md` prohíbe SQL plano fuera de las migraciones.

## Consecuencias

- `AGENTS.md` cambia la regla de doble reserva (global) y aclara la excepción de fechas para las franjas.
- Si Argentina vuelve al horario de verano, `argentinaInstant` pasa a calcular el desplazamiento con `Intl`.
- Con varios profesionales (fuera de alcance), el choque pasaría a ser por profesional.
