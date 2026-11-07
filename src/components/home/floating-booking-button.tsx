import { ArrowUpRight, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground focus-visible:ring-4 focus-visible:ring-background';
const GLOW = 'shadow-[0_14px_36px_-10px_var(--primary)] hover:shadow-[0_18px_44px_-8px_var(--primary)]';

export function FloatingBookingButton(): ReactElement {
  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))]'>
      <Link
        href='/reservar'
        data-booking-button
        className={`group pointer-events-auto flex h-16 items-center gap-3 rounded-full bg-primary pr-2 pl-6 text-[17px] font-semibold text-primary-foreground transition-shadow duration-300 md:h-[72px] md:pl-7 md:text-lg ${GLOW} ${FOCUS}`}
      >
        <CalendarCheck aria-hidden='true' className='size-5 shrink-0' strokeWidth={2} />
        Reservá tu turno
        <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-foreground text-primary md:size-14'>
          <ArrowUpRight
            aria-hidden='true'
            className='size-5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 md:size-6'
            strokeWidth={2.25}
          />
        </span>
      </Link>
    </div>
  );
}
