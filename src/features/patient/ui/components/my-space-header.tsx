import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { firstName } from './first-name';

const MARK = 'bg-[linear-gradient(transparent_70%,var(--primary)_70%,var(--primary)_88%,transparent_88%)]';

type Props = { name: string; back?: { href: string; label: string } };

export function MySpaceHeader({ name, back = { href: '/', label: 'Volver al inicio' } }: Props): ReactElement {
  return (
    <header className='flex flex-col gap-3'>
      <h1 className='text-[34px] leading-tight font-bold md:text-[48px]'>
        Hola, <span className={MARK}>{firstName(name)}</span>
      </h1>
      <Link href={back.href} className={`relative flex items-center gap-2 self-start rounded-sm text-[15px] font-medium text-muted-foreground after:absolute after:-inset-x-2 after:-inset-y-[11px] ${FOCUS}`}>
        <ArrowLeft aria-hidden='true' className='size-4' />
        {back.label}
      </Link>
    </header>
  );
}
