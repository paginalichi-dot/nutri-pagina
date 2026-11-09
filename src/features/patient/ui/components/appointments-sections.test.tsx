import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppointmentsSections } from './appointments-sections';
import { anAppointment } from './my-space.fixture';

describe('AppointmentsSections', () => {
  it('sin turnos muestra el vacío y el link a reservar, sin la sección de anteriores', () => {
    render(<AppointmentsSections upcoming={[]} past={[]} />);
    expect(screen.getByText('Todavía no tenés turnos.')).toBeDefined();
    expect(screen.getByRole('link', { name: /Reservá tu turno/ }).getAttribute('href')).toBe('/reservar');
    expect(screen.queryByText('Tus turnos anteriores')).toBeNull();
  });

  it('muestra la hora argentina, la ubicación, la dirección y el estado', () => {
    render(<AppointmentsSections upcoming={[anAppointment()]} past={[]} />);
    expect(screen.getByText('10/11/2026, 10:30')).toBeDefined();
    expect(screen.getByText('Consultorio Centro')).toBeDefined();
    expect(screen.getByText('Calle Falsa 123')).toBeDefined();
    expect(screen.getByText('Confirmado')).toBeDefined();
  });

  it('un turno online dice «Por videollamada» y los anteriores tienen su sección', () => {
    const online = anAppointment({ status: 'ATTENDED', place: { kind: 'ONLINE', address: null, directions: null, videoUrl: null } });
    render(<AppointmentsSections upcoming={[]} past={[online]} />);
    expect(screen.getByText('Tus turnos anteriores')).toBeDefined();
    expect(screen.getByText('Por videollamada')).toBeDefined();
    expect(screen.getByText('Asistió')).toBeDefined();
  });
});
