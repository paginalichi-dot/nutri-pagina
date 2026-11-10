import type { LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';
import { ArrowDisc } from '@/components/arrow-disc';
import type { Modality } from './booking-model';

export type ModalityOption = { modality: Modality; icon: LucideIcon; title: string; lead: string; chips: readonly string[]; cta: string };

const GLOW = 'shadow-[0_12px_32px_-10px_var(--primary)]';

export function PanelContent({ option, available }: { option: ModalityOption; available: boolean }): ReactElement {
  const { modality, icon: Icon } = option;
  const dark = modality === 'presencial';
  return (
    <>
      <Icon aria-hidden='true' strokeWidth={1} className={`pointer-events-none absolute -top-6 size-64 opacity-[0.07] md:top-10 md:size-80 ${dark ? '-right-10' : '-left-10'}`} />
      <span aria-hidden='true' className='pointer-events-none absolute -bottom-24 left-1/3 size-80 rounded-full bg-primary/15 blur-3xl' />
      <div className='relative flex flex-col items-start gap-6'>
        <span aria-hidden='true' className={`flex size-20 items-center justify-center rounded-input bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105 ${GLOW}`}>
          <Icon className='size-9' strokeWidth={1.75} />
        </span>
        <h2 className='text-[48px] leading-none font-medium md:text-[72px]'>{option.title}</h2>
        <p id={`modalidad-${modality}`} className='max-w-sm text-[17px] text-muted-foreground md:text-lg'>
          {option.lead}
        </p>
        <ul aria-label={`Qué incluye la consulta ${option.title.toLowerCase()}`} className='flex flex-wrap gap-2'>
          {option.chips.map((chip) => (
            <li key={chip} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${dark ? 'border-line-on-dark' : 'border-border bg-secondary'}`}>
              {chip}
            </li>
          ))}
        </ul>
        {available ? (
          <span aria-hidden='true' className={`mt-2 flex h-16 items-center gap-4 rounded-full bg-primary pr-2.5 pl-8 text-[17px] font-semibold text-primary-foreground md:text-lg ${GLOW}`}>
            {option.cta}
            <ArrowDisc className='size-11 bg-primary-foreground text-primary transition-transform duration-300 group-hover:translate-x-1' />
          </span>
        ) : (
          <p className='mt-2 text-[16px] font-semibold'>{`Por ahora no hay turnos ${option.title.toLowerCase()}es.`}</p>
        )}
      </div>
    </>
  );
}
