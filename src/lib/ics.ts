export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  stamp: Date;
  title: string;
  location: string;
  description: string;
};

const icsDate = (value: Date): string => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

export function calendarEvent(event: CalendarEvent): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lisandro Lopez Nutricion//Turnos//ES',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@lisandrolopez-nutricion`,
    `DTSTAMP:${icsDate(event.stamp)}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(event.end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
