import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { type AppointmentDetail, STATUS_LABELS } from '@/features/agenda/domain/appointment.schema';
import { formatDateTime } from '@/lib/format-date-time';

export const STATUS_CHIP: Readonly<Record<AppointmentDetail['status'], string>> = {
  PENDING: 'border border-border bg-muted',
  CONFIRMED: 'bg-confirmed',
  ATTENDED: 'bg-secondary',
  NO_SHOW: 'bg-secondary',
  CANCELLED: 'bg-secondary text-muted-foreground line-through',
};

const placeOf = (appointment: AppointmentDetail): string =>
  appointment.place.kind === 'ONLINE' ? 'Por videollamada' : (appointment.place.address ?? '');

function Item({ appointment }: { appointment: AppointmentDetail }): ReactElement {
  return (
    <li>
      <Link href={`/mi-espacio/turnos/${appointment.id}`} className={`hover-shade flex items-center gap-3 rounded-input border border-border p-4 ${FOCUS}`}>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <time dateTime={appointment.startsAt.toISOString()} className='text-[17px] font-semibold'>
              {formatDateTime(appointment.startsAt)}
            </time>
            <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${STATUS_CHIP[appointment.status]}`}>{STATUS_LABELS[appointment.status]}</span>
          </div>
          <p className='text-[15px] font-medium'>{appointment.locationName}</p>
          {placeOf(appointment) ? <p className='text-[15px] text-muted-foreground'>{placeOf(appointment)}</p> : null}
        </div>
        <ChevronRight aria-hidden='true' className='size-5 shrink-0 text-muted-foreground' />
      </Link>
    </li>
  );
}

export function AppointmentList({ appointments }: { appointments: AppointmentDetail[] }): ReactElement {
  return (
    <ul className='flex flex-col gap-3'>
      {appointments.map((appointment) => (
        <Item key={appointment.id} appointment={appointment} />
      ))}
    </ul>
  );
}
