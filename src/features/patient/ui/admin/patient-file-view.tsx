import { CalendarPlus, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS, SECONDARY_BUTTON } from '@/components/form/form-parts';
import { STATUS_LABELS } from '@/features/agenda/domain/appointment.schema';
import { argentinaTime, shortDate } from '@/lib/format-date-time';
import { whatsappLink } from '@/lib/whatsapp';
import type { DirectoryVisit, PatientFile } from '../../domain/patient-directory.schema';
import { PatientAvatar, PatientStatusChip } from './patient-row';

function Visits({ title, visits, empty }: { title: string; visits: DirectoryVisit[]; empty: string }): ReactElement {
  return (
    <section aria-label={title} className='flex flex-col gap-3 rounded-panel bg-background p-5 md:p-7'>
      <h2 className='text-[19px] font-semibold md:text-[20px]'>{title}</h2>
      {visits.length === 0 ? <p className='text-muted-foreground'>{empty}</p> : null}
      <ul className='flex flex-col'>
        {visits.map((visit) => (
          <li key={visit.id} className='border-b border-border last:border-b-0'>
            <Link href={`/admin/turnos/${visit.id}`} className={`hover-shade flex items-center gap-4 rounded-control px-2 py-3 ${FOCUS}`}>
              <span className='flex flex-1 flex-col'>
                <span className='font-semibold'>
                  {shortDate(visit.startsAt)} · {argentinaTime(visit.startsAt)} hs
                </span>
                <span className='text-[14px] text-muted-foreground'>
                  {visit.locationName} · {visit.healthInsurance ?? 'Particular'}
                </span>
              </span>
              <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${visit.status === 'CANCELLED' ? 'bg-secondary text-muted-foreground line-through' : 'bg-confirmed'}`}>{STATUS_LABELS[visit.status]}</span>
              <ChevronRight aria-hidden='true' className='size-5 shrink-0 text-muted-foreground' strokeWidth={2} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PatientFileView({ file }: { file: PatientFile }): ReactElement {
  const { entry } = file;
  return (
    <div className='flex flex-col gap-6'>
      <section aria-label='Datos del paciente' className='flex flex-col gap-5 rounded-panel bg-background p-5 md:flex-row md:items-center md:p-7'>
        <div className='flex flex-1 items-center gap-4'>
          <PatientAvatar name={entry.name} dark={false} />
          <dl className='grid flex-1 gap-x-6 gap-y-1 text-[15px] sm:grid-cols-[auto_1fr]'>
            <dt className='text-muted-foreground'>Email</dt>
            <dd className='break-all'>{entry.email ?? 'Sin email'}</dd>
            <dt className='text-muted-foreground'>Teléfono</dt>
            <dd>{entry.phone}</dd>
            <dt className='text-muted-foreground'>Cuenta</dt>
            <dd>{entry.hasAccount ? 'Tiene cuenta en la web' : 'Sin cuenta (turnos cargados a mano)'}</dd>
          </dl>
          <PatientStatusChip status={entry.status} />
        </div>
        <div className='flex flex-wrap gap-3'>
          <a href={whatsappLink(entry.phone, '')} target='_blank' rel='noopener noreferrer' className={SECONDARY_BUTTON}>
            <MessageCircle aria-hidden='true' className='size-5' strokeWidth={2} />
            WhatsApp
          </a>
          <Link href='/admin/turnos/nuevo' className={SECONDARY_BUTTON}>
            <CalendarPlus aria-hidden='true' className='size-5' strokeWidth={2} />
            Nuevo turno
          </Link>
        </div>
      </section>
      <Visits title='Turnos por venir' visits={file.upcoming} empty='No tiene turnos por venir.' />
      <Visits title='Turnos anteriores' visits={file.past} empty='Todavía no tuvo turnos.' />
    </div>
  );
}
