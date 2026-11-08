import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { PRIMARY_BUTTON } from '@/components/form/form-parts';
import { PanelPage } from '@/components/panel/panel-page';
import { getLocations } from '@/features/location/actions/location-queries';
import { LocationList } from '@/features/location/ui/components/location-list';

export const metadata: Metadata = { title: 'Ubicaciones · Panel' };

export default async function LocationsPage(): Promise<ReactElement> {
  const locations = await getLocations();
  return (
    <PanelPage
      title={
        <>
          Tus <strong className='font-bold'>ubicaciones</strong>
        </>
      }
      lead='Los consultorios donde atendés y la atención online, con sus horarios.'
      actions={
        <Link href='/admin/ubicaciones/nueva' className={PRIMARY_BUTTON}>
          Nueva ubicación
        </Link>
      }
    >
      <LocationList locations={locations} />
    </PanelPage>
  );
}
