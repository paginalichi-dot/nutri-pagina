import type { AppointmentDetail } from '@/features/agenda/domain/appointment.schema';
import { argentinaTime } from '@/lib/format-date-time';

const dayFormatter = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'long', day: 'numeric', month: 'long' });

export function appointmentDay(startsAt: Date): string {
  const day = dayFormatter.format(startsAt).replace(',', '');
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${argentinaTime(startsAt)} hs`;
}

export function placeOf(appointment: AppointmentDetail): string {
  if (appointment.place.kind === 'ONLINE') return 'Por videollamada';
  return [appointment.locationName, appointment.place.address].filter(Boolean).join(' · ');
}
