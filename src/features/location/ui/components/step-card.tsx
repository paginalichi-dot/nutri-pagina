import type { ChangeEvent, ReactElement, ReactNode } from 'react';

type StepCardProps = { step: number; title: string; lead?: string; children: ReactNode };

export function StepCard({ step, title, lead, children }: StepCardProps): ReactElement {
  const id = `paso-${step}`;
  return (
    <section aria-labelledby={id} className='flex flex-col gap-5 rounded-card bg-background p-5 md:p-8'>
      <div className='flex items-start gap-4'>
        <span aria-hidden='true' className='flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-[15px] font-bold text-primary'>
          {step}
        </span>
        <div className='flex flex-col gap-1 pt-1'>
          <h2 id={id} className='text-[19px] leading-tight font-semibold md:text-[20px]'>
            {title}
          </h2>
          {lead ? <p className='text-[15px] text-muted-foreground'>{lead}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

type SwitchProps = { label: string; name?: string; checked?: boolean; defaultChecked?: boolean; onChange?: (event: ChangeEvent<HTMLInputElement>) => void };

export function Switch({ label, name, checked, defaultChecked, onChange }: SwitchProps): ReactElement {
  return (
    <label className='group relative flex h-11 w-14 shrink-0 cursor-pointer items-center justify-center rounded-control has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground'>
      <input type='checkbox' role='switch' aria-label={label} name={name} value='true' checked={checked} defaultChecked={defaultChecked} onChange={onChange} className='peer absolute inset-0 z-10 cursor-pointer appearance-none opacity-0' />
      <span aria-hidden='true' className='flex h-7 w-12 items-center rounded-full bg-border p-1 transition-colors duration-200 peer-checked:bg-foreground'>
        <span className='size-5 rounded-full bg-background shadow-halo transition-transform duration-200 ease-(--ease-out) group-has-checked:translate-x-5 group-has-checked:bg-primary' />
      </span>
    </label>
  );
}
