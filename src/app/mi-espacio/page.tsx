import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { getMyAppointments } from '@/features/agenda/actions/my-appointments';
import { getMyProfile } from '@/features/patient/actions/patient-queries';
import { AccountTabs } from '@/features/patient/ui/components/account-tabs';
import { MySpaceFooter } from '@/features/patient/ui/components/my-space-footer';
import { MySpaceHeader } from '@/features/patient/ui/components/my-space-header';
import { MySpaceTopBar } from '@/features/patient/ui/components/my-space-top-bar';
import { RemindersCard } from '@/features/patient/ui/components/reminders-card';
import { UpcomingCard } from '@/features/patient/ui/components/upcoming-card';

export const instant = false;

export const metadata: Metadata = { title: 'Mi espacio · Lisandro López', robots: { index: false, follow: false } };

export default async function MySpacePage(): Promise<ReactElement> {
  const [profile, appointments] = await Promise.all([getMyProfile(), getMyAppointments()]);
  return (
    <div className='flex min-h-svh flex-col bg-muted'>
      <MySpaceTopBar name={profile.name} />
      <main className='mx-auto flex w-full max-w-[1100px] flex-1 flex-col gap-8 px-4 py-10 md:px-6 md:py-12'>
        <MySpaceHeader name={profile.name} />
        <div className='grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]'>
          <div className='flex min-w-0 flex-col gap-6'>
            <UpcomingCard upcoming={appointments.upcoming} />
            <RemindersCard />
          </div>
          <AccountTabs profile={profile} />
        </div>
      </main>
      <MySpaceFooter />
    </div>
  );
}
