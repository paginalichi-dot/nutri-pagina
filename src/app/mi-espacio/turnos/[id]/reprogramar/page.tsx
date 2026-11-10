import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import type { ReactElement } from 'react';
import { PUBLIC_LINK } from '@/components/form/public-form-parts';
import { getMyAppointment } from '@/features/agenda/actions/booking-queries';
import { rescheduleMyAppointment } from '@/features/agenda/actions/patient-bookings';
import { patientCanChange } from '@/features/agenda/domain/patient-change';
import { availableModalities, BookingEntry } from '@/features/agenda/ui/booking/booking-entry';
import type { ConfirmSlot } from '@/features/agenda/ui/booking/booking-flow';
import { resolveSelection, type BookingSelection } from '@/features/agenda/ui/booking/booking-selection';
import { BookingSummary } from '@/features/agenda/ui/booking/booking-summary';
import { placeText, reviewRows } from '@/features/agenda/ui/booking/booking-view';
import { ModalityChoice } from '@/features/agenda/ui/booking/modality-choice';
import { RequestDone } from '@/features/agenda/ui/booking/request-done';
import { RequestForm } from '@/features/agenda/ui/booking/request-form';
import { getPublicLocations } from '@/features/location/actions/location-queries';
import { getMyProfile } from '@/features/patient/actions/patient-queries';
import { MySpaceShell } from '@/features/patient/ui/components/my-space-shell';
import { whenText } from '@/lib/argentina-time';

export const instant = false;

export const metadata: Metadata = { title: 'Reprogramá tu turno · Lisandro López', robots: { index: false, follow: false } };

const LABELS = { title: 'Revisá el cambio', idle: 'Pedir el cambio', busy: 'Enviando…' };
const TITLE = (
  <>
    Reprogramá tu <strong className='font-bold'>turno</strong>
  </>
);

export default async function MyReschedulePage({ params, searchParams }: PageProps<'/mi-espacio/turnos/[id]/reprogramar'>): Promise<ReactElement> {
  await connection();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [profile, appointment, locations] = await Promise.all([getMyProfile(), getMyAppointment(id), getPublicLocations()]);
  if (!appointment) notFound();
  const back = `/mi-espacio/turnos/${id}`;
  if (!patientCanChange(appointment, new Date())) {
    return (
      <MySpaceShell name={profile.name}>
        <p className='rounded-card bg-background p-6 text-[17px] md:p-10'>Este turno ya no se puede reprogramar desde acá: faltan menos de 24 h o ya no está activo.</p>
        <Link href={back} className={`${PUBLIC_LINK} flex min-h-11 items-center self-start`}>
          Volver a tu turno
        </Link>
      </MySpaceShell>
    );
  }
  const before = `${whenText(appointment.startsAt)} hs · ${appointment.locationName}`;
  const confirm = (chosen: BookingSelection, { time, back: previous }: ConfirmSlot): ReactElement => (
    <RequestForm
      action={rescheduleMyAppointment}
      hidden={{ id, version: String(appointment.version), locationId: chosen.location?.id ?? '', startsAt: time.toISOString() }}
      labels={LABELS}
      back={previous}
      done={<RequestDone title='¡Pedido enviado!' lines={[`${whenText(time)} hs`, placeText(chosen), 'Tu turno vuelve a quedar pendiente hasta que Lisandro lo confirme.']} again={null} />}
    >
      <BookingSummary rows={[{ icon: 'day', label: 'Antes', value: before }, ...reviewRows(chosen, time)]} />
    </RequestForm>
  );
  const selection = await resolveSelection(query, locations);
  if (!selection) return <ModalityChoice basePath={`${back}/reprogramar`} available={availableModalities(locations)} back={{ href: back, label: 'Volver a tu turno' }} />;
  return (
    <MySpaceShell name={profile.name} width='wide' enter>
      <BookingEntry basePath={`${back}/reprogramar`} heading={{ title: TITLE, lead: () => `Hoy: ${before}.`, note: `Tu turno de hoy: ${before}.` }} selection={selection} confirm={confirm} />
    </MySpaceShell>
  );
}
