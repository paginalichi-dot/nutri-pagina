import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { NewLocationScreen } from '@/features/location/ui/components/new-location-screen';

export const metadata: Metadata = { title: 'Nuevo lugar de atención · Panel' };

export default function NewLocationPage(): ReactElement {
  return <NewLocationScreen />;
}
