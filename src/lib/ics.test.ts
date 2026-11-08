import { describe, expect, it } from 'vitest';
import { calendarEvent, escapeIcsText } from './ics';

describe('calendarEvent', () => {
  it('arma un .ics con el turno en UTC, líneas CRLF y texto escapado', () => {
    const ics = calendarEvent({
      id: 'abc',
      start: new Date('2026-11-10T13:00:00.000Z'),
      end: new Date('2026-11-10T13:45:00.000Z'),
      stamp: new Date('2026-11-07T12:00:00.000Z'),
      title: 'Turno con Lisandro López',
      location: 'Av. Siempre Viva 123, piso 2',
      description: 'Llegá 5 minutos antes;\ngracias',
    });
    expect(ics.split('\r\n')).toEqual([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lisandro Lopez Nutricion//Turnos//ES',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:abc@lisandrolopez-nutricion',
      'DTSTAMP:20261107T120000Z',
      'DTSTART:20261110T130000Z',
      'DTEND:20261110T134500Z',
      'SUMMARY:Turno con Lisandro López',
      'LOCATION:Av. Siempre Viva 123\\, piso 2',
      'DESCRIPTION:Llegá 5 minutos antes\\;\\ngracias',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ]);
  });
});

describe('escapeIcsText', () => {
  it('escapa barras, punto y coma, comas y saltos de línea', () => {
    expect(escapeIcsText('a\\b;c,d\r\ne')).toBe('a\\\\b\\;c\\,d\\ne');
  });
});
