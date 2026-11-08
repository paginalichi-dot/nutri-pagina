import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AppointmentRow } from '../../domain/appointment.schema';
import { DayTimeline } from './day-timeline';
import { WeekGrid } from './week-grid';

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
    appointment({ locationName: 'Online', patientName: 'Beto Prueba', status: 'PENDING', healthInsuranceName: 'Prepaga Uno', startsAt: new Date('2026-11-09T19:00:00Z'), endsAt: new Date('2026-11-09T19:45:00Z') }),
    appointment({ patientName: 'Dani Prueba', status: 'CANCELLED', startsAt: new Date('2026-11-09T13:00:00Z'), endsAt: new Date('2026-11-09T13:45:00Z') }),
    appointment({ patientName: 'Ceci Prueba', status: 'CANCELLED', startsAt: new Date('2026-11-12T12:00:00Z'), endsAt: new Date('2026-11-12T12:45:00Z') }),
  ],
  blocks: [{ id: '9b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10', startsAt: new Date('2026-11-09T17:00:00Z'), endsAt: new Date('2026-11-09T18:00:00Z'), reason: 'Trámite', version: 1 }],
};

describe('DayTimeline (US-26 CA-4)', () => {
  it('muestra cada turno del día con nombre, obra social, horario y ubicación, el bloqueo y no los cancelados', () => {
    render(<DayTimeline day='2026-11-09' view={VIEW} />);
    const links = within(screen.getByRole('list', { name: 'Turnos del día' })).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Ana Prueba · Particular, Confirmado09:00 – 09:45 · Consultorio Centro', 'Beto Prueba · Prepaga UnoPendiente16:00 – 16:45 · Online']);
    expect(links[0]?.getAttribute('href')).toBe(`/admin/turnos/${VIEW.appointments[0]?.id ?? ''}`);
    expect(screen.getByText('Bloqueado · Trámite')).toBeDefined();
    expect(screen.getByText('14:00 – 15:00')).toBeDefined();
    expect(screen.queryByText('Dani Prueba')).toBeNull();
  });

  it('ubica cada turno según su hora: el de las 9:00 queda una hora debajo de las 8:00', () => {
    render(<DayTimeline day='2026-11-09' view={VIEW} />);
    const first = within(screen.getByRole('list', { name: 'Turnos del día' })).getAllByRole('listitem').at(1);
    expect(first?.style.top).toBe('64px');
    expect(first?.style.height).toBe('48px');
  });

  it('US-13 CA-7: un día sin turnos lo dice', () => {
    render(<DayTimeline day='2026-11-10' view={VIEW} />);
    expect(screen.getByText('No hay turnos este día.')).toBeDefined();
  });
});

describe('WeekGrid (US-26 CA-9)', () => {
  it('muestra los siete días, con su link a la vista día, y las franjas de 4 horas', () => {
    render(<WeekGrid monday='2026-11-09' today='2026-11-09' view={VIEW} />);
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Día', '08–12', '12–16', '16–20']);
    expect(screen.getAllByRole('rowheader')).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Ver el lunes, 9 de noviembre' }).getAttribute('href')).toBe('/admin?dia=2026-11-09&vista=dia');
  });

  it('pone cada turno en su día y su franja, marca la franja bloqueada y deja afuera los cancelados', () => {
    render(<WeekGrid monday='2026-11-09' today='2026-11-09' view={VIEW} />);
    const monday = within(screen.getAllByRole('row')[1] ?? document.body).getAllByRole('cell');
    const ana = within(monday[0] ?? document.body).getByRole('link', { name: '09:00, Ana Prueba, Confirmado' });
    expect(ana.textContent).toBe('09:00');
    expect(ana.getAttribute('href')).toBe(`/admin/turnos/${VIEW.appointments[0]?.id ?? ''}`);
    expect(within(monday[2] ?? document.body).getByRole('link', { name: '16:00, Beto Prueba, Pendiente' })).toBeDefined();
    expect(within(monday[1] ?? document.body).getByText('Bloqueado')).toBeDefined();
    expect(screen.queryByRole('link', { name: /Dani Prueba|Ceci Prueba/ })).toBeNull();
  });

  it('un turno de las 22:00 argentinas cae en su día y suma la franja 20–24', () => {
    const late = appointment({ patientName: 'Eli Prueba', startsAt: new Date('2026-11-11T01:00:00Z'), endsAt: new Date('2026-11-11T01:45:00Z') });
    render(<WeekGrid monday='2026-11-09' today='2026-11-09' view={{ appointments: [late], blocks: [] }} />);
    const tuesday = within(screen.getAllByRole('row')[2] ?? document.body).getAllByRole('cell');
    expect(within(tuesday[3] ?? document.body).getByRole('link', { name: '22:00, Eli Prueba, Confirmado' })).toBeDefined();
  });
});
