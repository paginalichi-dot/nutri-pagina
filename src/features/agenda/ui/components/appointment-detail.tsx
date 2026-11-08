import type { ReactElement, ReactNode } from 'react';
import { longDay } from '@/lib/argentina-time';
import { argentinaDay, argentinaTime } from '@/lib/format-date-time';
import { whatsappLink } from '@/lib/whatsapp';
import { type AppointmentDetail, isActiveStatus } from '../../domain/appointment.schema';
import { AppointmentActions } from './appointment-actions';
import { StatusChip } from './appointment-card';
import { WhatsappLink } from './notice-panel';

function Item({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return (
    <div className='flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:gap-6'>
      <dt className='w-36 shrink-0 text-muted-foreground'>{label}</dt>
      <dd className='font-medium break-words'>{children}</dd>
    </div>
  );
}

function place({ locationName, place }: AppointmentDetail): string {
  return place.kind === 'ONLINE' ? `${locationName} (videollamada)` : `${locationName} · ${place.address ?? ''}`;
}

export function AppointmentInfo({ appointment, now }: { appointment: AppointmentDetail; now: Date }): ReactElement {
  const upcoming = isActiveStatus(appointment.status) && appointment.startsAt > now;
  const started = appointment.status === 'CONFIRMED' && appointment.startsAt <= now;
  return (
    <div className='flex flex-col gap-6'>
      <dl>
        <Item label='Día y hora'>
          <span className='capitalize'>{longDay(argentinaDay(appointment.startsAt))}</span>, {argentinaTime(appointment.startsAt)} a {argentinaTime(appointment.endsAt)}
        </Item>
        <Item label='Estado'>
          <StatusChip status={appointment.status} />
        </Item>
        <Item label='Ubicación'>{place(appointment)}</Item>
        <Item label='Paciente'>{appointment.patientName}</Item>
        <Item label='Teléfono'>{appointment.patientPhone}</Item>
        <Item label='Email'>{appointment.patientEmail ?? 'Sin email'}</Item>
        <Item label='Obra social'>{appointment.healthInsuranceName ?? 'Particular'}</Item>
        <Item label='Origen'>{appointment.source === 'PANEL' ? 'Cargado desde el panel' : 'Reserva online'}</Item>
      </dl>
      <div className='flex flex-wrap items-start gap-3'>
        <WhatsappLink href={whatsappLink(appointment.patientPhone, '')} label='Escribir por WhatsApp' />
      </div>
      <AppointmentActions id={appointment.id} version={appointment.version} upcoming={upcoming} started={started} />
    </div>
  );
}
