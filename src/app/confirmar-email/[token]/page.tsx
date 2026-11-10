import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AuthCard, AuthPage } from '@/components/auth/auth-card';
import { TokenForm } from '@/components/auth/token-form';
import { confirmEmailChange } from '@/features/patient/actions/token-links';

export const instant = false;

export const metadata: Metadata = { title: 'Confirmar tu email · Lisandro López', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function ConfirmEmailPage({ params }: PageProps<'/confirmar-email/[token]'>): Promise<ReactElement> {
  const { token } = await params;
  return (
    <AuthPage>
      <AuthCard title='Confirmá tu email' lead='Con esto tu cuenta pasa a usar el email nuevo.'>
        <TokenForm action={confirmEmailChange} token={token} idle='Confirmar mi email' busy='Confirmando…' />
      </AuthCard>
    </AuthPage>
  );
}
