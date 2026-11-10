import { Clock, MapPin } from 'lucide-react';
import type { ReactElement } from 'react';
import type { PublicLocation } from '@/features/location/domain/public-location.schema';
import { argentinaTime } from '@/lib/format-date-time';
import type { GridSlot } from '../../domain/booking.schema';

const PICK = 'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground';

export function LocationChoice({ places, selected }: { places: readonly PublicLocation[]; selected: string }): ReactElement {
  return (
    <fieldset className='grid gap-3 sm:grid-cols-2'>
      <legend className='sr-only'>Ubicación</legend>
      {places.map((place) => (
        <label
          key={place.id}
          className={`group/place hover-shade flex cursor-pointer items-center gap-4 rounded-input border-2 border-transparent bg-secondary p-5 has-checked:border-primary has-checked:bg-background has-checked:shadow-[0_8px_28px_-12px_var(--primary)] ${PICK}`}
        >
          <input type='radio' name='ubicacion' value={place.id} defaultChecked={place.id === selected} required className='sr-only' />
          <span aria-hidden='true' className='flex size-11 shrink-0 items-center justify-center rounded-full bg-background group-has-checked/place:bg-primary'>
            <MapPin className='size-5' strokeWidth={1.75} />
          </span>
          <span className='flex min-w-0 flex-col'>
            <span className='text-[18px] font-semibold'>{place.name}</span>
            <span className='text-[15px] text-muted-foreground'>{place.address ?? ''}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}

const SLOT = 'flex h-14 items-center justify-center gap-2 rounded-control text-[17px] font-bold tabular-nums';

export function SlotGrid({ slots, selected }: { slots: readonly GridSlot[]; selected: string }): ReactElement {
  return (
    <fieldset className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
      <legend className='sr-only'>Horario</legend>
      {slots.map(({ startsAt, free }) =>
        free ? (
          <label key={startsAt.toISOString()} className={`hover-shade cursor-pointer bg-secondary has-checked:bg-primary ${SLOT} ${PICK}`}>
            <input type='radio' name='hora' value={startsAt.toISOString()} defaultChecked={startsAt.toISOString() === selected} required className='sr-only' />
            <Clock aria-hidden='true' className='size-4' strokeWidth={2.25} />
            {argentinaTime(startsAt)}
          </label>
        ) : (
          <span key={startsAt.toISOString()} className={`bg-secondary/50 text-muted-foreground ${SLOT}`}>
            <Clock aria-hidden='true' className='size-4 opacity-60' strokeWidth={2.25} />
            <span className='line-through decoration-2'>{argentinaTime(startsAt)}</span>
            <span className='sr-only'>(ocupado)</span>
          </span>
        )
      )}
    </fieldset>
  );
}
