import type { ReactElement, ReactNode } from 'react';
import { BrandLogo } from './brand-logo';

type Props = { title: ReactNode; lead?: string; centered?: boolean; children: ReactNode };

export function AuthCard({ title, lead, centered = false, children }: Props): ReactElement {
  const align = centered ? 'items-center text-center' : '';
  return (
    <div className='auth-glow w-full max-w-[440px]'>
      <section className='theme-forest flex flex-col gap-6 rounded-card border border-primary/60 bg-background p-6 shadow-halo md:p-10'>
        <header className={`flex flex-col gap-3 ${align}`}>
          <div className='flex items-center gap-3'>
            <BrandLogo alt='' className='size-10' />
            <span className={`text-[14px] font-semibold tracking-[1px] uppercase ${centered ? 'text-primary' : ''}`}>Lic. Lisandro López</span>
          </div>
          <h1 className='text-[28px] leading-tight font-semibold md:text-[34px]'>{title}</h1>
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
