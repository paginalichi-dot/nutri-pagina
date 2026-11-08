import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { ChangeEmailForm, ChangePasswordForm } from '@/features/auth/ui/components/account-forms';
import { LogoutButton } from '@/features/auth/ui/components/logout-button';

export const metadata: Metadata = { title: 'Mi cuenta · Panel' };

export default function AccountPage(): ReactElement {
  return (
    <main className='mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 md:px-20'>
      <h1 className='text-[28px] font-medium md:text-[38.4px]'>
        Mi <strong className='font-bold'>cuenta</strong>
      </h1>
      <p className='text-muted-foreground'>Cualquiera de los dos cambios cierra la sesión en los demás dispositivos.</p>
      <ChangeEmailForm />
      <ChangePasswordForm />
      <div className='self-start md:hidden'>
        <LogoutButton />
      </div>
    </main>
  );
}
