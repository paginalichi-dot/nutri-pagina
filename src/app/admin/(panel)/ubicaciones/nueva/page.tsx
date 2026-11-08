import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { LocationForm } from '@/features/location/ui/components/location-form';

export const metadata: Metadata = { title: 'Nueva ubicación · Panel' };

export default function NewLocationPage(): ReactElement {
  return (
    <PanelPage title='Nueva ubicación' back={{ href: '/admin/ubicaciones', label: 'Volver a ubicaciones' }}>
      <PanelCard>
        <LocationForm />
      </PanelCard>
    </PanelPage>
  );
}
