import type { Metadata } from 'next';
import { connection } from 'next/server';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { ErrorMessage } from '@/components/form/form-parts';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { getPanelSlots } from '@/features/agenda/actions/agenda-queries';
import { ManualAppointmentForm } from '@/features/agenda/ui/components/manual-appointment-form';
import { SlotQueryForm } from '@/features/agenda/ui/components/slot-query-form';
import { getLocations } from '@/features/location/actions/location-queries';
import { getActiveHealthInsurances } from '@/features/settings/actions/settings-queries';
import { isArgentinaDay, todayInArgentina } from '@/lib/argentina-time';

export const metadata: Metadata = { title: 'Nuevo turno · Panel' };

const single = (value: string | string[] | undefined): string => (typeof value === 'string' ? value : '');

export default async function NewAppointmentPage({ searchParams }: PageProps<'/admin/turnos/nuevo'>): Promise<ReactElement> {
  await connection();
  const params = await searchParams;
  const today = todayInArgentina(new Date());
  const locations = (await getLocations()).filter(({ active }) => active);
  const back = { href: '/admin', label: 'Volver a la agenda' };
  if (locations.length === 0) {
    return (
      <PanelPage title='Nuevo turno' back={back}>
        <p className='rounded-panel bg-background p-6'>
          Primero cargá una ubicación con sus horarios en <Link href='/admin/ubicaciones' className='font-semibold underline'>Ubicaciones</Link>.
        </p>
      </PanelPage>
    );
  }
  const locationId = locations.find(({ id }) => id === single(params.ubicacion))?.id ?? locations[0]?.id ?? '';
  const day = isArgentinaDay(single(params.dia)) && single(params.dia) >= today ? single(params.dia) : today;
  const [{ slots, error }, insurances] = await Promise.all([getPanelSlots({ locationId, day }), getActiveHealthInsurances()]);
  return (
    <PanelPage title='Nuevo turno' lead='Para pacientes que te escribieron o te llamaron: el turno queda confirmado.' back={back}>
      <PanelCard title='Dónde y cuándo'>
        <SlotQueryForm action='/admin/turnos/nuevo' locations={locations} locationId={locationId} day={day} today={today} />
      </PanelCard>
      <PanelCard title='Horario y paciente'>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        {!error && slots.length === 0 ? <p className='text-muted-foreground'>No hay horarios libres ese día en esa ubicación. Probá con otro día.</p> : null}
        {slots.length > 0 ? <ManualAppointmentForm key={`${locationId}-${day}`} locationId={locationId} slots={slots} insurances={insurances} /> : null}
      </PanelCard>
    </PanelPage>
  );
}
