'use client';

import { type ReactElement, useActionState } from 'react';
import { requestPasswordReset } from '@/features/patient/actions/request-password-reset';
import { AuthCard } from '@/components/auth/auth-card';
import { AuthFooter } from '@/components/auth/auth-footer';
import { EmailSent } from '@/components/auth/email-sent';
import { FormFeedback } from '@/components/form/form-parts';
import { Honeypot, PUBLIC_PRIMARY, PublicField } from '@/components/form/public-form-parts';

const SENT = 'Si el email tiene una cuenta, te enviamos un correo para restablecer tu contraseña.';
const SENT_HINT = 'Revisá tu bandeja de entrada y hacé clic en el enlace. Vence en 1 hora.';

export function RecoverForm(): ReactElement {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  if (state?.success) return <EmailSent message={SENT} hint={SENT_HINT} />;
  return (
    <AuthCard title='Recuperá tu contraseña' lead='Te mandamos un link por email para elegir una nueva.'>
      <form action={action} className='flex flex-col gap-5'>
        <PublicField name='email' label='Email' type='email' autoComplete='email' placeholder='tu@email.com' />
        <Honeypot />
        <FormFeedback state={state} />
        <button type='submit' disabled={pending} className={PUBLIC_PRIMARY}>
          {pending ? 'Enviando…' : 'Mandarme el link'}
        </button>
      </form>
      <AuthFooter text='¿Te acordaste?' href='/login' label='Ingresá' />
    </AuthCard>
  );
}
