'use client';

import { Eye, EyeOff } from 'lucide-react';
import { type ReactElement, useId, useState } from 'react';
import { FOCUS } from './form-parts';
import { PUBLIC_INPUT } from './public-form-parts';

type Props = { name: string; label: string; autoComplete: 'current-password' | 'new-password'; hint?: string };

export function PasswordField({ name, label, autoComplete, hint }: Props): ReactElement {
  const id = useId();
  const hintId = `${id}-hint`;
  const [shown, setShown] = useState(false);
  const Icon = shown ? EyeOff : Eye;
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='text-[15px] font-semibold'>
        {label}
      </label>
      <div className='relative'>
        <input id={id} name={name} type={shown ? 'text' : 'password'} autoComplete={autoComplete} required maxLength={128} aria-describedby={hint ? hintId : undefined} className={`${PUBLIC_INPUT} pr-14`} />
        <button
          type='button'
          aria-pressed={shown}
          aria-label='Mostrar clave'
          onClick={() => setShown((value) => !value)}
          className={`hover-shade absolute top-0.5 right-1 flex size-11 items-center justify-center rounded-full text-muted-foreground ${FOCUS}`}
        >
          <Icon aria-hidden='true' className='size-5' strokeWidth={2} />
        </button>
      </div>
      {hint ? (
        <span id={hintId} className='text-[13px] font-medium text-muted-foreground'>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
