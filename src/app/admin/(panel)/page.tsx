import type { ReactElement } from 'react';
import { logout } from '@/features/auth/actions/logout';

export default function PanelPage(): ReactElement {
  return (
    <main className='mx-auto flex w-full max-w-5xl flex-1 flex-col items-start gap-6 px-4 py-10 md:px-20'>
      <h1 className='text-[28px] font-medium md:text-[38.4px]'>Panel</h1>
      <form action={logout}>
        <button
          type='submit'
          className='h-12 rounded-full bg-secondary px-6 font-medium text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
