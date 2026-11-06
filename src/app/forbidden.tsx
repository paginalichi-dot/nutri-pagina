import type { ReactElement } from 'react';
import { AccessDenied } from '@/components/access-denied';

export default function Forbidden(): ReactElement {
  return <AccessDenied />;
}
