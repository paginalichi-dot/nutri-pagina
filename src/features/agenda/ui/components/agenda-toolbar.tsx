import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { addDays, argentinaWeekday, longDate, startOfWeek, WEEKDAY_NAMES } from '@/lib/argentina-time';
import { DateJump } from './date-jump';

export type AgendaMode = 'dia' | 'semana';

export const agendaHref = (day: string, mode: AgendaMode): string => `/admin?dia=${day}&vista=${mode}`;
export const SQUARE = `hover-shade flex size-11 shrink-0 items-center justify-center rounded-control border border-border bg-background ${FOCUS}`;
const MODES: ReadonlyArray<readonly [AgendaMode, string]> = [
  ['dia', 'Día'],
  ['semana', 'Semana'],
];

export function boardTitle({ day, mode, today }: { day: string; mode: AgendaMode; today: string }): string {
  if (mode === 'semana') return `Semana del ${longDate(startOfWeek(day))}`;
  const weekday = WEEKDAY_NAMES[argentinaWeekday(day) - 1] ?? '';
  return day === today ? `Hoy, ${longDate(day)}` : `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${longDate(day)}`;
}

function ModeToggle({ day, mode }: { day: string; mode: AgendaMode }): ReactElement {
  return (
    <div className='flex rounded-control bg-secondary'>
      {MODES.map(([value, label]) => (
        <Link key={value} href={agendaHref(day, value)} aria-current={mode === value ? 'page' : undefined} className={`hover-shade flex h-11 items-center rounded-control px-3 text-[15px] font-semibold md:px-4 ${mode === value ? 'bg-primary' : ''} ${FOCUS}`}>
          {label}
        </Link>
      ))}
    </div>
  );
}

export function AgendaToolbar({ day, mode, today }: { day: string; mode: AgendaMode; today: string }): ReactElement {
  const step = mode === 'semana' ? 7 : 1;
  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex items-center gap-3'>
        <h2 className='text-[18px] font-semibold md:text-[20px]'>{boardTitle({ day, mode, today })}</h2>
        <DateJump day={day} mode={mode} />
      </div>
      <div className='flex items-center gap-1.5 md:gap-2'>
        <ModeToggle day={day} mode={mode} />
        <Link href={agendaHref(addDays(day, -step), mode)} aria-label={mode === 'semana' ? 'Semana anterior' : 'Día anterior'} className={SQUARE}>
          <ChevronLeft aria-hidden='true' className='size-5' />
        </Link>
        <Link href={agendaHref(today, mode)} className={`hover-shade flex h-11 items-center rounded-control bg-secondary px-3 text-[15px] font-semibold md:px-4 ${FOCUS}`}>
          Hoy
        </Link>
        <Link href={agendaHref(addDays(day, step), mode)} aria-label={mode === 'semana' ? 'Semana siguiente' : 'Día siguiente'} className={SQUARE}>
          <ChevronRight aria-hidden='true' className='size-5' />
        </Link>
      </div>
    </div>
  );
}
