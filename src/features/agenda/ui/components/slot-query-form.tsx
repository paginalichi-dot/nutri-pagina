import type { ReactElement } from 'react';
import { INPUT, SelectField } from '@/components/form/form-parts';

type SlotQueryProps = { action: string; locations: { id: string; name: string }[]; locationId: string; day: string; today: string };

export function SlotQueryForm({ action, locations, locationId, day, today }: SlotQueryProps): ReactElement {
  return (
    <form action={action} method='get' aria-label='Elegir ubicación y día' className='grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end'>
      <SelectField name='ubicacion' label='Ubicación' defaultValue={locationId}>
        {locations.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </SelectField>
      <label className='flex flex-col gap-2 text-[15px] font-semibold'>
        Día
        <input name='dia' type='date' required min={today} defaultValue={day} className={INPUT} />
      </label>
      <button
        type='submit'
        className='hover-shade flex h-12 items-center justify-center rounded-control bg-secondary px-6 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
      >
        Ver horarios
      </button>
    </form>
  );
}
