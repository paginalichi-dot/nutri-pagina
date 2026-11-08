import { Lock, Plus } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from '@/components/form/form-parts';
import { argentinaHour } from '@/lib/format-date-time';

export function greeting(now: Date): string {
  const hour = argentinaHour(now);
  if (hour >= 5 && hour < 12) return 'Buen día';
  return hour >= 12 && hour < 20 ? 'Buenas tardes' : 'Buenas noches';
}

export function AgendaHeader({ now, day }: { now: Date; day: string }): ReactElement {
  return (
    <header className='flex flex-wrap items-start justify-between gap-4'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-[28px] leading-tight font-bold md:text-[32px]'>Agenda</h1>
        <p className='text-[17px] font-medium'>{greeting(now)}, Lisandro</p>
        <p className='text-[14px] text-muted-foreground'>Acá tenés un resumen de tus turnos y de tu semana.</p>
      </div>
      <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
        <Link href={`/admin/turnos/nuevo?dia=${day}`} className={PRIMARY_BUTTON}>
          <Plus aria-hidden='true' className='size-5' strokeWidth={2} />
          Nuevo turno
        </Link>
        <Link href='/admin/bloqueos' className={`${SECONDARY_BUTTON} border border-muted-foreground`}>
          <Lock aria-hidden='true' className='size-5' strokeWidth={2} />
          Bloquear horario
        </Link>
      </div>
    </header>
  );
}
