import type { Metadata } from 'next';
import { connection } from 'next/server';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '@/components/form/form-parts';
import { PanelPage } from '@/components/panel/panel-page';
import { getAgenda } from '@/features/agenda/actions/agenda-queries';
import { type AgendaMode, AgendaToolbar } from '@/features/agenda/ui/components/agenda-toolbar';
import { AgendaDay, AgendaWeek } from '@/features/agenda/ui/components/agenda-views';
import { isArgentinaDay, longDay, startOfWeek, todayInArgentina } from '@/lib/argentina-time';

export const metadata: Metadata = { title: 'Agenda · Panel' };

const single = (value: string | string[] | undefined): string => (typeof value === 'string' ? value : '');

export default async function AgendaPage({ searchParams }: PageProps<'/admin'>): Promise<ReactElement> {
  await connection();
  const params = await searchParams;
  const today = todayInArgentina(new Date());
  const day = isArgentinaDay(single(params.dia)) ? single(params.dia) : today;
  const mode: AgendaMode = single(params.vista) === 'semana' ? 'semana' : 'dia';
  const start = mode === 'semana' ? startOfWeek(day) : day;
  const view = await getAgenda(start, mode === 'semana' ? 7 : 1);
  const pending = view.appointments.filter(({ status }) => status === 'PENDING').length;
  const actions = (
    <>
      <Link href={`/admin/turnos/nuevo?dia=${day}`} className={PRIMARY_BUTTON}>
        Nuevo turno
      </Link>
      <Link href='/admin/bloqueos' className={SECONDARY_BUTTON}>
        Bloquear horario
      </Link>
    </>
  );
  return (
    <PanelPage title='Agenda' actions={actions}>
      <AgendaToolbar day={day} mode={mode} today={today} title={mode === 'semana' ? `Semana del ${longDay(start)}` : longDay(day)} />
      {pending > 0 ? <p className='self-start rounded-full border border-border bg-background px-4 py-2 font-semibold'>{pending === 1 ? '1 turno pendiente de confirmar' : `${pending} turnos pendientes de confirmar`}</p> : null}
      {mode === 'semana' ? (
        <>
          <div className='hidden md:block'>
            <AgendaWeek monday={start} view={view} />
          </div>
          <div className='md:hidden'>
            <AgendaDay day={day} view={view} />
          </div>
        </>
      ) : (
        <AgendaDay day={day} view={view} />
      )}
    </PanelPage>
  );
}
