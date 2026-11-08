import { Clock, MapPin, MoreHorizontal, UserRound } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { addDays, longDay } from '@/lib/argentina-time';
import { argentinaDay, argentinaTime } from '@/lib/format-date-time';
import { whatsappLink } from '@/lib/whatsapp';
import type { AppointmentDetail } from '../../domain/appointment.schema';
import { NextAppointmentActions } from './next-appointment-actions';

const ICON = 'mt-0.5 size-5 shrink-0';

export function whenParts(appointment: Pick<AppointmentDetail, 'startsAt' | 'endsAt'>, now: Date): { day: string; time: string } {
  const day = argentinaDay(appointment.startsAt);
  const today = argentinaDay(now);
  const name = day === today ? 'Hoy' : day === addDays(today, 1) ? 'Mañana' : longDay(day).replace(/^./, (letter) => letter.toUpperCase());
  return { day: name, time: `${argentinaTime(appointment.startsAt)} – ${argentinaTime(appointment.endsAt)}` };
}

function NextDetail({ appointment, now }: { appointment: AppointmentDetail; now: Date }): ReactElement {
  const { place } = appointment;
  const when = whenParts(appointment, now);
  return (
    <>
      <div className='flex items-center gap-3'>
        <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/25'>
          <UserRound aria-hidden='true' className='size-6' strokeWidth={2} />
        </span>
        <div className='min-w-0'>
          <p className='truncate text-[17px] font-semibold'>{appointment.patientName}</p>
          <p className='text-[14px] text-muted-foreground'>{appointment.healthInsuranceName ?? 'Particular'}</p>
        </div>
      </div>
      <ul className='flex flex-col gap-3 text-[15px]'>
        <li className='flex gap-3'>
          <Clock aria-hidden='true' className={ICON} strokeWidth={2} />
          <span className='flex min-w-0 flex-col'>
            {when.time}
            <span className='text-[14px] text-muted-foreground'>{when.day}</span>
          </span>
        </li>
        <li className='flex gap-3'>
          <MapPin aria-hidden='true' className={ICON} strokeWidth={2} />
          <span className='flex min-w-0 flex-col'>
            {appointment.locationName}
            <span className='text-[14px] text-muted-foreground'>{place.kind === 'ONLINE' ? 'Por videollamada' : place.address}</span>
          </span>
        </li>
      </ul>
      <NextAppointmentActions id={appointment.id} version={appointment.version} canConfirm={appointment.status === 'PENDING' && appointment.startsAt > now} whatsappUrl={whatsappLink(appointment.patientPhone, '')} />
    </>
  );
}

export function NextAppointmentCard({ appointment, now }: { appointment: AppointmentDetail | null; now: Date }): ReactElement {
  return (
    <section aria-labelledby='proximo-turno' className='flex flex-col gap-4 rounded-panel bg-background p-5'>
      <div className='flex items-center justify-between gap-3'>
        <h2 id='proximo-turno' className='text-[18px] font-semibold'>
          Próximo turno
        </h2>
        {appointment ? (
          <Link href={`/admin/turnos/${appointment.id}`} aria-label='Ver el detalle del próximo turno' className={`-m-2 flex size-11 items-center justify-center rounded-control hover-shade ${FOCUS}`}>
            <MoreHorizontal aria-hidden='true' className='size-5' strokeWidth={2} />
          </Link>
        ) : null}
      </div>
      {appointment ? <NextDetail appointment={appointment} now={now} /> : <p className='text-[15px] text-muted-foreground'>No tenés turnos por venir.</p>}
    </section>
  );
}
