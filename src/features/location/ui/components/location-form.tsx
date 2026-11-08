'use client';

import { useActionState, useState } from 'react';
import type { ReactElement } from 'react';
import { Field, FormFeedback, SubmitButton } from '@/components/form/form-parts';
import { saveLocation } from '../../actions/save-location';
import type { LocationRow } from '../../domain/location.schema';

type Kind = LocationRow['kind'];

const KIND_LABELS: ReadonlyArray<readonly [Kind, string]> = [
  ['IN_PERSON', 'Presencial'],
  ['ONLINE', 'Online'],
];

function KindPicker({ kind, onChange }: { kind: Kind; onChange: (kind: Kind) => void }): ReactElement {
  return (
    <fieldset className='flex flex-col gap-2'>
      <legend className='mb-2 text-[15px] font-semibold'>Tipo de atención</legend>
      <div className='flex gap-2'>
        {KIND_LABELS.map(([value, label]) => (
          <label key={value} className='hover-shade flex h-12 cursor-pointer items-center rounded-control bg-secondary px-6 font-medium has-checked:bg-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground'>
            <input type='radio' name='kind' value={value} checked={kind === value} onChange={() => onChange(value)} className='sr-only' />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function InPersonFields({ location }: { location?: LocationRow }): ReactElement {
  return (
    <>
      <Field name='address' label='Dirección' defaultValue={location?.address ?? ''} hint='Calle, número y ciudad.' />
      <Field name='directions' label='Indicaciones (opcional)' defaultValue={location?.directions ?? ''} required={false} hint='Piso, timbre o consultorio.' />
      <Field name='mapUrl' label='Mapa (opcional)' defaultValue={location?.mapUrl ?? ''} required={false} hint='En Google Maps: Compartir → Insertar un mapa → Copiar HTML, y pegalo acá.' />
    </>
  );
}

export function LocationForm({ location }: { location?: LocationRow }): ReactElement {
  const [state, action, pending] = useActionState(saveLocation, null);
  const [kind, setKind] = useState<Kind>(location?.kind ?? 'IN_PERSON');
  return (
    <form action={action} aria-label='Datos de la ubicación' className='flex flex-col gap-5'>
      {location ? <input type='hidden' name='id' value={location.id} /> : null}
      {location ? <input type='hidden' name='version' value={location.version} /> : null}
      <KindPicker kind={kind} onChange={setKind} />
      <Field name='name' label='Nombre' defaultValue={location?.name ?? ''} hint='Así la ven los pacientes, por ejemplo «Consultorio Centro».' />
      {kind === 'IN_PERSON' ? (
        <InPersonFields location={location} />
      ) : (
        <Field name='videoUrl' label='Link de la videollamada' type='url' defaultValue={location?.videoUrl ?? ''} hint='Tu sala fija de Meet o Zoom. Va en el email del turno.' />
      )}
      <FormFeedback state={state} />
      <div className='self-start'>
        <SubmitButton pending={pending} idle='Guardar ubicación' busy='Guardando…' />
      </div>
    </form>
  );
}
