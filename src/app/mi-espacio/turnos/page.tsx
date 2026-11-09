import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { getMyAppointments } from '@/features/agenda/actions/my-appointments';
import { getMyProfile } from '@/features/patient/actions/patient-queries';
import { AppointmentsSections } from '@/features/patient/ui/components/appointments-sections';
import { MySpaceFooter } from '@/features/patient/ui/components/my-space-footer';
import { MySpaceHeader } from '@/features/patient/ui/components/my-space-header';
import { MySpaceTopBar } from '@/features/patient/ui/components/my-space-top-bar';

export const instant = false;

export const metadata: Metadata = { title: 'Tus turnos · Lisandro López', robots: { index: false, follow: false } };

export default async function MyAppointmentsPage(): Promise<ReactElement> {
  const [profile, appointments] = await Promise.all([getMyProfile(), getMyAppointments()]);
  return (
    <div className='flex min-h-svh flex-col bg-muted'>
      <MySpaceTopBar name={profile.name} />
      <main className='mx-auto flex w-full max-w-[800px] flex-1 flex-col gap-8 px-4 py-10 md:px-6 md:py-12'>
        <MySpaceHeader name={profile.name} back={{ href: '/mi-espacio', label: 'Volver a Mi espacio' }} />
        <AppointmentsSections {...appointments} />
      </main>
      <MySpaceFooter />
    </div>
  );
}
