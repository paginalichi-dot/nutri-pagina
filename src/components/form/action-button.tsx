'use client';

import { useActionState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import type { ActionResult } from '@/lib/action-result';
import { DANGER_BUTTON, FormFeedback, PRIMARY_BUTTON, SECONDARY_BUTTON } from './form-parts';

const TONES = { primary: PRIMARY_BUTTON, secondary: SECONDARY_BUTTON, danger: DANGER_BUTTON } as const;

type Action = (previous: ActionResult | null, formData: FormData) => Promise<ActionResult>;

type ActionButtonProps = {
  action: Action;
  fields: Readonly<Record<string, string>>;
  label: string;
  busy: string;
  tone?: keyof typeof TONES;
  confirm?: string;
};

export function ActionButton({ action, fields, label, busy, tone = 'secondary', confirm }: ActionButtonProps): ReactElement {
  const [state, run, pending] = useActionState(action, null);
  const ask = (event: FormEvent<HTMLFormElement>): void => {
    if (confirm && !window.confirm(confirm)) event.preventDefault();
  };
  return (
    <form action={run} onSubmit={ask} className='flex flex-col items-stretch gap-3 sm:items-start'>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type='hidden' name={name} value={value} />
      ))}
      <button type='submit' disabled={pending} className={TONES[tone]}>
        {pending ? busy : label}
      </button>
      <FormFeedback state={state} />
    </form>
  );
}
