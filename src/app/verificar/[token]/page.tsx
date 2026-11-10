import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AuthCard, AuthPage } from '@/components/auth/auth-card';
import { TokenForm } from '@/components/auth/token-form';
import { verifyEmail } from '@/features/patient/actions/token-links';

export const instant = false;

export const metadata: Metadata = { title: 'Activar tu cuenta · Lisandro López', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function VerifyPage({ params }: PageProps<'/verificar/[token]'>): Promise<ReactElement> {
  const { token } = await params;
  return (
    <AuthPage>
      <AuthCard title='Activá tu cuenta' lead='Un toque y ya podés entrar.'>
        <TokenForm action={verifyEmail} token={token} idle='Activar mi cuenta' busy='Activando…' />
      </AuthCard>
    </AuthPage>
  );
}
