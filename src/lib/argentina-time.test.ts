import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMinutes,
  argentinaInstant,
  argentinaWeekday,
  isArgentinaDay,
  longDay,
  minuteOfDay,
  minutesToTime,
  startOfWeek,
  timeToMinutes,
  todayInArgentina,
  whenText,
} from './argentina-time';

describe('isArgentinaDay', () => {
  it.each(['2026-11-07', '2028-02-29'])('acepta %s', (day) => {
    expect(isArgentinaDay(day)).toBe(true);
  });

  it.each(['2026-02-30', '2026-13-01', '07/11/2026', '2026-11-7', '', '2026-11-07T00:00'])('rechaza %s', (day) => {
    expect(isArgentinaDay(day)).toBe(false);
  });
});

describe('argentinaInstant', () => {
  it('el minuto 0 de un día argentino son las 03:00 UTC', () => {
    expect(argentinaInstant('2026-11-07', 0).toISOString()).toBe('2026-11-07T03:00:00.000Z');
  });

  it('las 22:30 de Argentina caen al día siguiente en UTC (cruce de medianoche)', () => {
    expect(argentinaInstant('2026-11-07', 22 * 60 + 30).toISOString()).toBe('2026-11-08T01:30:00.000Z');
  });

  it('ida y vuelta: el minuto del día de un instante argentino es el original', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1439 }), (minute) => {
        expect(minuteOfDay(argentinaInstant('2026-11-07', minute))).toBe(minute);
      })
    );
  });
});

describe('días', () => {
  it.each([
    ['2026-11-09', 1],
    ['2026-11-07', 6],
    ['2026-11-08', 7],
  ])('%s es el día %i de la semana (lunes = 1)', (day, weekday) => {
    expect(argentinaWeekday(day)).toBe(weekday);
  });

  it('addDays cruza meses y años', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('startOfWeek da el lunes de la semana', () => {
    expect(startOfWeek('2026-11-08')).toBe('2026-11-02');
    expect(startOfWeek('2026-11-09')).toBe('2026-11-09');
  });

  it('todayInArgentina usa la hora de Argentina, no la UTC', () => {
    expect(todayInArgentina(new Date('2026-11-08T02:30:00Z'))).toBe('2026-11-07');
  });

  it('longDay y whenText escriben el día y la hora de Argentina en español', () => {
    expect(longDay('2026-11-09')).toBe('lunes, 9 de noviembre');
    expect(whenText(new Date('2026-11-10T01:30:00Z'))).toBe('lunes, 9 de noviembre a las 22:30');
  });
});

describe('horas', () => {
  it.each([
    ['09:00', 540],
    ['00:00', 0],
    ['23:59', 1439],
  ])('timeToMinutes(%s) = %i', (time, minutes) => {
    expect(timeToMinutes(time)).toBe(minutes);
    expect(minutesToTime(minutes)).toBe(time);
  });

  it.each(['24:00', '9:00', '12:60', 'nueve'])('timeToMinutes rechaza %s', (time) => {
    expect(timeToMinutes(time)).toBeNull();
  });

  it('minutesToTime escribe el fin del día como 24:00', () => {
    expect(minutesToTime(1440)).toBe('24:00');
  });

  it('addMinutes suma minutos', () => {
    expect(addMinutes(new Date('2026-11-07T12:00:00Z'), 45).toISOString()).toBe('2026-11-07T12:45:00.000Z');
  });
});
