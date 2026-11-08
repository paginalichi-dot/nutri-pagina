import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AppointmentRow } from '../../domain/appointment.schema';
import { AgendaDay, AgendaWeek } from './agenda-views';

function appointment(overrides: Partial<AppointmentRow>): AppointmentRow {
  return {
    id: crypto.randomUUID(),
    locationId: '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
    locationName: 'Consultorio Centro',
    startsAt: new Date('2026-11-09T12:00:00Z'),
    endsAt: new Date('2026-11-09T12:45:00Z'),
    status: 'CONFIRMED',
    source: 'PANEL',
    patientName: 'Ana Prueba',
    patientPhone: '11 2345-6789',
    patientEmail: null,
    healthInsuranceName: null,
    version: 1,
    ...overrides,
  };
}

const VIEW = {
  appointments: [
    appointment({}),
    appointment({ locationName: 'Online', patientName: 'Beto Prueba', status: 'PENDING', startsAt: new Date('2026-11-09T19:00:00Z'), endsAt: new Date('2026-11-09T19:45:00Z') }),
    appointment({ patientName: 'Ceci Prueba', status: 'CANCELLED', startsAt: new Date('2026-11-12T12:00:00Z'), endsAt: new Date('2026-11-12T12:45:00Z') }),
  ],
  blocks: [{ id: '9b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10', startsAt: new Date('2026-11-09T17:00:00Z'), endsAt: new Date('2026-11-09T18:00:00Z'), reason: 'Trámite', version: 1 }],
};

describe('AgendaDay', () => {
  it('US-13 CA-4: agrupa los turnos del día por ubicación, con hora, estado y link al detalle', () => {
    render(<AgendaDay day='2026-11-09' view={VIEW} />);
    const centro = screen.getByRole('region', { name: 'Consultorio Centro' });
    expect(within(centro).getByRole('link').textContent).toBe('09:00 a 09:45ConfirmadoAna Prueba');
    expect(within(screen.getByRole('region', { name: 'Online' })).getByRole('link').textContent).toContain('Pendiente');
    expect(screen.getByText('Bloqueado: 14:00 a 15:00')).toBeDefined();
    expect(screen.queryByText('Ceci Prueba')).toBeNull();
  });

  it('US-13 CA-7: un día sin turnos lo dice', () => {
    render(<AgendaDay day='2026-11-10' view={VIEW} />);
    expect(screen.getByText('No hay turnos este día.')).toBeDefined();
  });
});

describe('AgendaWeek', () => {
  it('US-13 CA-2: muestra los siete días con los turnos de cada uno y el cancelado tachado', () => {
    render(<AgendaWeek monday='2026-11-09' view={VIEW} />);
    expect(screen.getAllByRole('region')).toHaveLength(7);
    const thursday = screen.getByRole('region', { name: 'jueves, 12 de noviembre' });
    expect(within(thursday).getByText('Ceci Prueba').className).toContain('line-through');
    expect(within(screen.getByRole('region', { name: 'lunes, 9 de noviembre' })).getAllByRole('link')).toHaveLength(2);
  });
});
