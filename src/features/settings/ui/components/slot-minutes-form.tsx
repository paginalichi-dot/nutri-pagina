'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { FormFeedback, INPUT, SubmitButton } from '@/components/form/form-parts';
import { saveSlotMinutes } from '../../actions/settings-changes';
import type { AgendaSettingsRow } from '../../domain/settings.schema';

export function SlotMinutesForm({ settings }: { settings: AgendaSettingsRow | null }): ReactElement {
  const [state, action, pending] = useActionState(saveSlotMinutes, null);
  return (
    <form action={action} aria-label='Duración de los turnos' className='flex flex-col gap-5'>
      <input type='hidden' name='version' value={settings?.version ?? 0} />
      <label className='flex max-w-xs flex-col gap-2 text-[15px] font-semibold'>
        Minutos por turno
        <input name='slotMinutes' type='number' min={15} max={120} step={5} required defaultValue={settings?.slotMinutes} className={INPUT} />
        <span className='text-[13px] font-medium text-muted-foreground'>De 15 a 120, de a 5. Los turnos ya reservados conservan su duración.</span>
      </label>
      {settings ? null : <p className='font-medium text-destructive'>Mientras no la definas, la agenda no ofrece horarios.</p>}
      <FormFeedback state={state} />
      <div className='self-start'>
        <SubmitButton pending={pending} idle='Guardar duración' busy='Guardando…' />
      </div>
    </form>
  );
}
