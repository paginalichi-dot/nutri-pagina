'use client';

import Link from 'next/link';
import { type ReactElement, useActionState } from 'react';
import { register } from '@/features/patient/actions/register';
import { FormFeedback } from '@/components/form/form-parts';
import { PasswordField } from '@/components/form/password-field';
import { Honeypot, PUBLIC_LINK, PUBLIC_PRIMARY, PublicField } from '@/components/form/public-form-parts';
import { AuthDone } from '@/components/auth/auth-done';

export function RegisterForm(): ReactElement {
  const [state, action, pending] = useActionState(register, null);
  if (state?.success) return <AuthDone message={state.message ?? 'Listo.'} />;
  return (
    <form action={action} className='flex flex-col gap-5'>
      <PublicField name='name' label='Nombre y apellido' autoComplete='name' />
      <PublicField name='email' label='Email' type='email' autoComplete='email' placeholder='tu@email.com' />
      <PublicField name='phone' label='Teléfono (WhatsApp)' type='tel' autoComplete='tel' placeholder='11 2345-6789' />
      <PasswordField name='password' label='Contraseña' autoComplete='new-password' hint='Al menos 8 caracteres.' />
      <label className='flex items-start gap-3 text-[15px] font-medium'>
        <input type='checkbox' name='consent' required className='mt-0.5 size-5 shrink-0 accent-foreground' />
        <span>
          Leí y acepto la{' '}
          <Link href='/privacidad' className={PUBLIC_LINK}>
            política de privacidad
          </Link>
        </span>
      </label>
      <Honeypot />
      <FormFeedback state={state} />
      <button type='submit' disabled={pending} className={PUBLIC_PRIMARY}>
        {pending ? 'Creando…' : 'Crear mi cuenta'}
      </button>
    </form>
  );
}
