import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { AccessDenied } from '@/components/access-denied';

export const metadata: Metadata = { title: 'Acceso denegado', robots: { index: false, follow: false } };

export default function AccessDeniedPage(): ReactElement {
  return <AccessDenied />;
}
