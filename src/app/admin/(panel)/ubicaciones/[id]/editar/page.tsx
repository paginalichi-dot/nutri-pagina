import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { PanelPage } from '@/components/panel/panel-page';
import { getLocation } from '@/features/location/actions/location-queries';
import { EditLocationForm } from '@/features/location/ui/components/edit-location-form';

export const metadata: Metadata = { title: 'Editar ubicación · Panel' };

export default async function EditLocationPage({ params }: PageProps<'/admin/ubicaciones/[id]/editar'>): Promise<ReactElement> {
  const location = await getLocation((await params).id);
  if (!location) notFound();
  return (
    <PanelPage title={`Editar ${location.name}`} lead='Los horarios se cambian desde la ficha de la ubicación.' back={{ href: `/admin/ubicaciones/${location.id}`, label: 'Volver a la ubicación' }}>
      <EditLocationForm location={location} />
    </PanelPage>
  );
}
