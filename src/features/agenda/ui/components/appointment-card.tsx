import Link from 'next/link';
import type { CSSProperties, ReactElement } from 'react';
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

const BLOCK_STYLE: Readonly<Record<AppointmentStatus, string>> = {
  PENDING: 'bg-muted border border-border border-l-foreground',
  CONFIRMED: 'bg-confirmed border-primary',
  ATTENDED: 'bg-confirmed border-primary',
  NO_SHOW: 'bg-secondary border-footer-text',
  CANCELLED: 'bg-secondary border-border text-muted-foreground',
};

export const HATCH = 'bg-[repeating-linear-gradient(135deg,var(--secondary)_0_8px,var(--border)_8px_10px)]';

const range = ({ startsAt, endsAt }: { startsAt: Date; endsAt: Date }): string => `${argentinaTime(startsAt)} – ${argentinaTime(endsAt)}`;

export function StatusChip({ status }: { status: AppointmentStatus }): ReactElement {
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${STATUS_STYLE[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function AppointmentCard({ appointment, style }: { appointment: AppointmentRow; style?: CSSProperties }): ReactElement {
  const { status } = appointment;
  return (
    <Link
      href={`/admin/turnos/${appointment.id}`}
      style={style}
      className={`hover-shade flex min-w-0 flex-col justify-center gap-0.5 overflow-hidden rounded-r-control border-l-4 px-3 py-1 text-[13px] leading-snug focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${BLOCK_STYLE[status]}`}
    >
      <span className='flex items-center justify-between gap-2'>
        <span className={`truncate ${status === 'CANCELLED' ? 'line-through' : ''}`}>
          <strong className='font-semibold'>{appointment.patientName}</strong>
          <span className='max-sm:sr-only'> · {appointment.healthInsuranceName ?? 'Particular'}</span>
        </span>
        {status === 'CONFIRMED' ? <span className='sr-only'>, {STATUS_LABELS[status]}</span> : <span className='shrink-0 rounded-full bg-background px-2 text-[12px] leading-[18px] font-semibold'>{STATUS_LABELS[status]}</span>}
      </span>
      <span className='truncate text-[12px]'>
        {range(appointment)} · {appointment.locationName}
      </span>
    </Link>
  );
}

export function BlockCard({ block, style }: { block: BlockRow; style?: CSSProperties }): ReactElement {
  return (
    <div
      style={style}
      className={`flex min-w-0 flex-col justify-center gap-0.5 overflow-hidden rounded-r-control border-l-4 border-footer-text ${HATCH} px-3 py-1 text-[13px] leading-snug`}
    >
      <strong className='truncate font-semibold'>Bloqueado{block.reason ? ` · ${block.reason}` : ''}</strong>
      <span className='truncate text-[12px]'>{range(block)}</span>
    </div>
  );
}
