'use client';

import { Ellipsis, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { FOCUS, FormFeedback } from '@/components/form/form-parts';
import { setLocationActive } from '../../actions/location-changes';
import type { LocationRow } from '../../domain/location.schema';
import { ICON_BUTTON } from './hours-row';

export function LocationMenu({ id }: { id: string }): ReactElement {
  return (
    <details className='relative'>
      <summary aria-label='Más acciones' className={`${ICON_BUTTON} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
        <Ellipsis aria-hidden='true' className='size-5' strokeWidth={2.25} />
      </summary>
      <div className='absolute right-0 z-20 mt-2 flex w-48 flex-col rounded-panel bg-background p-2 shadow-modal'>
        <Link href={`/admin/ubicaciones/${id}/editar`} className={`hover-shade flex h-11 items-center gap-3 rounded-control px-3 text-[15px] font-semibold ${FOCUS}`}>
          <Pencil aria-hidden='true' className='size-4' strokeWidth={2} />
          Editar datos
        </Link>
      </div>
    </details>
  );
}

export function ActiveToggle({ location }: { location: LocationRow }): ReactElement {
  const [state, action, pending] = useActionState(setLocationActive, null);
  const confirm = (event: FormEvent<HTMLFormElement>): void => {
    if (location.active && !window.confirm('¿Desactivar esta ubicación? Deja de ofrecerse para reservar y de verse en la web.')) event.preventDefault();
  };
  return (
    <form action={action} onSubmit={confirm} className='flex flex-col items-end gap-2'>
      <input type='hidden' name='id' value={location.id} />
      <input type='hidden' name='version' value={location.version} />
      <input type='hidden' name='active' value={String(!location.active)} />
      <button type='submit' disabled={pending} className={`flex h-11 items-center rounded-control px-2 text-[15px] font-semibold disabled:opacity-70 ${location.active ? 'text-destructive' : 'underline underline-offset-4'} ${FOCUS}`}>
        {location.active ? 'Desactivar ubicación' : 'Reactivar ubicación'}
      </button>
      <FormFeedback state={state} />
    </form>
  );
}
