import { CalendarPlus, Ellipsis, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { shortDate } from '@/lib/format-date-time';
import { whatsappLink } from '@/lib/whatsapp';
import type { DirectoryEntry, PatientStatus } from '../../domain/patient-directory.schema';
import { initials } from './directory-filter';

const STATUS: Readonly<Record<PatientStatus, { label: string; style: string }>> = {
  NEW: { label: 'Nuevo', style: 'bg-primary/25' },
  ACTIVE: { label: 'Activo', style: 'bg-confirmed' },
  INACTIVE: { label: 'Inactivo', style: 'bg-secondary text-muted-foreground' },
};

const MENU_ITEM = `hover-shade flex h-11 items-center gap-3 rounded-control px-3 text-[15px] font-semibold ${FOCUS}`;

export function PatientStatusChip({ status }: { status: PatientStatus }): ReactElement {
  return <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${STATUS[status].style}`}>{STATUS[status].label}</span>;
}

export function PatientAvatar({ name, dark }: { name: string; dark: boolean }): ReactElement {
  return (
    <span aria-hidden='true' className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${dark ? 'bg-foreground text-primary' : 'bg-primary'}`}>
      {initials(name)}
    </span>
  );
}

export function NextVisit({ value }: { value: Date | null }): ReactElement {
  if (!value) return <span className='text-muted-foreground'>—</span>;
  return (
    <span className='flex items-center gap-2 font-medium'>
      <span aria-hidden='true' className='size-2 rounded-full bg-primary' />
      {shortDate(value)}
    </span>
  );
}

export function RowActions({ entry }: { entry: DirectoryEntry }): ReactElement {
  return (
    <span className='flex items-center justify-end gap-1'>
      <Link href={`/admin/pacientes/${entry.id}`} aria-label={`Ver a ${entry.name}`} className={`hover-shade flex h-11 items-center rounded-control px-3 font-semibold ${FOCUS}`}>
        Ver
      </Link>
      <details className='relative'>
        <summary aria-label={`Más acciones para ${entry.name}`} className={`hover-shade flex size-11 cursor-pointer list-none items-center justify-center rounded-control [&::-webkit-details-marker]:hidden ${FOCUS}`}>
          <Ellipsis aria-hidden='true' className='size-5' strokeWidth={2.25} />
        </summary>
        <div className='absolute right-0 z-20 mt-2 flex w-52 flex-col rounded-panel bg-background p-2 text-left shadow-modal'>
          <a href={whatsappLink(entry.phone, '')} target='_blank' rel='noopener noreferrer' className={MENU_ITEM}>
            <MessageCircle aria-hidden='true' className='size-4' strokeWidth={2} />
            WhatsApp
          </a>
          <Link href='/admin/turnos/nuevo' className={MENU_ITEM}>
            <CalendarPlus aria-hidden='true' className='size-4' strokeWidth={2} />
            Nuevo turno
          </Link>
        </div>
      </details>
    </span>
  );
}

export function PatientName({ entry, dark }: { entry: DirectoryEntry; dark: boolean }): ReactElement {
  return (
    <span className='flex min-w-0 items-center gap-3'>
      <PatientAvatar name={entry.name} dark={dark} />
      <span className='flex min-w-0 flex-col'>
        <span className='truncate font-semibold'>{entry.name}</span>
        <span className='truncate text-[14px] text-muted-foreground'>{entry.email ?? 'Sin email'}</span>
      </span>
    </span>
  );
}
