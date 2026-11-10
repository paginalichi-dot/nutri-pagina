import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';
import { AuthCard } from '@/components/auth/auth-card';
import { hasAdminSession } from '@/features/auth/actions/require-admin';
import { LoginBrandPanel } from '@/features/auth/ui/components/login-brand-panel';
import { LoginForm } from '@/features/auth/ui/components/login-form';
import { currentPatient } from '@/features/patient/actions/require-patient';
import { safeReturnPath } from '@/lib/auth/return-path';

export const instant = false;

export const metadata: Metadata = { title: 'Ingresar · Lisandro López', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<'/login'>): Promise<ReactElement> {
  const returnTo = safeReturnPath((await searchParams).volver);
  if (await hasAdminSession()) redirect('/admin');
  if (await currentPatient()) redirect(returnTo ?? '/mi-espacio');
  return (
    <main className='grid min-h-svh overflow-clip bg-background lg:grid-cols-2'>
      <LoginBrandPanel />
      <div data-enter='unfold-right' className='flex flex-col items-center justify-center bg-muted px-4 py-12 md:px-8'>
        <AuthCard title='Ingresá a tu cuenta' lead='Gestioná tus turnos y tu historial'>
          <LoginForm returnTo={returnTo} />
        </AuthCard>
      </div>
    </main>
  );
}
