import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { getMyAppointments } from '@/features/agenda/actions/my-appointments';
import { getMyProfile } from '@/features/patient/actions/patient-queries';
import { AccountCard } from '@/features/patient/ui/components/account-card';
import { AppointmentsSections } from '@/features/patient/ui/components/appointments-sections';
import { DeleteAccountForm } from '@/features/patient/ui/components/delete-account-form';
import { EmailForm } from '@/features/patient/ui/components/email-form';
import { MySpaceHeader } from '@/features/patient/ui/components/my-space-header';
import { PasswordForm } from '@/features/patient/ui/components/password-form';
import { ProfileForm } from '@/features/patient/ui/components/profile-form';

export const instant = false;

export const metadata: Metadata = { title: 'Mi espacio · Lisandro López', robots: { index: false, follow: false } };

export default async function MySpacePage(): Promise<ReactElement> {
  const [profile, appointments] = await Promise.all([getMyProfile(), getMyAppointments()]);
  return (
    <main className='flex-1 bg-muted px-4 py-10 md:px-6 md:py-16'>
      <div className='mx-auto flex w-full max-w-[1100px] flex-col gap-8'>
        <MySpaceHeader name={profile.name} />
        <div className='grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]'>
          <div className='flex flex-col gap-6'>
            <AppointmentsSections {...appointments} />
          </div>
          <div className='flex flex-col gap-6'>
            <AccountCard title='Tus datos'>
              <ProfileForm profile={profile} />
            </AccountCard>
            <AccountCard title='Tu email'>
              <EmailForm email={profile.email} />
            </AccountCard>
            <AccountCard title='Tu contraseña'>
              <PasswordForm />
            </AccountCard>
            <AccountCard title='Eliminar mi cuenta'>
              <DeleteAccountForm />
            </AccountCard>
          </div>
        </div>
      </div>
    </main>
  );
}
