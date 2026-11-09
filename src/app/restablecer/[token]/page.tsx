import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AuthCard, AuthPage } from '@/components/auth/auth-card';
import { TokenForm } from '@/components/auth/token-form';
import { PasswordField } from '@/components/form/password-field';
import { resetPassword } from '@/features/patient/actions/token-links';

export const instant = false;

export const metadata: Metadata = { title: 'Nueva contraseña · Lisandro López', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function ResetPage({ params }: PageProps<'/restablecer/[token]'>): Promise<ReactElement> {
  const { token } = await params;
  return (
    <AuthPage>
      <AuthCard title='Elegí tu contraseña nueva' lead='Después de guardarla, entrás con ella.'>
        <TokenForm action={resetPassword} token={token} idle='Guardar la contraseña' busy='Guardando…'>
          <PasswordField name='password' label='Contraseña nueva' autoComplete='new-password' hint='Al menos 8 caracteres.' />
        </TokenForm>
      </AuthCard>
    </AuthPage>
  );
}
