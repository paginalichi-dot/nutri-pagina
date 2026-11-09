'use client';

import { type ReactElement, useActionState } from 'react';
import { FormFeedback } from '@/components/form/form-parts';
import { PasswordField } from '@/components/form/password-field';
import { PublicField } from '@/components/form/public-form-parts';
import { requestEmailChange } from '../../actions/account-changes';
import { SubmitPill } from './account-card';

export function EmailForm({ email }: { email: string }): ReactElement {
  const [state, action, pending] = useActionState(requestEmailChange, null);
  return (
    <form action={action} className='flex flex-col gap-4'>
      <p className='text-[16px]'>
        Tu email actual: <strong className='font-semibold'>{email}</strong>
      </p>
      <p className='text-[14px] text-muted-foreground'>
        Te mandamos un link al email nuevo; el cambio se aplica cuando lo toques. Los turnos que Lisandro cargó con tu email anterior dejan de verse acá.
      </p>
      <PublicField name='email' label='Email nuevo' type='email' autoComplete='email' />
      <PasswordField name='currentPassword' label='Contraseña actual' autoComplete='current-password' />
      <FormFeedback state={state} />
      <SubmitPill pending={pending} idle='Cambiar el email' busy='Enviando…' />
    </form>
  );
}
