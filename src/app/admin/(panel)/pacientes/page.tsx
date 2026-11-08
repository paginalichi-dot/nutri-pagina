import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';

export const metadata: Metadata = { title: 'Pacientes · Panel' };

export default function PatientsPage(): ReactElement {
  return (
    <PanelPage title='Pacientes'>
      <PanelCard title='Próximamente'>
        <p className='text-muted-foreground'>Acá vas a ver la lista de tus pacientes, con sus datos y sus turnos.</p>
      </PanelCard>
    </PanelPage>
  );
}
