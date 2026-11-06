import type { ReactElement } from 'react';

export function ArrowDisc({ className = 'size-10' }: { className?: string }): ReactElement {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-background text-foreground ${className}`}>
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        className='size-5'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M5 12h14M13 6l6 6-6 6' />
      </svg>
    </span>
  );
}
