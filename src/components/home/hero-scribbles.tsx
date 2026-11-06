import type { ReactElement } from 'react';

const STROKE = { fill: 'none', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function HeroScribbles(): ReactElement {
  return (
    <div aria-hidden='true' data-testid='hero-scribbles' className='pointer-events-none absolute inset-0 z-10 hidden md:block'>
      <svg viewBox='0 0 60 60' className='absolute top-14 right-16 size-14 text-primary' {...STROKE} stroke='currentColor'>
        <path d='M30 6v14M50 16l-10 10M54 38H40' />
      </svg>
      <svg viewBox='0 0 120 60' className='absolute bottom-[14%] left-[10%] h-12 w-28 text-background' {...STROKE} stroke='currentColor'>
        <path d='M4 44c18-30 34-34 40-20s-12 22-14 8 30-30 56-14c12 8 20 18 28 22' />
      </svg>
    </div>
  );
}
