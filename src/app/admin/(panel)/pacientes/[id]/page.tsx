import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { PanelPage } from '@/components/panel/panel-page';
import { getPatientFile } from '@/features/patient/actions/patient-directory-queries';
import { PatientFileView } from '@/features/patient/ui/admin/patient-file-view';

export const metadata: Metadata = { title: 'Paciente · Panel' };

export default async function PatientPage({ params }: PageProps<'/admin/pacientes/[id]'>): Promise<ReactElement> {
  const file = await getPatientFile((await params).id);
  if (!file) notFound();
  return (
    <PanelPage title={file.entry.name} back={{ href: '/admin/pacientes', label: 'Volver a pacientes' }}>
      <PatientFileView file={file} />
    </PanelPage>
  );
}
