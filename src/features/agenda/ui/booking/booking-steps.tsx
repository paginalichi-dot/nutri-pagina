import { Check } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';
import { FOCUS } from '@/components/form/form-parts';

export type StepPill = { label: string; href: string };
type State = 'current' | 'done' | 'next';

const PILL = 'flex h-11 items-center gap-2 rounded-full pl-1.5 text-[15px] font-semibold';
const TONES: Readonly<Record<State, string>> = {
  current:
    'bg-primary pr-4 text-primary-foreground shadow-[0_8px_24px_-10px_var(--primary)] group-has-[[data-booking-done]]/flow:bg-foreground group-has-[[data-booking-done]]/flow:text-background group-has-[[data-booking-done]]/flow:shadow-none',
  done: `hover-shade hover-shade-on-dark bg-foreground pr-1.5 text-background sm:pr-4 ${FOCUS}`,
  next: 'border border-border pr-1.5 text-muted-foreground sm:pr-4',
};
const DISCS: Readonly<Record<State, string>> = {
  current: 'bg-background text-foreground group-has-[[data-booking-done]]/flow:bg-primary group-has-[[data-booking-done]]/flow:text-primary-foreground',
  done: 'bg-primary text-primary-foreground',
  next: 'bg-secondary',
};

function StepContent({ number, label, state }: { number: number; label: string; state: State }): ReactNode {
  return (
    <>
      <span aria-hidden='true' className={`flex size-8 items-center justify-center rounded-full ${DISCS[state]}`}>
        {state === 'done' ? <Check className='size-4' strokeWidth={3} /> : <span className={state === 'current' ? 'group-has-[[data-booking-done]]/flow:hidden' : ''}>{number}</span>}
        {state === 'current' ? <Check className='hidden size-4 group-has-[[data-booking-done]]/flow:block' strokeWidth={3} /> : null}
      </span>
      <span className={state === 'current' ? '' : 'sr-only sm:not-sr-only'}>{label}</span>
    </>
  );
}

export function BookingSteps({ steps, current }: { steps: readonly StepPill[]; current: number }): ReactElement {
  return (
    <ol aria-label='Pasos de la reserva' className='flex flex-wrap gap-1.5 sm:gap-2'>
      {steps.map(({ label, href }, index) => {
        const number = index + 1;
        const state: State = number === current ? 'current' : number < current ? 'done' : 'next';
        return (
          <li key={label}>
            {state === 'done' ? (
              <Link href={href} aria-label={`Paso ${number}: ${label} (cambiar)`} className={`${PILL} ${TONES.done}`}>
                <StepContent number={number} label={label} state={state} />
              </Link>
            ) : (
              <span aria-current={state === 'current' ? 'step' : undefined} className={`${PILL} ${TONES[state]}`}>
                <StepContent number={number} label={label} state={state} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
