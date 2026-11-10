import { whenText } from '@/lib/argentina-time';
import { type EmailContent, renderEmail } from '@/lib/email/render-email';
import type { EmailMessage } from '@/lib/email/send-email';
import type { AppointmentDetail } from '../domain/appointment.schema';
import { placeText } from './appointment-notices';

export type RequestEvent = 'requested' | 'change-requested';
export type BookingEvent = RequestEvent | 'cancelled';
export type BookingNotice = { detail: AppointmentDetail; appUrl: string; previous?: Date | null };
type Detail = readonly [string, string];

const PATIENT_TEXT: Readonly<Record<RequestEvent, { subject: string; title: string; line: string }>> = {
  requested: {
    subject: 'Recibimos tu solicitud de turno',
    title: 'Recibimos tu solicitud',
    line: 'Lisandro la va a revisar y te avisamos por email cuando la confirme.',
  },
  'change-requested': {
    subject: 'Recibimos tu cambio de turno',
    title: 'Recibimos tu cambio',
    line: 'Tu turno vuelve a quedar pendiente: Lisandro lo va a revisar y te avisamos por email cuando lo confirme.',
  },
};

const LISANDRO_TEXT: Readonly<Record<BookingEvent, { subject: (name: string) => string; line: string }>> = {
  requested: { subject: (name) => `Nueva solicitud de turno de ${name}`, line: 'Tenés una solicitud nueva para confirmar.' },
  cancelled: { subject: (name) => `${name} canceló su turno`, line: 'El horario quedó libre.' },
  'change-requested': { subject: (name) => `${name} pidió cambiar su turno`, line: 'El turno volvió a pendiente: confirmalo desde el panel.' },
};

const oneLine = (text: string): string => text.replace(/\s+/g, ' ').trim();
const firstName = (name: string): string => oneLine(name).split(' ')[0] ?? name;

function whenDetails(event: BookingEvent, { detail, previous }: BookingNotice): Detail[] {
  if (event !== 'change-requested') return [['Día y hora', whenText(detail.startsAt)]];
  return [
    ['Antes', whenText(previous ?? detail.startsAt)],
    ['Ahora', whenText(detail.startsAt)],
  ];
}

function message(to: string, subject: string, content: EmailContent): EmailMessage {
  return { to, subject: oneLine(subject), ...renderEmail(content) };
}

export function patientRequestEmail(event: RequestEvent, notice: BookingNotice): EmailMessage | null {
  const { detail, appUrl } = notice;
  if (!detail.patientEmail) return null;
  const { subject, title, line } = PATIENT_TEXT[event];
  const details: Detail[] = [...whenDetails(event, notice), ['Lugar', placeText(detail)], ['Estado', 'Pendiente de confirmación']];
  const action = { label: 'Gestionar mi turno', url: `${appUrl}/mi-espacio/turnos/${detail.id}` };
  return message(detail.patientEmail, subject, { title, paragraphs: [`Hola ${firstName(detail.patientName)}:`, line], details, action });
}

export function lisandroEmail(event: BookingEvent, notice: BookingNotice & { to: string }): EmailMessage {
  const { detail, appUrl, to } = notice;
  const { subject, line } = LISANDRO_TEXT[event];
  const details: Detail[] = [
    ['Paciente', oneLine(detail.patientName)],
    ['Teléfono', detail.patientPhone],
    ['Obra social', detail.healthInsuranceName ?? 'Particular'],
    ...whenDetails(event, notice),
    ['Lugar', detail.locationName],
  ];
  const action = { label: 'Ver en el panel', url: `${appUrl}/admin/turnos/${detail.id}` };
  return message(to, subject(detail.patientName), { title: oneLine(subject(detail.patientName)), paragraphs: [line], details, action });
}
