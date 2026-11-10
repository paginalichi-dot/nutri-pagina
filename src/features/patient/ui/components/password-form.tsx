'use client';

import { type ReactElement, useActionState } from 'react';
import { FormFeedback } from '@/components/form/form-parts';
import { PasswordField } from '@/components/form/password-field';
import { changePatientPassword } from '../../actions/account-changes';
import { SubmitPill } from './account-card';

export function PasswordForm(): ReactElement {
  const [state, action, pending] = useActionState(changePatientPassword, null);
  return (
    <form action={action} className='flex flex-col gap-4'>
      <PasswordField name='currentPassword' label='Contraseña actual' autoComplete='current-password' />
      <PasswordField name='newPassword' label='Contraseña nueva' autoComplete='new-password' hint='De 8 a 128 caracteres.' />
      <PasswordField name='confirmPassword' label='Repetí la contraseña nueva' autoComplete='new-password' />
      <FormFeedback state={state} />
      <SubmitPill pending={pending} idle='Cambiar la contraseña' busy='Guardando…' />
    </form>
  );
}
