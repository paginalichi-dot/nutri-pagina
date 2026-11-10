import { Building2, Clock, Video } from 'lucide-react';
import type { ReactElement } from 'react';
import type { LocationRow } from '../../domain/location.schema';
import { type WeekDraft, weeklyHours, weekSummary } from './week-draft';

type PreviewProps = { kind: LocationRow['kind']; name: string; address: string; visible: boolean; week: WeekDraft };

function WeekSummary({ week }: { week: WeekDraft }): ReactElement {
  const summary = weekSummary(week);
  return (
    <div className='flex flex-col gap-2'>
      <span className='flex items-center gap-2 text-[13px] font-bold tracking-[1px] uppercase'>
        <Clock aria-hidden='true' className='size-4' strokeWidth={2} />
        Semana
      </span>
      {summary.length === 0 ? <p className='text-[14px] text-muted-foreground'>Todavía no cargaste horarios.</p> : null}
      <ul className='flex flex-col gap-1 text-[14px]'>
        {summary.map(({ day, ranges }) => (
          <li key={day} className='flex justify-between gap-3'>
            <span className='font-semibold capitalize'>{day}</span>
            <span className='text-right text-muted-foreground'>{ranges}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PatientPreviewCard({ kind, name, address, visible, week }: PreviewProps): ReactElement {
  const Icon = kind === 'ONLINE' ? Video : Building2;
  return (
    <aside aria-label='Vista del paciente' className='theme-forest relative flex flex-col gap-5 overflow-hidden rounded-card bg-background p-6 text-foreground'>
      <span aria-hidden='true' className='pointer-events-none absolute -right-16 -bottom-16 size-56 rounded-full bg-primary/25 blur-3xl' />
      <div className='flex items-center justify-between gap-3'>
        <span className='text-[13px] font-bold tracking-[1px] text-primary uppercase'>Vista del paciente</span>
        <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${visible ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{visible ? 'Visible' : 'Oculta'}</span>
      </div>
      <div className='flex items-center gap-4 rounded-panel bg-secondary p-4'>
        <span aria-hidden='true' className='flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background'>
          <Icon className='size-5' strokeWidth={2} />
        </span>
        <span className='flex min-w-0 flex-col'>
          <span className='truncate font-semibold'>{name.trim() || 'Nombre de la ubicación'}</span>
          <span className='truncate text-[14px] text-muted-foreground'>{kind === 'ONLINE' ? 'Por videollamada' : address.trim() || 'Dirección'}</span>
        </span>
      </div>
      <WeekSummary week={week} />
      <div className='flex items-end justify-between border-t border-border pt-4'>
        <span className='text-[14px] text-muted-foreground'>Horas por semana</span>
        <span className='text-[32px] leading-none font-bold'>
          {weeklyHours(week)}
          <span className='ml-1 text-[15px] text-primary'>h</span>
        </span>
      </div>
    </aside>
  );
}
