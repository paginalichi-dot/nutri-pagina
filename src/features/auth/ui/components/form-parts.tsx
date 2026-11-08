import type { ReactElement } from 'react';
import type { ActionResult } from '@/lib/action-result';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground';
const INPUT = 'h-12 w-full rounded-input bg-secondary px-5 text-base text-foreground focus-visible:shadow-[0_0_0_6px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-foreground';

type FieldProps = { name: string; label: string; type: string; autoComplete: string };

export function Field({ name, label, type, autoComplete }: FieldProps): ReactElement {
  return (
    <label className='flex flex-col gap-2 text-[15px] font-semibold'>
      {label}
      <input name={name} type={type} autoComplete={autoComplete} required className={INPUT} />
    </label>
  );
}

function AlertIcon(): ReactElement {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='size-5 shrink-0' fill='none' stroke='currentColor' strokeWidth='2'>
      <circle cx='12' cy='12' r='10' />
      <path d='M12 8v5M12 16h.01' strokeLinecap='round' />
    </svg>
  );
}

export function FormFeedback({ state }: { state: ActionResult | null }): ReactElement | null {
  if (!state) return null;
  if (state.success) {
    return state.message ? (
      <p role='status' className='rounded-input bg-confirmed px-5 py-3 text-[15px] font-medium'>
        {state.message}
      </p>
    ) : null;
  }
  return (
    <p role='alert' className='flex items-center gap-2 text-[15px] font-medium text-destructive'>
      <AlertIcon />
      {state.error}
    </p>
  );
}

type SubmitProps = { pending: boolean; idle: string; busy: string };

export function SubmitButton({ pending, idle, busy }: SubmitProps): ReactElement {
  return (
    <button
      type='submit'
      disabled={pending}
      className={`h-14 rounded-full bg-primary px-8 text-[17px] font-medium text-primary-foreground shadow-halo disabled:opacity-70 ${FOCUS}`}
    >
      {pending ? busy : idle}
    </button>
  );
}
