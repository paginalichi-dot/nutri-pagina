import type { ReactElement } from 'react';

const STROKE = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function HandUnderline(): ReactElement {
  return (
    <svg aria-hidden='true' viewBox='0 0 120 18' preserveAspectRatio='none' className='absolute -bottom-3 -left-[3%] h-4 w-[106%] text-primary md:-bottom-4 md:h-5'>
      <path data-draw d='M4 11c24-6 52-8 78-7 12 1 23 2 33 5M22 15c18-2 40-3 60-2' strokeWidth={4} {...STROKE} />
    </svg>
  );
}
