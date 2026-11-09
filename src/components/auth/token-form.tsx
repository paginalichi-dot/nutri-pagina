'use client';

import { type ReactElement, type ReactNode, useActionState } from 'react';
import type { ActionResult } from '@/lib/action-result';
import { FormFeedback } from '@/components/form/form-parts';
import { Honeypot, PUBLIC_PRIMARY } from '@/components/form/public-form-parts';
import { AuthDone } from './auth-done';

type Action = (previous: ActionResult | null, formData: FormData) => Promise<ActionResult>;
type Props = { action: Action; token: string; idle: string; busy: string; children?: ReactNode };

export function TokenForm({ action, token, idle, busy, children }: Props): ReactElement {
  const [state, formAction, pending] = useActionState(action, null);
  if (state?.success) return <AuthDone message={state.message ?? 'Listo.'} />;
  return (
    <form action={formAction} className='flex flex-col gap-5'>
      <input type='hidden' name='token' value={token} />
      {children}
      <Honeypot />
      <FormFeedback state={state} />
      <button type='submit' disabled={pending} className={PUBLIC_PRIMARY}>
        {pending ? busy : idle}
      </button>
    </form>
  );
}
