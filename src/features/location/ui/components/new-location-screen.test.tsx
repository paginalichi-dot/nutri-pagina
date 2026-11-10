import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NewLocationScreen } from './new-location-screen';
import { weeklyHours, weekSummary } from './week-draft';

vi.mock('../../actions/create-location', () => ({ createLocation: vi.fn() }));

const preview = (): HTMLElement => screen.getByRole('complementary', { name: 'Vista del paciente' });

describe('Nueva ubicación (US-42)', () => {
  it('CA-1: el título y el botón dicen qué se carga; la online pide el link', () => {
    render(<NewLocationScreen />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Nuevo consultorio');
    expect(screen.getByRole('button', { name: 'Guardar consultorio' })).toBeTruthy();
    expect(screen.getByLabelText(/^Dirección/)).toBeTruthy();
    fireEvent.click(screen.getByLabelText(/Online/));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Nuevo espacio online');
    expect(screen.getByRole('button', { name: 'Guardar ubicación online' })).toBeTruthy();
    expect(screen.getByLabelText(/^Link de la videollamada/)).toBeTruthy();
    expect(within(preview()).getByText('Por videollamada')).toBeTruthy();
  });

  it('CA-1 y CA-2: prender un día suma una franja, «Franja» suma otra y la vista del paciente las cuenta', () => {
    render(<NewLocationScreen />);
    expect(within(preview()).getByText('Todavía no cargaste horarios.')).toBeTruthy();
    fireEvent.click(screen.getByRole('switch', { name: 'Atendés los lunes' }));
    expect(screen.getByLabelText<HTMLInputElement>('Desde, lunes').value).toBe('09:00');
    fireEvent.click(screen.getByRole('button', { name: 'Franja' }));
    expect(screen.getAllByLabelText(/Desde, lunes/)).toHaveLength(2);
    expect(within(preview()).getByText('09:00 – 13:00 · 16:00 – 20:00')).toBeTruthy();
    expect(within(preview()).getByText('8')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Quitar la franja del lunes' })[0] ?? document.body);
    expect(screen.getAllByLabelText(/Desde, lunes/)).toHaveLength(1);
  });

  it('CA-2: el nombre y la visibilidad se ven en la tarjeta mientras se escriben', () => {
    render(<NewLocationScreen />);
    fireEvent.input(screen.getByLabelText(/^Nombre/), { target: { value: 'Sede Norte' } });
    expect(within(preview()).getByText('Sede Norte')).toBeTruthy();
    expect(within(preview()).getByText('Visible')).toBeTruthy();
    fireEvent.click(screen.getByRole('switch', { name: 'Visible para los pacientes' }));
    expect(within(preview()).getByText('Oculta')).toBeTruthy();
  });

  it('las horas por semana ignoran las franjas incompletas o al revés', () => {
    const week = [[{ key: 1, start: '09:00', end: '10:30' }, { key: 2, start: '12:00', end: '11:00' }], [{ key: 3, start: '', end: '10:00' }], [], [], [], [], []];
    expect(weeklyHours(week)).toBe('1,5');
    expect(weekSummary(week)).toEqual([{ day: 'lunes', ranges: '09:00 – 10:30' }]);
  });
});
