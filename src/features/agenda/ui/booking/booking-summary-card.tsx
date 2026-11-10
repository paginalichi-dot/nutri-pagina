import { CalendarDays, Clock, type LucideIcon, MapPin, ShieldCheck, Video } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';

export type SummaryRow = { icon: 'place' | 'video' | 'day' | 'time'; label: string; value: string | null };
export type SummaryCardProps = { title: string; changeHref: string; rows: readonly SummaryRow[]; progress: { step: number; total: number }; note: string };

const ICONS: Readonly<Record<SummaryRow['icon'], LucideIcon>> = { place: MapPin, video: Video, day: CalendarDays, time: Clock };

function Row({ row }: { row: SummaryRow }): ReactElement {
  const Icon = ICONS[row.icon];
  const done = row.value !== null;
  return (
    <li className='flex items-center gap-4'>
      <span aria-hidden='true' className={`flex size-10 shrink-0 items-center justify-center rounded-full ${done ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
        <Icon className='size-5' strokeWidth={1.75} />
      </span>
      <span className='flex min-w-0 flex-col'>
        <span className='text-[13px] text-muted-foreground'>{row.label}</span>
        <span className={`text-[17px] font-bold ${done ? '' : 'text-muted-foreground'}`}>{row.value ?? 'Pendiente'}</span>
      </span>
    </li>
  );
}

export function BookingSummaryCard({ title, changeHref, rows, progress, note }: SummaryCardProps): ReactElement {
  const chosen = rows.flatMap(({ value }) => (value ? [value] : []));
  return (
    <aside aria-label='Tu turno' className='theme-forest relative overflow-hidden rounded-card bg-background p-5 text-foreground md:p-8'>
      <span aria-hidden='true' className='pointer-events-none absolute -right-16 -bottom-16 size-56 rounded-full bg-primary/20 blur-3xl' />
      <div className='flex items-center justify-between gap-4'>
        <p className='text-[13px] font-bold tracking-[1px] text-primary uppercase'>{title}</p>
        <Link href={changeHref} className={`relative rounded-sm text-[14px] text-muted-foreground underline underline-offset-4 after:absolute after:-inset-3 hover:text-foreground ${FOCUS}`}>
          Cambiar
        </Link>
      </div>
      <ul className='mt-6 hidden flex-col gap-5 lg:flex'>
        {rows.map((row) => (
          <Row key={row.label} row={row} />
        ))}
      </ul>
      <p className='mt-3 line-clamp-2 text-[15px] font-semibold lg:hidden'>{chosen.length > 0 ? chosen.join(' · ') : 'Elegí cada paso para armar tu turno.'}</p>
      <div className='mt-4 flex flex-col gap-2 lg:mt-8'>
        <span aria-hidden='true' className='h-1.5 overflow-hidden rounded-full bg-secondary'>
          <span className='block h-full rounded-full bg-primary' style={{ width: `${(progress.step / progress.total) * 100}%` }} />
        </span>
        <p className='text-[13px] text-muted-foreground'>{`Paso ${progress.step} de ${progress.total}`}</p>
      </div>
      <p className='mt-6 hidden items-start gap-3 border-t border-line-on-dark pt-6 text-[15px] lg:flex'>
        <ShieldCheck aria-hidden='true' className='mt-0.5 size-5 shrink-0 text-primary' strokeWidth={1.75} />
        {note}
      </p>
    </aside>
  );
}
