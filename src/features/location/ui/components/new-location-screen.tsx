'use client';

import { type ReactElement, useState } from 'react';
import { PanelPage } from '@/components/panel/panel-page';
import type { LocationRow } from '../../domain/location.schema';
import { NewLocationForm } from './new-location-form';

export function NewLocationScreen(): ReactElement {
  const [kind, setKind] = useState<LocationRow['kind']>('IN_PERSON');
  return (
    <PanelPage
      wide
      title={kind === 'ONLINE' ? 'Nuevo espacio online' : 'Nuevo consultorio'}
      lead='Configurá los datos y los horarios en un solo paso.'
      back={{ href: '/admin/ubicaciones', label: 'Volver a ubicaciones' }}
    >
      <NewLocationForm kind={kind} onKindChange={setKind} />
    </PanelPage>
  );
}
