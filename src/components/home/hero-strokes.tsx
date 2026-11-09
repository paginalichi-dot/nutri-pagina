import type { ReactElement } from 'react';

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
} as const;

const SVG = { 'aria-hidden': true, 'data-hero-strokes': true, preserveAspectRatio: 'none' } as const;
const BASE = 'pointer-events-none absolute overflow-visible text-primary';

export function HeroBodyStrokes(): ReactElement {
  return (
    <svg {...SVG} viewBox='0 0 750 1000' className={`${BASE} inset-0 h-full w-full`}>
      <path data-draw d='M224 335C160 355 90 370 78 420C74 440 76 460 76 477' {...STROKE} />
      <path data-draw d='M526 225C490 255 495 295 530 318C560 335 595 342 620 346' {...STROKE} />
      <path data-draw d='M720 722C716 800 690 840 664 947' {...STROKE} />
    </svg>
  );
}

export function OpeningStrokes(): ReactElement {
  return (
    <>
      <svg {...SVG} viewBox='0 0 100 10' className={`${BASE} top-full left-0 mt-3 h-2 w-1/3 lg:mt-5 lg:w-[65%]`}>
        <path data-draw d='M2 6C30 2 60 8 98 3' {...STROKE} />
      </svg>
    </>
  );
}

export function ClosingStrokes(): ReactElement {
  return (
    <>
      <svg {...SVG} viewBox='0 0 100 100' className={`${BASE} top-[30%] -left-[8%] hidden h-[calc(70%+12px)] w-[108%] lg:block`}>
        <path data-draw d='M4 0V35H15V99H99' {...STROKE} />
      </svg>
      <svg {...SVG} viewBox='0 0 100 10' className={`${BASE} top-full right-0 mt-3 h-2 w-1/3 lg:hidden`}>
        <path data-draw d='M2 6C30 2 60 8 98 3' {...STROKE} />
      </svg>
    </>
  );
}
