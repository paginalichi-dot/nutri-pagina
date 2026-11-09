import Link from 'next/link';
import type { ReactElement } from 'react';
import { ArrowDisc } from '@/components/arrow-disc';
import type { MyAppointments } from '@/features/agenda/domain/appointment.schema';
import { AccountCard } from './account-card';
import { AppointmentList } from './appointment-list';

const BOOK =
  'hover-shade flex h-14 items-center justify-between gap-4 self-start rounded-full bg-primary pr-2 pl-6 text-[17px] font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground';

function Empty(): ReactElement {
  return (
    <>
      <p className='text-[16px] text-muted-foreground'>Todavía no tenés turnos.</p>
      <Link href='/reservar' className={BOOK}>
        Reservá tu turno
        <ArrowDisc className='size-10 bg-foreground text-primary' />
      </Link>
    </>
  );
}

export function AppointmentsSections({ upcoming, past }: MyAppointments): ReactElement {
  return (
    <>
      <AccountCard title='Tus próximos turnos'>{upcoming.length > 0 ? <AppointmentList appointments={upcoming} /> : <Empty />}</AccountCard>
      {past.length > 0 ? (
        <AccountCard title='Tus turnos anteriores'>
          <AppointmentList appointments={past} />
        </AccountCard>
      ) : null}
    </>
  );
}
