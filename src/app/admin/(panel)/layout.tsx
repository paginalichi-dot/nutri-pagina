import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { guardAdminPage } from '@/features/auth/actions/require-admin';

export const instant = false;

export const metadata: Metadata = { title: 'Panel · Lisandro López', robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: Readonly<{ children: ReactNode }>): Promise<ReactElement> {
  await guardAdminPage();
  return <div className='flex flex-1 flex-col bg-muted'>{children}</div>;
}
