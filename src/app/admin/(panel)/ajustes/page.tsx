import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { getSettingsOverview } from '@/features/settings/actions/settings-queries';
import { HealthInsuranceEditor } from '@/features/settings/ui/components/health-insurance-editor';
import { SlotMinutesForm } from '@/features/settings/ui/components/slot-minutes-form';

export const metadata: Metadata = { title: 'Ajustes · Panel' };

export default async function SettingsPage(): Promise<ReactElement> {
  const { settings, healthInsurances } = await getSettingsOverview();
  return (
    <PanelPage
      title={
        <>
          <strong className='font-bold'>Ajustes</strong> de la agenda
        </>
      }
    >
      <PanelCard title='Duración de los turnos'>
        <SlotMinutesForm settings={settings} />
      </PanelCard>
      <PanelCard title='Obras sociales'>
        <HealthInsuranceEditor rows={healthInsurances} />
      </PanelCard>
    </PanelPage>
  );
}
