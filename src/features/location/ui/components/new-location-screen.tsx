'use client';

import { type ReactElement, useState } from 'react';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { KIND_TEXTS, LocationForm } from './location-form';

export function NewLocationScreen(): ReactElement {
  const [kind, setKind] = useState<keyof typeof KIND_TEXTS>('IN_PERSON');
  return (
    <PanelPage title={KIND_TEXTS[kind].title} back={{ href: '/admin/ubicaciones', label: 'Volver a ubicaciones' }}>
      <PanelCard>
        <LocationForm onKindChange={setKind} />
      </PanelCard>
    </PanelPage>
  );
}
