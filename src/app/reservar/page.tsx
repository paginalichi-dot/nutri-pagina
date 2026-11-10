import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { bookAppointment } from '@/features/agenda/actions/patient-bookings';
import { bookingRoomLeft } from '@/features/agenda/actions/booking-queries';
import { availableModalities, BookingEntry, LimitReached } from '@/features/agenda/ui/booking/booking-entry';
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
import { getActiveHealthInsurances } from '@/features/settings/actions/settings-queries';
import { whenText } from '@/lib/argentina-time';

export const instant = false;

export const metadata: Metadata = { title: 'Reservá tu turno · Lisandro López', robots: { index: false, follow: false } };

const LABELS = { title: 'Revisá y confirmá', idle: 'Confirmar turno', busy: 'Enviando…' };
const TITLE = (
  <>
    Reservá tu <strong className='font-bold'>turno</strong>
  </>
);

const lead = ({ modality }: BookingSelection): string =>
  modality === 'virtual' ? 'Elegí cuándo y a qué hora. En tres pasos pedís tu consulta.' : 'Elegí dónde, cuándo y a qué hora. En cuatro pasos pedís tu consulta.';

type Insurance = { id: string; name: string };

function bookingConfirm({ room, insurances }: { room: number; insurances: readonly Insurance[] }) {
  return function Confirm(chosen: BookingSelection, { time, back }: ConfirmSlot): ReactElement {
    const lines = [`${whenText(time)} hs`, placeText(chosen), 'Lisandro la confirma y te avisamos por email.'];
    const again = room > 1 ? { href: '/reservar', label: 'Reservar otro turno' } : null;
    return (
      <RequestForm
        action={bookAppointment}
        hidden={{ locationId: chosen.location?.id ?? '', startsAt: time.toISOString() }}
        insurances={insurances}
        labels={LABELS}
        back={back}
        done={<RequestDone title='¡Solicitud enviada!' lines={lines} again={again} />}
      >
        <BookingSummary rows={reviewRows(chosen, time)} />
      </RequestForm>
    );
  };
}

export default async function BookingPage({ searchParams }: PageProps<'/reservar'>): Promise<ReactElement> {
  const [profile, query, room, locations, insurances] = await Promise.all([getMyProfile(), searchParams, bookingRoomLeft(), getPublicLocations(), getActiveHealthInsurances()]);
  if (room === 0) {
    return (
      <MySpaceShell name={profile.name}>
        <LimitReached />
      </MySpaceShell>
    );
  }
  const selection = await resolveSelection(query, locations);
  if (!selection) return <ModalityChoice basePath='/reservar' available={availableModalities(locations)} back={{ href: '/', label: 'Volver al inicio' }} />;
  return (
    <MySpaceShell name={profile.name} width='wide' enter>
      <BookingEntry basePath='/reservar' heading={{ title: TITLE, lead }} selection={selection} confirm={bookingConfirm({ room, insurances })} />
    </MySpaceShell>
  );
}
