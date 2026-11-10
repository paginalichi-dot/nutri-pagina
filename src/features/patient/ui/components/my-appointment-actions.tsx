'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, type ReactElement, useActionState } from 'react';
import { ErrorMessage, FormFeedback } from '@/components/form/form-parts';
import { PUBLIC_LINK, PUBLIC_SECONDARY } from '@/components/form/public-form-parts';
import { cancelMyAppointment } from '@/features/agenda/actions/patient-bookings';

function confirmFirst(event: FormEvent<HTMLFormElement>): void {
  if (!window.confirm('¿Cancelar tu turno? El horario queda libre para otra persona.')) event.preventDefault();
}

type ChangesProps = { id: string; version: number; canChange: boolean; tooLate: boolean; whatsappUrl: string | null };

export function MyAppointmentActions({ id, version, canChange, tooLate, whatsappUrl }: ChangesProps): ReactElement | null {
  const [state, cancel, pending] = useActionState(cancelMyAppointment, null);
  if (state?.success) {
    return (
      <div className='flex flex-col items-start gap-4'>
        <FormFeedback state={state} />
        <Link href='/mi-espacio' className={`${PUBLIC_LINK} flex min-h-11 items-center`}>
          Volver a Mi espacio
        </Link>
      </div>
    );
  }
  if (tooLate) return <TooLateNotice whatsappUrl={whatsappUrl} />;
  if (!canChange) return null;
  return (
    <div className='flex flex-col items-start gap-4'>
      <div className='flex flex-wrap gap-3'>
        <Link href={`/mi-espacio/turnos/${id}/reprogramar`} className={PUBLIC_SECONDARY}>
          Reprogramar
        </Link>
        <form action={cancel} onSubmit={confirmFirst}>
          <input type='hidden' name='id' value={id} />
          <input type='hidden' name='version' value={version} />
          <button type='submit' disabled={pending} className={PUBLIC_SECONDARY}>
            {pending ? 'Cancelando…' : 'Cancelar turno'}
          </button>
        </form>
      </div>
      {state && !state.success ? <ErrorMessage>{state.error}</ErrorMessage> : null}
    </div>
  );
}

function TooLateNotice({ whatsappUrl }: { whatsappUrl: string | null }): ReactElement {
  return (
    <div className='flex flex-col items-start gap-4'>
      <p className='text-[16px]'>Faltan menos de 24 h para tu turno. Para cambiarlo o cancelarlo, escribile a Lisandro.</p>
      {whatsappUrl ? (
        <a href={whatsappUrl} target='_blank' rel='noopener noreferrer' className={`${PUBLIC_SECONDARY} gap-2`}>
          <MessageCircle aria-hidden='true' className='size-5' />
          Escribile por WhatsApp
          <span className='sr-only'> (se abre en otra pestaña)</span>
        </a>
      ) : null}
    </div>
  );
}
