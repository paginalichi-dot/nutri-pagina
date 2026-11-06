'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import type { ActionResult } from '@/lib/action-result';
import { login } from '../../actions/login';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-foreground';
const INPUT = `h-12 w-full rounded-input bg-secondary px-5 text-base text-foreground focus-visible:shadow-[0_0_0_6px_var(--primary)] ${FOCUS}`;

type FieldProps = { name: string; label: string; type: string; autoComplete: string };

function Field({ name, label, type, autoComplete }: FieldProps): ReactElement {
  return (
    <label className='flex flex-col gap-2 text-[15px] font-semibold'>
      {label}
      <input name={name} type={type} autoComplete={autoComplete} required className={INPUT} />
    </label>
  );
}

function ErrorMessage({ state }: { state: ActionResult | null }): ReactElement | null {
  if (!state || state.success) return null;
  return (
    <p role='alert' className='flex items-center gap-2 text-[15px] font-medium text-destructive'>
      <svg aria-hidden='true' viewBox='0 0 24 24' className='size-5 shrink-0' fill='none' stroke='currentColor' strokeWidth='2'>
        <circle cx='12' cy='12' r='10' />
        <path d='M12 8v5M12 16h.01' strokeLinecap='round' />
      </svg>
      {state.error}
    </p>
  );
}

export function LoginForm(): ReactElement {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className='flex flex-col gap-5'>
      <Field name='email' label='Email' type='email' autoComplete='username' />
      <Field name='password' label='Contraseña' type='password' autoComplete='current-password' />
      <div aria-hidden='true' className='absolute -left-[9999px] h-px w-px overflow-hidden'>
        <label>
          No completar
          <input name='website' tabIndex={-1} autoComplete='off' defaultValue='' />
        </label>
      </div>
      <ErrorMessage state={state} />
      <button
        type='submit'
        disabled={pending}
        className='h-14 rounded-full bg-primary px-8 text-[17px] font-medium text-primary-foreground shadow-halo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-70'
      >
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
