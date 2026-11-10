import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AgendaSummary, AppointmentDetail } from '../../domain/appointment.schema';
import { greeting } from './agenda-header';
import { NextAppointmentCard, whenParts } from './next-appointment-card';
import { dayDelta, SummaryCards, weekDelta } from './summary-cards';

vi.mock('../../actions/appointment-changes', () => ({ confirmAppointment: vi.fn() }));

const NOW = new Date('2026-11-09T13:00:00Z');
const NEXT: AppointmentDetail = {
  id: '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
  locationId: '8b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
  locationName: 'Consultorio Centro',
  startsAt: new Date('2026-11-09T13:30:00Z'),
  endsAt: new Date('2026-11-09T14:15:00Z'),
  status: 'PENDING',
  source: 'ONLINE',
  patientName: 'Ana Prueba',
  patientPhone: '11 2345-6789',
  patientEmail: null,
  healthInsuranceName: null,
  version: 1,
  place: { kind: 'IN_PERSON', address: 'Calle Falsa 123', directions: null, videoUrl: null },
};
const SUMMARY: AgendaSummary = { today: { count: 6, yesterday: 4 }, week: { count: 28, previous: 25 }, newPatients: 3, time: { freeMinutes: 120, availableMinutes: 600 }, next: NEXT };

describe('textos del resumen (US-26 CA-2 y CA-3)', () => {
  it('compara hoy con ayer y la semana con la anterior', () => {
    expect([dayDelta(6, 4), dayDelta(2, 3), dayDelta(1, 1)]).toEqual(['+2 que ayer', '−1 que ayer', 'Igual que ayer']);
    expect([weekDelta(28, 25), weekDelta(20, 25), weekDelta(25, 25), weekDelta(3, 0), weekDelta(0, 0)]).toEqual([
      '+12% vs. semana anterior',
      '−20% vs. semana anterior',
      'Igual que la semana anterior',
      'Sin turnos la semana anterior',
      'Igual que la semana anterior',
    ]);
  });

  it.each([
    ['2026-11-09T11:00:00Z', 'Buen día'],
    ['2026-11-09T16:00:00Z', 'Buenas tardes'],
    ['2026-11-10T01:30:00Z', 'Buenas noches'],
  ])('a las %s (UTC) saluda «%s» según la hora argentina', (iso, text) => {
    expect(greeting(new Date(iso))).toBe(text);
  });

  it('dice el día del próximo turno: hoy, mañana o la fecha', () => {
    expect(whenParts(NEXT, NOW)).toEqual({ day: 'Hoy', time: '10:30 – 11:15' });
    expect(whenParts(NEXT, new Date('2026-11-08T13:00:00Z')).day).toBe('Mañana');
    expect(whenParts(NEXT, new Date('2026-11-06T13:00:00Z')).day).toBe('Lunes, 9 de noviembre');
  });
});

describe('SummaryCards', () => {
  it('muestra las cuatro métricas con sus bajadas', () => {
    render(<SummaryCards summary={SUMMARY} />);
    const cards = within(screen.getByRole('list', { name: 'Resumen' })).getAllByRole('listitem');
    expect(cards.map((card) => card.textContent)).toEqual(['Turnos hoy6+2 que ayer', 'Esta semana28+12% vs. semana anterior', 'Pacientes nuevos3Esta semana', 'Horas libres hoy2:00De 10:00 disponibles']);
  });

  it('sin duración definida, las horas libres piden definirla', () => {
    render(<SummaryCards summary={{ ...SUMMARY, time: null }} />);
    expect(screen.getByText('Definí la duración en Ajustes')).toBeDefined();
  });

  it('un día sin horarios dice que hoy no atendés', () => {
    render(<SummaryCards summary={{ ...SUMMARY, time: { freeMinutes: 0, availableMinutes: 0 } }} />);
    expect(screen.getByText('Hoy no atendés')).toBeDefined();
  });
});

describe('NextAppointmentCard (US-26 CA-5)', () => {
  it('un pendiente ofrece Confirmar y WhatsApp, con el lugar y el detalle', () => {
    render(<NextAppointmentCard appointment={NEXT} now={NOW} />);
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'WhatsApp' }).getAttribute('href')).toBe('https://wa.me/5491123456789?text=');
    expect(screen.getByText('Calle Falsa 123')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Ver el detalle del próximo turno' }).getAttribute('href')).toBe(`/admin/turnos/${NEXT.id}`);
  });

  it('uno confirmado ofrece Ver turno; uno online dice que es por videollamada', () => {
    render(<NextAppointmentCard appointment={{ ...NEXT, status: 'CONFIRMED', place: { ...NEXT.place, kind: 'ONLINE' } }} now={NOW} />);
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Ver turno' })).toBeDefined();
    expect(screen.getByText('Por videollamada')).toBeDefined();
  });

  it('sin turnos por venir lo dice', () => {
    render(<NextAppointmentCard appointment={null} now={NOW} />);
    expect(screen.getByText('No tenés turnos por venir.')).toBeDefined();
  });
});
