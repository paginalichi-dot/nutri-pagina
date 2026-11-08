import type { ReactElement } from 'react';

const TONES = { onDark: 'text-background', onLight: 'text-scribble' } as const;
const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function ScrollHint({ tone }: { tone: keyof typeof TONES }): ReactElement {
  return (
    <span
      aria-hidden='true'
      data-scroll-hint
      className={`pointer-events-none absolute right-3 bottom-4 z-10 motion-safe:animate-[bounce_2.6s_ease-in-out_infinite] md:right-6 md:bottom-6 ${TONES[tone]}`}
    >
      <svg aria-hidden='true' viewBox='0 0 56 100' className='h-9 w-5 md:h-16 md:w-9'>
        <path d='M40 6C24 6 12 18 18 32c5 11 22 9 21-2-1-10-17-11-21 1-5 15 2 40 10 60' {...STROKE} />
        <path d='M18 80l10 12 10-13' {...STROKE} />
      </svg>
    </span>
  );
}
