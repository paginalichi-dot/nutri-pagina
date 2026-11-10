import { whenText } from '@/lib/argentina-time';
import type { EmailMessage } from '@/lib/email/send-email';
import { type EmailContent, renderEmail } from '@/lib/email/render-email';
import { calendarEvent } from '@/lib/ics';
import type { AppointmentDetail } from '../domain/appointment.schema';

export type NoticeKind = 'confirmed' | 'cancelled' | 'rescheduled';

const SUBJECTS: Readonly<Record<NoticeKind, string>> = {
  confirmed: 'Tu turno con Lisandro López está confirmado',
  cancelled: 'Tu turno con Lisandro López se canceló',
  rescheduled: 'Tu turno con Lisandro López cambió de horario',
};

const firstName = (name: string): string => name.trim().split(/\s+/)[0] ?? name;

export function placeText({ locationName, place }: AppointmentDetail): string {
  if (place.kind === 'ONLINE') return 'Online, por videollamada';
  return `${locationName}, ${place.address ?? ''}${place.directions ? ` (${place.directions})` : ''}`;
}

function placeAction({ place }: AppointmentDetail): EmailContent['action'] {
  if (place.kind === 'ONLINE') return place.videoUrl ? { label: 'Entrar a la videollamada', url: place.videoUrl } : undefined;
  return place.address ? { label: 'Cómo llegar', url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}` } : undefined;
}

function calendarFile(detail: AppointmentDetail, now: Date): EmailMessage['attachments'] {
  const description = detail.place.kind === 'ONLINE' ? `Videollamada: ${detail.place.videoUrl ?? ''}` : (detail.place.directions ?? '');
  const ics = calendarEvent({ id: detail.id, start: detail.startsAt, end: detail.endsAt, stamp: now, title: 'Turno con Lisandro López (Nutrición)', location: placeText(detail), description });
  return [{ filename: 'turno.ics', content: Buffer.from(ics).toString('base64') }];
}

function content(kind: NoticeKind, detail: AppointmentDetail, previous: Date | null): EmailContent {
  const hello = `Hola ${firstName(detail.patientName)}:`;
  const place: readonly [string, string] = ['Lugar', placeText(detail)];
  if (kind === 'cancelled') {
    return { title: 'Tu turno se canceló', paragraphs: [hello, `Se canceló tu turno del ${whenText(detail.startsAt)}.`], details: [place] };
  }
  const when: readonly [string, string] = ['Día y hora', whenText(detail.startsAt)];
  if (kind === 'rescheduled') {
    const before: readonly [string, string] = ['Antes', whenText(previous ?? detail.startsAt)];
    const now: readonly [string, string] = ['Ahora', when[1]];
    return { title: 'Tu turno cambió de horario', paragraphs: [hello, 'Tu turno tiene un horario nuevo.'], details: [before, now, place], action: placeAction(detail) };
  }
  return { title: 'Tu turno está confirmado', paragraphs: [hello, 'Tu turno con Lisandro López quedó confirmado.'], details: [when, place], action: placeAction(detail) };
}

export type EmailRequest = { kind: NoticeKind; detail: AppointmentDetail; now: Date; previous?: Date | null };

const withoutVideo = (detail: AppointmentDetail): AppointmentDetail => ({ ...detail, place: { ...detail.place, videoUrl: null } });

export function appointmentEmail({ kind, detail: stored, now, previous = null }: EmailRequest): EmailMessage | null {
  const detail = kind === 'confirmed' || stored.status === 'CONFIRMED' ? stored : withoutVideo(stored);
  if (!detail.patientEmail) return null;
  const message = { to: detail.patientEmail, subject: SUBJECTS[kind], ...renderEmail(content(kind, detail, previous)) };
  return kind === 'cancelled' ? message : { ...message, attachments: calendarFile(detail, now) };
}

export function whatsappMessage(kind: NoticeKind, detail: AppointmentDetail, previous: Date | null = null): string {
  const hello = `Hola ${firstName(detail.patientName)}`;
  if (kind === 'cancelled') return `${hello}, tu turno del ${whenText(detail.startsAt)} se canceló.`;
  if (kind === 'rescheduled') return `${hello}, tu turno pasó del ${whenText(previous ?? detail.startsAt)} al ${whenText(detail.startsAt)}. Lugar: ${placeText(detail)}.`;
  return `${hello}, te confirmo tu turno con Lisandro López el ${whenText(detail.startsAt)}. Lugar: ${placeText(detail)}.`;
}
