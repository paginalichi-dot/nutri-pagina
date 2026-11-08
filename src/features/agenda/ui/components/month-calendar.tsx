import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { addDays, longDay, startOfWeek } from '@/lib/argentina-time';
import { type AgendaMode, agendaHref, SQUARE } from './agenda-toolbar';

const WEEKDAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;
const monthName = new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', month: 'long' });

export function shiftMonth(day: string, months: number): string {
  const date = new Date(Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1 + months, 1));
  return date.toISOString().slice(0, 10);
}

export function monthGrid(day: string): string[] {
  const end = addDays(startOfWeek(addDays(shiftMonth(day, 1), -1)), 6);
  const days: string[] = [];
  for (let current = startOfWeek(shiftMonth(day, 0)); current <= end; current = addDays(current, 1)) days.push(current);
  return days;
}

export function monthTitle(day: string): string {
  const name = monthName.format(new Date(`${shiftMonth(day, 0)}T00:00:00Z`));
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${day.slice(0, 4)}`;
}

type CalendarProps = { day: string; mode: AgendaMode; today: string; busyDays: ReadonlySet<string> };

function DayLink({ date, day, mode, today, busyDays }: CalendarProps & { date: string }): ReactElement {
  const selected = date === day;
  const tone = selected ? 'bg-foreground text-background' : date.startsWith(day.slice(0, 7)) ? '' : 'text-muted-foreground';
  return (
    <Link
      href={agendaHref(date, mode)}
      aria-label={`${longDay(date)}${busyDays.has(date) ? ', con turnos' : ''}`}
      aria-current={selected ? 'date' : undefined}
      className={`hover-shade mx-auto flex size-11 items-center justify-center rounded-full text-[14px] tabular-nums ${date === today ? 'font-bold ring-1 ring-border' : 'font-medium'} ${tone} ${FOCUS}`}
    >
      {Number(date.slice(8))}
      {busyDays.has(date) ? <span aria-hidden='true' className={`absolute bottom-1 size-1.5 rounded-full ${selected ? 'bg-primary' : 'bg-foreground'}`} /> : null}
    </Link>
  );
}

export function MonthCalendar(props: CalendarProps): ReactElement {
  const { day, mode } = props;
  return (
    <section aria-labelledby='calendario-mes' className='flex flex-col gap-3 rounded-panel bg-background p-4'>
      <div className='flex items-center justify-between gap-3'>
        <h2 id='calendario-mes' className='text-[18px] font-semibold'>
          {monthTitle(day)}
        </h2>
        <div className='flex gap-2'>
          <Link href={agendaHref(shiftMonth(day, -1), mode)} aria-label='Mes anterior' className={SQUARE}>
            <ChevronLeft aria-hidden='true' className='size-5' />
          </Link>
          <Link href={agendaHref(shiftMonth(day, 1), mode)} aria-label='Mes siguiente' className={SQUARE}>
            <ChevronRight aria-hidden='true' className='size-5' />
          </Link>
        </div>
      </div>
      <ol className='grid grid-cols-7 gap-y-1 text-center'>
        {WEEKDAY_INITIALS.map((initial) => (
          <li key={initial} aria-hidden='true' className='py-1 text-[12px] font-semibold text-muted-foreground'>
            {initial}
          </li>
        ))}
        {monthGrid(day).map((date) => (
          <li key={date}>
            <DayLink {...props} date={date} />
          </li>
        ))}
      </ol>
    </section>
  );
}
