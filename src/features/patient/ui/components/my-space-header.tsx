import Link from 'next/link';
import type { ReactElement } from 'react';
import { PUBLIC_LINK, PUBLIC_SECONDARY } from '@/components/form/public-form-parts';
import { logoutPatient } from '../../actions/logout-patient';
import { firstName } from './first-name';

const MARK = 'bg-[linear-gradient(transparent_62%,var(--primary)_62%,var(--primary)_88%,transparent_88%)]';

export function MySpaceHeader({ name }: { name: string }): ReactElement {
  return (
    <header className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
      <div className='flex flex-col gap-3'>
        <h1 className='text-[28px] font-medium md:text-[38.4px]'>
          Hola, <strong className={`font-bold ${MARK}`}>{firstName(name)}</strong>
        </h1>
        <Link href='/' className={`${PUBLIC_LINK} relative self-start text-[15px] after:absolute after:-inset-x-2 after:-inset-y-[11px]`}>
          Volver al inicio
        </Link>
      </div>
      <form action={logoutPatient}>
        <button type='submit' className={PUBLIC_SECONDARY}>
          Cerrar sesión
        </button>
      </form>
    </header>
  );
}
