import { LogOut } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { BrandLogo } from '@/components/auth/brand-logo';
import { FOCUS } from '@/components/form/form-parts';
import { logoutPatient } from '../../actions/logout-patient';
import { firstName } from './first-name';

const LOGOUT = `hover-shade hover-shade-on-dark flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[15px] font-semibold text-background ${FOCUS}`;

export function MySpaceTopBar({ name }: { name: string }): ReactElement {
  return (
    <div className='border-b border-border bg-muted'>
      <div className='mx-auto flex w-full max-w-[1100px] items-center justify-between gap-4 px-4 py-3 md:px-6'>
        <Link href='/' className={`flex items-center gap-3 rounded-full ${FOCUS}`}>
          <BrandLogo alt='' className='size-10' />
          <span className='hidden text-[14px] font-semibold tracking-[1px] uppercase sm:inline'>Lic. Lisandro López</span>
        </Link>
        <div className='flex items-center gap-3'>
          <form action={logoutPatient}>
            <button type='submit' className={LOGOUT}>
              <LogOut aria-hidden='true' className='size-5' />
              Cerrar sesión
            </button>
          </form>
          <span aria-hidden='true' className='flex size-11 items-center justify-center rounded-full bg-primary text-[17px] font-bold'>
            {firstName(name).charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
