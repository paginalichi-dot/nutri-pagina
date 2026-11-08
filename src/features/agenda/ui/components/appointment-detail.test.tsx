import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AppointmentDetail } from '../../domain/appointment.schema';
import { AppointmentInfo } from './appointment-detail';
import { NoticePanel } from './notice-panel';

vi.mock('../../actions/appointment-changes', () => ({ cancelAppointment: vi.fn(), confirmAppointment: vi.fn(), markAttendance: vi.fn() }));

const DETAIL: AppointmentDetail = {
  id: '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
  locationId: '8b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
  locationName: 'Consultorio Centro',
  startsAt: new Date('2026-11-09T12:00:00Z'),
  endsAt: new Date('2026-11-09T12:45:00Z'),
  status: 'CONFIRMED',
  source: 'PANEL',
  patientName: 'Ana Prueba',
  patientPhone: '11 2345-6789',
  patientEmail: null,
  healthInsuranceName: null,
  version: 2,
  place: { kind: 'IN_PERSON', address: 'Calle Falsa 123', directions: null, videoUrl: null },
};

describe('AppointmentInfo', () => {
  it('US-13 CA-5: muestra los datos del turno; sin email ni obra social dice Particular', () => {
    render(<AppointmentInfo appointment={DETAIL} now={new Date('2026-11-07T12:00:00Z')} />);
    for (const text of ['Ana Prueba', '11 2345-6789', 'Sin email', 'Particular', 'Consultorio Centro · Calle Falsa 123', 'Cargado desde el panel']) expect(screen.getByText(text)).toBeDefined();
    expect(screen.getByRole('link', { name: 'Escribir por WhatsApp' }).getAttribute('href')).toBe('https://wa.me/5491123456789?text=');
  });

  it('US-17 y US-18: un turno por venir se puede reprogramar o cancelar, pero no marcar asistencia', () => {
    render(<AppointmentInfo appointment={DETAIL} now={new Date('2026-11-07T12:00:00Z')} />);
    expect(screen.getByRole('link', { name: 'Reprogramar' }).getAttribute('href')).toBe(`/admin/turnos/${DETAIL.id}/reprogramar`);
    expect(screen.getByRole('button', { name: 'Cancelar turno' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Asistió' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
  });

  it('US-23 CA-1: un pendiente por venir se puede confirmar', () => {
    render(<AppointmentInfo appointment={{ ...DETAIL, status: 'PENDING' }} now={new Date('2026-11-07T12:00:00Z')} />);
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Cancelar turno' })).toBeDefined();
  });

  it('US-17 CA-3: un turno confirmado que ya empezó se marca asistió o ausente', () => {
    render(<AppointmentInfo appointment={DETAIL} now={new Date('2026-11-09T12:30:00Z')} />);
    expect(screen.getByRole('button', { name: 'Asistió' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Ausente' })).toBeDefined();
    expect(screen.queryByRole('button', { name: 'Cancelar turno' })).toBeNull();
  });

  it('un turno cancelado no ofrece acciones', () => {
    render(<AppointmentInfo appointment={{ ...DETAIL, status: 'CANCELLED' }} now={new Date('2026-11-07T12:00:00Z')} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('NoticePanel', () => {
  it('US-16 CA-5: tras guardar muestra el mensaje, el WhatsApp y el link al turno', () => {
    render(<NoticePanel state={{ success: true, message: 'Turno guardado.', data: { whatsappUrl: 'https://wa.me/549?text=Hola', appointmentId: DETAIL.id } }} />);
    expect(screen.getByRole('status').textContent).toContain('Turno guardado.');
    expect(screen.getByRole('link', { name: 'Avisar por WhatsApp' }).getAttribute('target')).toBe('_blank');
    expect(screen.getByRole('link', { name: 'Ver el turno' }).getAttribute('href')).toBe(`/admin/turnos/${DETAIL.id}`);
  });

  it('con un error lo muestra como alerta', () => {
    render(<NoticePanel state={{ success: false, code: 'SLOT_TAKEN', error: 'Ese horario ya no está disponible. Elegí otro.' }} />);
    expect(screen.getByRole('alert').textContent).toBe('Ese horario ya no está disponible. Elegí otro.');
  });
});
