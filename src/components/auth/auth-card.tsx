import type { ReactElement, ReactNode } from 'react';

type Props = { title: ReactNode; lead?: string; children: ReactNode };

export function AuthCard({ title, lead, children }: Props): ReactElement {
  return (
    <div className='auth-glow w-full max-w-[440px]'>
      <section className='flex flex-col gap-6 rounded-card bg-background p-6 shadow-halo md:p-10'>
        <header className='flex flex-col gap-2'>
          <h1 className='text-[28px] leading-tight font-medium md:text-[34px]'>{title}</h1>
          {lead ? <p className='text-[16px] font-medium text-muted-foreground'>{lead}</p> : null}
        </header>
        {children}
      </section>
    </div>
  );
}

export function AuthPage({ children }: { children: ReactNode }): ReactElement {
  return <main className='flex min-h-svh items-center justify-center overflow-x-clip bg-muted px-4 py-16 md:px-8'>{children}</main>;
}
