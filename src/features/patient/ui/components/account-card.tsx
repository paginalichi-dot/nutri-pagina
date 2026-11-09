import type { ReactElement, ReactNode } from 'react';
import { PUBLIC_SECONDARY } from '@/components/form/public-form-parts';

export function AccountCard({ title, children }: { title: string; children: ReactNode }): ReactElement {
  return (
    <section className='flex flex-col gap-5 rounded-card bg-background p-6 md:p-8'>
      <h2 className='text-[20px] font-semibold'>{title}</h2>
      {children}
    </section>
  );
}

type SubmitProps = { pending: boolean; idle: string; busy: string };

export function SubmitPill({ pending, idle, busy }: SubmitProps): ReactElement {
  return (
    <button type='submit' disabled={pending} className={`${PUBLIC_SECONDARY} sm:self-start`}>
      {pending ? busy : idle}
    </button>
  );
}
