import Link from 'next/link';
import type { ReactElement } from 'react';
import { ArrowDisc } from '../arrow-disc';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground focus-visible:ring-4 focus-visible:ring-background';

export function FloatingBookingButton(): ReactElement {
  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(16px,env(safe-area-inset-bottom))]'>
      <Link
        href='/reservar'
        className={`pointer-events-auto flex h-16 items-center gap-4 rounded-full bg-primary pr-2 pl-8 text-[17px] font-medium text-primary-foreground shadow-halo md:h-[88px] md:pr-3 md:pl-[37px] md:text-lg ${FOCUS}`}
      >
        Reservá tu turno
        <ArrowDisc className='size-12 md:size-16' />
      </Link>
    </div>
  );
}
