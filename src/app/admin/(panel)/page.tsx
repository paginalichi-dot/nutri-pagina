import type { Metadata } from 'next';
import { connection } from 'next/server';
import type { ReactElement } from 'react';
import { getAgenda, getAgendaSummary } from '@/features/agenda/actions/agenda-queries';
import { AgendaHeader } from '@/features/agenda/ui/components/agenda-header';
import type { AgendaMode } from '@/features/agenda/ui/components/agenda-toolbar';
import { AgendaBoard } from '@/features/agenda/ui/components/agenda-views';
import { MonthCalendar, monthGrid } from '@/features/agenda/ui/components/month-calendar';
import { NextAppointmentCard } from '@/features/agenda/ui/components/next-appointment-card';
import { SummaryCards } from '@/features/agenda/ui/components/summary-cards';
import { isArgentinaDay, startOfWeek, todayInArgentina } from '@/lib/argentina-time';
import { argentinaDay } from '@/lib/format-date-time';

export const metadata: Metadata = { title: 'Agenda · Panel' };

const single = (value: string | string[] | undefined): string => (typeof value === 'string' ? value : '');

export default async function AgendaPage({ searchParams }: PageProps<'/admin'>): Promise<ReactElement> {
  await connection();
  const params = await searchParams;
  const now = new Date();
  const today = todayInArgentina(now);
  const day = isArgentinaDay(single(params.dia)) ? single(params.dia) : today;
  const mode: AgendaMode = single(params.vista) === 'semana' ? 'semana' : 'dia';
  const grid = monthGrid(day);
  const [view, summary, month] = await Promise.all([mode === 'semana' ? getAgenda(startOfWeek(day), 7) : getAgenda(day, 1), getAgendaSummary(), getAgenda(grid[0] ?? day, grid.length)]);
  const busyDays = new Set(month.appointments.filter(({ status }) => status !== 'CANCELLED').map(({ startsAt }) => argentinaDay(startsAt)));
  return (
    <main className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 md:px-8'>
      <AgendaHeader now={now} day={day} />
      <SummaryCards summary={summary} />
      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_1fr]'>
        <div className='lg:col-start-2 lg:row-start-1'>
          <NextAppointmentCard appointment={summary.next} now={now} />
        </div>
        <div className='min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1'>
          <AgendaBoard day={day} mode={mode} today={today} view={view} />
        </div>
        <div className='lg:col-start-2 lg:row-start-2'>
          <MonthCalendar day={day} mode={mode} today={today} busyDays={busyDays} />
        </div>
      </div>
    </main>
  );
}
