'use client';

import { UserRound } from 'lucide-react';
import { type ReactElement, useCallback, useId, useRef, useState } from 'react';
import { AccountPanel, type Viewer } from './account-panel';
import { useDismiss } from './use-dismiss';

const SPARKS = ['M-29.1 -10.6L-35.7 -13.0', 'M-21.9 -21.9L-26.9 -26.9', 'M-10.6 -29.1L-13.0 -35.7'];

function Sparks(): ReactElement {
  return (
    <svg aria-hidden='true' viewBox='-40 -40 80 80' className='pointer-events-none absolute -inset-[33.4%] text-primary' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
      {SPARKS.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

export function AccountMenu({ viewer }: { viewer: Viewer }): ReactElement {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss({ open, onClose: close, root, trigger });

  return (
    <div ref={root} className='relative'>
      <button
        ref={trigger}
        type='button'
        aria-label='Mi cuenta'
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className='glass-shine hover-shade hover-shade-on-dark relative flex size-14 items-center lg:size-16 justify-center rounded-full border-2 border-primary bg-foreground text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
      >
        <UserRound aria-hidden='true' className='size-7 lg:size-8' strokeWidth={2} />
      </button>
      <Sparks />
      {open ? (
        <div
          id={panelId}
          role='region'
          aria-label='Mi espacio'
          className='absolute top-[calc(100%+12px)] right-0 flex w-72 max-w-[calc(100vw-48px)] flex-col gap-4 rounded-[25px] border border-line-on-dark bg-foreground p-5 shadow-modal transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] starting:-translate-y-1 starting:opacity-0 motion-reduce:transition-none'
        >
          <AccountPanel viewer={viewer} />
        </div>
      ) : null}
    </div>
  );
}
