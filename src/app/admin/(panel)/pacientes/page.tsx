import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { PanelPage } from '@/components/panel/panel-page';
import { getPatientDirectory } from '@/features/patient/actions/patient-directory-queries';
import { PatientDirectory } from '@/features/patient/ui/admin/patient-directory';

export const metadata: Metadata = { title: 'Pacientes · Panel' };

export default async function PatientsPage(): Promise<ReactElement> {
  const entries = await getPatientDirectory();
  return (
    <PanelPage wide title='Pacientes' lead={`${entries.length} ${entries.length === 1 ? 'paciente registrado' : 'pacientes registrados'}`}>
      <PatientDirectory entries={entries} />
    </PanelPage>
  );
}
