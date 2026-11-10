'use client';

import { useActionState, useState } from 'react';
import type { ReactElement } from 'react';
import { FormFeedback } from '@/components/form/form-parts';
import { saveLocation } from '../../actions/save-location';
import type { LocationRow } from '../../domain/location.schema';
import { KindChoice, LocationFields } from './location-fields';
import { SubmitRow } from './new-location-form';
import { StepCard } from './step-card';

export function EditLocationForm({ location }: { location: LocationRow }): ReactElement {
  const [state, action, pending] = useActionState(saveLocation, null);
  const [kind, setKind] = useState(location.kind);
  return (
    <form action={action} aria-label='Datos de la ubicación' className='flex max-w-3xl flex-col gap-6'>
      <input type='hidden' name='id' value={location.id} />
      <input type='hidden' name='version' value={location.version} />
      <StepCard step={1} title='Tipo de atención'>
        <KindChoice kind={kind} onChange={setKind} />
      </StepCard>
      <StepCard step={2} title='Datos de la ubicación'>
        <LocationFields key={kind} kind={kind} location={location} />
      </StepCard>
      <FormFeedback state={state} />
      <SubmitRow pending={pending} label='Guardar cambios' cancel={`/admin/ubicaciones/${location.id}`} cancelLabel='Volver a la ubicación' />
    </form>
  );
}
