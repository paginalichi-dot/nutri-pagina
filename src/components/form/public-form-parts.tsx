import type { ReactElement } from 'react';
import { FOCUS } from './form-parts';

export const PUBLIC_INPUT =
  'h-12 w-full rounded-input bg-secondary px-5 text-base text-foreground focus-visible:shadow-[0_0_0_6px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-foreground';

export const PUBLIC_PRIMARY = `hover-shade flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-[17px] font-semibold text-primary-foreground disabled:opacity-70 ${FOCUS}`;

export const PUBLIC_SECONDARY = `hover-shade flex h-12 items-center justify-center rounded-full bg-secondary px-6 text-[16px] font-semibold text-secondary-foreground disabled:opacity-70 ${FOCUS}`;

export const PUBLIC_LINK = `rounded-sm font-semibold underline underline-offset-4 ${FOCUS}`;

type FieldProps = { name: string; label: string; type?: string; autoComplete?: string; defaultValue?: string; placeholder?: string; required?: boolean };

export function PublicField({ name, label, type = 'text', autoComplete = 'off', defaultValue, placeholder, required = true }: FieldProps): ReactElement {
  return (
    <label className='flex flex-col gap-2 text-[15px] font-semibold'>
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={`${PUBLIC_INPUT} placeholder:font-normal placeholder:text-muted-foreground`}
      />
    </label>
  );
}

export function Honeypot(): ReactElement {
  return (
    <div aria-hidden='true' className='absolute -left-[9999px] h-px w-px overflow-hidden'>
      <label>
        Dejá este campo vacío
        <input name='website' type='text' tabIndex={-1} autoComplete='off' defaultValue='' />
      </label>
    </div>
  );
}
