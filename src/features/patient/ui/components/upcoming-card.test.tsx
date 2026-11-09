import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { anAppointment } from './my-space.fixture';
import { UpcomingCard } from './upcoming-card';

const later = (id: string, day: string): ReturnType<typeof anAppointment> => anAppointment({ id, startsAt: new Date(`2026-11-${day}T13:30:00Z`) });

describe('UpcomingCard', () => {
  it('muestra el día en hora argentina, el lugar, el estado y el link a todos los turnos', () => {
    render(<UpcomingCard upcoming={[anAppointment()]} />);
    expect(screen.getByText('Martes 10 de noviembre · 10:30 hs')).toBeDefined();
    expect(screen.getByText('Consultorio Centro · Calle Falsa 123')).toBeDefined();
    expect(screen.getByText('Confirmado')).toBeDefined();
    expect(screen.getByRole('link', { name: /Ver todos/ }).getAttribute('href')).toBe('/mi-espacio/turnos');
    expect(screen.getByRole('link', { name: /Reservá tu turno/ }).getAttribute('href')).toBe('/reservar');
  });

  it('muestra como mucho dos turnos', () => {
    render(<UpcomingCard upcoming={[later('a', '10'), later('b', '11'), later('c', '12')]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('sin turnos lo dice y deja reservar; un turno online dice «Por videollamada»', () => {
    const { rerender } = render(<UpcomingCard upcoming={[]} />);
    expect(screen.getByText('Todavía no tenés turnos.')).toBeDefined();
    rerender(<UpcomingCard upcoming={[anAppointment({ place: { kind: 'ONLINE', address: null, directions: null, videoUrl: null } })]} />);
    expect(screen.getByText('Por videollamada')).toBeDefined();
  });
});
