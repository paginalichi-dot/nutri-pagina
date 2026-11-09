'use client';

import { type ReactElement, useActionState } from 'react';
import { resendVerification } from '@/features/patient/actions/register';
import { FormFeedback } from '@/components/form/form-parts';
import { Honeypot, PUBLIC_SECONDARY } from '@/components/form/public-form-parts';

export function ResendForm({ email }: { email: string }): ReactElement {
  const [state, action, pending] = useActionState(resendVerification, null);
  return (
    <form action={action} className='flex flex-col gap-3'>
      <input type='hidden' name='email' value={email} />
      <Honeypot />
      <FormFeedback state={state} />
      <button type='submit' disabled={pending} className={PUBLIC_SECONDARY}>
        {pending ? 'Reenviando…' : 'Reenviar el email'}
      </button>
    </form>
  );
}
