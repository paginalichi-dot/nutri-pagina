import type { ReactElement } from 'react';

const STROKE = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function HandUnderline(): ReactElement {
  return (
    <svg aria-hidden='true' viewBox='0 0 120 18' preserveAspectRatio='none' className='absolute -bottom-4 -left-[18%] h-5 w-[136%] text-primary'>
      <path data-draw d='M4 11c24-6 52-8 78-7 12 1 23 2 33 5M22 15c18-2 40-3 60-2' strokeWidth={4} {...STROKE} />
    </svg>
  );
}

export function HandArrow(): ReactElement {
  return (
    <svg aria-hidden='true' viewBox='0 0 160 120' className='pointer-events-none absolute top-6 -left-36 hidden h-28 w-36 text-scribble lg:block'>
      <path data-draw d='M152 14C116 6 70 14 52 44c-14 24-6 52 10 58 14 6 22-12 8-24C56 66 30 74 12 98' strokeWidth={3} {...STROKE} />
      <path data-draw d='M10 82l2 18 18-4' strokeWidth={3} {...STROKE} />
    </svg>
  );
}
