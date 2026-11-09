'use client';

import Link from 'next/link';
import { type ReactElement, useActionState, useState } from 'react';
import { login } from '../../actions/login';
import { ResendForm } from './resend-form';
import { AuthFooter } from '@/components/auth/auth-footer';
import { FormFeedback } from '@/components/form/form-parts';
import { PasswordField } from '@/components/form/password-field';
import { Honeypot, PUBLIC_LINK, PUBLIC_PRIMARY, PublicField } from '@/components/form/public-form-parts';

export function LoginForm(): ReactElement {
  const [state, action, pending] = useActionState(login, null);
  const [email, setEmail] = useState('');
  const unverified = state?.success === false && state.code === 'EMAIL_NOT_VERIFIED';
  return (
    <div className='flex flex-col gap-5'>
      <form
        action={action}
        onSubmit={(event) => setEmail(String(new FormData(event.currentTarget).get('email') ?? ''))}
        className='flex flex-col gap-5'
      >
        <PublicField name='email' label='Email' type='email' autoComplete='username' placeholder='tu@email.com' />
        <div className='flex flex-col gap-2'>
          <PasswordField name='password' label='Contraseña' autoComplete='current-password' />
          <Link href='/recuperar' className={`${PUBLIC_LINK} relative self-end text-[14px] after:absolute after:-inset-x-2 after:-top-2 after:-bottom-4`}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Honeypot />
        <FormFeedback state={state} />
        <button type='submit' disabled={pending} className={PUBLIC_PRIMARY}>
          {pending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      {unverified ? <ResendForm email={email} /> : null}
      <AuthFooter text='¿No tenés cuenta?' href='/registro' label='Registrate' />
    </div>
  );
}
