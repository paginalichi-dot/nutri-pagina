import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

type PanelPageProps = { title: ReactNode; lead?: string; back?: { href: string; label: string }; actions?: ReactNode; children: ReactNode };

export function PanelPage({ title, lead, back, actions, children }: PanelPageProps): ReactElement {
  return (
    <main className='mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-10 md:py-10'>
      {back ? (
        <Link
          href={back.href}
          className='self-start text-[15px] font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
        >
          {back.label}
        </Link>
      ) : null}
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-[28px] leading-tight font-bold md:text-[32px]'>{title}</h1>
          {lead ? <p className='text-muted-foreground'>{lead}</p> : null}
        </div>
        {actions ? <div className='flex flex-wrap gap-3'>{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}

export function PanelCard({ title, children }: { title?: string; children: ReactNode }): ReactElement {
  return (
    <section className='flex flex-col gap-5 rounded-panel bg-background p-5 md:p-8'>
      {title ? <h2 className='text-[19px] font-medium md:text-[20px]'>{title}</h2> : null}
      {children}
    </section>
  );
}
