import { CalendarCheck, GraduationCap, UserRound } from 'lucide-react';
import type { ReactElement } from 'react';

const HIGHLIGHTS = [
  { icon: GraduationCap, label: 'Universidad Favaloro' },
  { icon: UserRound, label: 'Atención personalizada' },
  { icon: CalendarCheck, label: 'Seguimiento continuo' },
] as const;

export function AboutHighlights(): ReactElement {
  return (
    <ul className='flex flex-col gap-4 xl:flex-row xl:gap-0 xl:divide-x xl:divide-border'>
      {HIGHLIGHTS.map(({ icon: Icon, label }) => (
        <li key={label} className='flex flex-1 items-center gap-3 text-[15px] leading-tight font-semibold xl:px-5 xl:first:pl-0 xl:last:pr-0'>
          <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-primary short:size-10'>
            <Icon aria-hidden='true' className='size-6 short:size-5' strokeWidth={1.75} />
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}
