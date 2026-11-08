import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { ChangeEmailForm, ChangePasswordForm } from '@/features/auth/ui/components/account-forms';

export const metadata: Metadata = { title: 'Mi cuenta · Panel' };

export default function AccountPage(): ReactElement {
  return (
    <main className='mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 md:px-20'>
      <Link href='/admin' className='self-start text-[15px] font-semibold underline underline-offset-4'>
        Volver al panel
      </Link>
      <h1 className='text-[28px] font-medium md:text-[38.4px]'>
        Mi <strong className='font-bold'>cuenta</strong>
      </h1>
      <p className='text-muted-foreground'>Cualquiera de los dos cambios cierra la sesión en los demás dispositivos.</p>
      <ChangeEmailForm />
      <ChangePasswordForm />
    </main>
  );
}
