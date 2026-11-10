import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';
import { PUBLIC_DARK } from '@/components/form/public-form-parts';
import type { PublicLocation } from '@/features/location/domain/public-location.schema';
import { cn } from '@/lib/utils';
import { type Modality, MODALITIES, placesFor } from './booking-model';
import type { BookingSelection } from './booking-selection';
import { BookingSummaryCard } from './booking-summary-card';
import { BookingFlow, type ConfirmSlot } from './booking-flow';
import { BookingLayout } from './booking-layout';
import { summaryProps } from './booking-view';

export const availableModalities = (locations: readonly PublicLocation[]): Set<Modality> =>
  new Set(MODALITIES.filter((modality) => placesFor(locations, modality).length > 0));

export function LimitReached(): ReactElement {
  return (
    <div className='flex flex-col items-start gap-5 rounded-card bg-background p-6 md:p-10'>
      <p className='max-w-prose text-[17px]'>Ya tenés dos turnos por venir. Cancelá o reprogramá uno desde Mi espacio para reservar otro.</p>
      <Link href='/mi-espacio' className={cn(PUBLIC_DARK, 'w-auto px-8')}>
        Ir a Mi espacio
      </Link>
    </div>
  );
}

type EntryProps = {
  basePath: string;
  heading: { title: ReactNode; lead: (selection: BookingSelection) => string; note?: string };
  selection: BookingSelection;
  confirm: (selection: BookingSelection, slot: ConfirmSlot) => ReactNode;
};

export function BookingEntry({ basePath, heading, selection, confirm }: EntryProps): ReactElement {
  return (
    <BookingLayout title={heading.title} lead={heading.lead(selection)} summary={<BookingSummaryCard {...summaryProps(selection, { basePath, note: heading.note })} />}>
      <BookingFlow basePath={basePath} selection={selection} confirm={(slot) => confirm(selection, slot)} />
    </BookingLayout>
  );
}
