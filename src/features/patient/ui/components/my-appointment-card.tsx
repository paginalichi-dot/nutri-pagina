import { Video } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { PUBLIC_DARK } from '@/components/form/public-form-parts';
import { type AppointmentDetail, STATUS_LABELS } from '@/features/agenda/domain/appointment.schema';
import { showsVideoLink } from '@/features/agenda/domain/patient-change';
import { cn } from '@/lib/utils';
import { STATUS_CHIP } from './appointment-list';
import { appointmentDay } from './appointment-text';

function where({ locationName, place }: AppointmentDetail): string {
  if (place.kind === 'ONLINE') return `${locationName} · por videollamada`;
  return [locationName, place.address, place.directions].filter(Boolean).join(' · ');
}

export function MyAppointmentCard({ appointment, children }: { appointment: AppointmentDetail; children: ReactNode }): ReactElement {
  const { place, status } = appointment;
  const video = place.kind === 'ONLINE' && showsVideoLink(appointment) ? place.videoUrl : null;
  return (
    <section aria-labelledby='turno-titulo' className='flex flex-col gap-6 rounded-card bg-background p-6 md:p-10'>
      <div className='flex flex-col items-start gap-3'>
        <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${STATUS_CHIP[status]}`}>{STATUS_LABELS[status]}</span>
        <h2 id='turno-titulo' className='text-[24px] font-semibold md:text-[28px]'>
          <time dateTime={appointment.startsAt.toISOString()}>{appointmentDay(appointment.startsAt)}</time>
        </h2>
        <p className='text-[17px] text-muted-foreground'>{where(appointment)}</p>
        <p className='text-[15px] text-muted-foreground'>Obra social: {appointment.healthInsuranceName ?? 'Particular'}</p>
      </div>
      {status === 'PENDING' ? <p className='rounded-input border border-border bg-muted px-5 py-3 text-[15px]'>Lisandro todavía no lo confirmó. Te avisamos por email.</p> : null}
      {video ? (
        <a href={video} target='_blank' rel='noopener noreferrer' className={cn(PUBLIC_DARK, 'w-auto self-start')}>
          <Video aria-hidden='true' className='size-5' />
          Entrar a la videollamada
          <span className='sr-only'> (se abre en otra pestaña)</span>
        </a>
      ) : null}
      {children}
    </section>
  );
}
