'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { changeEmail } from '../../actions/change-email';
import { changePassword } from '../../actions/change-password';
import { Field, FormFeedback, SubmitButton } from './form-parts';

const CARD = 'flex flex-col gap-5 rounded-panel bg-background p-6 md:p-10';
const TITLE = 'text-[19px] font-medium md:text-[20px]';

export function ChangeEmailForm(): ReactElement {
  const [state, action, pending] = useActionState(changeEmail, null);
  return (
    <form action={action} aria-labelledby='cambiar-email' className={CARD}>
      <h2 id='cambiar-email' className={TITLE}>
        Cambiar el email
      </h2>
      <Field name='email' label='Email nuevo' type='email' autoComplete='username' />
      <Field name='currentPassword' label='Contraseña actual' type='password' autoComplete='current-password' />
      <FormFeedback state={state} />
      <SubmitButton pending={pending} idle='Guardar email' busy='Guardando…' />
    </form>
  );
}

export function ChangePasswordForm(): ReactElement {
  const [state, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} aria-labelledby='cambiar-contrasena' className={CARD}>
      <h2 id='cambiar-contrasena' className={TITLE}>
        Cambiar la contraseña
      </h2>
      <Field name='currentPassword' label='Contraseña actual' type='password' autoComplete='current-password' />
      <Field name='newPassword' label='Contraseña nueva' type='password' autoComplete='new-password' />
      <Field name='confirmPassword' label='Repetí la contraseña nueva' type='password' autoComplete='new-password' />
      <FormFeedback state={state} />
      <SubmitButton pending={pending} idle='Guardar contraseña' busy='Guardando…' />
    </form>
  );
}
