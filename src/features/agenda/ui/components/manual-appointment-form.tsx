'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { Field, SelectField, SubmitButton } from '@/components/form/form-parts';
import { createManualAppointment } from '../../actions/appointment-changes';
import { NoticePanel } from './notice-panel';
import { SlotPicker } from './slot-picker';

type Option = { id: string; name: string };

export function ManualAppointmentForm({ locationId, slots, insurances }: { locationId: string; slots: Date[]; insurances: Option[] }): ReactElement {
  const [state, action, pending] = useActionState(createManualAppointment, null);
  if (state?.success) return <NoticePanel state={state} />;
  return (
    <form action={action} aria-label='Datos del turno' className='flex flex-col gap-5'>
      <input type='hidden' name='locationId' value={locationId} />
      <SlotPicker slots={slots} />
      <Field name='name' label='Nombre y apellido' autoComplete='off' />
      <Field name='phone' label='Teléfono (WhatsApp)' type='tel' hint='Con código de área, por ejemplo 11 2345-6789.' />
      <Field name='email' label='Email (opcional)' type='email' required={false} hint='Si lo cargás, le llega la confirmación con el turno para su calendario.' />
      <SelectField name='healthInsuranceId' label='Obra social' defaultValue=''>
        <option value=''>Particular</option>
        {insurances.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </SelectField>
      <NoticePanel state={state} />
      <div className='self-start'>
        <SubmitButton pending={pending} idle='Guardar turno' busy='Guardando…' />
      </div>
    </form>
  );
}
