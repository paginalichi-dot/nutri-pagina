import { UserRound } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { ArrowDisc } from '@/components/arrow-disc';
import { logoutPatient } from '../../actions/logout-patient';

export type Viewer = { role: 'patient'; name: string } | { role: 'admin' } | null;

const RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
const PILL = `hover-shade flex h-12 items-center justify-between rounded-full bg-primary pr-2 pl-6 text-[16px] font-semibold text-primary-foreground ${RING}`;
const TEXT = 'text-[14px] font-medium text-footer-text';

function Title({ children }: { children: string }): ReactElement {
  return (
    <div className='flex items-center gap-3 text-[18px] font-semibold text-background'>
      <span className='flex size-8 items-center justify-center rounded-full bg-footer-text text-foreground'>
        <UserRound aria-hidden='true' className='size-5' strokeWidth={2} />
      </span>
      {children}
    </div>
  );
}

function Guest(): ReactElement {
  return (
    <>
      <Title>Mi espacio</Title>
      <p className={TEXT}>Accedé a tu espacio personal para gestionar tus consultas y seguimiento.</p>
      <Link href='/login' className={PILL}>
        Iniciar sesión
        <ArrowDisc className='size-8' />
      </Link>
      <hr className='border-line-on-dark' />
      <p className={TEXT}>
        ¿Todavía no tenés una cuenta?{' '}
        <Link href='/registro' className={`rounded-sm font-bold text-primary ${RING}`}>
          Registrate
        </Link>
      </p>
    </>
  );
}

function SignedIn({ greeting, href, label }: { greeting: string; href: string; label: string }): ReactElement {
  return (
    <>
      <Title>{greeting}</Title>
      <Link href={href} className={PILL}>
        {label}
        <ArrowDisc className='size-8' />
      </Link>
    </>
  );
}

export function AccountPanel({ viewer }: { viewer: Viewer }): ReactElement {
  if (!viewer) return <Guest />;
  if (viewer.role === 'admin') return <SignedIn greeting='Hola, Lisandro' href='/admin' label='Ir al panel' />;
  return (
    <>
      <SignedIn greeting={`Hola, ${viewer.name}`} href='/mi-espacio' label='Ir a mi espacio' />
      <hr className='border-line-on-dark' />
      <form action={logoutPatient}>
        <button type='submit' className={`relative rounded-sm text-[14px] font-semibold text-background underline underline-offset-4 after:absolute after:-inset-x-2 after:-inset-y-3 ${RING}`}>
          Cerrar sesión
        </button>
      </form>
    </>
  );
}
