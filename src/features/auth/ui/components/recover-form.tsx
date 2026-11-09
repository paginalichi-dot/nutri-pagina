'use client';

import { type ReactElement, useActionState } from 'react';
import { requestPasswordReset } from '@/features/patient/actions/request-password-reset';
import { FormFeedback } from '@/components/form/form-parts';
import { Honeypot, PUBLIC_PRIMARY, PublicField } from '@/components/form/public-form-parts';

export function RecoverForm(): ReactElement {
  const [state, action, pending] = useActionState(requestPasswordReset, null);
  return (
    <form action={action} className='flex flex-col gap-5'>
      <PublicField name='email' label='Email' type='email' autoComplete='email' placeholder='tu@email.com' />
      <Honeypot />
      <FormFeedback state={state} />
      <button type='submit' disabled={pending} className={PUBLIC_PRIMARY}>
        {pending ? 'Enviando…' : 'Mandarme el link'}
      </button>
    </form>
  );
}
