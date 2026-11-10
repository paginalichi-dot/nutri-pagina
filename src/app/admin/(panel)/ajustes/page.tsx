import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { getSettingsOverview } from '@/features/settings/actions/settings-queries';
import { HealthInsuranceList } from '@/features/settings/ui/components/health-insurance-list';
import { settingsTab, SettingsTabs } from '@/features/settings/ui/components/settings-tabs';
import { SlotMinutesForm } from '@/features/settings/ui/components/slot-minutes-form';

export const metadata: Metadata = { title: 'Ajustes · Panel' };

export default async function SettingsPage({ searchParams }: PageProps<'/admin/ajustes'>): Promise<ReactElement> {
  const tab = settingsTab((await searchParams).pestana);
  const { settings, healthInsurances } = await getSettingsOverview();
  return (
    <PanelPage title='Ajustes' lead='Configurá cómo funciona tu agenda.'>
      <SettingsTabs active={tab} />
      {tab === 'duracion' ? (
        <PanelCard title='Duración de los turnos'>
          <SlotMinutesForm settings={settings} />
        </PanelCard>
      ) : (
        <HealthInsuranceList rows={healthInsurances} />
      )}
    </PanelPage>
  );
}
