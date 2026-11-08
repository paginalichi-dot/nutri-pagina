import Link from 'next/link';
import type { ReactElement } from 'react';
import { argentinaTime } from '@/lib/format-date-time';
import { type AppointmentRow, type AppointmentStatus, STATUS_LABELS } from '../../domain/appointment.schema';
import type { BlockRow } from '../../domain/block.schema';

const STATUS_STYLE: Readonly<Record<AppointmentStatus, string>> = {
  PENDING: 'bg-muted border border-border',
  CONFIRMED: 'bg-confirmed',
  ATTENDED: 'bg-confirmed',
  NO_SHOW: 'bg-secondary',
  CANCELLED: 'bg-secondary text-muted-foreground',
};

export function StatusChip({ status }: { status: AppointmentStatus }): ReactElement {
  return <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${STATUS_STYLE[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function AppointmentCard({ appointment, showLocation = false }: { appointment: AppointmentRow; showLocation?: boolean }): ReactElement {
  const cancelled = appointment.status === 'CANCELLED';
  return (
    <Link
      href={`/admin/turnos/${appointment.id}`}
      className={`flex flex-col gap-1 rounded-panel p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${STATUS_STYLE[appointment.status]}`}
    >
      <span className='flex items-center justify-between gap-2 text-[15px] font-semibold'>
        {argentinaTime(appointment.startsAt)} a {argentinaTime(appointment.endsAt)}
        <StatusChip status={appointment.status} />
      </span>
      <span className={cancelled ? 'line-through' : 'font-medium'}>{appointment.patientName}</span>
      {showLocation ? <span className='text-[13px] text-muted-foreground'>{appointment.locationName}</span> : null}
    </Link>
  );
}

export function BlockCard({ block }: { block: BlockRow }): ReactElement {
  return (
    <div className='flex flex-col gap-1 rounded-panel border border-dashed border-border bg-secondary p-3 text-[15px]'>
      <span className='font-semibold'>
        Bloqueado: {argentinaTime(block.startsAt)} a {argentinaTime(block.endsAt)}
      </span>
      {block.reason ? <span className='text-muted-foreground'>{block.reason}</span> : null}
    </div>
  );
}
