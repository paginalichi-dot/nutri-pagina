import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LocationsScreen } from './locations-screen';

vi.mock('../../actions/location-changes', () => ({ addHours: vi.fn(), updateHours: vi.fn(), deleteHours: vi.fn(), setLocationActive: vi.fn() }));

const BASE = { directions: null, mapUrl: null, videoUrl: null, active: true, version: 1 };
const CENTRO = {
  ...BASE,
  id: '00000000-0000-4000-8000-000000000001',
  name: 'El centro',
  kind: 'IN_PERSON' as const,
  address: 'Estomba 246',
  hours: [
    { id: '00000000-0000-4000-8000-0000000000a1', locationId: '00000000-0000-4000-8000-000000000001', weekday: 1, startMinute: 960, endMinute: 1200, version: 1 },
    { id: '00000000-0000-4000-8000-0000000000a2', locationId: '00000000-0000-4000-8000-000000000001', weekday: 3, startMinute: 540, endMinute: 780, version: 1 },
  ],
};
const ONLINE = { ...BASE, id: '00000000-0000-4000-8000-000000000002', name: 'Atención online', kind: 'ONLINE' as const, address: null, videoUrl: 'https://meet.example.test/sala', active: false, hours: [] };
const STATS = { appointmentsThisMonth: 6, blocksThisMonth: 1 };

describe('Ubicaciones (US-41)', () => {
  it('CA-1: la lista marca la elegida, trae el chip de cada una y en mobile esconde la ficha', () => {
    render(<LocationsScreen locations={[CENTRO, ONLINE]} selected={{ location: CENTRO, stats: STATS }} focus='list' />);
    const list = screen.getByRole('list', { name: 'Ubicaciones' });
    expect(within(list).getByRole('link', { name: /El centro/ }).getAttribute('aria-current')).toBe('page');
    expect(within(list).getByText('Presencial')).toBeTruthy();
    expect(within(list).getByText('Desactivada')).toBeTruthy();
    expect(within(list).getByText('Videollamada')).toBeTruthy();
    expect(screen.getByRole('article').parentElement?.className).toContain('hidden lg:flex');
  });

  it('CA-2 a CA-5: la ficha muestra horarios por día, los números del mes y el botón para desactivar', () => {
    render(<LocationsScreen locations={[CENTRO, ONLINE]} selected={{ location: CENTRO, stats: STATS }} focus='detail' />);
    const hours = screen.getByRole('list', { name: 'Horarios por día' });
    expect(within(hours).getByText('16:00 – 20:00')).toBeTruthy();
    expect(within(hours).getAllByText('sin atención')).toHaveLength(5);
    expect(screen.getByText('turnos este mes')).toBeTruthy();
    expect(screen.getByText('bloqueo este mes')).toBeTruthy();
    expect(screen.queryByText(/asistencia/)).toBeNull();
    expect(screen.getByRole('link', { name: 'Abrir en Google Maps' }).getAttribute('href')).toContain('Estomba%20246');
    expect(screen.getByRole('link', { name: 'Editar datos' }).getAttribute('href')).toBe(`/admin/ubicaciones/${CENTRO.id}/editar`);
    expect(screen.getByRole('button', { name: 'Desactivar ubicación' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Volver a ubicaciones' })).toBeTruthy();
  });

  it('CA-3: el lápiz abre la edición de esa franja con sus horas', () => {
    render(<LocationsScreen locations={[CENTRO]} selected={{ location: CENTRO, stats: STATS }} focus='detail' />);
    fireEvent.click(screen.getByRole('button', { name: 'Editar la franja del lunes de 16:00 – 20:00' }));
    const form = screen.getByRole('form', { name: 'Editar la franja' });
    expect(within(form).getByLabelText<HTMLInputElement>('Desde').value).toBe('16:00');
    fireEvent.click(within(form).getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('form', { name: 'Editar la franja' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Agregar horario' }));
    expect(screen.getByRole('form', { name: 'Agregar una franja' })).toBeTruthy();
  });

  it('una ubicación online desactivada muestra su link y «Reactivar ubicación»', () => {
    render(<LocationsScreen locations={[ONLINE]} selected={{ location: ONLINE, stats: { appointmentsThisMonth: 1, blocksThisMonth: 0 } }} focus='detail' />);
    expect(screen.getByRole('link', { name: 'https://meet.example.test/sala' })).toBeTruthy();
    expect(screen.getByText('turno este mes')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reactivar ubicación' })).toBeTruthy();
  });
});
