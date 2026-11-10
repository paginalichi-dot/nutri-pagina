import { Mail } from 'lucide-react';
import type { ReactElement } from 'react';

export function RemindersCard(): ReactElement {
  return (
    <section aria-labelledby='reminders-title' className='flex items-center gap-5 rounded-card bg-background p-6 md:px-8'>
      <span aria-hidden='true' className='flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'>
        <Mail className='size-6' />
      </span>
      <div className='flex flex-col gap-1'>
        <h2 id='reminders-title' className='text-[17px] font-semibold'>
          Recordatorios
        </h2>
        <p className='text-[15px] text-muted-foreground'>Te avisamos por email 24 h antes de tu turno.</p>
      </div>
    </section>
  );
}
