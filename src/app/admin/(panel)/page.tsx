import Link from 'next/link';
import type { ReactElement } from 'react';
import { logout } from '@/features/auth/actions/logout';

const SECONDARY =
  'flex h-12 items-center rounded-full bg-secondary px-6 font-medium text-secondary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground';

export default function PanelPage(): ReactElement {
  return (
    <main className='mx-auto flex w-full max-w-5xl flex-1 flex-col items-start gap-6 px-4 py-10 md:px-20'>
      <h1 className='text-[28px] font-medium md:text-[38.4px]'>Panel</h1>
      <div className='flex flex-wrap gap-3'>
        <Link href='/admin/cuenta' className={SECONDARY}>
          Mi cuenta
        </Link>
        <form action={logout}>
          <button type='submit' className={SECONDARY}>
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
