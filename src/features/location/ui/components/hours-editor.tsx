'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { ActionButton } from '@/components/form/action-button';
import { FormFeedback, INPUT, SelectField, SubmitButton } from '@/components/form/form-parts';
import { minutesToTime, WEEKDAY_NAMES } from '@/lib/argentina-time';
import { addHours, deleteHours } from '../../actions/location-changes';
import type { WeeklyHoursRow } from '../../domain/hours.schema';

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
    <form action={action} aria-label='Agregar una franja' className='flex flex-col gap-4 border-t border-border pt-5'>
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
        <SubmitButton pending={pending} idle='Agregar franja' busy='Agregando…' secondary />
      </div>
    </form>
  );
}

function DayRow({ weekday, hours }: { weekday: number; hours: WeeklyHoursRow[] }): ReactElement {
  const ranges = hours.filter((range) => range.weekday === weekday);
  return (
    <li className='flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-start'>
      <span className='w-28 shrink-0 font-semibold capitalize sm:leading-11'>{WEEKDAY_NAMES[weekday - 1]}</span>
      {ranges.length === 0 ? <span className='text-muted-foreground sm:leading-11'>No atendés</span> : null}
      <ul className='flex flex-col gap-3'>
        {ranges.map((range) => (
          <li key={range.id} className='flex flex-wrap items-center gap-4'>
            <span>
              {minutesToTime(range.startMinute)} a {minutesToTime(range.endMinute)}
            </span>
            <ActionButton action={deleteHours} fields={{ id: range.id, version: String(range.version) }} label='Borrar' busy='Borrando…' />
          </li>
        ))}
      </ul>
    </li>
  );
}

export function HoursEditor({ locationId, hours }: { locationId: string; hours: WeeklyHoursRow[] }): ReactElement {
  return (
    <div className='flex flex-col gap-2'>
      <ul aria-label='Horarios por día'>
        {WEEKDAY_NAMES.map((day, index) => (
          <DayRow key={day} weekday={index + 1} hours={hours} />
        ))}
      </ul>
      <AddHoursForm locationId={locationId} />
    </div>
  );
}
