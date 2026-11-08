import type { Metadata } from 'next';
import { connection } from 'next/server';
import type { ReactElement } from 'react';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { getAgenda } from '@/features/agenda/actions/agenda-queries';
import { BlockForm, BlockList } from '@/features/agenda/ui/components/block-editor';
import { todayInArgentina } from '@/lib/argentina-time';

export const metadata: Metadata = { title: 'Bloqueos · Panel' };

export default async function BlocksPage(): Promise<ReactElement> {
  await connection();
  const { blocks } = await getAgenda(todayInArgentina(new Date()), 365);
  return (
    <PanelPage
      title={
        <>
          Bloquear <strong className='font-bold'>horarios</strong>
        </>
      }
      lead='Cerrá días u horarios puntuales (vacaciones, un trámite) en todas tus ubicaciones. Si en ese rango hay turnos, primero cancelalos o reprogramalos.'
      back={{ href: '/admin', label: 'Volver a la agenda' }}
    >
      <PanelCard title='Nuevo bloqueo'>
        <BlockForm />
      </PanelCard>
      <PanelCard title='Bloqueos por venir'>
        <BlockList blocks={blocks} />
      </PanelCard>
    </PanelPage>
  );
}
