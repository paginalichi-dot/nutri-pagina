import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { PanelPage } from '@/components/panel/panel-page';
import { getPendingRequests } from '@/features/agenda/actions/agenda-queries';
import { RequestList } from '@/features/agenda/ui/components/request-list';

export const metadata: Metadata = { title: 'Solicitudes · Panel' };

export default async function RequestsPage(): Promise<ReactElement> {
  const requests = await getPendingRequests();
  return (
    <PanelPage title='Solicitudes' lead='Turnos que pidieron los pacientes y esperan tu confirmación.' back={{ href: '/admin', label: 'Volver a la agenda' }}>
      <RequestList requests={requests} />
    </PanelPage>
  );
}
