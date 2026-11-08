import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS, SECONDARY_BUTTON } from '@/components/form/form-parts';
import { addDays } from '@/lib/argentina-time';

export type AgendaMode = 'dia' | 'semana';

const href = (day: string, mode: AgendaMode): string => `/admin?dia=${day}&vista=${mode}`;
const ROUND = `flex size-11 items-center justify-center rounded-full bg-background ${FOCUS}`;

function ModeToggle({ day, mode }: { day: string; mode: AgendaMode }): ReactElement {
  const options: ReadonlyArray<readonly [AgendaMode, string]> = [
    ['dia', 'Día'],
    ['semana', 'Semana'],
  ];
  return (
    <div className='hidden gap-1 rounded-toggle bg-background p-1 md:flex'>
      {options.map(([value, label]) => (
        <Link key={value} href={href(day, value)} aria-current={mode === value ? 'page' : undefined} className={`flex h-10 items-center rounded-toggle px-5 font-medium ${mode === value ? 'bg-primary' : ''} ${FOCUS}`}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export function AgendaToolbar({ day, mode, title, today }: { day: string; mode: AgendaMode; title: string; today: string }): ReactElement {
  const step = mode === 'semana' ? 7 : 1;
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Link href={href(addDays(day, -step), mode)} aria-label={mode === 'semana' ? 'Semana anterior' : 'Día anterior'} className={ROUND}>
        <ChevronLeft aria-hidden='true' className='size-5' />
      </Link>
      <Link href={href(addDays(day, step), mode)} aria-label={mode === 'semana' ? 'Semana siguiente' : 'Día siguiente'} className={ROUND}>
        <ChevronRight aria-hidden='true' className='size-5' />
      </Link>
      <p className='text-[19px] font-medium capitalize'>{title}</p>
      {day === today ? null : (
        <Link href={href(today, mode)} className={SECONDARY_BUTTON}>
          Hoy
        </Link>
      )}
      <div className='ml-auto'>
        <ModeToggle day={day} mode={mode} />
      </div>
    </div>
  );
}
