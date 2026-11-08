'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { ActionButton } from '@/components/form/action-button';
import { SECONDARY_BUTTON } from '@/components/form/form-parts';
import { cancelAppointment, markAttendance } from '../../actions/appointment-changes';
import { NoticePanel } from './notice-panel';

type ActionsProps = { id: string; version: number; upcoming: boolean; started: boolean };

function confirmFirst(event: FormEvent<HTMLFormElement>): void {
  if (!window.confirm('¿Cancelar este turno? El horario vuelve a quedar libre.')) event.preventDefault();
}

function AttendanceActions({ id, version }: { id: string; version: number }): ReactElement {
  const fields = { id, version: String(version) };
  return (
    <div className='flex flex-wrap items-start gap-3'>
      <ActionButton action={markAttendance} fields={{ ...fields, attended: 'true' }} label='Asistió' busy='Guardando…' />
      <ActionButton action={markAttendance} fields={{ ...fields, attended: 'false' }} label='Ausente' busy='Guardando…' />
    </div>
  );
}

export function AppointmentActions({ id, version, upcoming, started }: ActionsProps): ReactElement | null {
  const [state, cancel, pending] = useActionState(cancelAppointment, null);
  if (state?.success) return <NoticePanel state={state} showLink={false} />;
  if (started) return <AttendanceActions id={id} version={version} />;
  if (!upcoming) return null;
  return (
    <div className='flex flex-col items-start gap-3'>
      <div className='flex flex-wrap items-start gap-3'>
        <Link href={`/admin/turnos/${id}/reprogramar`} className={SECONDARY_BUTTON}>
          Reprogramar
        </Link>
        <form action={cancel} onSubmit={confirmFirst}>
          <input type='hidden' name='id' value={id} />
          <input type='hidden' name='version' value={version} />
          <button type='submit' disabled={pending} className={SECONDARY_BUTTON}>
            {pending ? 'Cancelando…' : 'Cancelar turno'}
          </button>
        </form>
      </div>
      <NoticePanel state={state} />
    </div>
  );
}
