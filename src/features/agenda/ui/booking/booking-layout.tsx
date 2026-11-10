import type { ReactElement, ReactNode } from 'react';

type LayoutProps = { title: ReactNode; lead: string; summary: ReactNode; children: ReactNode };

export function BookingLayout({ title, lead, summary, children }: LayoutProps): ReactElement {
  return (
    <div className='relative isolate flex flex-col gap-8'>
      <span aria-hidden='true' className='pointer-events-none fixed -top-48 -right-48 -z-10 size-[560px] rounded-full bg-primary/15 blur-3xl' />
      <header data-enter='left' className='flex flex-col gap-3 [--enter-delay:80ms]'>
        <h1 className='text-[34px] leading-tight font-medium md:text-[56px]'>{title}</h1>
        <p className='max-w-md text-[17px] text-muted-foreground'>{lead}</p>
      </header>
      <div className='grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]'>
        <div data-enter='left' className='[--enter-delay:240ms] lg:sticky lg:top-6 lg:order-2'>{summary}</div>
        <div data-enter='left' className='rounded-card bg-background px-4 py-6 shadow-[0_24px_60px_-30px_var(--foreground)] [--enter-delay:160ms] sm:p-6 md:p-10'>{children}</div>
      </div>
    </div>
  );
}
