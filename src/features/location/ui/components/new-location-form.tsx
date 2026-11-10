'use client';

import { Check, Eye } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { FOCUS, FormFeedback } from '@/components/form/form-parts';
import { createLocation } from '../../actions/create-location';
import type { LocationRow } from '../../domain/location.schema';
import { KindChoice, LocationFields } from './location-fields';
import { PatientPreviewCard } from './patient-preview-card';
import { StepCard, Switch } from './step-card';
import { EMPTY_WEEK } from './week-draft';
import { WeekHoursEditor } from './week-hours-editor';

type Kind = LocationRow['kind'];

export const SUBMIT = `hover-shade flex h-14 items-center gap-4 rounded-control bg-primary pr-2 pl-6 text-[17px] font-semibold text-primary-foreground shadow-halo disabled:opacity-70 ${FOCUS}`;

function VisibilityStep(): ReactElement {
  return (
    <StepCard step={4} title='Visibilidad'>
      <div className='flex items-center gap-4 rounded-panel bg-secondary p-4'>
        <span aria-hidden='true' className='flex size-11 shrink-0 items-center justify-center rounded-full bg-primary'>
          <Eye className='size-5' strokeWidth={2} />
        </span>
        <span className='flex flex-1 flex-col'>
          <span className='font-semibold'>Visible para los pacientes</span>
          <span className='text-[14px] text-muted-foreground'>Los pacientes pueden elegirla al sacar un turno.</span>
        </span>
        <Switch label='Visible para los pacientes' name='active' defaultChecked />
      </div>
    </StepCard>
  );
}

type SubmitRowProps = { pending: boolean; label: string; cancel: string; cancelLabel: string };

export function SubmitRow({ pending, label, cancel, cancelLabel }: SubmitRowProps): ReactElement {
  return (
    <div className='flex flex-wrap items-center gap-4'>
      <button type='submit' disabled={pending} className={SUBMIT}>
        {pending ? 'Guardando…' : label}
        <span aria-hidden='true' className='flex size-10 items-center justify-center rounded-full bg-foreground text-primary'>
          <Check className='size-5' strokeWidth={2.5} />
        </span>
      </button>
      <Link href={cancel} className={`flex h-11 items-center rounded-control px-3 font-semibold ${FOCUS}`}>
        {cancelLabel}
      </Link>
    </div>
  );
}

export function NewLocationForm({ kind, onKindChange }: { kind: Kind; onKindChange: (kind: Kind) => void }): ReactElement {
  const [state, action, pending] = useActionState(createLocation, null);
  const [week, setWeek] = useState(EMPTY_WEEK);
  const [draft, setDraft] = useState({ name: '', address: '', visible: true });
  const track = (event: FormEvent<HTMLFormElement>): void => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement)) return;
    if (field.name === 'name' || field.name === 'address') setDraft({ ...draft, [field.name]: field.value });
    if (field.name === 'active') setDraft({ ...draft, visible: field.checked });
  };
  return (
    <form action={action} onInput={track} aria-label='Nueva ubicación' className='grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]'>
      <div className='flex flex-col gap-6 lg:order-1'>
        <StepCard step={1} title='Tipo de atención'>
          <KindChoice kind={kind} onChange={onKindChange} />
        </StepCard>
        <StepCard step={2} title='Datos de la ubicación'>
          <LocationFields key={kind} kind={kind} />
        </StepCard>
        <StepCard step={3} title='Horarios de atención' lead='Se repiten cada semana, en hora de Argentina. Para cerrar un día puntual, usá un bloqueo desde la agenda.'>
          <WeekHoursEditor week={week} onChange={setWeek} />
        </StepCard>
        <VisibilityStep />
        <FormFeedback state={state} />
        <SubmitRow pending={pending} label={kind === 'ONLINE' ? 'Guardar ubicación online' : 'Guardar consultorio'} cancel='/admin/ubicaciones' cancelLabel='Cancelar' />
      </div>
      <div className='lg:sticky lg:top-6 lg:order-2'>
        <PatientPreviewCard kind={kind} name={draft.name} address={draft.address} visible={draft.visible} week={week} />
      </div>
    </form>
  );
}
