'use client';

import { useActionState, useState } from 'react';
import type { ReactElement } from 'react';
import { FormFeedback, INPUT, SECONDARY_BUTTON, SubmitButton } from '@/components/form/form-parts';
import { saveSlotMinutes } from '../../actions/settings-changes';
import type { AgendaSettingsRow } from '../../domain/settings.schema';

const PRESETS = [30, 45, 60, 90] as const;

export function SlotMinutesForm({ settings }: { settings: AgendaSettingsRow | null }): ReactElement {
  const [state, action, pending] = useActionState(saveSlotMinutes, null);
  const [minutes, setMinutes] = useState(settings ? String(settings.slotMinutes) : '');
  return (
    <form action={action} aria-label='Duración de los turnos' className='flex flex-col gap-5'>
      <input type='hidden' name='version' value={settings?.version ?? 0} />
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
        <div role='group' aria-label='Duraciones comunes' className='grid grid-cols-2 gap-3 sm:flex'>
          {PRESETS.map((preset) => (
            <button key={preset} type='button' aria-pressed={minutes === String(preset)} onClick={() => setMinutes(String(preset))} className={`${SECONDARY_BUTTON} aria-pressed:bg-primary`}>
              {preset} minutos
            </button>
          ))}
        </div>
        <span aria-hidden='true' className='hidden h-10 w-px bg-border lg:block' />
        <div className='flex items-center gap-3'>
          <label className='flex flex-col gap-2 text-[15px] font-semibold'>
            <span className='sr-only'>Minutos por turno</span>
            <input name='slotMinutes' inputMode='numeric' autoComplete='off' required value={minutes} onChange={(event) => setMinutes(event.target.value)} placeholder='Minutos, por ejemplo 50' className={`${INPUT} w-56`} />
          </label>
          <span aria-hidden='true' className='text-[15px] text-muted-foreground'>
            minutos
          </span>
        </div>
      </div>
      <p className='text-[15px] text-muted-foreground'>Los turnos ya reservados conservan su duración.</p>
      {settings ? null : <p className='font-medium text-destructive'>Mientras no la definas, la agenda no ofrece horarios.</p>}
      <FormFeedback state={state} />
      <div className='self-end'>
        <SubmitButton pending={pending} idle='Guardar cambios' busy='Guardando…' />
      </div>
    </form>
  );
}
