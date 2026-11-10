import { CalendarDays, Clock, type LucideIcon, MapPin, Video } from 'lucide-react';
import type { ReactElement } from 'react';

export type ReviewRow = { icon: 'place' | 'video' | 'day' | 'time'; label: string; value: string };

const ICONS: Readonly<Record<ReviewRow['icon'], LucideIcon>> = { place: MapPin, video: Video, day: CalendarDays, time: Clock };

export function BookingSummary({ rows }: { rows: readonly ReviewRow[] }): ReactElement {
  return (
    <dl className='flex flex-col divide-y divide-border overflow-hidden rounded-input bg-secondary'>
      {rows.map(({ icon, label, value }) => {
        const Icon = ICONS[icon];
        return (
          <div key={label} className='flex items-center gap-4 px-5 py-4'>
            <span aria-hidden='true' className='flex size-11 shrink-0 items-center justify-center rounded-full bg-background'>
              <Icon className='size-5' strokeWidth={1.75} />
            </span>
            <div className='flex min-w-0 flex-col gap-0.5'>
              <dt className='text-[12px] font-bold tracking-[1px] text-muted-foreground uppercase'>{label}</dt>
              <dd className='text-[17px] font-semibold'>{value}</dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
