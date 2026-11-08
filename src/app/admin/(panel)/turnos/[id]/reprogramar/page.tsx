import type { Metadata } from 'next';
import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { ErrorMessage } from '@/components/form/form-parts';
import { PanelCard, PanelPage } from '@/components/panel/panel-page';
import { getAppointment, getPanelSlots } from '@/features/agenda/actions/agenda-queries';
import { isActiveStatus } from '@/features/agenda/domain/appointment.schema';
import { RescheduleForm } from '@/features/agenda/ui/components/reschedule-form';
import { SlotQueryForm } from '@/features/agenda/ui/components/slot-query-form';
import { getLocations } from '@/features/location/actions/location-queries';
import { isArgentinaDay, todayInArgentina, whenText } from '@/lib/argentina-time';
import { argentinaDay } from '@/lib/format-date-time';

export const metadata: Metadata = { title: 'Reprogramar turno · Panel' };

const single = (value: string | string[] | undefined): string => (typeof value === 'string' ? value : '');

export default async function ReschedulePage({ params, searchParams }: PageProps<'/admin/turnos/[id]/reprogramar'>): Promise<ReactElement> {
  await connection();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const appointment = await getAppointment(id);
  if (!appointment) notFound();
  const now = new Date();
  const today = todayInArgentina(now);
  const back = { href: `/admin/turnos/${id}`, label: 'Volver al turno' };
  if (!isActiveStatus(appointment.status) || appointment.startsAt <= now) {
    return (
      <PanelPage title='Reprogramar turno' back={back}>
        <ErrorMessage>Este turno ya no se puede reprogramar.</ErrorMessage>
      </PanelPage>
    );
  }
  const locations = (await getLocations()).filter(({ active }) => active);
  const locationId = locations.find(({ id: candidate }) => candidate === single(query.ubicacion))?.id ?? appointment.locationId;
  const fallbackDay = argentinaDay(appointment.startsAt) >= today ? argentinaDay(appointment.startsAt) : today;
  const day = isArgentinaDay(single(query.dia)) && single(query.dia) >= today ? single(query.dia) : fallbackDay;
  const { slots, error } = await getPanelSlots({ locationId, day }, id);
  return (
    <PanelPage title={`Reprogramar a ${appointment.patientName}`} lead={`Hoy está el ${whenText(appointment.startsAt)} en ${appointment.locationName}.`} back={back}>
      <PanelCard title='Dónde y cuándo'>
        <SlotQueryForm action={`/admin/turnos/${id}/reprogramar`} locations={locations} locationId={locationId} day={day} today={today} />
      </PanelCard>
      <PanelCard title='Horario nuevo'>
        {error ? <ErrorMessage>{error}</ErrorMessage> : null}
        {!error && slots.length === 0 ? <p className='text-muted-foreground'>No hay horarios libres ese día en esa ubicación. Probá con otro día.</p> : null}
        {slots.length > 0 ? <RescheduleForm key={`${locationId}-${day}`} id={id} version={appointment.version} locationId={locationId} slots={slots} /> : null}
      </PanelCard>
    </PanelPage>
  );
}
