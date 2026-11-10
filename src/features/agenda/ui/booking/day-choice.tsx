import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { longDay } from '@/lib/argentina-time';
import { monthGrid, monthTitle } from '../components/month-calendar';

const WEEKDAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;
const DAY = 'mx-auto flex size-10 items-center justify-center rounded-full text-[16px] font-semibold tabular-nums sm:size-12';
const ARROW = `hover-shade flex size-11 items-center justify-center rounded-full bg-background ${FOCUS}`;

type DayProps = { days: readonly string[]; selected: string; month: string; monthHref: (month: string) => string };

function MonthArrow({ month, label, monthHref }: { month: string | undefined; label: string; monthHref: (month: string) => string }): ReactElement {
  const Icon = label === 'Mes anterior' ? ChevronLeft : ChevronRight;
  if (!month) return <span className='size-11' />;
  return (
    <Link href={monthHref(month)} aria-label={label} className={ARROW}>
      <Icon aria-hidden='true' className='size-5' />
    </Link>
  );
}

function Day({ date, free, selected }: { date: string; free: boolean; selected: boolean }): ReactElement {
  if (!free) {
    return (
      <span aria-hidden='true' className={`${DAY} font-medium text-muted-foreground/70`}>
        {Number(date.slice(8))}
      </span>
    );
  }
  return (
    <label aria-label={longDay(date)} className={`hover-shade cursor-pointer bg-background has-checked:bg-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground ${DAY}`}>
      <input type='radio' name='dia' value={date} defaultChecked={selected} required className='sr-only' />
      {Number(date.slice(8))}
    </label>
  );
}

export function DayChoice({ days, selected, month, monthHref }: DayProps): ReactElement {
  const free = new Set(days);
  const months = [...new Set(days.map((day) => day.slice(0, 7)))];
  const index = months.indexOf(month);
  return (
    <fieldset className='flex max-w-md flex-col gap-4 rounded-input bg-secondary px-2 py-4 sm:p-6'>
      <legend className='sr-only'>Día</legend>
      <div className='flex items-center justify-between gap-3'>
        <MonthArrow month={months[index - 1]} label='Mes anterior' monthHref={monthHref} />
        <p className='text-[18px] font-bold'>{monthTitle(`${month}-01`)}</p>
        <MonthArrow month={months[index + 1]} label='Mes siguiente' monthHref={monthHref} />
      </div>
      <ol className='grid grid-cols-7 gap-y-2 text-center'>
        {WEEKDAY_INITIALS.map((initial) => (
          <li key={initial} aria-hidden='true' className='py-1 text-[13px] font-semibold text-muted-foreground'>
            {initial}
          </li>
        ))}
        {monthGrid(`${month}-01`).map((date) => (
          <li key={date}>{date.startsWith(month) ? <Day date={date} free={free.has(date)} selected={date === selected} /> : null}</li>
        ))}
      </ol>
    </fieldset>
  );
}
