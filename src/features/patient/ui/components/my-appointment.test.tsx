import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MyAppointmentActions } from './my-appointment-actions';
import { MyAppointmentCard } from './my-appointment-card';
import { anAppointment } from './my-space.fixture';

vi.mock('@/features/agenda/actions/patient-bookings', () => ({ cancelMyAppointment: vi.fn() }));

const ONLINE = { kind: 'ONLINE', address: null, directions: null, videoUrl: 'https://meet.example.test/sala' } as const;

describe('Mi espacio: el detalle de un turno (US-24, US-25)', () => {
  it('el link de la videollamada aparece sólo con el turno confirmado', () => {
    const { rerender } = render(<MyAppointmentCard appointment={anAppointment({ place: ONLINE })}>{null}</MyAppointmentCard>);
    expect(screen.getByRole('link', { name: /Entrar a la videollamada/ }).getAttribute('href')).toBe('https://meet.example.test/sala');
    rerender(<MyAppointmentCard appointment={anAppointment({ place: ONLINE, status: 'PENDING' })}>{null}</MyAppointmentCard>);
    expect(screen.queryByRole('link', { name: /Entrar a la videollamada/ })).toBeNull();
    expect(screen.getByText('Lisandro todavía no lo confirmó. Te avisamos por email.')).toBeDefined();
  });

  it('con más de 24 h ofrece reprogramar y cancelar', () => {
    render(<MyAppointmentActions id='turno-1' version={2} canChange tooLate={false} whatsappUrl={null} />);
    expect(screen.getByRole('link', { name: 'Reprogramar' }).getAttribute('href')).toBe('/mi-espacio/turnos/turno-1/reprogramar');
    expect(screen.getByRole('button', { name: 'Cancelar turno' })).toBeDefined();
  });

  it('con menos de 24 h manda a escribirle a Lisandro, por WhatsApp si está configurado', () => {
    const late = { id: 'turno-1', version: 2, canChange: false, tooLate: true };
    const { rerender, container } = render(<MyAppointmentActions {...late} whatsappUrl='https://wa.me/5491100000000?text=Hola' />);
    expect(screen.getByRole('link', { name: /Escribile por WhatsApp/ }).getAttribute('href')).toBe('https://wa.me/5491100000000?text=Hola');
    expect(screen.queryByRole('button', { name: 'Cancelar turno' })).toBeNull();
    rerender(<MyAppointmentActions {...late} whatsappUrl={null} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText(/Faltan menos de 24 h/)).toBeDefined();
    rerender(<MyAppointmentActions {...late} tooLate={false} whatsappUrl={null} />);
    expect(container.textContent).toBe('');
  });
});
