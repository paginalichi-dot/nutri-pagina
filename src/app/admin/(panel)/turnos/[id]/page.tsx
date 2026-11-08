import type { Metadata } from 'next';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { getAppointment } from '@/features/agenda/actions/agenda-queries';
import { AppointmentInfo } from '@/features/agenda/ui/components/appointment-detail';
import { argentinaDay } from '@/lib/format-date-time';

export const metadata: Metadata = { title: 'Turno · Panel' };

export default async function AppointmentPage({ params }: PageProps<'/admin/turnos/[id]'>): Promise<ReactElement> {
  await connection();
  const appointment = await getAppointment((await params).id);
  if (!appointment) notFound();
  return (
    <PanelPage title={`Turno de ${appointment.patientName}`} back={{ href: `/admin?dia=${argentinaDay(appointment.startsAt)}`, label: 'Volver a la agenda' }}>
      <PanelCard>
        <AppointmentInfo appointment={appointment} now={new Date()} />
      </PanelCard>
    </PanelPage>
  );
}
