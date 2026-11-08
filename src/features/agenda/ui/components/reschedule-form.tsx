'use client';

import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { SubmitButton } from '@/components/form/form-parts';
import { rescheduleAppointment } from '../../actions/appointment-changes';
import { NoticePanel } from './notice-panel';
import { SlotPicker } from './slot-picker';

type RescheduleProps = { id: string; version: number; locationId: string; slots: Date[] };

export function RescheduleForm({ id, version, locationId, slots }: RescheduleProps): ReactElement {
  const [state, action, pending] = useActionState(rescheduleAppointment, null);
  if (state?.success) return <NoticePanel state={state} />;
  return (
    <form action={action} aria-label='Nuevo horario' className='flex flex-col gap-5'>
      <input type='hidden' name='id' value={id} />
      <input type='hidden' name='version' value={version} />
      <input type='hidden' name='locationId' value={locationId} />
      <SlotPicker slots={slots} />
      <NoticePanel state={state} />
      <div className='self-start'>
        <SubmitButton pending={pending} idle='Reprogramar' busy='Reprogramando…' />
      </div>
    </form>
  );
}
