'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { ReactElement } from 'react';
import { PRIMARY_BUTTON } from '@/components/form/form-parts';
import { confirmAppointment } from '../../actions/appointment-changes';
import { ConfirmForm } from './confirm-button';
import { NoticePanel, WhatsappLink } from './notice-panel';

type NextActionsProps = { id: string; version: number; canConfirm: boolean; whatsappUrl: string };

export function NextAppointmentActions({ id, version, canConfirm, whatsappUrl }: NextActionsProps): ReactElement {
  const [state, confirm, busy] = useActionState(confirmAppointment, null);
  if (state?.success) return <NoticePanel state={state} showLink={false} />;
  return (
    <div className='flex flex-col gap-3'>
      <div className='grid grid-cols-2 gap-3'>
        {canConfirm ? (
          <ConfirmForm id={id} version={version} action={confirm} busy={busy} />
        ) : (
          <Link href={`/admin/turnos/${id}`} className={PRIMARY_BUTTON}>
            Ver turno
          </Link>
        )}
        <WhatsappLink href={whatsappUrl} label='WhatsApp' />
      </div>
      <NoticePanel state={state} />
    </div>
  );
}
