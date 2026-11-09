import { CalendarDays, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { ArrowDisc } from '@/components/arrow-disc';
import { FOCUS } from '@/components/form/form-parts';
import { type AppointmentDetail, STATUS_LABELS } from '@/features/agenda/domain/appointment.schema';
import { appointmentDay, placeOf } from './appointment-text';

const SHOWN = 2;
const BOOK = `hover-shade flex h-14 items-center justify-between gap-4 self-start rounded-full bg-primary pr-2 pl-6 text-[17px] font-semibold text-primary-foreground ${FOCUS}`;
const CHIP: Readonly<Record<AppointmentDetail['status'], string>> = {
  CONFIRMED: 'bg-primary text-primary-foreground',
  PENDING: 'border border-border',
  ATTENDED: 'bg-secondary',
  NO_SHOW: 'bg-secondary',
  CANCELLED: 'bg-secondary line-through',
};

function Row({ appointment }: { appointment: AppointmentDetail }): ReactElement {
  return (
    <li className='flex flex-wrap items-center gap-x-4 gap-y-2 rounded-input border border-border bg-secondary p-4'>
      <span aria-hidden='true' className='hidden size-11 shrink-0 items-center justify-center rounded-full bg-secondary sm:flex'>
        <CalendarDays className='size-5' />
      </span>
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <time dateTime={appointment.startsAt.toISOString()} className='text-[16px] font-semibold'>
          {appointmentDay(appointment.startsAt)}
        </time>
        <p className='text-[14px] text-muted-foreground'>{placeOf(appointment)}</p>
      </div>
      <span className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[13px] font-semibold ${CHIP[appointment.status]}`}>
        {appointment.status === 'CONFIRMED' ? <Check aria-hidden='true' className='size-4' strokeWidth={3} /> : null}
        {STATUS_LABELS[appointment.status]}
      </span>
    </li>
  );
}

export function UpcomingCard({ upcoming }: { upcoming: AppointmentDetail[] }): ReactElement {
  return (
    <section aria-labelledby='upcoming-title' className='theme-forest flex flex-col gap-5 rounded-card bg-background p-6 md:p-8'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <span aria-hidden='true' className='flex size-12 items-center justify-center rounded-input bg-primary text-primary-foreground'>
            <CalendarDays className='size-6' />
          </span>
          <h2 id='upcoming-title' className='text-[20px] font-semibold md:text-[22px]'>
            Tus próximos turnos
          </h2>
        </div>
        <Link href='/mi-espacio/turnos' className={`relative flex shrink-0 items-center gap-1 rounded-sm text-[14px] font-medium text-muted-foreground after:absolute after:-inset-3 ${FOCUS}`}>
          Ver todos
          <ChevronRight aria-hidden='true' className='size-4' />
        </Link>
      </div>
      {upcoming.length > 0 ? (
        <ul className='flex flex-col gap-3'>
          {upcoming.slice(0, SHOWN).map((appointment) => (
            <Row key={appointment.id} appointment={appointment} />
          ))}
        </ul>
      ) : (
        <p className='text-[16px] text-muted-foreground'>Todavía no tenés turnos.</p>
      )}
      <Link href='/reservar' className={BOOK}>
        Reservá tu turno
        <ArrowDisc className='size-10 bg-primary-foreground text-primary' />
      </Link>
    </section>
  );
}
