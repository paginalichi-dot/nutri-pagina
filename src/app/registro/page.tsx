import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AuthPage } from '@/components/auth/auth-card';
import { RegisterForm } from '@/features/auth/ui/components/register-form';

export const metadata: Metadata = { title: 'Crear cuenta · Lisandro López', robots: { index: false, follow: false } };

export default function RegisterPage(): ReactElement {
  return (
    <AuthPage>
      <RegisterForm />
    </AuthPage>
  );
}
