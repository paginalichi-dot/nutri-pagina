import { ArrowLeft } from 'lucide-react';
import Form from 'next/form';
import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';
import { ArrowDisc } from '@/components/arrow-disc';
import { FOCUS } from '@/components/form/form-parts';

export const STEP_TITLE = 'text-[22px] font-bold md:text-[26px]';

const CONTINUE = `flex h-12 items-center gap-3 rounded-full bg-border pr-1.5 pl-6 text-[16px] font-semibold text-muted-foreground transition-colors group-has-[:checked]:bg-foreground group-has-[:checked]:text-background ${FOCUS}`;

export function StepFooter({ back, children }: { back: string | null; children: ReactNode }): ReactElement {
  return (
    <div className='mt-2 flex items-center justify-between gap-4 border-t border-border pt-6'>
      {back ? (
        <Link href={back} className={`flex min-h-11 items-center gap-2 rounded-full px-2 text-[16px] font-semibold ${FOCUS}`}>
          <ArrowLeft aria-hidden='true' className='size-5' />
          Atrás
        </Link>
      ) : (
        <span />
      )}
      {children}
    </div>
  );
}

type StepFormProps = { action: string; title: string; lead?: string; hidden: Readonly<Record<string, string>>; back: string | null; children: ReactNode };

export function StepForm({ action, title, lead, hidden, back, children }: StepFormProps): ReactElement {
  return (
    <Form action={action} aria-labelledby='paso-titulo' className='group flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h2 id='paso-titulo' className={STEP_TITLE}>
          {title}
        </h2>
        {lead ? <p className='text-[15px] text-muted-foreground'>{lead}</p> : null}
      </div>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type='hidden' name={name} value={value} />
      ))}
      {children}
      <StepFooter back={back}>
        <button type='submit' className={CONTINUE}>
          Continuar
          <ArrowDisc className='size-9 bg-primary text-primary-foreground' />
        </button>
      </StepFooter>
    </Form>
  );
}
