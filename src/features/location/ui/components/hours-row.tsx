'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useActionState, useState } from 'react';
import type { ReactElement } from 'react';
import { ErrorMessage, FOCUS, FormFeedback, INPUT, SECONDARY_BUTTON, SubmitButton } from '@/components/form/form-parts';
import type { ActionResult } from '@/lib/action-result';
import { minutesToTime } from '@/lib/argentina-time';
import { deleteHours, updateHours } from '../../actions/location-changes';
import type { WeeklyHoursRow } from '../../domain/hours.schema';

export const ICON_BUTTON = `hover-shade flex size-11 shrink-0 items-center justify-center rounded-control disabled:opacity-70 ${FOCUS}`;

function EditRange({ range, onDone }: { range: WeeklyHoursRow; onDone: () => void }): ReactElement {
  const save = async (previous: ActionResult | null, formData: FormData): Promise<ActionResult> => {
    const result = await updateHours(previous, formData);
    if (result.success) onDone();
    return result;
  };
  const [state, action, pending] = useActionState(save, null);
  return (
    <form action={action} aria-label='Editar la franja' className='flex flex-1 flex-col gap-3'>
      <input type='hidden' name='id' value={range.id} />
      <input type='hidden' name='version' value={range.version} />
      <div className='flex flex-wrap items-center gap-2'>
        <input name='start' type='time' step={300} required aria-label='Desde' defaultValue={minutesToTime(range.startMinute)} className={`${INPUT} w-32`} />
        <input name='end' type='time' step={300} required aria-label='Hasta' defaultValue={minutesToTime(range.endMinute)} className={`${INPUT} w-32`} />
        <SubmitButton pending={pending} idle='Guardar' busy='Guardando…' />
        <button type='button' onClick={onDone} className={SECONDARY_BUTTON}>
          Cancelar
        </button>
      </div>
      <FormFeedback state={state} />
    </form>
  );
}

function DeleteRange({ range, label }: { range: WeeklyHoursRow; label: string }): ReactElement {
  const [state, action, pending] = useActionState(deleteHours, null);
  return (
    <form action={action} className='flex flex-col items-end'>
      <input type='hidden' name='id' value={range.id} />
      <input type='hidden' name='version' value={range.version} />
      <button type='submit' disabled={pending} aria-label={`Borrar ${label}`} className={ICON_BUTTON}>
        <Trash2 aria-hidden='true' className='size-5' strokeWidth={2} />
      </button>
      {state && !state.success ? <ErrorMessage>{state.error}</ErrorMessage> : null}
    </form>
  );
}

export function HoursRow({ day, range }: { day: string; range: WeeklyHoursRow }): ReactElement {
  const [editing, setEditing] = useState(false);
  const text = `${minutesToTime(range.startMinute)} – ${minutesToTime(range.endMinute)}`;
  const label = `la franja del ${day} de ${text}`;
  return (
    <li className='flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 border-b border-border py-2 last:border-b-0'>
      <span className='w-24 shrink-0 font-semibold capitalize'>{day}</span>
      {editing ? <EditRange range={range} onDone={() => setEditing(false)} /> : <span className='flex-1 font-medium'>{text}</span>}
      {editing ? null : (
        <span className='flex items-center'>
          <button type='button' aria-label={`Editar ${label}`} onClick={() => setEditing(true)} className={ICON_BUTTON}>
            <Pencil aria-hidden='true' className='size-5' strokeWidth={2} />
          </button>
          <DeleteRange range={range} label={label} />
        </span>
      )}
    </li>
  );
}
