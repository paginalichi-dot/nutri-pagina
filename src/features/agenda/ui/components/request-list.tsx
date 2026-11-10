import { Clock, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { FOCUS } from '@/components/form/form-parts';
import { PanelCard } from '@/components/panel/panel-page';
import { whenText } from '@/lib/argentina-time';
import type { AppointmentRow } from '../../domain/appointment.schema';
import { AppointmentActions } from './appointment-actions';

const ICON = 'size-5 shrink-0';

function Request({ request }: { request: AppointmentRow }): ReactElement {
  return (
    <PanelCard title={request.patientName}>
      <ul className='flex flex-col gap-2 text-[15px]'>
        <li className='flex items-center gap-3'>
          <Clock aria-hidden='true' className={ICON} strokeWidth={2} />
          {whenText(request.startsAt)}
        </li>
        <li className='flex items-center gap-3'>
          <MapPin aria-hidden='true' className={ICON} strokeWidth={2} />
          {request.locationName} · {request.healthInsuranceName ?? 'Particular'}
        </li>
        <li className='flex items-center gap-3'>
          <Phone aria-hidden='true' className={ICON} strokeWidth={2} />
          {request.patientPhone}
        </li>
      </ul>
      <AppointmentActions id={request.id} version={request.version} upcoming started={false} pending />
      <Link href={`/admin/turnos/${request.id}`} className={`flex min-h-11 items-center self-start rounded-sm text-[15px] font-semibold underline underline-offset-4 ${FOCUS}`}>
        Ver el turno
      </Link>
    </PanelCard>
  );
}

export function RequestList({ requests }: { requests: readonly AppointmentRow[] }): ReactElement {
  if (requests.length === 0) {
    return (
      <PanelCard>
        <p className='text-muted-foreground'>No tenés solicitudes por confirmar.</p>
      </PanelCard>
    );
  }
  return (
    <ul className='flex flex-col gap-4'>
      {requests.map((request) => (
        <li key={request.id}>
          <Request request={request} />
        </li>
      ))}
    </ul>
  );
}
