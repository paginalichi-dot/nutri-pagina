import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { ActionButton } from '@/components/form/action-button';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { setLocationActive } from '@/features/location/actions/location-changes';
import { getLocation } from '@/features/location/actions/location-queries';
import { HoursEditor } from '@/features/location/ui/components/hours-editor';
import { LocationForm } from '@/features/location/ui/components/location-form';

export const metadata: Metadata = { title: 'Ubicación · Panel' };

export default async function LocationPage({ params }: PageProps<'/admin/ubicaciones/[id]'>): Promise<ReactElement> {
  const location = await getLocation((await params).id);
  if (!location) notFound();
  const fields = { id: location.id, version: String(location.version), active: String(!location.active) };
  return (
    <PanelPage title={location.name} lead={location.active ? undefined : 'Desactivada: no se ofrece para reservar.'} back={{ href: '/admin/ubicaciones', label: 'Volver a ubicaciones' }}>
      <PanelCard title='Datos'>
        <LocationForm location={location} />
      </PanelCard>
      <PanelCard title='Horarios de atención'>
        <p className='text-muted-foreground'>Se repiten cada semana, en hora de Argentina. Para cerrar un día puntual, usá un bloqueo desde la agenda.</p>
        <HoursEditor locationId={location.id} hours={location.hours} />
      </PanelCard>
      <PanelCard title={location.active ? 'Dejar de ofrecerla' : 'Volver a ofrecerla'}>
        <p className='text-muted-foreground'>
          {location.active ? 'Una ubicación desactivada no se ofrece para reservar ni aparece en la web. Sus turnos e historial quedan.' : 'Vuelve a ofrecerse con sus horarios.'}
        </p>
        <ActionButton action={setLocationActive} fields={fields} label={location.active ? 'Desactivar' : 'Reactivar'} busy='Guardando…' />
      </PanelCard>
    </PanelPage>
  );
}
