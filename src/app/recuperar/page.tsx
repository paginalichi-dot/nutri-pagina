import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AuthPage } from '@/components/auth/auth-card';
import { RecoverForm } from '@/features/auth/ui/components/recover-form';

export const metadata: Metadata = { title: 'Recuperar contraseña · Lisandro López', robots: { index: false, follow: false } };

export default function RecoverPage(): ReactElement {
  return (
    <AuthPage>
      <RecoverForm />
    </AuthPage>
  );
}
