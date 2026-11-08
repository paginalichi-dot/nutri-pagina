'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { login } from '../../actions/login';
import { Field, FormFeedback, SubmitButton } from '@/components/form/form-parts';

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
      <FormFeedback state={state} />
      <SubmitButton pending={pending} idle='Entrar' busy='Entrando…' />
    </form>
  );
}
