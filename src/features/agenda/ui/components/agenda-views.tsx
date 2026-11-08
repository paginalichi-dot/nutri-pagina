import type { ReactElement } from 'react';
import { startOfWeek } from '@/lib/argentina-time';
import type { AgendaView } from '../../domain/appointment.schema';
import { type AgendaMode, AgendaToolbar } from './agenda-toolbar';
import { DayTimeline } from './day-timeline';
import { WeekGrid } from './week-grid';

type BoardProps = { day: string; mode: AgendaMode; today: string; view: AgendaView };

export function AgendaBoard({ day, mode, today, view }: BoardProps): ReactElement {
  return (
    <section aria-label='Agenda' className='flex min-w-0 flex-col gap-4 rounded-panel bg-background p-4 md:p-6'>
      <AgendaToolbar day={day} mode={mode} today={today} />
      {mode === 'semana' ? <WeekGrid monday={startOfWeek(day)} today={today} view={view} /> : <DayTimeline day={day} view={view} />}
    </section>
  );
}
