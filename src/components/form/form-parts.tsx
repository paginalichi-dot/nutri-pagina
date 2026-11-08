import type { ReactElement, ReactNode } from 'react';
import type { ActionResult } from '@/lib/action-result';

export const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground';
export const INPUT =
  'h-12 w-full rounded-input bg-secondary px-5 text-base text-foreground focus-visible:shadow-[0_0_0_6px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-foreground';
export const SECONDARY_BUTTON = `flex h-12 items-center justify-center gap-2 rounded-full bg-secondary px-6 font-medium text-secondary-foreground disabled:opacity-70 ${FOCUS}`;
export const PRIMARY_BUTTON = `flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-[17px] font-medium text-primary-foreground shadow-halo disabled:opacity-70 ${FOCUS}`;

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
};

export function Field({ name, label, type = 'text', autoComplete = 'off', defaultValue, required = true, hint }: FieldProps): ReactElement {
  return (
    <label className='flex flex-col gap-2 text-[15px] font-semibold'>
      {label}
      <input name={name} type={type} autoComplete={autoComplete} defaultValue={defaultValue} required={required} className={INPUT} />
      {hint ? <span className='text-[13px] font-medium text-muted-foreground'>{hint}</span> : null}
    </label>
  );
}

type SelectProps = { name: string; label: string; defaultValue?: string; children: ReactNode };

export function SelectField({ name, label, defaultValue, children }: SelectProps): ReactElement {
  return (
    <label className='flex flex-col gap-2 text-[15px] font-semibold'>
      {label}
      <select name={name} defaultValue={defaultValue} className={INPUT}>
        {children}
      </select>
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

export function ErrorMessage({ children }: { children: ReactNode }): ReactElement {
  return (
    <p role='alert' className='flex items-center gap-2 text-[15px] font-medium text-destructive'>
      <AlertIcon />
      {children}
    </p>
  );
}

export function FormFeedback<T>({ state }: { state: ActionResult<T> | null }): ReactElement | null {
  if (!state) return null;
  if (!state.success) return <ErrorMessage>{state.error}</ErrorMessage>;
  return state.message ? (
    <p role='status' className='rounded-input bg-confirmed px-5 py-3 text-[15px] font-medium'>
      {state.message}
    </p>
  ) : null;
}

type SubmitProps = { pending: boolean; idle: string; busy: string; secondary?: boolean };

export function SubmitButton({ pending, idle, busy, secondary = false }: SubmitProps): ReactElement {
  return (
    <button type='submit' disabled={pending} className={secondary ? SECONDARY_BUTTON : PRIMARY_BUTTON}>
      {pending ? busy : idle}
    </button>
  );
}
