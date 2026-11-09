import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AuthCard, AuthPage } from '@/components/auth/auth-card';
import { AuthFooter } from '@/components/auth/auth-footer';
import { RegisterForm } from '@/features/auth/ui/components/register-form';

export const metadata: Metadata = { title: 'Crear cuenta · Lisandro López', robots: { index: false, follow: false } };

export default function RegisterPage(): ReactElement {
  return (
    <AuthPage>
      <AuthCard title='Creá tu cuenta' lead='Gestioná tus turnos desde un solo lugar.'>
        <RegisterForm />
        <AuthFooter text='¿Ya tenés cuenta?' href='/login' label='Ingresá' />
      </AuthCard>
    </AuthPage>
  );
}
