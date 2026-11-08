import type { ReactElement } from 'react';
import { argentinaTime } from '@/lib/format-date-time';

export function SlotPicker({ slots }: { slots: Date[] }): ReactElement {
  return (
    <fieldset className='flex flex-col gap-3'>
      <legend className='mb-3 text-[15px] font-semibold'>Horario</legend>
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-5'>
        {slots.map((slot, index) => (
          <label
            key={slot.toISOString()}
            className='flex h-12 cursor-pointer items-center justify-center rounded-full bg-secondary font-medium has-checked:bg-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground'
          >
            <input type='radio' name='startsAt' value={slot.toISOString()} defaultChecked={index === 0} required className='sr-only' />
            {argentinaTime(slot)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
