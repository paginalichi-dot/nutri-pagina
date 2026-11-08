import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { ErrorMessage, SECONDARY_BUTTON } from '@/components/form/form-parts';
import type { ActionResult } from '@/lib/action-result';
import type { NoticeData } from '../../actions/appointment-changes';

export function WhatsappLink({ href, label = 'Avisar por WhatsApp' }: { href: string; label?: string }): ReactElement {
  return (
    <a href={href} target='_blank' rel='noopener noreferrer' className={SECONDARY_BUTTON}>
      <MessageCircle aria-hidden='true' className='size-5' strokeWidth={2} />
      {label}
    </a>
  );
}

export function NoticePanel({ state, showLink = true }: { state: ActionResult<NoticeData> | null; showLink?: boolean }): ReactElement | null {
  if (!state) return null;
  if (!state.success) return <ErrorMessage>{state.error}</ErrorMessage>;
  return (
    <div role='status' className='flex flex-col items-start gap-4 rounded-panel bg-confirmed p-5'>
      <p className='font-medium'>{state.message}</p>
      <div className='flex flex-wrap gap-3'>
        <WhatsappLink href={state.data.whatsappUrl} />
        {showLink ? (
          <Link href={`/admin/turnos/${state.data.appointmentId}`} className={SECONDARY_BUTTON}>
            Ver el turno
          </Link>
        ) : null}
      </div>
    </div>
  );
}
