'use client';

import { useActionState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { ActionResult } from '@/lib/action-result';
import { FormFeedback, PRIMARY_BUTTON, SECONDARY_BUTTON } from './form-parts';

type Action = (previous: ActionResult | null, formData: FormData) => Promise<ActionResult>;

type ActionButtonProps = {
  action: Action;
  fields: Readonly<Record<string, string>>;
  label: string;
  busy: string;
  primary?: boolean;
  confirm?: string;
};

export function ActionButton({ action, fields, label, busy, primary = false, confirm }: ActionButtonProps): ReactElement {
  const [state, run, pending] = useActionState(action, null);
  const ask = (event: FormEvent<HTMLFormElement>): void => {
    if (confirm && !window.confirm(confirm)) event.preventDefault();
  };
  return (
    <form action={run} onSubmit={ask} className='flex flex-col items-start gap-3'>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type='hidden' name={name} value={value} />
      ))}
      <button type='submit' disabled={pending} className={primary ? PRIMARY_BUTTON : SECONDARY_BUTTON}>
        {pending ? busy : label}
      </button>
      <FormFeedback state={state} />
    </form>
  );
}
