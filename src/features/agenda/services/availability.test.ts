import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { argentinaTime } from '@/lib/format-date-time';
import { type AvailabilityInput, availableSlots, bookingWindow } from './availability';

const MONDAY = '2026-11-09';
const NOW = new Date('2026-11-07T12:00:00Z');
const BASE: AvailabilityInput = { day: MONDAY, hours: [{ weekday: 1, startMinute: 540, endMinute: 780 }], slotMinutes: 60, busy: [], now: NOW, scope: 'public' };

const times = (input: Partial<AvailabilityInput>): string[] => availableSlots({ ...BASE, ...input }).map((date) => argentinaTime(date));
const at = (iso: string, minutes: number): { startsAt: Date; endsAt: Date } => ({ startsAt: new Date(iso), endsAt: new Date(Date.parse(iso) + minutes * 60_000) });

describe('availableSlots', () => {
  it('US-15 CA-1: corta la franja en pasos de la duración desde su inicio', () => {
    expect(times({})).toEqual(['09:00', '10:00', '11:00', '12:00']);
  });

  it('US-15 CA-1: un turno que no entra entero en la franja no se ofrece', () => {
    expect(times({ slotMinutes: 45 })).toEqual(['09:00', '09:45', '10:30', '11:15', '12:00']);
    expect(times({ slotMinutes: 120, hours: [{ weekday: 1, startMinute: 540, endMinute: 780 }] })).toEqual(['09:00', '11:00']);
  });

  it('US-15 CA-1: junta varias franjas del mismo día en orden y sólo las de ese día', () => {
    const hours = [
      { weekday: 1, startMinute: 960, endMinute: 1080 },
      { weekday: 2, startMinute: 540, endMinute: 600 },
      { weekday: 1, startMinute: 540, endMinute: 600 },
    ];
    expect(times({ hours })).toEqual(['09:00', '16:00', '17:00']);
  });

  it('US-15 CA-2: descuenta turnos y bloqueos de cualquier ubicación, aunque se pisen apenas', () => {
    const busy = [at('2026-11-09T13:30:00Z', 15), at('2026-11-09T14:00:00Z', 60)];
    expect(times({ busy })).toEqual(['09:00', '12:00']);
  });

  it('US-15 CA-2: un turno que termina justo cuando empieza otro no lo bloquea', () => {
    expect(times({ busy: [at('2026-11-09T11:00:00Z', 60)] })).toEqual(['09:00', '10:00', '11:00', '12:00']);
  });

  it('US-15 CA-3: el paciente no ve horarios a menos de 12 h; el panel sí, salvo los que ya pasaron', () => {
    const now = new Date('2026-11-09T01:30:00Z');
    expect(times({ now })).toEqual(['11:00', '12:00']);
    expect(times({ now, scope: 'panel' })).toEqual(['09:00', '10:00', '11:00', '12:00']);
    expect(times({ now: new Date('2026-11-09T13:30:00Z'), scope: 'panel' })).toEqual(['11:00', '12:00']);
  });

  it('US-15 CA-3: no se ofrecen horarios a más de 60 días', () => {
    expect(times({ day: '2027-01-04' })).toEqual(['09:00', '10:00', '11:00', '12:00']);
    expect(times({ day: '2027-01-11' })).toEqual([]);
  });

  it('US-15 CA-4: una franja que termina a la medianoche argentina cae al día siguiente en UTC', () => {
    const slots = availableSlots({ ...BASE, hours: [{ weekday: 1, startMinute: 1320, endMinute: 1440 }] });
    expect(slots.map((date) => date.toISOString())).toEqual(['2026-11-10T01:00:00.000Z', '2026-11-10T02:00:00.000Z']);
  });

  it('US-15 CA-4: un día sin franjas no ofrece nada', () => {
    expect(times({ day: '2026-11-10' })).toEqual([]);
  });

  it('propiedad: ningún horario ofrecido se pisa con lo ocupado ni sale de la ventana', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 24 * 60 }), { maxLength: 6 }), fc.constantFrom(15, 30, 45, 60), (offsets, slotMinutes) => {
        const busy = offsets.map((offset) => at(new Date(Date.parse('2026-11-09T03:00:00Z') + offset * 60_000).toISOString(), 30));
        const { earliest, latest } = bookingWindow(NOW, 'public');
        for (const startsAt of availableSlots({ ...BASE, slotMinutes, busy })) {
          const endsAt = new Date(startsAt.getTime() + slotMinutes * 60_000);
          expect(busy.some((taken) => startsAt < taken.endsAt && taken.startsAt < endsAt)).toBe(false);
          expect(startsAt >= earliest && startsAt <= latest).toBe(true);
        }
      })
    );
  });
});
