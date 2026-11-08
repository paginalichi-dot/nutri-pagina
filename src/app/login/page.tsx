import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';
import { hasAdminSession } from '@/features/auth/actions/require-admin';
import { LoginForm } from '@/features/auth/ui/components/login-form';

export const instant = false;

export const metadata: Metadata = { title: 'Ingresar · Lisandro López', robots: { index: false, follow: false } };

export default async function LoginPage(): Promise<ReactElement> {
  if (await hasAdminSession()) redirect('/admin');
  return (
    <main className='flex flex-1 items-center justify-center bg-muted px-4 py-16'>
      <section className='w-full max-w-md rounded-card bg-background p-6 md:p-10'>
        <h1 className='mb-8 text-[28px] font-medium md:text-[38.4px]'>
          Ingresá a tu <strong className='font-bold'>cuenta</strong>
        </h1>
        <LoginForm />
      </section>
    </main>
  );
}
