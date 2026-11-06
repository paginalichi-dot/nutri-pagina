import Link from 'next/link';
import type { ReactElement } from 'react';

function ArrowDisc(): ReactElement {
  return (
    <span className='flex size-10 items-center justify-center rounded-full bg-background text-foreground'>
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        className='size-5'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M5 12h14M13 6l6 6-6 6' />
      </svg>
    </span>
  );
}

export function AccessDenied(): ReactElement {
  return (
    <main className='flex flex-1 items-center justify-center bg-muted px-4 py-16'>
      <section className='flex w-full max-w-xl flex-col items-start gap-6 rounded-card bg-background p-6 md:p-10'>
        <h1 className='text-[28px] leading-snug font-medium md:text-[38.4px]'>
          Acceso <strong className='font-bold underline decoration-primary decoration-4 underline-offset-8'>denegado</strong>
        </h1>
        <p className='text-lg text-muted-foreground'>Esta sección es privada.</p>
        <Link
          href='/'
          className='flex h-16 items-center gap-4 rounded-full bg-primary pr-3 pl-8 text-[17px] font-medium text-primary-foreground shadow-halo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:text-lg'
        >
          Volver al inicio
          <ArrowDisc />
        </Link>
      </section>
    </main>
  );
}
