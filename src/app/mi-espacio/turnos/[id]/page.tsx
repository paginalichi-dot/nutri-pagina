import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import type { ReactElement } from 'react';
import { getMyAppointment, lisandroWhatsapp } from '@/features/agenda/actions/booking-queries';
import { isActiveStatus } from '@/features/agenda/domain/appointment.schema';
import { patientCanChange } from '@/features/agenda/domain/patient-change';
import { getMyProfile } from '@/features/patient/actions/patient-queries';
import { MyAppointmentActions } from '@/features/patient/ui/components/my-appointment-actions';
import { MyAppointmentCard } from '@/features/patient/ui/components/my-appointment-card';
import { MySpaceHeader } from '@/features/patient/ui/components/my-space-header';
import { MySpaceShell } from '@/features/patient/ui/components/my-space-shell';
import { whenText } from '@/lib/argentina-time';

export const instant = false;

export const metadata: Metadata = { title: 'Tu turno · Lisandro López', robots: { index: false, follow: false } };

export default async function MyAppointmentPage({ params }: PageProps<'/mi-espacio/turnos/[id]'>): Promise<ReactElement> {
  await connection();
  const { id } = await params;
  const [profile, appointment] = await Promise.all([getMyProfile(), getMyAppointment(id)]);
  if (!appointment) notFound();
  const now = new Date();
  const upcoming = isActiveStatus(appointment.status) && appointment.startsAt > now;
  const canChange = patientCanChange(appointment, now);
  const whatsapp = upcoming && !canChange ? await lisandroWhatsapp(`Hola Lisandro, soy ${profile.name}. Te escribo por mi turno del ${whenText(appointment.startsAt)}.`) : null;
  return (
    <MySpaceShell name={profile.name}>
      <MySpaceHeader name={profile.name} back={{ href: '/mi-espacio/turnos', label: 'Volver a tus turnos' }} />
      <MyAppointmentCard appointment={appointment}>
        <MyAppointmentActions id={appointment.id} version={appointment.version} canChange={canChange} tooLate={upcoming && !canChange} whatsappUrl={whatsapp} />
      </MyAppointmentCard>
    </MySpaceShell>
  );
}
