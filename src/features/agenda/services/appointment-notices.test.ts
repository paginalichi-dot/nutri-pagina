import { describe, expect, it } from 'vitest';
import type { AppointmentDetail } from '../domain/appointment.schema';
import { appointmentEmail, placeText, whatsappMessage } from './appointment-notices';

const NOW = new Date('2026-11-07T12:00:00Z');
const BASE: AppointmentDetail = {
  id: '7b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
  locationId: '8b0f1a52-4a5c-4c1e-9a43-1f3b5a7c9d10',
  locationName: 'Consultorio Centro',
  startsAt: new Date('2026-11-09T12:00:00Z'),
  endsAt: new Date('2026-11-09T12:45:00Z'),
  status: 'CONFIRMED',
  source: 'PANEL',
  patientName: '  Ana María Prueba ',
  patientPhone: '11 2345-6789',
  patientEmail: 'ana@ejemplo.test',
  healthInsuranceName: null,
  version: 1,
  place: { kind: 'IN_PERSON', address: 'Calle Falsa 123', directions: null, videoUrl: null },
};
const ONLINE: AppointmentDetail = { ...BASE, locationName: 'Online', place: { kind: 'ONLINE', address: null, directions: null, videoUrl: 'https://meet.example.test/sala' } };

describe('placeText', () => {
  it('presencial: nombre, dirección e indicaciones si hay; online: por videollamada', () => {
    expect(placeText(BASE)).toBe('Consultorio Centro, Calle Falsa 123');
    expect(placeText({ ...BASE, place: { ...BASE.place, directions: 'Piso 2' } })).toBe('Consultorio Centro, Calle Falsa 123 (Piso 2)');
    expect(placeText(ONLINE)).toBe('Online, por videollamada');
  });
});

describe('appointmentEmail', () => {
  it('sin email del paciente no hay email', () => {
    expect(appointmentEmail({ kind: 'confirmed', detail: { ...BASE, patientEmail: null }, now: NOW })).toBeNull();
  });

  it('confirmado presencial: saludo con el primer nombre, «Cómo llegar» y el .ics del turno', () => {
    const email = appointmentEmail({ kind: 'confirmed', detail: BASE, now: NOW });
    expect(email).toMatchObject({ to: 'ana@ejemplo.test', subject: 'Tu turno con Lisandro López está confirmado' });
    expect(email?.text).toContain('Hola Ana:');
    expect(email?.text).toContain('Día y hora: lunes, 9 de noviembre a las 09:00');
    expect(email?.text).toContain('Cómo llegar: https://www.google.com/maps/search/?api=1&query=Calle%20Falsa%20123');
    const ics = Buffer.from(email?.attachments?.[0]?.content ?? '', 'base64').toString();
    expect(ics).toContain('DTSTART:20261109T120000Z');
    expect(ics).toContain('DTEND:20261109T124500Z');
    expect(ics).toContain('DTSTAMP:20261107T120000Z');
  });

  it('confirmado online: el botón y el .ics llevan el link de la videollamada', () => {
    const email = appointmentEmail({ kind: 'confirmed', detail: ONLINE, now: NOW });
    expect(email?.text).toContain('Entrar a la videollamada: https://meet.example.test/sala');
    expect(Buffer.from(email?.attachments?.[0]?.content ?? '', 'base64').toString()).toContain('DESCRIPTION:Videollamada: https://meet.example.test/sala');
  });

  it('Sprint 4: un turno online pendiente que cambia de horario no lleva el link de la videollamada', () => {
    const email = appointmentEmail({ kind: 'rescheduled', detail: { ...ONLINE, status: 'PENDING' }, now: NOW, previous: NOW });
    expect(email?.text).not.toContain('meet.example.test');
    expect(Buffer.from(email?.attachments?.[0]?.content ?? '', 'base64').toString()).not.toContain('meet.example.test');
  });

  it('una presencial sin dirección no muestra botón', () => {
    const email = appointmentEmail({ kind: 'confirmed', detail: { ...BASE, place: { ...BASE.place, address: null } }, now: NOW });
    expect(email?.text).not.toContain('Cómo llegar');
  });

  it('cancelado: sin .ics ni botón', () => {
    const email = appointmentEmail({ kind: 'cancelled', detail: BASE, now: NOW });
    expect(email).toMatchObject({ subject: 'Tu turno con Lisandro López se canceló' });
    expect(email?.attachments).toBeUndefined();
    expect(email?.text).toContain('Se canceló tu turno del lunes, 9 de noviembre a las 09:00.');
  });
});

describe('whatsappMessage', () => {
  it.each([
    ['confirmed', 'Hola Ana, te confirmo tu turno con Lisandro López el lunes, 9 de noviembre a las 09:00. Lugar: Consultorio Centro, Calle Falsa 123.'],
    ['cancelled', 'Hola Ana, tu turno del lunes, 9 de noviembre a las 09:00 se canceló.'],
    ['rescheduled', 'Hola Ana, tu turno pasó del sábado, 7 de noviembre a las 09:00 al lunes, 9 de noviembre a las 09:00. Lugar: Consultorio Centro, Calle Falsa 123.'],
  ] as const)('%s', (kind, text) => {
    expect(whatsappMessage(kind, BASE, new Date('2026-11-07T12:00:00Z'))).toBe(text);
  });
});
