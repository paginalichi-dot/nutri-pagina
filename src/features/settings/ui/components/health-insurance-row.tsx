'use client';

import { Pencil } from 'lucide-react';
import { useActionState, useState } from 'react';
import type { ReactElement } from 'react';
import { ErrorMessage, FOCUS, FormFeedback, INPUT, SubmitButton } from '@/components/form/form-parts';
import type { ActionResult } from '@/lib/action-result';
import { renameHealthInsurance, setHealthInsuranceActive } from '../../actions/settings-changes';
import type { HealthInsuranceUsage } from '../../domain/settings.schema';

function RenameForm({ row, onDone }: { row: HealthInsuranceUsage; onDone: () => void }): ReactElement {
  const rename = async (previous: ActionResult | null, formData: FormData): Promise<ActionResult> => {
    const result = await renameHealthInsurance(previous, formData);
    if (result.success) onDone();
    return result;
  };
  const [state, action, pending] = useActionState(rename, null);
  return (
    <form action={action} aria-label={`Nombre de ${row.name}`} className='flex flex-1 flex-col gap-3'>
      <input type='hidden' name='id' value={row.id} />
      <input type='hidden' name='version' value={row.version} />
      <div className='flex flex-col gap-3 sm:flex-row'>
        <input name='name' aria-label='Nombre' defaultValue={row.name} required maxLength={60} className={INPUT} />
        <SubmitButton pending={pending} idle='Guardar' busy='Guardando…' />
      </div>
      <FormFeedback state={state} />
    </form>
  );
}

function ActiveSwitch({ row }: { row: HealthInsuranceUsage }): ReactElement {
  const [state, action, pending] = useActionState(setHealthInsuranceActive, null);
  return (
    <form action={action} className='flex flex-col items-end gap-2'>
      <input type='hidden' name='id' value={row.id} />
      <input type='hidden' name='version' value={row.version} />
      <input type='hidden' name='active' value={String(!row.active)} />
      <button type='submit' role='switch' aria-checked={row.active} aria-label={`Ofrecer ${row.name}`} disabled={pending} className={`group flex h-11 w-14 items-center justify-center rounded-control disabled:opacity-70 ${FOCUS}`}>
        <span className='flex h-7 w-12 items-center rounded-full bg-border p-1 transition-colors duration-200 group-aria-checked:bg-foreground'>
          <span className='size-5 rounded-full bg-background shadow-halo transition-transform duration-200 ease-(--ease-out) group-aria-checked:translate-x-5 group-aria-checked:bg-primary' />
        </span>
      </button>
      {state && !state.success ? <ErrorMessage>{state.error}</ErrorMessage> : null}
    </form>
  );
}

export function HealthInsuranceRow({ row }: { row: HealthInsuranceUsage }): ReactElement {
  const [editing, setEditing] = useState(false);
  return (
    <li className={`flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border py-3 ${row.active ? '' : 'text-muted-foreground'}`}>
      {editing ? <RenameForm row={row} onDone={() => setEditing(false)} /> : <span className='min-w-0 flex-1 font-semibold break-words sm:flex-none sm:basis-44'>{row.name}</span>}
      <span className='rounded-full bg-secondary px-3 py-1 text-[13px] font-medium text-muted-foreground'>
        {row.appointments} {row.appointments === 1 ? 'turno' : 'turnos'}
      </span>
      <div className='ml-auto flex items-center gap-1'>
        <ActiveSwitch row={row} />
        <button type='button' aria-label={`Renombrar ${row.name}`} aria-pressed={editing} onClick={() => setEditing(!editing)} className={`hover-shade flex size-11 items-center justify-center rounded-control ${FOCUS}`}>
          <Pencil aria-hidden='true' className='size-5' strokeWidth={2} />
        </button>
      </div>
    </li>
  );
}
