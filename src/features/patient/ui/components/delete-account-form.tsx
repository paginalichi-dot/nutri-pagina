'use client';

import { type ReactElement, useActionState } from 'react';
import { FormFeedback } from '@/components/form/form-parts';
import { PasswordField } from '@/components/form/password-field';
import { deleteAccount } from '../../actions/account-changes';
import { SubmitPill } from './account-card';

export function DeleteAccountForm(): ReactElement {
  const [state, action, pending] = useActionState(deleteAccount, null);
  return (
    <form action={action} className='flex flex-col gap-4'>
      <p className='text-[14px] text-muted-foreground'>Se borran tus datos de acceso. Los turnos que ya tuviste quedan en la agenda de Lisandro.</p>
      <PasswordField name='currentPassword' label='Contraseña actual' autoComplete='current-password' />
      <label className='flex min-h-11 items-center gap-3 text-[15px] font-medium'>
        <input type='checkbox' name='confirm' required className='size-5 accent-foreground' />
        Sí, quiero eliminar mi cuenta
      </label>
      <FormFeedback state={state} />
      <SubmitPill pending={pending} idle='Eliminar mi cuenta' busy='Eliminando…' />
    </form>
  );
}
