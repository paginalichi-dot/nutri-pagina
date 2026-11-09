import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AuthCard, AuthPage } from '@/components/auth/auth-card';
import { AuthFooter } from '@/components/auth/auth-footer';
import { RecoverForm } from '@/features/auth/ui/components/recover-form';

export const metadata: Metadata = { title: 'Recuperar contraseña · Lisandro López', robots: { index: false, follow: false } };

export default function RecoverPage(): ReactElement {
  return (
    <AuthPage>
      <AuthCard title='Recuperá tu contraseña' lead='Te mandamos un link por email para elegir una nueva.'>
        <RecoverForm />
        <AuthFooter text='¿Te acordaste?' href='/login' label='Ingresá' />
      </AuthCard>
    </AuthPage>
  );
}
