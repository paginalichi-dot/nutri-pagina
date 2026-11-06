import type { Metadata } from 'next';
import type { ReactElement } from 'react';
import { Emphasis, NoticePage } from '@/components/notice-page';

export const metadata: Metadata = { title: 'Reservá tu turno · Lisandro López' };

export default function BookingPage(): ReactElement {
  return (
    <NoticePage
      title={
        <>
          Reservá tu <Emphasis>turno</Emphasis>
        </>
      }
      message='La reserva online está por llegar.'
    />
  );
}
