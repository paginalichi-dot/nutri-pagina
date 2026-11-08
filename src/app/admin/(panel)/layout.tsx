import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { PanelNav } from '@/components/panel/panel-nav';
import { guardAdminPage } from '@/features/auth/actions/require-admin';
import { LogoutButton } from '@/features/auth/ui/components/logout-button';

export const instant = false;

export const metadata: Metadata = { title: 'Panel · Lisandro López', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: Readonly<{ children: ReactNode }>): Promise<ReactElement> {
  await guardAdminPage();
  return (
    <div className='flex flex-1 bg-muted'>
      <PanelNav footer={<LogoutButton onDark />} />
      <div className='flex min-w-0 flex-1 flex-col pb-24 md:pb-0'>{children}</div>
    </div>
  );
}
