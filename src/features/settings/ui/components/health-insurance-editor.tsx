'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { ActionButton } from '@/components/form/action-button';
import { FormFeedback, INPUT, SubmitButton } from '@/components/form/form-parts';
import { createHealthInsurance, renameHealthInsurance, setHealthInsuranceActive } from '../../actions/settings-changes';
import type { HealthInsuranceRow } from '../../domain/settings.schema';

function AddForm(): ReactElement {
  const [state, action, pending] = useActionState(createHealthInsurance, null);
  return (
    <form action={action} aria-label='Agregar una obra social' className='flex flex-col gap-3'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
        <label className='flex flex-1 flex-col gap-2 text-[15px] font-semibold'>
          Nueva obra social
          <input name='name' required maxLength={60} className={INPUT} />
        </label>
        <SubmitButton pending={pending} idle='Agregar' busy='Agregando…' secondary />
      </div>
      <FormFeedback state={state} />
    </form>
  );
}

function Row({ row }: { row: HealthInsuranceRow }): ReactElement {
  const [state, action, pending] = useActionState(renameHealthInsurance, null);
  return (
    <li className='flex flex-col gap-3 border-b border-border py-4 last:border-b-0 md:flex-row md:items-start md:justify-between'>
      <form action={action} aria-label={`Nombre de ${row.name}`} className='flex flex-1 flex-col gap-3'>
        <input type='hidden' name='id' value={row.id} />
        <input type='hidden' name='version' value={row.version} />
        <div className='flex flex-col gap-3 sm:flex-row'>
          <input name='name' aria-label='Nombre' defaultValue={row.name} required maxLength={60} className={`${INPUT} ${row.active ? '' : 'line-through'}`} />
          <SubmitButton pending={pending} idle='Guardar' busy='Guardando…' secondary />
        </div>
        <FormFeedback state={state} />
      </form>
      <ActionButton
        action={setHealthInsuranceActive}
        fields={{ id: row.id, version: String(row.version), active: String(!row.active) }}
        label={row.active ? 'Desactivar' : 'Reactivar'}
        busy='Guardando…'
      />
    </li>
  );
}

export function HealthInsuranceEditor({ rows }: { rows: HealthInsuranceRow[] }): ReactElement {
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-muted-foreground'>«Particular» siempre aparece como opción: no hace falta cargarla. Las desactivadas dejan de ofrecerse, pero los turnos que ya las tienen las siguen mostrando.</p>
      {rows.length === 0 ? <p className='text-muted-foreground'>Todavía no cargaste ninguna.</p> : null}
      <ul aria-label='Obras sociales'>
        {rows.map((row) => (
          <Row key={row.id} row={row} />
        ))}
      </ul>
      <AddForm />
    </div>
  );
}
