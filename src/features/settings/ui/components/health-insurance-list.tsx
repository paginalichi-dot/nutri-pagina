'use client';

import { Plus } from 'lucide-react';
import { useActionState, useState } from 'react';
import type { ReactElement } from 'react';
import { DARK_BUTTON, FormFeedback, INPUT, PRIMARY_BUTTON } from '@/components/form/form-parts';
import { createHealthInsurance } from '../../actions/settings-changes';
import type { HealthInsuranceUsage } from '../../domain/settings.schema';
import { HealthInsuranceRow } from './health-insurance-row';

function AddForm(): ReactElement {
  const [state, action, pending] = useActionState(createHealthInsurance, null);
  return (
    <form action={action} aria-label='Agregar una obra social' className='flex flex-col gap-3 rounded-panel bg-muted p-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
        <label className='flex flex-1 flex-col gap-2 text-[15px] font-semibold'>
          Nueva obra social
          <input name='name' required maxLength={60} autoComplete='off' className={`${INPUT} bg-background`} />
        </label>
        <button type='submit' disabled={pending} className={DARK_BUTTON}>
          {pending ? 'Agregando…' : 'Agregar'}
        </button>
      </div>
      <FormFeedback state={state} />
    </form>
  );
}

export function HealthInsuranceList({ rows }: { rows: HealthInsuranceUsage[] }): ReactElement {
  const [adding, setAdding] = useState(false);
  return (
    <section aria-labelledby='obras-sociales' className='flex flex-col gap-5 rounded-panel bg-background p-5 md:p-8'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <h2 id='obras-sociales' className='text-[19px] font-semibold md:text-[20px]'>
            Obras sociales
          </h2>
          <p className='text-[15px] text-muted-foreground'>«Particular» siempre aparece como opción. Las desactivadas dejan de ofrecerse.</p>
        </div>
        <button type='button' aria-expanded={adding} onClick={() => setAdding(!adding)} className={PRIMARY_BUTTON}>
          <Plus aria-hidden='true' className='size-5' strokeWidth={2.5} />
          Nueva obra social
        </button>
      </div>
      {adding ? <AddForm /> : null}
      {rows.length === 0 ? <p className='text-muted-foreground'>Todavía no cargaste ninguna.</p> : null}
      <ul aria-label='Obras sociales'>
        {rows.map((row) => (
          <HealthInsuranceRow key={`${row.id}-${row.version}`} row={row} />
        ))}
      </ul>
    </section>
  );
}
