import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { boardTitle } from './agenda-toolbar';
import { MonthCalendar, monthGrid, monthTitle, shiftMonth } from './month-calendar';

describe('calendario del mes (US-26 CA-6)', () => {
  it('la grilla va de lunes a domingo y cubre el mes entero', () => {
    const grid = monthGrid('2026-11-18');
    expect(grid[0]).toBe('2026-10-26');
    expect(grid.at(-1)).toBe('2026-12-06');
    expect(grid).toHaveLength(42);
    expect(monthGrid('2027-02-10')).toHaveLength(28);
  });

  it('cambia de mes y de año, y titula el mes', () => {
    expect([shiftMonth('2026-12-31', 1), shiftMonth('2026-01-15', -1)]).toEqual(['2027-01-01', '2025-12-01']);
    expect(monthTitle('2026-11-18')).toBe('Noviembre 2026');
  });

  it('marca el día elegido y los días con turnos, y cada día lleva a su agenda', () => {
    render(<MonthCalendar day='2026-11-12' mode='dia' today='2026-11-09' busyDays={new Set(['2026-11-05'])} />);
    const selected = screen.getByRole('link', { name: 'jueves, 12 de noviembre' });
    expect(selected.getAttribute('aria-current')).toBe('date');
    expect(selected.getAttribute('href')).toBe('/admin?dia=2026-11-12&vista=dia');
    expect(screen.getByRole('link', { name: 'jueves, 5 de noviembre, con turnos' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Mes siguiente' }).getAttribute('href')).toBe('/admin?dia=2026-12-01&vista=dia');
  });
});

describe('título de la agenda', () => {
  it('dice Hoy, el día o la semana, con el año', () => {
    expect(boardTitle({ day: '2026-11-09', mode: 'dia', today: '2026-11-09' })).toBe('Hoy, 9 de noviembre de 2026');
    expect(boardTitle({ day: '2026-11-10', mode: 'dia', today: '2026-11-09' })).toBe('Martes, 10 de noviembre de 2026');
    expect(boardTitle({ day: '2026-11-12', mode: 'semana', today: '2026-11-09' })).toBe('Semana del 9 de noviembre de 2026');
  });
});
