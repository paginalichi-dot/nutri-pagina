import type { ReactElement } from 'react';

const TONES = { onDark: 'text-background', onLight: 'text-scribble' } as const;
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const PLACES = {
  corner: 'right-3 bottom-4 md:right-6 md:bottom-6',
  phrase: 'bottom-0 -left-3 lg:hidden',
  opening: 'hidden lg:block lg:bottom-0 lg:left-[calc(100%+3rem)]',
} as const;

export function ScrollHint({ tone, placement = 'corner' }: { tone: keyof typeof TONES; placement?: keyof typeof PLACES }): ReactElement {
  return (
    <span
      aria-hidden='true'
      data-scroll-hint
      className={`pointer-events-none absolute z-10 motion-safe:animate-[bounce_2.6s_ease-in-out_infinite] ${PLACES[placement]} ${TONES[tone]}`}
    >
      <svg aria-hidden='true' viewBox='0 0 56 100' className='h-14 w-8 md:h-24 md:w-[3.4rem]'>
        <path d='M40 6C24 6 12 18 18 32c5 11 22 9 21-2-1-10-17-11-21 1-5 15 2 40 10 60' {...STROKE} />
        <path d='M18 80l10 12 10-13' {...STROKE} />
      </svg>
    </span>
  );
}
