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

const BODY = [
  'M28 367C58 306 124 264 198 245',
  'M53 504C50 446 74 380 127 344',
  'M487 264C529 314 694 364 724 526',
  'M661 337C686 298 719 251 748 212',
  'M697 274C694 235 719 215 748 212C748 245 727 268 697 274Z',
  'M674 311C644 307 623 281 624 251C653 255 672 281 674 311Z',
  'M677 314C697 298 724 294 740 302C724 319 697 324 677 314Z',
  'M33 884L86 912',
  'M21 936L79 939',
  'M682 793C669 835 648 868 619 896',
  'M631 922L691 901',
] as const;

const UNDERLINE = 'M2 7C30 3 65 3 98 5';

export function HeroBodyStrokes(): ReactElement {
  return (
    <svg {...SVG} viewBox='0 0 750 1000' className={`${BASE} inset-0 h-full w-full`}>
      {BODY.map((d) => (
        <path key={d} data-draw d={d} {...STROKE} />
      ))}
    </svg>
  );
}

export function OpeningStrokes(): ReactElement {
  return (
    <>
      <svg {...SVG} viewBox='0 0 50 40' className={`${BASE} bottom-full left-0 mb-1 h-8 w-10 lg:mb-2 lg:h-10 lg:w-12`}>
        <path data-draw d='M6 22L18 34' {...STROKE} />
        <path data-draw d='M30 4L33 30' {...STROKE} />
      </svg>
      <svg {...SVG} viewBox='0 0 100 10' className={`${BASE} top-full left-0 mt-3 h-2 w-1/2 lg:mt-5 lg:w-[72%]`}>
        <path data-draw d={UNDERLINE} {...STROKE} />
      </svg>
    </>
  );
}

export function ClosingStrokes(): ReactElement {
  return (
    <svg {...SVG} viewBox='0 0 100 10' className={`${BASE} top-full right-0 mt-3 h-2 w-1/2 lg:mt-5 lg:w-[85%]`}>
      <path data-draw d={UNDERLINE} {...STROKE} />
    </svg>
  );
}
