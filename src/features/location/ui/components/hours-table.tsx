'use client';

import { Plus } from 'lucide-react';
import { useActionState, useState } from 'react';
import type { ReactElement } from 'react';
import { FOCUS, FormFeedback, INPUT, SelectField, SubmitButton } from '@/components/form/form-parts';
import { WEEKDAY_NAMES } from '@/lib/argentina-time';
import { addHours } from '../../actions/location-changes';
import type { WeeklyHoursRow } from '../../domain/hours.schema';
import { HoursRow } from './hours-row';

function TimeInput({ name, label }: { name: string; label: string }): ReactElement {
  return (
    <label className='flex flex-col gap-2 text-[15px] font-semibold'>
      {label}
      <input name={name} type='time' required step={300} className={INPUT} />
    </label>
  );
}

function AddHoursForm({ locationId }: { locationId: string }): ReactElement {
  const [state, action, pending] = useActionState(addHours, null);
  return (
    <form action={action} aria-label='Agregar una franja' className='flex flex-col gap-4 rounded-panel bg-muted p-4'>
      <input type='hidden' name='locationId' value={locationId} />
      <div className='grid gap-4 sm:grid-cols-3'>
        <SelectField name='weekday' label='Día'>
          {WEEKDAY_NAMES.map((day, index) => (
            <option key={day} value={index + 1}>
              {day}
            </option>
          ))}
        </SelectField>
        <TimeInput name='start' label='Desde' />
        <TimeInput name='end' label='Hasta' />
      </div>
      <FormFeedback state={state} />
      <div className='self-start'>
        <SubmitButton pending={pending} idle='Agregar franja' busy='Agregando…' />
      </div>
    </form>
  );
}

export function HoursTable({ locationId, hours }: { locationId: string; hours: WeeklyHoursRow[] }): ReactElement {
  const [adding, setAdding] = useState(false);
  return (
    <div className='flex flex-col gap-3'>
      <ul aria-label='Horarios por día'>
        {WEEKDAY_NAMES.map((day, index) => {
          const ranges = hours.filter(({ weekday }) => weekday === index + 1);
          if (ranges.length > 0) return ranges.map((range) => <HoursRow key={`${range.id}-${range.version}`} day={day} range={range} />);
          return (
            <li key={day} className='flex min-h-14 items-center gap-4 border-b border-border py-2 last:border-b-0'>
              <span className='w-24 shrink-0 font-semibold capitalize'>{day}</span>
              <span className='text-[15px] text-muted-foreground'>sin atención</span>
            </li>
          );
        })}
      </ul>
      <button type='button' aria-expanded={adding} onClick={() => setAdding(!adding)} className={`flex h-11 items-center gap-2 self-start rounded-control text-[15px] font-semibold underline underline-offset-4 ${FOCUS}`}>
        <Plus aria-hidden='true' className='size-5' strokeWidth={2.5} />
        Agregar horario
      </button>
      {adding ? <AddHoursForm locationId={locationId} /> : null}
    </div>
  );
}
